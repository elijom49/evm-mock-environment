const hre = require("hardhat");

/**
 * Example: Interact with real mainnet protocols on a fork
 *
 * This example shows how to:
 * - Check ETH balance of any mainnet address
 * - Interact with real deployed contracts (like USDC, Uniswap, etc.)
 *
 * Usage:
 *   1. Set MAINNET_RPC_URL in your .env file
 *   2. Run: npx hardhat run examples/mainnet-fork.js --network mainnetFork
 */

// Some well-known Ethereum addresses
const ADDRESSES = {
  // Vitalik's address
  vitalik: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  // USDC token contract
  usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  // Uniswap V2 Router
  uniswapRouter: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  // WETH
  weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
};

// Minimal ERC20 ABI for reading balances
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

async function main() {
  console.log("=== Mainnet Fork Example ===\n");
  console.log("This example connects to a fork of Ethereum mainnet.\n");

  // Get current block number
  const blockNumber = await hre.ethers.provider.getBlockNumber();
  console.log(`Current block number: ${blockNumber}`);
  console.log("");

  // Check ETH balance of Vitalik's address
  console.log("--- Checking Vitalik's ETH Balance ---");
  const vitalikBalance = await hre.ethers.provider.getBalance(ADDRESSES.vitalik);
  console.log(`Address: ${ADDRESSES.vitalik}`);
  console.log(`ETH Balance: ${hre.ethers.formatEther(vitalikBalance)} ETH`);
  console.log("");

  // Read USDC contract
  console.log("--- Reading USDC Contract ---");
  const usdc = new hre.ethers.Contract(ADDRESSES.usdc, ERC20_ABI, hre.ethers.provider);

  const usdcName = await usdc.name();
  const usdcSymbol = await usdc.symbol();
  const usdcDecimals = await usdc.decimals();

  console.log(`Token Name: ${usdcName}`);
  console.log(`Symbol: ${usdcSymbol}`);
  console.log(`Decimals: ${usdcDecimals}`);

  // Check Vitalik's USDC balance
  const vitalikUSDC = await usdc.balanceOf(ADDRESSES.vitalik);
  const formattedUSDC = Number(vitalikUSDC) / (10 ** Number(usdcDecimals));
  console.log(`Vitalik's USDC Balance: ${formattedUSDC.toLocaleString()} USDC`);
  console.log("");

  // Get a test account and show its balance
  console.log("--- Test Account (can impersonate any address) ---");
  const [testAccount] = await hre.ethers.getSigners();
  const testBalance = await hre.ethers.provider.getBalance(testAccount.address);
  console.log(`Test Account: ${testAccount.address}`);
  console.log(`Test Account Balance: ${hre.ethers.formatEther(testBalance)} ETH`);
  console.log("");

  // Demonstrate impersonating an account (powerful feature for testing)
  console.log("--- Impersonating Vitalik (Advanced) ---");
  console.log("With mainnet fork, you can impersonate any address!");
  console.log("This lets you test interactions as if you were that address.");
  console.log("");

  // To impersonate, you would use:
  // await hre.network.provider.request({
  //   method: "hardhat_impersonateAccount",
  //   params: [ADDRESSES.vitalik],
  // });
  // const vitalikSigner = await hre.ethers.getSigner(ADDRESSES.vitalik);
  // Now you can send transactions as Vitalik!

  console.log("=== Fork Example Complete ===");
  console.log("\nWith mainnet fork, you can:");
  console.log("  - Test against real protocol deployments");
  console.log("  - Impersonate any address");
  console.log("  - Simulate complex DeFi interactions");
  console.log("  - Debug production issues safely");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
