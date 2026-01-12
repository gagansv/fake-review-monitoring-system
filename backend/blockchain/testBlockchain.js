require('dotenv').config();
const { ethers } = require("ethers");
const abi = require("./abi.json");

async function testConnection() {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const network = await provider.getNetwork();
    console.log("Connected to network:", network.name, "Chain ID:", network.chainId);
    
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Wallet address:", wallet.address);
    console.log("Wallet balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "MATIC");
    
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);
    console.log("Contract address:", await contract.getAddress());
    
    console.log("✅ Blockchain connection successful!");
    
  } catch (error) {
    console.error("❌ Blockchain connection failed:", error.message);
  }
}

testConnection();