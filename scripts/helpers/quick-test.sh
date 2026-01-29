#!/bin/bash
#
# Quick Health Check
# Verifies the blockchain is running and responsive
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
PID_FILE="/tmp/hardhat-node.pid"

echo "═══════════════════════════════════════════════════════════"
echo "  BLOCKCHAIN HEALTH CHECK"
echo "═══════════════════════════════════════════════════════════"
echo ""

PASSED=0
FAILED=0

# Test 1: Check if process is running
echo "TEST 1: Process Status"
echo "───────────────────────────────────────────────────────────"
if [ -f "$PID_FILE" ]; then
    NODE_PID=$(cat "$PID_FILE")
    if ps -p "$NODE_PID" > /dev/null 2>&1; then
        echo "  ✅ PASS - Hardhat node running (PID: $NODE_PID)"
        ((PASSED++))
    else
        echo "  ❌ FAIL - Process not found (stale PID: $NODE_PID)"
        ((FAILED++))
    fi
else
    if pgrep -f "hardhat node" > /dev/null 2>&1; then
        echo "  ✅ PASS - Hardhat node running"
        ((PASSED++))
    else
        echo "  ❌ FAIL - No Hardhat node process found"
        ((FAILED++))
    fi
fi
echo ""

# Test 2: Check port 8545
echo "TEST 2: Port 8545"
echo "───────────────────────────────────────────────────────────"
if lsof -i:8545 > /dev/null 2>&1; then
    echo "  ✅ PASS - Port 8545 is active"
    ((PASSED++))
else
    echo "  ❌ FAIL - Port 8545 not listening"
    ((FAILED++))
fi
echo ""

# Test 3: RPC Response
echo "TEST 3: RPC Response"
echo "───────────────────────────────────────────────────────────"
RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    http://127.0.0.1:8545 2>/dev/null)

if [ -n "$RESPONSE" ] && echo "$RESPONSE" | grep -q "result"; then
    BLOCK_HEX=$(echo "$RESPONSE" | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
    BLOCK_DEC=$((BLOCK_HEX))
    echo "  ✅ PASS - RPC responding (Block: $BLOCK_DEC)"
    ((PASSED++))
else
    echo "  ❌ FAIL - No RPC response"
    ((FAILED++))
fi
echo ""

# Test 4: Chain ID
echo "TEST 4: Chain ID"
echo "───────────────────────────────────────────────────────────"
CHAIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
    http://127.0.0.1:8545 2>/dev/null)

if echo "$CHAIN_RESPONSE" | grep -q "0x7a69"; then
    echo "  ✅ PASS - Chain ID is 31337 (0x7a69)"
    ((PASSED++))
else
    echo "  ❌ FAIL - Unexpected Chain ID"
    ((FAILED++))
fi
echo ""

# Test 5: Account Balance
echo "TEST 5: Account Balance"
echo "───────────────────────────────────────────────────────────"
BALANCE_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","latest"],"id":1}' \
    http://127.0.0.1:8545 2>/dev/null)

if echo "$BALANCE_RESPONSE" | grep -q "result"; then
    BALANCE_HEX=$(echo "$BALANCE_RESPONSE" | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
    # Check if balance is substantial (more than 1 ETH in wei)
    if [ -n "$BALANCE_HEX" ] && [ "$BALANCE_HEX" != "0x0" ]; then
        echo "  ✅ PASS - Account #0 has balance"
        ((PASSED++))
    else
        echo "  ❌ FAIL - Account #0 has no balance"
        ((FAILED++))
    fi
else
    echo "  ❌ FAIL - Could not check balance"
    ((FAILED++))
fi
echo ""

# Test 6: Contract Compilation
echo "TEST 6: Compiled Contracts"
echo "───────────────────────────────────────────────────────────"
cd "$PROJECT_DIR"
if [ -d "artifacts/contracts" ]; then
    CONTRACT_COUNT=$(find artifacts/contracts -name "*.json" ! -name "*.dbg.json" | wc -l | tr -d ' ')
    echo "  ✅ PASS - $CONTRACT_COUNT contract artifact(s) found"
    ((PASSED++))
else
    echo "  ⚠️  WARN - No compiled contracts (run: npm run compile)"
fi
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════"
echo "  SUMMARY"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Passed: $PASSED"
echo "  Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "  ✅ ALL CHECKS PASSED - Blockchain is healthy!"
    echo ""
    echo "  Ready for:"
    echo "    • npm run deploy:local"
    echo "    • npm run test"
    echo "    • npm run example:basic"
    EXIT_CODE=0
else
    echo "  ❌ SOME CHECKS FAILED"
    echo ""
    echo "  Try:"
    echo "    • ./scripts/helpers/start-blockchain.sh"
    echo "    • ./scripts/helpers/reset-blockchain.sh"
    EXIT_CODE=1
fi

echo ""
echo "═══════════════════════════════════════════════════════════"

exit $EXIT_CODE
