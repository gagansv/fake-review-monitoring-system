const mongoose = require("mongoose");
const Purchase = require("./models/Purchase");
require('dotenv').config();

async function createTestPurchase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const testPurchase = new Purchase({
      transactionHash: "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef123456",
      userId: "testUser123",
      productId: "P001",
      purchaseDate: new Date(),
      verified: true,
      reviewAllowed: true,
      reviewSubmitted: false
    });

    await testPurchase.save();
    console.log("Test purchase created:", testPurchase.transactionHash);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createTestPurchase();
