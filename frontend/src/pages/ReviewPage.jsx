import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { submitReview, checkReviewEligibility, getProduct } from '../api/api';

const ReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const productId = query.get('product');
  const purchaseTxHash = query.get('tx'); // Renamed from txFromUrl for clarity
  
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [userId, setUserId] = useState('');
  const [product, setProduct] = useState(null);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    if (!productId || !purchaseTxHash) {
      setError('Missing product or transaction information');
      setLoading(false);
      return;
    }

    const verifyAndLoad = async () => {
      try {
        console.log(`🔍 Checking eligibility for purchase: ${purchaseTxHash}`);
        
        // Check if purchase is eligible for review
        const eligibility = await checkReviewEligibility(purchaseTxHash);
        
        if (eligibility.success && eligibility.eligible) {
          setEligible(true);
          setUserId(eligibility.purchaseData?.userId || `user_${Date.now()}`);
          
          // Load product details from API
          try {
            const productData = await getProduct(productId);
            setProduct(productData);
          } catch (productError) {
            console.warn('Could not fetch product from API, using mock data');
            setProduct(getMockProductDetails(productId));
          }
        } else {
          setError(eligibility.reason || 'Not eligible to submit review');
        }
      } catch (err) {
        console.error('Eligibility check failed:', err);
        setError(err.message || 'Failed to verify purchase eligibility');
      } finally {
        setLoading(false);
      }
    };

    verifyAndLoad();
  }, [productId, purchaseTxHash]);

  // Mock product data (fallback)
  const getMockProductDetails = (id) => {
    const products = {
      'P001': { 
        name: 'Sony WH-1000XM5', 
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        price: 399,
        description: 'Premium noise-cancelling headphones'
      },
      'P002': { 
        name: 'Apple Watch Ultra', 
        image: 'https://images.unsplash.com/photo-1579586337278-3f4ab5c8d6b9?w=400&h=300&fit=crop',
        price: 799,
        description: 'Premium smartwatch for fitness'
      },
      'P003': { 
        name: 'MacBook Pro M3', 
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
        price: 2499,
        description: 'Professional laptop for creators'
      },
      'P004': { 
        name: 'Samsung S24 Ultra', 
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
        price: 1299,
        description: 'Flagship smartphone with advanced camera'
      }
    };
    const product = products[id];
    return product ? { ...product, price: `$${product.price}` } : null;
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!review.trim() || review.length < 10) {
      setError('Please write a detailed review (at least 10 characters)');
      return;
    }
    
    if (!reviewTitle.trim()) {
      setError('Please enter a review title');
      return;
    }
    
    setError('');
    setSubmitting(true);
    
    try {
      console.log("🔄 Submitting review to backend...");
      console.log("Product ID:", productId);
      console.log("Rating:", rating);
      console.log("Review title:", reviewTitle);
      console.log("Review length:", review.length);
      console.log("Purchase TX:", purchaseTxHash);
      console.log("User ID:", userId);
      
      // Prepare review data for new API endpoint
      const reviewData = {
        productId,
        userId,
        reviewText: `${reviewTitle}\n\n${review}`,
        rating: Number(rating),
        purchaseTransactionHash: purchaseTxHash,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Generate review tx hash
        reviewerName: reviewerName || 'Anonymous',
        title: reviewTitle // Optional: separate title field
      };
      
      console.log("📝 Review data:", reviewData);
      
      // CALL NEW BACKEND API
      console.log("Making API call to /api/reviews...");
      const result = await submitReview(reviewData);
      
      console.log("✅ Backend response received:", result);
      
      if (result.success) {
        setResultData(result.data);
        setSubmitted(true);
        setSuccess(true);
        
        console.log("🎉 Review submitted successfully!");
        console.log("Review ID:", result.data?.reviewId);
        console.log("Transaction Hash:", result.data?.transactionHash);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate(`/product/${productId}?review=submitted`);
        }, 3000);
        
      } else {
        setError(result.error || 'Submission failed');
      }
      
    } catch (error) {
      console.error('❌ Review submission failed:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        setError(error.response.data?.error || `Error ${error.response.status}: ${error.response.statusText}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('Backend not responding. Make sure server is running on http://localhost:5000');
      } else {
        setError(error.message || 'Failed to submit review. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-8">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Verifying Purchase Eligibility...
          </h1>
          <p className="text-gray-600">Checking if purchase can be reviewed</p>
        </div>
      </div>
    );
  }

  if (error && !eligible) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-8 text-red-500">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Cannot Submit Review
          </h1>
          <p className="text-xl text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white py-3 px-8 rounded-xl font-semibold text-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (success && submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-12 text-center">
            <div className="text-8xl mb-8">🎉</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Review Successfully Submitted!
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Your verified review has been stored in the database with blockchain verification.
            </p>

            <div className="bg-white rounded-xl p-8 mb-10 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`text-3xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </div>
                ))}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{reviewTitle}</h3>
              <p className="text-gray-800 text-lg mb-6 italic">"{review}"</p>
              <div className="border-t pt-6">
                <p className="text-gray-600 mb-2">
                  Product: <span className="font-semibold">{product?.name || getMockProductDetails(productId)?.name}</span>
                </p>
                {resultData && (
                  <>
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-green-700 font-semibold">✓ Review Saved to Database</p>
                        <p className="text-sm text-green-600 mt-1">Review ID: {resultData.reviewId}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-700 font-semibold">✓ Purchase Verified</p>
                        <p className="text-sm text-blue-600 mt-1">
                          Purchase TX: {purchaseTxHash.substring(0, 30)}...
                        </p>
                      </div>
                      {resultData.aiAnalysis && (
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-purple-700 font-semibold">AI Analysis Complete</p>
                          <p className="text-sm text-purple-600 mt-1">
                            {resultData.aiAnalysis.label === 'genuine' ? '✅ Genuine Review' : '⚠️ Under Review'}
                          </p>
                        </div>
                      )}
                    </div>
                    {resultData.transactionHash && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 text-sm mb-1">Review Transaction Hash:</p>
                        <code className="text-xs text-gray-500 break-all block">
                          {resultData.transactionHash}
                        </code>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate(`/product/${productId}`)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
            >
              View Product with Reviews
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Submit Your Verified Review
          </h1>
          <p className="text-xl text-gray-600">
            Your purchase has been verified! Now share your experience
          </p>
          <p className="text-sm text-green-600 mt-2">
            ✓ Purchase verified and eligible for review
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Info */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-32 h-32 rounded-xl overflow-hidden">
                <img 
                  src={product?.image || getMockProductDetails(productId)?.image} 
                  alt={product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {product?.name || getMockProductDetails(productId)?.name}
                </h2>
                <p className="text-gray-600 mb-1">
                  Product ID: <span className="font-mono font-bold">{productId}</span>
                </p>
                <p className="text-gray-600 mb-1">
                  Price: <span className="font-bold text-green-600">
                    {product?.price || getMockProductDetails(productId)?.price}
                  </span>
                </p>
                <p className="text-sm text-gray-500">{product?.description}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700 font-semibold">✓ Purchase Verified</p>
                    <p className="text-xs text-green-600 mt-1">
                      Transaction: {purchaseTxHash.substring(0, 20)}...
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-700 font-semibold">✓ Review Allowed</p>
                    <p className="text-xs text-blue-600 mt-1">You can submit one verified review</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Verified Purchase</h4>
                  <p className="text-gray-600 text-sm">Your purchase is confirmed on blockchain</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">⛓️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Blockchain Storage</h4>
                  <p className="text-gray-600 text-sm">Review stored permanently and immutably</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">AI Verification</h4>
                  <p className="text-gray-600 text-sm">Automatically checked for authenticity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Write Your Review</h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 font-semibold">Error:</p>
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Reviewer Name */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-900 mb-2">Your Name (Optional)</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Anonymous"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
              />
            </div>

            {/* Review Title */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-900 mb-2">Review Title *</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                maxLength={100}
              />
            </div>

            {/* Rating */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-900 mb-6">Your Rating *</label>
              <div className="flex gap-4 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-all duration-300 transform hover:scale-125"
                  >
                    <span className={`text-6xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-center text-gray-600 mt-4">
                {rating === 0 ? 'Select your rating' : `You rated: ${rating} star${rating > 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Review Text */}
            <div className="mb-10">
              <label className="block text-lg font-medium text-gray-900 mb-4">Your Review *</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your honest experience with this product. What did you like? What could be improved? (Minimum 10 characters)"
                className="w-full h-48 bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                maxLength={1000}
                minLength={10}
              />
              <div className="flex justify-between mt-3">
                <span className={`text-sm ${review.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                  {review.length < 10 ? `Need ${10 - review.length} more characters` : '✓ Minimum met'}
                </span>
                <span className={`text-sm ${review.length > 800 ? 'text-red-500' : 'text-gray-500'}`}>
                  {review.length}/1000 characters
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmitReview}
              disabled={submitting || rating === 0 || review.trim().length < 10 || !reviewTitle.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-5 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
            >
              {submitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting to Database...
                </>
              ) : (
                <>
                  <span className="text-2xl">⛓️</span>
                  Submit Verified Review
                </>
              )}
            </button>

            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-700 font-semibold mb-2">
                This verified review will be:
              </p>
              <ul className="text-sm text-gray-600 ml-4 list-disc space-y-1">
                <li>Stored in the database with all verification data</li>
                <li>Linked to your verified purchase transaction</li>
                <li>Analyzed by AI for authenticity</li>
                <li>Displayed as a "Verified Purchase" review</li>
                <li>Available for viewing on the product page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;