console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
console.log("PRIVATE_KEY length:", process.env.PRIVATE_KEY?.length);
console.log("CONTRACT_ADDRESS:", process.env.CONTRACT_ADDRESS);

const { ethers } = require("ethers");
const abi = require("./abi.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

async function storeReviewOnChain(reviewHash, aiScore) {
  const tx = await contract.storeReview("0x" + reviewHash, aiScore);
  await tx.wait();
  return tx.hash;
}

module.exports = { storeReviewOnChain };
