const hre = require("hardhat");

/**
 * Example: Send ETH between accounts
 *
 * Usage:
 *   npx hardhat run examples/send-eth.js --network localhost
 */

async function main() {
  console.log("=== Send ETH Example ===\n");

  // Get test accounts
  const [sender, receiver] = await hre.ethers.getSigners();

  // Check balances before
  const senderBalanceBefore = await hre.ethers.provider.getBalance(sender.address);
  const receiverBalanceBefore = await hre.ethers.provider.getBalance(receiver.address);

  console.log("Before Transfer:");
  console.log(`  Sender (${sender.address}): ${hre.ethers.formatEther(senderBalanceBefore)} ETH`);
  console.log(`  Receiver (${receiver.address}): ${hre.ethers.formatEther(receiverBalanceBefore)} ETH`);
  console.log("");

  // Send 1 ETH
  const amountToSend = hre.ethers.parseEther("1.0");
  console.log("Sending 1 ETH...");

  const tx = await sender.sendTransaction({
    to: receiver.address,
    value: amountToSend,
  });

  const receipt = await tx.wait();
  console.log(`Transaction hash: ${tx.hash}`);
  console.log(`Gas used: ${receipt.gasUsed.toString()}`);
  console.log("");

  // Check balances after
  const senderBalanceAfter = await hre.ethers.provider.getBalance(sender.address);
  const receiverBalanceAfter = await hre.ethers.provider.getBalance(receiver.address);

  console.log("After Transfer:");
  console.log(`  Sender: ${hre.ethers.formatEther(senderBalanceAfter)} ETH`);
  console.log(`  Receiver: ${hre.ethers.formatEther(receiverBalanceAfter)} ETH`);
  console.log("");

  // Calculate actual ETH spent (includes gas)
  const senderSpent = senderBalanceBefore - senderBalanceAfter;
  console.log(`Sender spent: ${hre.ethers.formatEther(senderSpent)} ETH (includes gas)`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
