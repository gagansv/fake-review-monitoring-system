import axios from "axios";

const API_BASE_URL = 'http://localhost:5000/api';
const API = axios.create({
  baseURL: API_BASE_URL,
});

// Add interceptors for debugging
API.interceptors.request.use(request => {
  console.log('➡️ [FRONTEND] API Request:', request.method, request.url);
  return request;
});

API.interceptors.response.use(response => {
  console.log('⬅️ [FRONTEND] API Response:', response.status, response.config.url);
  return response;
}, error => {
  console.error('❌ [FRONTEND] API Error:', error.message);
  return Promise.reject(error);
});

/* ========== PRODUCTS ========== */
export const getProducts = async () => {
  try {
    const response = await API.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProduct = async (productId) => {
  try {
    const response = await API.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

/* ========== PURCHASE ========== */
export const initiatePurchase = async (productId) => {
  try {
    // Generate user ID (in real app, this would come from auth)
    const userId = "user_" + Date.now();
    
    const response = await API.post("/purchase/initiate", {
      productId,
      userId
    });
    return response.data;
  } catch (error) {
    console.error("Error initiating purchase:", error);
    throw error;
  }
};

export const verifyPurchase = async (purchaseId, transactionHash) => {
  try {
    const response = await API.post("/purchase/verify", {
      purchaseId,
      transactionHash
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying purchase:", error);
    throw error;
  }
};

/* ========== REVIEWS ========== */

// Legacy endpoint (for backward compatibility)
export const submitReviewLegacy = async (productId, reviewText, rating, transactionHash) => {
  try {
    const response = await API.post("/review/submit", {
      productId,
      reviewText,
      rating,
      transactionHash  // Pass the purchase transaction hash
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

// New review submission with full data
export const submitReview = async (reviewData) => {
  console.log('📝 [API] Submitting review:', reviewData);
  
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit review');
  }
  
  console.log('✅ [API] Review submitted successfully:', data);
  return data;
};

// Get reviews for a product with pagination and filtering
export const getProductReviews = async (productId, options = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt', filter = 'all' } = options;
  
  const queryParams = new URLSearchParams({
    page,
    limit,
    sort,
    filter
  }).toString();
  
  console.log(`📊 [API] Fetching reviews for ${productId} with:`, options);
  
  const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}?${queryParams}`);
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch reviews');
  }
  
  console.log(`✅ [API] Retrieved ${data.data?.reviews?.length || 0} reviews`);
  return data;
};

// Check if purchase can submit review
export const checkReviewEligibility = async (purchaseTxHash) => {
  console.log(`🔍 [API] Checking eligibility for tx: ${purchaseTxHash}`);
  
  const response = await fetch(`${API_BASE_URL}/reviews/check-eligibility/${purchaseTxHash}`);
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to check eligibility');
  }
  
  console.log(`✅ [API] Eligibility result:`, data);
  return data;
};

// Get review by transaction hash
export const getReviewByTransaction = async (txHash) => {
  console.log(`🔍 [API] Fetching review by tx: ${txHash}`);
  
  const response = await fetch(`${API_BASE_URL}/reviews/transaction/${txHash}`);
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch review');
  }
  
  return data;
};

// Get user's reviews
export const getUserReviews = async (userId, page = 1, limit = 10) => {
  console.log(`👤 [API] Fetching reviews for user: ${userId}`);
  
  const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}?page=${page}&limit=${limit}`);
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch user reviews');
  }
  
  return data;
};

// Get admin stats
export const getAdminStats = async () => {
  try {
    const response = await API.get("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};

// Get admin reviews
export const getAdminReviews = async (page = 1, limit = 20, sort = '-createdAt', filter = '') => {
  try {
    const params = { page, limit, sort };
    if (filter) params.filter = filter;
    
    const response = await API.get("/admin/reviews", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    throw error;
  }
};

// Get verified reviews (legacy endpoint)
export const getVerifiedReviews = async (productId) => {
  try {
    // Use new endpoint with verified filter
    return getProductReviews(productId, { filter: 'verified' });
  } catch (error) {
    console.error("Error fetching verified reviews:", error);
    throw error;
  }
};

// Helper function to create review data from form
export const createReviewData = (formData, purchaseTxHash) => {
  const userId = formData.userId || `user_${Date.now()}`;
  
  return {
    productId: formData.productId,
    userId: userId,
    reviewText: formData.content || formData.reviewText || '',
    rating: Number(formData.rating),
    title: formData.title || '',
    purchaseTransactionHash: purchaseTxHash,
    transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Generate review tx hash
    reviewerName: formData.reviewerName || 'Anonymous'
  };
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await API.get("/health");
    return response.data;
  } catch (error) {
    console.error("Health check failed:", error);
    throw error;
  }
};

export default API;