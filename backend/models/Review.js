const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  reviewText: String,
  fakeProbability: Number,
  label: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);