const hre = require("hardhat");

/**
 * Example script showing how to interact with a deployed contract
 *
 * Usage:
 *   1. First deploy SimpleStorage: npx hardhat run scripts/deploy.js --network localhost
 *   2. Copy the deployed address and paste it below
 *   3. Run: npx hardhat run scripts/interact.js --network localhost
 */

// ============================================
// CONFIGURATION - Set your deployed contract address
// ============================================

const CONTRACT_ADDRESS = "PASTE_YOUR_CONTRACT_ADDRESS_HERE";
const CONTRACT_NAME = "SimpleStorage";

// ============================================

async function main() {
  if (CONTRACT_ADDRESS === "PASTE_YOUR_CONTRACT_ADDRESS_HERE") {
    console.log("Please deploy a contract first and set CONTRACT_ADDRESS in this script.");
    console.log("\nSteps:");
    console.log("1. Start local node: npm run node");
    console.log("2. Deploy contract: npm run deploy:local");
    console.log("3. Copy the deployed address");
    console.log("4. Set CONTRACT_ADDRESS in scripts/interact.js");
    console.log("5. Run: npm run interact");
    process.exit(1);
  }

  console.log("Connecting to contract at:", CONTRACT_ADDRESS);
  console.log("");

  // Get signers
  const [owner, user1] = await hre.ethers.getSigners();

  // Connect to the deployed contract
  const contract = await hre.ethers.getContractAt(CONTRACT_NAME, CONTRACT_ADDRESS);

  // Example interactions with SimpleStorage
  console.log("=== Reading Initial Value ===");
  let value = await contract.get();
  console.log("Current stored value:", value.toString());
  console.log("");

  console.log("=== Setting New Value ===");
  console.log("Setting value to 42...");
  const tx = await contract.set(42);
  await tx.wait();
  console.log("Transaction hash:", tx.hash);
  console.log("");

  console.log("=== Reading Updated Value ===");
  value = await contract.get();
  console.log("New stored value:", value.toString());
  console.log("");

  console.log("=== Interaction Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
