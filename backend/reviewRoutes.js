const express = require('express');
const router = express.Router();
const {
  submitReview,
  getProductReviews,
  getReviewByTransaction,
  checkReviewEligibility,
  getUserReviews
} = require('./controllers/reviewController');

// Submit a new review
router.post('/', submitReview);

// Get reviews for a product
router.get('/product/:productId', getProductReviews);

// Get review by transaction hash
router.get('/transaction/:txHash', getReviewByTransaction);

// Get user's reviews
router.get('/user/:userId', getUserReviews);

// Check if purchase can submit review
router.get('/check-eligibility/:purchaseTxHash', checkReviewEligibility);

module.exports = router;