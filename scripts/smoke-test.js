const hre = require("hardhat");

/**
 * Smoke Test Script
 * Tests the complete workflow: deploy, mint, verify
 */

async function main() {
  console.log("═".repeat(60));
  console.log("  EVM MOCK ENVIRONMENT - SMOKE TEST");
  console.log("═".repeat(60));
  console.log("");

  // Get accounts
  const [owner, recipient] = await hre.ethers.getSigners();
  const ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log("STEP 1: Environment Check");
  console.log("─".repeat(60));
  console.log(`  Owner Address:    ${owner.address}`);
  console.log(`  Owner Balance:    ${hre.ethers.formatEther(ownerBalance)} ETH`);
  console.log(`  Recipient:        ${recipient.address}`);

  const network = await hre.ethers.provider.getNetwork();
  console.log(`  Network:          ${network.name}`);
  console.log(`  Chain ID:         ${network.chainId}`);
  console.log("");

  // Deploy AccessNFT
  console.log("STEP 2: Deploy AccessNFT Contract");
  console.log("─".repeat(60));
  const AccessNFT = await hre.ethers.getContractFactory("AccessNFT");
  const deployTx = await AccessNFT.deploy();
  const nft = await deployTx.waitForDeployment();
  const contractAddress = await nft.getAddress();

  const deployReceipt = await deployTx.deploymentTransaction().wait();

  console.log(`  Contract Address: ${contractAddress}`);
  console.log(`  Deploy Tx Hash:   ${deployReceipt.hash}`);
  console.log(`  Block Number:     ${deployReceipt.blockNumber}`);
  console.log(`  Gas Used:         ${deployReceipt.gasUsed.toString()}`);
  console.log("");

  // Verify contract state
  console.log("STEP 3: Verify Contract Deployment");
  console.log("─".repeat(60));
  const name = await nft.name();
  const symbol = await nft.symbol();
  const contractOwner = await nft.owner();
  const nextTokenId = await nft.nextTokenId();

  console.log(`  Name:             ${name}`);
  console.log(`  Symbol:           ${symbol}`);
  console.log(`  Contract Owner:   ${contractOwner}`);
  console.log(`  Next Token ID:    ${nextTokenId}`);
  console.log(`  Owner Match:      ${contractOwner === owner.address ? "✓ PASS" : "✗ FAIL"}`);
  console.log("");

  // Mint an NFT
  console.log("STEP 4: Mint Test NFT");
  console.log("─".repeat(60));
  const tokenUri = "ipfs://QmSmokeTest123456789/metadata.json";
  console.log(`  Minting to:       ${recipient.address}`);
  console.log(`  Token URI:        ${tokenUri}`);

  const mintTx = await nft.mint(recipient.address, tokenUri);
  const mintReceipt = await mintTx.wait();

  console.log(`  Mint Tx Hash:     ${mintReceipt.hash}`);
  console.log(`  Block Number:     ${mintReceipt.blockNumber}`);
  console.log(`  Gas Used:         ${mintReceipt.gasUsed.toString()}`);
  console.log("");

  // Parse Transfer event
  const transferEvent = mintReceipt.logs.find(
    log => log.fragment && log.fragment.name === "Transfer"
  );
  const mintedTokenId = transferEvent ? transferEvent.args.tokenId : "Unknown";
  console.log(`  Minted Token ID:  ${mintedTokenId}`);
  console.log("");

  // Verify the mint
  console.log("STEP 5: Verify Minted NFT");
  console.log("─".repeat(60));
  const tokenOwner = await nft.ownerOf(mintedTokenId);
  const retrievedUri = await nft.tokenURI(mintedTokenId);
  const recipientBalance = await nft.balanceOf(recipient.address);
  const newNextTokenId = await nft.nextTokenId();

  console.log(`  Token Owner:      ${tokenOwner}`);
  console.log(`  Token URI:        ${retrievedUri}`);
  console.log(`  Recipient Balance: ${recipientBalance} NFT(s)`);
  console.log(`  Next Token ID:    ${newNextTokenId}`);
  console.log("");

  // Validation
  const ownerCorrect = tokenOwner === recipient.address;
  const uriCorrect = retrievedUri === tokenUri;
  const balanceCorrect = recipientBalance === 1n;
  const idIncremented = newNextTokenId === 2n;

  console.log("STEP 6: Validation Results");
  console.log("─".repeat(60));
  console.log(`  Owner Correct:    ${ownerCorrect ? "✓ PASS" : "✗ FAIL"}`);
  console.log(`  URI Correct:      ${uriCorrect ? "✓ PASS" : "✗ FAIL"}`);
  console.log(`  Balance Correct:  ${balanceCorrect ? "✓ PASS" : "✗ FAIL"}`);
  console.log(`  ID Incremented:   ${idIncremented ? "✓ PASS" : "✗ FAIL"}`);
  console.log("");

  const allPassed = ownerCorrect && uriCorrect && balanceCorrect && idIncremented;

  console.log("═".repeat(60));
  if (allPassed) {
    console.log("  SMOKE TEST RESULT: ✓ ALL TESTS PASSED");
  } else {
    console.log("  SMOKE TEST RESULT: ✗ SOME TESTS FAILED");
  }
  console.log("═".repeat(60));
  console.log("");

  // Transaction Summary
  console.log("TRANSACTION SUMMARY");
  console.log("─".repeat(60));
  console.log(`  Deploy Transaction:`);
  console.log(`    Hash:           ${deployReceipt.hash}`);
  console.log(`    From:           ${owner.address}`);
  console.log(`    Contract:       ${contractAddress}`);
  console.log(`    Gas Used:       ${deployReceipt.gasUsed.toString()}`);
  console.log(`    Block:          ${deployReceipt.blockNumber}`);
  console.log("");
  console.log(`  Mint Transaction:`);
  console.log(`    Hash:           ${mintReceipt.hash}`);
  console.log(`    From:           ${owner.address}`);
  console.log(`    To:             ${contractAddress}`);
  console.log(`    Gas Used:       ${mintReceipt.gasUsed.toString()}`);
  console.log(`    Block:          ${mintReceipt.blockNumber}`);
  console.log(`    Token ID:       ${mintedTokenId}`);
  console.log(`    Recipient:      ${recipient.address}`);
  console.log("");

  return { nft, contractAddress, mintedTokenId, deployReceipt, mintReceipt };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("SMOKE TEST FAILED WITH ERROR:");
    console.error(error);
    process.exit(1);
  });
