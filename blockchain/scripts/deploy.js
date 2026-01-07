const hre = require("hardhat");

async function main() {
  console.log("Deploying ReviewLedger contract...");

  const ReviewLedger = await hre.ethers.getContractFactory("ReviewLedger");

  const contract = await ReviewLedger.deploy();

  await contract.waitForDeployment();

  console.log("Contract deployed successfully!");
  console.log(" Contract Address:");
  console.log(contract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(" Deployment failed:");
    console.error(error);
    process.exit(1);
  });
