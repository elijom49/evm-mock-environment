#!/bin/bash
#
# Start Local Blockchain
# Starts the Hardhat node for local development
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_FILE="/tmp/hardhat-node.log"
PID_FILE="/tmp/hardhat-node.pid"

echo "═══════════════════════════════════════════════════════════"
echo "  STARTING LOCAL BLOCKCHAIN"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if already running
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        echo "⚠️  Blockchain is already running (PID: $OLD_PID)"
        echo "   Run stop-blockchain.sh first, or use reset-blockchain.sh"
        exit 1
    else
        rm -f "$PID_FILE"
    fi
fi

# Check if port is in use
if lsof -i:8545 > /dev/null 2>&1; then
    echo "⚠️  Port 8545 is already in use"
    echo "   Something else may be running on this port"
    echo "   Run: lsof -i:8545 to see what's using it"
    exit 1
fi

cd "$PROJECT_DIR"

echo "📍 Project: $PROJECT_DIR"
echo "📝 Log file: $LOG_FILE"
echo ""

# Start the node
echo "🚀 Starting Hardhat node..."
nohup npx hardhat node > "$LOG_FILE" 2>&1 &
NODE_PID=$!
echo "$NODE_PID" > "$PID_FILE"

# Wait for startup
echo "⏳ Waiting for node to initialize..."
sleep 4

# Check if it started successfully
if ! ps -p "$NODE_PID" > /dev/null 2>&1; then
    echo "❌ Failed to start blockchain"
    echo ""
    echo "Error log:"
    cat "$LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
fi

# Verify it's responding
if curl -s -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    http://127.0.0.1:8545 > /dev/null 2>&1; then
    echo ""
    echo "✅ Blockchain started successfully!"
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  NODE INFORMATION"
    echo "═══════════════════════════════════════════════════════════"
    echo "  PID:          $NODE_PID"
    echo "  RPC URL:      http://127.0.0.1:8545"
    echo "  Chain ID:     31337"
    echo "  Network:      localhost"
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  TEST ACCOUNTS (10,000 ETH each)"
    echo "═══════════════════════════════════════════════════════════"
    grep "Account #" "$LOG_FILE" | head -10
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "💡 Tips:"
    echo "   • Keep this terminal open or the node runs in background"
    echo "   • View logs: tail -f $LOG_FILE"
    echo "   • Stop node: ./scripts/helpers/stop-blockchain.sh"
    echo "   • Deploy contracts: npm run deploy:local"
    echo ""
else
    echo "❌ Node started but not responding"
    echo "   Check log: cat $LOG_FILE"
    exit 1
fi
