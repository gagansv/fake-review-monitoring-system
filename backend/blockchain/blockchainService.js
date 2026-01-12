const { ethers } = require("ethers");
const abi = require("./abi.json");

console.log("Initializing blockchain service...");
console.log("RPC URL:", process.env.RPC_URL);
console.log("Contract Address:", process.env.CONTRACT_ADDRESS);
console.log("Private Key length:", process.env.PRIVATE_KEY?.length);

// Use Polygon Amoy testnet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Initialize wallet with private key
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

console.log("Wallet address:", wallet.address);

// Initialize contract
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  wallet
);

async function storeReviewOnChain(reviewHash) {
  try {
    console.log("Storing review on blockchain...");
    console.log("Review hash:", reviewHash);

    // Ensure hash is properly formatted
    const formattedHash = reviewHash.startsWith("0x") ? reviewHash : "0x" + reviewHash;

    // Call the smart contract with default aiScore of 0 (since aiScore was removed)
    const tx = await contract.storeReview(formattedHash, 0);
    console.log("Transaction sent:", tx.hash);

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.hash);

    return receipt.hash;
  } catch (error) {
    console.error("Error storing review on chain:", error);
    throw new Error(`Blockchain error: ${error.message}`);
  }
}

async function verifyPurchaseTransaction(txHash) {
  try {
    console.log("Verifying transaction:", txHash);
    
    // Check if transaction exists and is confirmed
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      console.log("Transaction not found");
      return false;
    }
    
    console.log("Transaction status:", receipt.status === 1 ? "Success" : "Failed");
    
    // Return true if transaction was successful
    return receipt.status === 1;
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return false;
  }
}

async function generatePurchaseTransaction(userId, productId, amountInUSD) {
  try {
    console.log("Generating purchase transaction...");
    console.log("User:", userId, "Product:", productId, "Amount:", amountInUSD);
    
    // For demo purposes, we'll use a small fixed amount in MATIC
    // In production, you would convert USD to MATIC using current rate
    const amountInMatic = ethers.parseEther("0.001"); // 0.001 MATIC for demo
    
    // Create purchase transaction
    const tx = await wallet.sendTransaction({
      to: wallet.address, // Send to store wallet (using same wallet for demo)
      value: amountInMatic,
      data: ethers.toUtf8Bytes(`Purchase:${productId}:${userId}:${Date.now()}`)
    });
    
    console.log("Purchase transaction sent:", tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("Purchase transaction confirmed:", receipt.hash);
    
    return receipt.hash;
  } catch (error) {
    console.error("Error creating purchase transaction:", error);
    throw new Error(`Purchase transaction failed: ${error.message}`);
  }
}

// Verify if a review exists on blockchain
async function verifyReviewOnChain(reviewHash) {
  try {
    const formattedHash = reviewHash.startsWith("0x") ? reviewHash : "0x" + reviewHash;
    const exists = await contract.verifyReview(formattedHash);
    return exists;
  } catch (error) {
    console.error("Error verifying review on chain:", error);
    return false;
  }
}

module.exports = { 
  storeReviewOnChain, 
  verifyPurchaseTransaction,
  generatePurchaseTransaction,
  verifyReviewOnChain,
  walletAddress: wallet.address
};