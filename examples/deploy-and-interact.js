const hre = require("hardhat");

/**
 * Example: Deploy a contract and interact with it in one script
 *
 * Usage:
 *   npx hardhat run examples/deploy-and-interact.js --network localhost
 */

async function main() {
  console.log("=== Deploy and Interact Example ===\n");

  // Get accounts
  const [deployer, user1, user2] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("User 1:", user1.address);
  console.log("User 2:", user2.address);
  console.log("");

  // Deploy SimpleStorage
  console.log("Deploying SimpleStorage...");
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const storage = await SimpleStorage.deploy();
  await storage.waitForDeployment();
  console.log("Deployed to:", await storage.getAddress());
  console.log("");

  // Interact with the contract
  console.log("--- Interacting with SimpleStorage ---");

  // Read initial value
  let value = await storage.get();
  console.log(`Initial value: ${value}`);

  // Deployer sets a value
  console.log("\nDeployer sets value to 100...");
  await (await storage.set(100)).wait();
  value = await storage.get();
  console.log(`Value after deployer set: ${value}`);

  // User1 sets a value
  console.log("\nUser1 sets value to 200...");
  await (await storage.connect(user1).set(200)).wait();
  value = await storage.get();
  console.log(`Value after user1 set: ${value}`);

  // Deploy ExampleNFT
  console.log("\n--- Deploying ExampleNFT ---");
  const ExampleNFT = await hre.ethers.getContractFactory("ExampleNFT");
  const nft = await ExampleNFT.deploy();
  await nft.waitForDeployment();
  console.log("NFT deployed to:", await nft.getAddress());

  // Mint some NFTs
  console.log("\nMinting NFTs...");
  await (await nft.mint(user1.address)).wait();
  await (await nft.mint(user1.address)).wait();
  await (await nft.mint(user2.address)).wait();

  console.log(`User1 balance: ${await nft.balanceOf(user1.address)} NFTs`);
  console.log(`User2 balance: ${await nft.balanceOf(user2.address)} NFTs`);
  console.log(`Total supply: ${await nft.totalSupply()}`);

  // Transfer an NFT
  console.log("\nUser1 transfers token #0 to User2...");
  await (await nft.connect(user1).transferFrom(user1.address, user2.address, 0)).wait();

  console.log(`User1 balance: ${await nft.balanceOf(user1.address)} NFTs`);
  console.log(`User2 balance: ${await nft.balanceOf(user2.address)} NFTs`);
  console.log(`Token #0 owner: ${await nft.ownerOf(0)}`);

  console.log("\n=== Example Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
