const Purchase = require("./Purchase");
const { generatePurchaseTransaction, verifyPurchaseTransaction } = require("./blockchainService");

// Mock product data with prices in USD
const products = [
  { id: "P001", name: "Sony WH-1000XM5", price: 3.99, usdPrice: 399 },
  { id: "P002", name: "Apple Watch Ultra", price: 7.99, usdPrice: 799 },
  { id: "P003", name: "MacBook Pro M3", price: 24.99, usdPrice: 2499 },
  { id: "P004", name: "Samsung S24 Ultra", price: 12.99, usdPrice: 1299 }
];

async function initiatePurchase(userId, productId) {
  try {
    console.log(`Initiating purchase for user ${userId}, product ${productId}`);
    
    // Find product
    const product = products.find(p => p.id === productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Generate blockchain transaction (using MATIC)
    const txHash = await generatePurchaseTransaction(userId, productId, product.usdPrice);

    // Create purchase record
    const purchase = new Purchase({
      userId,
      productId,
      transactionHash: txHash,
      productName: product.name,
      amount: product.usdPrice,
      verified: false,
      status: 'pending'
    });

    await purchase.save();
    
    console.log(`Purchase initiated successfully. Purchase ID: ${purchase._id}, TX: ${txHash}`);
    
    return {
      success: true,
      transactionHash: txHash,
      purchaseId: purchase._id,
      productName: product.name,
      amount: product.usdPrice
    };
  } catch (error) {
    console.error("Purchase initiation error:", error);
    throw error;
  }
}

async function verifyPurchase(purchaseId) {
  try {
    console.log(`Verifying purchase ${purchaseId}`);
    
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      throw new Error("Purchase not found");
    }

    // Verify transaction on blockchain
    const isVerified = await verifyPurchaseTransaction(purchase.transactionHash);
    
    if (isVerified) {
      purchase.verified = true;
      purchase.reviewAllowed = true;
      purchase.status = 'verified';
      purchase.verifiedAt = new Date();
      await purchase.save();
      
      console.log(`Purchase ${purchaseId} verified successfully`);
    } else {
      console.log(`Purchase ${purchaseId} verification failed`);
    }

    return {
      success: isVerified,
      verified: isVerified,
      reviewAllowed: isVerified,
      transactionHash: purchase.transactionHash
    };
  } catch (error) {
    console.error("Purchase verification error:", error);
    throw error;
  }
}

async function checkPurchaseStatus(userId, productId) {
  try {
    const purchase = await Purchase.findOne({
      userId,
      productId,
      verified: true,
      reviewAllowed: true
    }).sort({ createdAt: -1 }); // Get the latest purchase

    return {
      canReview: !!purchase,
      purchaseId: purchase?._id,
      productName: purchase?.productName,
      purchaseDate: purchase?.createdAt
    };
  } catch (error) {
    console.error("Check purchase status error:", error);
    throw error;
  }
}

// Get purchase history for user
async function getUserPurchases(userId) {
  try {
    const purchases = await Purchase.find({ userId }).sort({ createdAt: -1 });
    return purchases;
  } catch (error) {
    console.error("Get user purchases error:", error);
    throw error;
  }
}

module.exports = {
  initiatePurchase,
  verifyPurchase,
  checkPurchaseStatus,
  getUserPurchases
};