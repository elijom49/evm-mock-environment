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

---

## Notes

Add any general notes, learnings, or reminders here:

-
