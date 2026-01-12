const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use the correct environment variable name
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error("MongoDB URI not found in environment variables. Check your .env file.");
    }
    
    console.log("Connecting to MongoDB...");
    console.log("URI:", mongoURI.substring(0, 50) + "...");
    
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected Successfully!");
    
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;