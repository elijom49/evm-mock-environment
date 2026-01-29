const hre = require("hardhat");

/**
 * Display all test accounts with their balances
 *
 * Usage:
 *   npx hardhat run scripts/accounts.js --network localhost
 */

async function main() {
  console.log("=".repeat(70));
  console.log("TEST ACCOUNTS");
  console.log("=".repeat(70));
  console.log("\nWARNING: These are TEST accounts only!");
  console.log("Never send real ETH to these addresses!\n");

  const accounts = await hre.ethers.getSigners();

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const balance = await hre.ethers.provider.getBalance(account.address);

    console.log(`Account #${i}`);
    console.log(`  Address: ${account.address}`);
    console.log(`  Balance: ${hre.ethers.formatEther(balance)} ETH`);
    console.log("");
  }

  console.log("=".repeat(70));
  console.log(`Total accounts: ${accounts.length}`);
  console.log("=".repeat(70));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
