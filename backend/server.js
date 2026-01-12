require("dotenv").config(); // Load .env first
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const connectDB = require("./config/db");

const { generateHash } = require("./utils/crypto");
const { storeReviewOnChain } = require("./blockchain/blockchainService");

const Product = require("./models/Product");
const Review = require("./models/Review");
const Purchase = require("./models/Purchase");

// Import review controller
const reviewController = require("./controllers/reviewController.js");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Log environment variables
console.log("Environment check:");
console.log("- MONGODB_URI:", process.env.MONGODB_URI ? "✓ Loaded" : "✗ Missing");
console.log("- RPC_URL:", process.env.RPC_URL ? "✓ Loaded" : "✗ Missing");

/* ================================
   PRODUCTS
================================ */

/* ADD PRODUCT */
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: err.message });
  }
});

/* GET PRODUCTS */
app.get("/api/products", async (req, res) => {
  try {
    console.log("GET /api/products - Fetching all products");
    const products = await Product.find();
    console.log(`Found ${products.length} products`);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: err.message });
  }
});

/* GET SINGLE PRODUCT BY ID */
app.get("/api/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log(`GET /api/products/${productId}`);
    
    // Try to find by productId field first (from your seed)
    let product = await Product.findOne({ productId: productId });
    
    // If not found by productId, try by _id
    if (!product) {
      product = await Product.findById(productId);
    }
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Get reviews for this product
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    
    // Get review statistics
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
          genuineReviews: {
            $sum: { $cond: [{ $eq: ['$label', 'genuine'] }, 1, 0] }
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
      genuineReviews: 0,
      rating1: 0,
      rating2: 0,
      rating3: 0,
      rating4: 0,
      rating5: 0
    };

    res.json({
      ...product.toObject(),
      reviews,
      statistics: {
        ...statistics,
        averageRating: Math.round(statistics.averageRating * 10) / 10
      }
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   PURCHASE & BLOCKCHAIN ROUTES
================================ */

/* INITIATE PURCHASE (returns transaction data) */
app.post("/api/purchase/initiate", async (req, res) => {
  try {
    const { productId, userId } = req.body;
    
    console.log(`Initiating purchase for product ${productId}, user ${userId}`);
    
    // Find product
    const product = await Product.findOne({ productId: productId });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Generate a mock transaction hash
    const mockTransactionHash = "0x" + Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    // Create a purchase record
    const purchase = await Purchase.create({
      userId: userId || `user_${Date.now()}`,
      productId,
      transactionHash: mockTransactionHash,
      verified: false,
      reviewAllowed: false,
      amount: product.price || 0
    });
    
    res.json({
      success: true,
      message: "Purchase initiated",
      productId: productId,
      productName: product.name,
      price: product.price,
      transactionHash: mockTransactionHash,
      purchaseId: purchase._id
    });
    
  } catch (error) {
    console.error("Purchase initiation error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* VERIFY PURCHASE */
app.post("/api/purchase/verify", async (req, res) => {
  try {
    const { purchaseId, transactionHash } = req.body;
    
    console.log(`Verifying purchase ${purchaseId}, tx: ${transactionHash}`);
    
    // Find and update purchase
    const purchase = await Purchase.findOne({ 
      $or: [
        { _id: purchaseId },
        { transactionHash: transactionHash }
      ]
    });
    
    if (!purchase) {
      return res.status(404).json({
        success: false,
        error: "Purchase not found"
      });
    }
    
    // Mark as verified
    purchase.verified = true;
    purchase.reviewAllowed = true;
    purchase.status = 'VERIFIED';
    purchase.verifiedAt = new Date();
    await purchase.save();
    
    res.json({
      success: true,
      verified: true,
      message: "Purchase verified successfully",
      transactionHash: purchase.transactionHash,
      purchaseData: {
        userId: purchase.userId,
        productId: purchase.productId,
        purchaseId: purchase._id
      }
    });
    
  } catch (error) {
    console.error("Purchase verification error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ================================
   REVIEW ROUTES (Updated)
================================ */

/* SUBMIT REVIEW WITH BLOCKCHAIN - Using controller */
app.post("/api/reviews", reviewController.submitReview);

/* GET REVIEWS FOR A PRODUCT */
app.get("/api/reviews/product/:productId", reviewController.getProductReviews);

/* GET REVIEW BY TRANSACTION HASH */
app.get("/api/reviews/transaction/:txHash", reviewController.getReviewByTransaction);

/* CHECK REVIEW ELIGIBILITY */
app.get("/api/reviews/check-eligibility/:purchaseTxHash", reviewController.checkReviewEligibility);

/* GET USER REVIEWS */
app.get("/api/reviews/user/:userId", reviewController.getUserReviews);

/* LEGACY REVIEW ENDPOINT (for backward compatibility) */
app.post("/api/review/submit", async (req, res) => {
  try {
    const { productId, reviewText, rating, transactionHash, userId, reviewerName } = req.body;
    
    console.log("📥 [Legacy] Received review submission:", { productId, rating, transactionHash });
    
    if (!productId || !reviewText || rating === undefined || !transactionHash) {
      return res.status(400).json({ 
        error: "productId, reviewText, rating, and transactionHash are required" 
      });
    }
    
    // Forward to new controller
    req.body.purchaseTransactionHash = transactionHash;
    req.body.userId = userId || `user_${Date.now()}`;
    req.body.reviewerName = reviewerName || 'Anonymous';
    
    return reviewController.submitReview(req, res);
    
  } catch (error) {
    console.error("❌ Error submitting review:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

/* ================================
   ADMIN DASHBOARD
================================ */

/* ADMIN STATS */
app.get("/api/admin/stats", async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalPurchases = await Purchase.countDocuments();
    
    const verifiedReviews = await Review.countDocuments({ verifiedPurchase: true });
    const genuineReviews = await Review.countDocuments({ label: "genuine" });
    const suspiciousReviews = await Review.countDocuments({ label: "suspicious" });
    
    const verifiedPurchases = await Purchase.countDocuments({ verified: true });
    const purchasesWithReviews = await Purchase.countDocuments({ reviewSubmitted: true });

    res.json({ 
      totalReviews,
      totalProducts,
      totalPurchases,
      verifiedReviews,
      genuineReviews,
      suspiciousReviews,
      verifiedPurchases,
      purchasesWithReviews,
      reviewsOnBlockchain: await Review.countDocuments({ blockchainVerified: true })
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* FLAGGED FAKE REVIEWS */
app.get("/api/admin/fake-reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ 
      $or: [
        { label: "fake" },
        { label: "suspicious" },
        { fakeProbability: { $gt: 70 } }
      ]
    }).sort({ fakeProbability: -1 });
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET ALL REVIEWS FOR ADMIN */
app.get("/api/admin/reviews", async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt', filter } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (filter === 'verified') query.verifiedPurchase = true;
    if (filter === 'suspicious') query.label = 'suspicious';
    if (filter === 'unverified') query.verifiedPurchase = false;
    
    const reviews = await Review.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('purchaseId', 'userId transactionHash verified');
    
    const total = await Review.countDocuments(query);
    
    res.json({
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Admin get reviews error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   HEALTH CHECK
================================ */

app.get("/api/health", async (req, res) => {
  try {
    const dbStatus = require('mongoose').connection.readyState;
    const dbStatusText = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[dbStatus] || 'unknown';
    
    res.json({ 
      status: "OK", 
      timestamp: new Date().toISOString(),
      database: dbStatusText,
      endpoints: {
        products: '/api/products',
        reviews: '/api/reviews',
        purchase: '/api/purchase',
        admin: '/api/admin'
      }
    });
  } catch (err) {
    res.status(500).json({ 
      status: "ERROR", 
      error: err.message 
    });
  }
});

/* ================================
   SERVER
================================ */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📚 API Endpoints:`);
  console.log(`   Products: http://localhost:${PORT}/api/products`);
  console.log(`   Reviews: http://localhost:${PORT}/api/reviews`);
  console.log(`   Purchase: http://localhost:${PORT}/api/purchase`);
  console.log(`   Admin: http://localhost:${PORT}/api/admin`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});