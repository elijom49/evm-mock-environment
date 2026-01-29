const hre = require("hardhat");

/**
 * Universal deployment script
 *
 * Usage:
 *   npx hardhat run scripts/deploy.js --network localhost
 *
 * To deploy a specific contract, modify CONTRACT_NAME and CONSTRUCTOR_ARGS below
 */

// ============================================
// CONFIGURATION - Modify these for your needs
// ============================================

const CONTRACT_NAME = "SimpleStorage";  // Change to your contract name
const CONSTRUCTOR_ARGS = [];            // Add constructor arguments if needed

// ============================================

async function main() {
  console.log("Starting deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("");

  // Deploy contract
  console.log(`Deploying ${CONTRACT_NAME}...`);

  const Contract = await hre.ethers.getContractFactory(CONTRACT_NAME);
  const contract = await Contract.deploy(...CONSTRUCTOR_ARGS);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`${CONTRACT_NAME} deployed to:`, contractAddress);

  // Get deployment transaction details
  const deployTx = contract.deploymentTransaction();
  if (deployTx) {
    const receipt = await deployTx.wait();
    console.log("Gas used:", receipt.gasUsed.toString());
    console.log("Block number:", receipt.blockNumber);
  }

  console.log("\nDeployment complete!");

  return { contract, contractAddress };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
