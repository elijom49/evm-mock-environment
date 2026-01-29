# EVM Mock Environment

A complete local Ethereum blockchain for testing and development. No real money, no risk - perfect for learning and building.

## What Is This?

This is a **fake Ethereum blockchain** that runs on your computer. It works exactly like the real Ethereum network, but:

- All the ETH is fake (you get 10,000 ETH per account!)
- Transactions are instant (no waiting for blocks)
- Everything resets when you stop it
- You can test any smart contract safely

Think of it like a sandbox or practice mode for blockchain development.

---

## Quick Start (5 Minutes)

### Step 1: Install Dependencies

Open your terminal, navigate to this folder, and run:

```bash
npm install
```

### Step 2: Start the Local Blockchain

```bash
npm run node
```

You'll see output showing 10 test accounts, each with 10,000 fake ETH.

**Keep this terminal window open!** The blockchain runs as long as this window is open.

### Step 3: Deploy a Test Contract

Open a **new terminal window** and run:

```bash
npm run deploy:local
```

This deploys a simple storage contract to your local blockchain.

### Step 4: Run the Examples

```bash
npm run example:basic
```

This shows you how to deploy contracts and interact with them.

---

## Available Commands

| Command | What It Does |
|---------|--------------|
| `npm run node` | Start the local blockchain |
| `npm run compile` | Compile your smart contracts |
| `npm run test` | Run automated tests |
| `npm run deploy:local` | Deploy contracts to local blockchain |
| `npm run accounts` | Show all test accounts and balances |
| `npm run example:basic` | Run the basic deploy & interact example |
| `npm run example:eth` | Show how to send ETH between accounts |
| `npm run example:fork` | Test with real Ethereum data (advanced) |

---

## Test Accounts

When you start the blockchain, you get **10 test accounts** pre-loaded with fake ETH:

| Account | Address | Balance |
|---------|---------|---------|
| #0 | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 10,000 ETH |
| #1 | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 10,000 ETH |
| #2 | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC | 10,000 ETH |
| ... | ... | ... |
| #9 | 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f | 10,000 ETH |

**Important:** These are TEST accounts only. Never send real ETH to these addresses!

---

## Project Structure

```
evm-mock-environment/
├── contracts/          # Your smart contracts go here
│   ├── SimpleStorage.sol
│   └── ExampleNFT.sol
├── scripts/            # Deployment and utility scripts
│   ├── deploy.js       # Deploy any contract
│   ├── accounts.js     # View test accounts
│   └── interact.js     # Interact with deployed contracts
├── examples/           # Learning examples
│   ├── send-eth.js     # How to send ETH
│   ├── deploy-and-interact.js  # Full workflow example
│   └── mainnet-fork.js # Test with real protocol data
├── test/               # Automated tests
├── hardhat.config.js   # Configuration file
└── README.md           # This file
```

---

## How to Use

### Starting and Stopping the Blockchain

**To Start:**
```bash
npm run node
```

**To Stop:**
Press `Ctrl+C` in the terminal window running the node.

When you stop the blockchain, everything is erased. Next time you start it, you get a fresh blockchain with full balances again.

### Deploying Your Own Contract

1. Put your `.sol` file in the `contracts/` folder
2. Open `scripts/deploy.js`
3. Change `CONTRACT_NAME` to your contract's name
4. Run `npm run deploy:local`

### Connecting Metamask (Optional)

If you want to use Metamask with your local blockchain:

1. Open Metamask
2. Click the network dropdown
3. Click "Add Network"
4. Enter these settings:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

5. Import a test account using one of the private keys shown when you start the node

---

## Advanced: Mainnet Fork

Want to test with **real Ethereum data**? You can fork mainnet!

This means you can:
- See real account balances
- Interact with real deployed contracts (Uniswap, Aave, etc.)
- Test your code against real protocols

### Setup

1. Get a free RPC URL from [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)
2. Copy `.env.example` to `.env`
3. Add your RPC URL to `.env`:
   ```
   MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY
   ```

4. Run:
   ```bash
   npm run example:fork
   ```

---

## FAQ

### Why use this instead of a real testnet?

| Local Blockchain | Public Testnet |
|-----------------|----------------|
| Instant transactions | Wait for blocks |
| Unlimited free ETH | Need to get test ETH |
| Works offline | Needs internet |
| Resets on restart | Persistent |
| 100% private | Public transactions |

Use local for development, testnet for final testing before mainnet.

### Can I lose real money?

**No!** Everything in this environment is fake. The ETH has no value and transactions don't touch the real Ethereum network.

### What happens to my deployed contracts when I restart?

They're gone. Each restart gives you a fresh blockchain. If you need persistence, deploy to a public testnet like Sepolia.

### Why do I need two terminal windows?

One terminal runs the blockchain node (must stay open). The other terminal is where you run commands to interact with it.

---

## Troubleshooting

### "Connection refused" error

Make sure your blockchain node is running (`npm run node` in a separate terminal).

### "Nonce too high" in Metamask

Reset your Metamask account: Settings > Advanced > Reset Account

### Contract not found

1. Make sure you compiled: `npm run compile`
2. Check the contract name matches exactly (case-sensitive)

---

## Next Steps

1. Try modifying `SimpleStorage.sol` and redeploying
2. Write your own contract and deploy it
3. Write tests for your contracts
4. Try the mainnet fork to interact with real protocols

Happy building!
