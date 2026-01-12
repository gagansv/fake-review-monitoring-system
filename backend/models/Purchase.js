const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  productId: {
    type: String,
    required: true,
    index: true
  },
  
  transactionHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Your existing fields
  purchaseDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  verified: {
    type: Boolean,
    default: false,
    index: true
  },
  
  reviewAllowed: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // New fields for review integration
  purchaseId: {
    type: String,
    required: true,
    unique: true,
    default: () => `PUR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  
  amount: {
    type: Number,
    default: 0
  },
  
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'VERIFIED'],
    default: 'PENDING'
  },
  
  // For review reference
  reviewSubmitted: {
    type: Boolean,
    default: false
  },
  
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    default: null
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
purchaseSchema.index({ userId: 1, productId: 1 });
purchaseSchema.index({ transactionHash: 1 });

// Method to mark as verified
purchaseSchema.methods.markAsVerified = function() {
  this.verified = true;
  this.reviewAllowed = true;
  this.status = 'VERIFIED';
  return this.save();
};

// Method to mark review as submitted
purchaseSchema.methods.markReviewSubmitted = function(reviewId) {
  this.reviewSubmitted = true;
  this.reviewId = reviewId;
  return this.save();
};

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;