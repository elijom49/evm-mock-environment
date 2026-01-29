#!/bin/bash
#
# Reset Local Blockchain
# Stops any running node and starts fresh
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "═══════════════════════════════════════════════════════════"
echo "  RESETTING LOCAL BLOCKCHAIN"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "This will:"
echo "  • Stop any running blockchain"
echo "  • Clear all deployed contracts"
echo "  • Clear Hardhat cache and artifacts"
echo "  • Start a fresh blockchain"
echo ""

# Ask for confirmation
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""

# Stop existing blockchain
echo "🛑 Stopping existing blockchain..."
"$SCRIPT_DIR/stop-blockchain.sh" 2>/dev/null || true
echo ""

# Clear cache and artifacts
echo "🧹 Clearing cache and artifacts..."
cd "$PROJECT_DIR"
rm -rf cache artifacts
echo "   Removed: cache/"
echo "   Removed: artifacts/"
echo ""

# Recompile contracts
echo "🔨 Recompiling contracts..."
npx hardhat compile 2>&1 | grep -v "injecting env" | grep -v "tip:"
echo ""

# Start fresh blockchain
echo "🚀 Starting fresh blockchain..."
"$SCRIPT_DIR/start-blockchain.sh"
