#!/bin/bash
# Quick start script for Salon Automation Hub

echo "🚀 Setting up Salon Automation Hub..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION installed"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Installation failed"
    exit 1
fi

echo "✅ Dependencies installed"

# Setup environment
echo ""
echo "🔑 Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "📝 IMPORTANT: Edit .env with your API credentials:"
    echo "   - ANTHROPIC_API_KEY"
    echo "   - SQUARE_ACCESS_TOKEN"
    echo "   - GMAIL_CLIENT_ID"
    echo "   See docs/API_KEYS.md for detailed setup instructions"
else
    echo "✅ .env file already exists"
fi

# Build info
echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Configure your API keys in .env"
echo "   2. Run 'npm run dev' to start development servers"
echo "   3. Open http://localhost:5173 in your browser"
echo "   4. Read docs/SETUP.md for detailed instructions"
echo ""
echo "💡 Useful commands:"
echo "   npm run dev       - Start dev servers"
echo "   npm test          - Run tests"
echo "   npm run build     - Build for production"
echo "   npm run lint      - Check code style"
echo ""
