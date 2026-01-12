const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Product ID is required'],
    index: true
  },
  
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [2000, 'Review cannot exceed 2000 characters'],
    trim: true
  },
  
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  // AI Analysis Fields
  fakeProbability: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  label: {
    type: String,
    enum: ['REAL', 'FAKE', 'UNVERIFIED', 'PENDING'],
    default: 'PENDING'
  },
  
  // Blockchain Verification Fields
  transactionHash: {
    type: String,
    required: [true, 'Transaction hash is required'],
    unique: true,
    index: true,
    trim: true
  },
  
  purchaseTransactionHash: {
    type: String,
    required: [true, 'Purchase transaction hash is required'],
    trim: true
  },
  
  // Verification Status
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  
  blockchainVerified: {
    type: Boolean,
    default: false
  },
  
  verificationTimestamp: {
    type: Date
  },
  
  // Review Metadata
  helpfulVotes: {
    type: Number,
    default: 0
  },
  
  unhelpfulVotes: {
    type: Number,
    default: 0
  },
  
  reportedCount: {
    type: Number,
    default: 0
  },
  
  status: {
    type: String,
    enum: ['ACTIVE', 'FLAGGED', 'REMOVED', 'UNDER_REVIEW'],
    default: 'ACTIVE'
  },
  
  // Additional Info
  reviewerName: {
    type: String,
    default: 'Anonymous',
    trim: true
  },
  
  // Purchase Reference
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
reviewSchema.index({ productId: 1, rating: -1 });
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ label: 1, status: 1 });
reviewSchema.index({ verifiedPurchase: 1 });

// Virtual for helpfulness percentage
reviewSchema.virtual('helpfulnessPercentage').get(function() {
  const totalVotes = this.helpfulVotes + this.unhelpfulVotes;
  if (totalVotes === 0) return 0;
  return Math.round((this.helpfulVotes / totalVotes) * 100);
});

// Method to check if review is trusted
reviewSchema.methods.isTrusted = function() {
  return this.verifiedPurchase && this.blockchainVerified && this.label === 'REAL';
};

// Method to mark as verified
reviewSchema.methods.markAsVerified = function() {
  this.verifiedPurchase = true;
  this.blockchainVerified = true;
  this.label = 'REAL';
  this.verificationTimestamp = new Date();
  return this.save();
};

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;