# Testing Notes

Use this file to document your test sessions, experiments, and findings.

---

## Session Template

Copy this template for each testing session:

```
### Session: [Date] - [Brief Description]

**Goal:**
What are you testing?

**Setup:**
- Node started: yes/no
- Network: localhost / mainnetFork
- Contracts deployed:

**Steps Taken:**
1.
2.
3.

**Results:**


**Issues/Observations:**


**Next Steps:**

```

---

## Test Sessions

### Session: 2026-01-29 - Initial Environment Verification

**Goal:**
Verify the EVM mock environment is working correctly.

**Setup:**
- Node started: yes
- Network: localhost
- Contracts deployed: SimpleStorage

**Steps Taken:**
1. Started Hardhat node with `npm run node`
2. Verified 10 test accounts loaded with 10,000 ETH each
3. Deployed SimpleStorage contract
4. Contract deployed successfully to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

**Results:**
- All systems working correctly
- Deployment completed in block #1
- Gas used: 140,256

**Issues/Observations:**
- None - everything worked as expected

**Next Steps:**
- Ready for contract testing

---

### Session: 2026-01-29 - AccessNFT Smoke Test

**Goal:**
Complete smoke test of EVM environment with AccessNFT contract deployment and minting.

**Setup:**
- Node started: yes
- Network: localhost (Chain ID: 31337)
- Contracts deployed: AccessNFT

**Steps Taken:**
1. Copied AccessNFT.sol from nft-testing project
2. Installed OpenZeppelin contracts dependency
3. Compiled all contracts (20 Solidity files)
4. Started Hardhat node (10 accounts, 10,000 ETH each)
5. Deployed AccessNFT contract
6. Minted test NFT to recipient address
7. Verified NFT ownership, URI, and token ID increment
8. Stopped blockchain

**Results:**
- ALL TESTS PASSED

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Contract deploys | Address assigned | 0x5FbDB2315678afecb367f032d93F642f64180aa3 | PASS |
| Name correct | "AI File Access" | "AI File Access" | PASS |
| Symbol correct | "AIFA" | "AIFA" | PASS |
| Owner set | Deployer address | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | PASS |
| NFT mints | Token ID 1 | Token ID 1 | PASS |
| Owner correct | Recipient | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | PASS |
| URI correct | IPFS URI | ipfs://QmSmokeTest123456789/metadata.json | PASS |
| Balance updated | 1 NFT | 1 NFT | PASS |
| Token ID incremented | 2 | 2 | PASS |

**Transaction Details:**

| Transaction | Hash | Gas Used | Block |
|-------------|------|----------|-------|
| Deploy | 0x35af1013ddd6877915fb7a869fad994efd7dd2ba7e1ce974c9531c6d960ce7a3 | 1,285,566 | 1 |
| Mint | 0xdef04249758b1391a452c26e8dae6a9faf3483de283d57b55528333ac5f6af3d | 148,126 | 2 |

**Issues/Observations:**
- None - all systems working correctly
- AccessNFT contract from nft-testing project works in evm-mock-environment
- Cross-project contract testing successful

**Next Steps:**
- Environment ready for further NFT testing
- Can proceed with more complex test scenarios

---

## Quick Reference

### Starting a Test Session
```bash
# Terminal 1: Start the blockchain
npm run node

# Terminal 2: Run commands
npm run deploy:local
npm run example:basic
```

### Useful Commands
```bash
npm run accounts          # View all test accounts
npm run compile           # Compile contracts after changes
npm run test              # Run automated tests
```

### Contract Addresses Log

| Date | Contract | Address | Network |
|------|----------|---------|---------|
| 2026-01-29 | SimpleStorage | 0x5FbDB2315678afecb367f032d93F642f64180aa3 | localhost |
| 2026-01-29 | AccessNFT | 0x5FbDB2315678afecb367f032d93F642f64180aa3 | localhost |

---

## Notes

Add any general notes, learnings, or reminders here:

-
