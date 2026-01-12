const { ethers } = require("ethers");

// ===== CONFIG =====
const RPC_URL = "https://polygon-amoy.infura.io/v3/a5c4ef3778734852a70b4705c3ae94e0";
const PRIVATE_KEY = "0x207b36bda8f045113fa0f62969c31f8b5790bc94952a20fa1df5a99f7096709a"; // never share this publicly
const TO_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // any valid address
// ==================

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Wallet:", wallet.address);

  // Record start time (local system time)
  const startTime = Date.now();

  // Send small test transaction
  const tx = await wallet.sendTransaction({
    to: TO_ADDRESS,
    value: ethers.parseEther("0.000001"), // tiny amount for test
  });

  console.log("Transaction sent:", tx.hash);

  // Wait for confirmation
  const receipt = await tx.wait();

  const endTime = Date.now();
  const secondsTaken = (endTime - startTime) / 1000;

  // Get block timestamp from chain
  const block = await provider.getBlock(receipt.blockNumber);

  console.log("\n====== RESULT ======");
  console.log("Transaction Hash:", tx.hash);
  console.log("Block Number:", receipt.blockNumber);
  console.log("Block Timestamp (unix):", block.timestamp);
  console.log(
    "Block Time (readable):",
    new Date(block.timestamp * 1000).toString()
  );
  console.log("Time Taken (seconds):", secondsTaken);
  console.log("====================");
}

main();
