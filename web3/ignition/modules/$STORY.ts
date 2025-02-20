require("@nomicfoundation/hardhat-ethers");

const { ethers } = require("hardhat");

async function main() {
  // Get the ContractFactory for the contract
  const Story = await ethers.deployContract("$STORY");

  console.log("Deploying Story...");

  // Wait for the deployment to complete
  await Story.waitForDeployment();

  // Get the deployed contract's address
  const contractAddress = await Story.getAddress();
  console.log("Story deployed to:", contractAddress);
}

// Proper error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
