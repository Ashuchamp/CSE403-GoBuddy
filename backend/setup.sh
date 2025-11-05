#!/bin/bash

echo "🚀 Setting up GoBuddy Backend..."
echo ""

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed."
    echo "Please install PostgreSQL:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql"
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ PostgreSQL is installed"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Auto-configure database user based on platform
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - use current user and no password
    CURRENT_USER=$(whoami)
    echo ""
    echo "🔧 Configuring for macOS (user: $CURRENT_USER)..."
    sed -i '' "s/DB_USER=.*/DB_USER=$CURRENT_USER/" .env
    sed -i '' "s/DB_PASSWORD=.*/DB_PASSWORD=/" .env
    echo "✅ .env configured for macOS (using user '$CURRENT_USER', no password)"
else
    echo ""
    echo "⚠️  Please edit .env file with your database credentials"
    echo "   - For Linux/Docker: Usually DB_USER=postgres with a password"
    echo "   - For Windows: Check your PostgreSQL installation settings"
fi


