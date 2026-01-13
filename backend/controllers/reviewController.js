const Review = require("../models/Review");
const Purchase = require("../models/Purchase");
const crypto = require("../utils/crypto");
const { storeReviewOnChain } = require("../blockchain/blockchainService");
const axios = require('axios');

// Submit a new review with blockchain verification
const submitReview = async (req, res) => {
  try {
    const {
      productId,
      userId,
      reviewText,
      rating,
      purchaseTransactionHash,
      reviewerName
    } = req.body;

    console.log('📝 [Review] Received review submission:', { 
      userId, productId, purchaseTransactionHash 
    });

    // Validate required fields
    if (!productId || !userId || !reviewText || !rating || !purchaseTransactionHash) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: productId, userId, reviewText, rating, purchaseTransactionHash'
      });
    }

    // Check if purchase is verified
    const purchase = await Purchase.findOne({
      transactionHash: purchaseTransactionHash,
      userId,
      productId,
      verified: true,
      reviewAllowed: true
    });

    if (!purchase) {
      return res.status(400).json({
        success: false,
        error: 'Purchase not verified or review not allowed'
      });
    }

    if (purchase.reviewSubmitted) {
      return res.status(400).json({
        success: false,
        error: 'Review already submitted for this purchase'
      });
    }

    // Generate hash of the review
    const reviewHash = crypto.generateHash(`${userId}:${productId}:${reviewText}:${Date.now()}`);

    // AI fake review detection using the model
    let fakeProbability, label;
    try {
      const aiResponse = await axios.post('http://localhost:8000/analyze', {
        review: reviewText
      });
      fakeProbability = Math.round(aiResponse.data.final_fake * 100);
      label = aiResponse.data.label === 'fake' ? 'FAKE' : 'REAL';
    } catch (error) {
      console.error('AI analysis failed, using fallback:', error.message);
      // Fallback to random if AI fails
      fakeProbability = Math.floor(Math.random() * 101); // 0-100 inclusive
      label = fakeProbability > 50 ? "FAKE" : "REAL";
    }

    // Store on blockchain only if review is REAL (not fake)
    let txHash = null;
    if (label === 'REAL') {
      txHash = await storeReviewOnChain(reviewHash);
    }
    
    // Generate unique transaction hash for the review
    const reviewTransactionHash = txHash || `0x${crypto.generateHash(`${Date.now()}:${Math.random()}`).substr(0, 64)}`;

    // Save to database
    const review = new Review({
      productId,
      userId,
      reviewText,
      rating,
      fakeProbability,
      label, // Now uses 'REAL' or 'FAKE' matching schema
      transactionHash: reviewTransactionHash,
      purchaseTransactionHash,
      purchaseId: purchase._id,
      reviewerName: reviewerName || 'Anonymous',
      verifiedPurchase: true,
      blockchainVerified: label === 'REAL', // Only real reviews are blockchain verified
      verificationTimestamp: new Date()
    });

    await review.save();

    // Mark purchase as reviewed
    purchase.reviewAllowed = false;
    purchase.reviewSubmitted = true;
    purchase.reviewId = review._id;
    await purchase.save();

    console.log('✅ [Review] Saved to database:', {
      reviewId: review._id,
      productId: review.productId,
      transactionHash: review.transactionHash,
      label: review.label
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        reviewId: review._id,
        transactionHash: review.transactionHash,
        label,
        fakeProbability,
        timestamp: review.createdAt,
        blockchainTxHash: txHash
      }
    });

  } catch (error) {
    console.error('❌ [Review] Submission error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate transaction detected'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while submitting review'
    });
  }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { 
      page = 1, 
      limit = 10,
      sort = '-createdAt',
      filter = 'all'
    } = req.query;

    console.log(`📊 [Review] Fetching reviews for product: ${productId}`);

    // Build query
    const query = { productId };
    
    // Apply filters - UPDATED TO MATCH NEW LABELS
    if (filter === 'verified') {
      query.verifiedPurchase = true;
    } else if (filter === 'real') {
      query.label = 'REAL'; // Changed from 'genuine'
    } else if (filter === 'fake') {
      query.label = 'FAKE'; // Changed from 'suspicious'
    } else if (filter === 'verified_real') {
      query.verifiedPurchase = true;
      query.label = 'REAL'; // Changed from 'verified_genuine'
    }

    // Build sort
    let sortOption = { createdAt: -1 };
    if (sort === 'highest_rated') sortOption = { rating: -1 };
    if (sort === 'lowest_rated') sortOption = { rating: 1 };
    if (sort === 'most_helpful') sortOption = { helpfulVotes: -1 };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get reviews
    const reviews = await Review.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v -updatedAt')
      .populate('purchaseId', 'transactionHash purchaseDate verified');

    // Get total count
    const total = await Review.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Calculate statistics - UPDATED TO MATCH NEW LABELS
    const stats = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          verifiedReviews: {
            $sum: { $cond: [{ $eq: ['$verifiedPurchase', true] }, 1, 0] }
          },
          realReviews: {
            $sum: { $cond: [{ $eq: ['$label', 'REAL'] }, 1, 0] } // Changed from 'genuine'
          },
          fakeReviews: {
            $sum: { $cond: [{ $eq: ['$label', 'FAKE'] }, 1, 0] } // Changed from 'suspicious'
          },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } }
        }
      }
    ]);

    const statistics = stats[0] || {
      averageRating: 0,
      totalReviews: 0,
      verifiedReviews: 0,
      realReviews: 0,
      fakeReviews: 0,
      rating1: 0,
      rating2: 0,
      rating3: 0,
      rating4: 0,
      rating5: 0
    };

    // Calculate percentages
    const ratingPercentages = {
      rating1: statistics.totalReviews > 0 ? Math.round((statistics.rating1 / statistics.totalReviews) * 100) : 0,
      rating2: statistics.totalReviews > 0 ? Math.round((statistics.rating2 / statistics.totalReviews) * 100) : 0,
      rating3: statistics.totalReviews > 0 ? Math.round((statistics.rating3 / statistics.totalReviews) * 100) : 0,
      rating4: statistics.totalReviews > 0 ? Math.round((statistics.rating4 / statistics.totalReviews) * 100) : 0,
      rating5: statistics.totalReviews > 0 ? Math.round((statistics.rating5 / statistics.totalReviews) * 100) : 0
    };

    console.log(`✅ [Review] Retrieved ${reviews.length} reviews for product ${productId}`);

    // Format reviews
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      productId: review.productId,
      userId: review.userId,
      reviewText: review.reviewText,
      rating: review.rating,
      fakeProbability: review.fakeProbability,
      label: review.label,
      transactionHash: review.transactionHash,
      verifiedPurchase: review.verifiedPurchase,
      blockchainVerified: review.blockchainVerified,
      reviewerName: review.reviewerName,
      createdAt: review.createdAt,
      purchase: review.purchaseId
    }));

    res.json({
      success: true,
      data: {
        reviews: formattedReviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        statistics: {
          ...statistics,
          averageRating: Math.round(statistics.averageRating * 10) / 10,
          ratingPercentages,
          realPercentage: statistics.totalReviews > 0 ? Math.round((statistics.realReviews / statistics.totalReviews) * 100) : 0,
          fakePercentage: statistics.totalReviews > 0 ? Math.round((statistics.fakeReviews / statistics.totalReviews) * 100) : 0
        }
      }
    });

  } catch (error) {
    console.error('❌ [Review] Get reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews'
    });
  }
};

// Get single review by transaction hash
const getReviewByTransaction = async (req, res) => {
  try {
    const { txHash } = req.params;

    const review = await Review.findOne({ transactionHash: txHash })
      .select('-__v -updatedAt')
      .populate('purchaseId', 'transactionHash purchaseDate verified reviewAllowed');

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Format review
    const formattedReview = {
      id: review._id,
      productId: review.productId,
      userId: review.userId,
      reviewText: review.reviewText,
      rating: review.rating,
      fakeProbability: review.fakeProbability,
      label: review.label,
      transactionHash: review.transactionHash,
      verifiedPurchase: review.verifiedPurchase,
      blockchainVerified: review.blockchainVerified,
      reviewerName: review.reviewerName,
      createdAt: review.createdAt,
      purchase: review.purchaseId
    };

    res.json({
      success: true,
      data: formattedReview
    });

  } catch (error) {
    console.error('❌ [Review] Get review by transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch review'
    });
  }
};

// Check if purchase can submit review
const checkReviewEligibility = async (req, res) => {
  try {
    const { purchaseTxHash } = req.params;

    // Check if purchase exists
    const purchase = await Purchase.findOne({ transactionHash: purchaseTxHash });
    
    if (!purchase) {
      return res.json({
        success: true,
        eligible: false,
        reason: 'Purchase not found'
      });
    }

    // Check if review already submitted
    if (purchase.reviewSubmitted) {
      return res.json({
        success: true,
        eligible: false,
        reason: 'Review already submitted for this purchase',
        reviewId: purchase.reviewId
      });
    }

    // Check if purchase is verified and review allowed
    if (!purchase.verified || !purchase.reviewAllowed) {
      return res.json({
        success: true,
        eligible: false,
        reason: 'Purchase not verified or review not allowed'
      });
    }

    res.json({
      success: true,
      eligible: true,
      purchaseData: {
        productId: purchase.productId,
        userId: purchase.userId,
        purchaseId: purchase._id,
        purchaseDate: purchase.purchaseDate,
        transactionHash: purchase.transactionHash
      }
    });

  } catch (error) {
    console.error('❌ [Review] Check eligibility error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check review eligibility'
    });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v')
      .populate('purchaseId', 'transactionHash purchaseDate');

    const total = await Review.countDocuments({ userId });

    // Format reviews
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      productId: review.productId,
      reviewText: review.reviewText,
      rating: review.rating,
      fakeProbability: review.fakeProbability,
      label: review.label,
      transactionHash: review.transactionHash,
      verifiedPurchase: review.verifiedPurchase,
      blockchainVerified: review.blockchainVerified,
      reviewerName: review.reviewerName,
      createdAt: review.createdAt
    }));

    res.json({
      success: true,
      data: {
        reviews: formattedReviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ [Review] Get user reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user reviews'
    });
  }
};

// Legacy review submission (for backward compatibility)
const submitReviewLegacy = async (req, res) => {
  try {
    const { productId, reviewText, rating, transactionHash, userId, reviewerName } = req.body;

    console.log('📝 [Review Legacy] Received review submission:', { 
      productId, rating, transactionHash 
    });

    // Forward to new submitReview function
    req.body.userId = userId || `user_${Date.now()}`;
    req.body.purchaseTransactionHash = transactionHash;
    req.body.reviewerName = reviewerName || 'Anonymous';
    req.body.productId = productId;
    req.body.reviewText = reviewText;
    req.body.rating = rating;

    return submitReview(req, res);

  } catch (error) {
    console.error('❌ [Review Legacy] Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: error.message 
    });
  }
};

module.exports = {
  submitReview,
  submitReviewLegacy,
  getProductReviews,
  getReviewByTransaction,
  checkReviewEligibility,
  getUserReviews
};