#!/bin/bash
#
# Stop Local Blockchain
# Gracefully stops the Hardhat node
#

PID_FILE="/tmp/hardhat-node.pid"
LOG_FILE="/tmp/hardhat-node.log"

echo "═══════════════════════════════════════════════════════════"
echo "  STOPPING LOCAL BLOCKCHAIN"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check PID file
if [ -f "$PID_FILE" ]; then
    NODE_PID=$(cat "$PID_FILE")

    if ps -p "$NODE_PID" > /dev/null 2>&1; then
        echo "🛑 Stopping Hardhat node (PID: $NODE_PID)..."
        kill "$NODE_PID" 2>/dev/null

        # Wait for graceful shutdown
        sleep 2

        # Force kill if still running
        if ps -p "$NODE_PID" > /dev/null 2>&1; then
            echo "   Forcing shutdown..."
            kill -9 "$NODE_PID" 2>/dev/null
            sleep 1
        fi

        rm -f "$PID_FILE"
        echo ""
        echo "✅ Blockchain stopped successfully"
    else
        echo "ℹ️  Node was not running (stale PID file)"
        rm -f "$PID_FILE"
    fi
else
    # Try to find and kill any hardhat node process
    HARDHAT_PIDS=$(pgrep -f "hardhat node" 2>/dev/null)

    if [ -n "$HARDHAT_PIDS" ]; then
        echo "🔍 Found Hardhat node process(es): $HARDHAT_PIDS"
        echo "🛑 Stopping..."
        pkill -f "hardhat node" 2>/dev/null
        sleep 2

        # Force kill if needed
        if pgrep -f "hardhat node" > /dev/null 2>&1; then
            pkill -9 -f "hardhat node" 2>/dev/null
        fi

        echo ""
        echo "✅ Blockchain stopped"
    else
        echo "ℹ️  No blockchain is currently running"
    fi
fi

# Clear the port if something is still using it
if lsof -i:8545 > /dev/null 2>&1; then
    echo ""
    echo "⚠️  Port 8545 still in use, forcing cleanup..."
    lsof -ti:8545 | xargs kill -9 2>/dev/null
    sleep 1
    echo "✅ Port cleared"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "💡 Notes:"
echo "   • All deployed contracts are now gone"
echo "   • Run start-blockchain.sh to start fresh"
echo "   • Previous session log: $LOG_FILE"
echo ""
