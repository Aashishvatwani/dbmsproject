const hre = require("hardhat");

async function main() {
  const DocumentStore = await hre.ethers.getContractFactory("DocumentStore");

  // Deploy the contract
  const documentStore = await DocumentStore.deploy();

  // Wait until the contract is mined (deployed)
  await documentStore.waitForDeployment();

  // Log the deployed address
  console.log("✅ Contract deployed to:", await documentStore.getAddress());
}

main().catch((error) => {
  console.error("❌ Error in deployment:", error);
  process.exitCode = 1;
});
