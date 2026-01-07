require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const { generateHash } = require("./utils/crypto");
const { storeReviewOnChain } = require("./blockchain/blockchainService");

const Product = require("./models/Product");
const Review = require("./models/Review");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

/* ================================
   PRODUCTS
================================ */

/* ADD PRODUCT */
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET PRODUCTS */
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   REVIEW ANALYSIS + BLOCKCHAIN
================================ */

app.post("/api/review/analyze", async (req, res) => {
  try {
    const { reviewText, productId } = req.body;

    /* ---- VALIDATION ---- */
    if (!reviewText || !productId) {
      return res.status(400).json({
        error: "reviewText and productId are required",
      });
    }

    /* ---- CHECK PRODUCT EXISTS ---- */
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        error: "Invalid productId",
      });
    }

    /* ---- CALL AI ENGINE ---- */
    const aiRes = await axios.post("http://localhost:8000/analyze", {
      review: reviewText,
    });

    const { fake_probability, label } = aiRes.data;

    /* ---- HASH REVIEW ---- */
    const reviewHash = generateHash(reviewText);

    /* ---- SAVE REVIEW IN MONGODB ---- */
    const savedReview = await Review.create({
      productId,
      reviewText,
      fakeProbability: fake_probability,
      label,
      reviewHash,
      onBlockchain: false,
    });

    /* ---- BLOCKCHAIN CONDITION ---- */
    // Simulated verified buyer (replace later with real order check)
    const userHasPurchasedProduct = true;

    if (userHasPurchasedProduct && label === "genuine") {
      await storeReviewOnChain(reviewHash, Math.floor(fake_probability * 100));

      savedReview.onBlockchain = true;
      await savedReview.save();
    }

    res.json({
      message: "Review processed successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Review processing error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

/* ================================
   ADMIN DASHBOARD
================================ */

/* ADMIN STATS */
app.get("/api/admin/stats", async (req, res) => {
  try {
    const total = await Review.countDocuments();
    const fake = await Review.countDocuments({ label: "fake" });
    const genuine = total - fake;

    res.json({ total, fake, genuine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* FLAGGED FAKE REVIEWS */
app.get("/api/admin/fake-reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ label: "fake" });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   SERVER
================================ */

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
