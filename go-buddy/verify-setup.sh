#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  GoBuddy Testing Infrastructure Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        return 1
    fi
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to print info
print_info() {
    echo -e "  $1"
}

ERRORS=0

# Check Node.js
echo "Checking Prerequisites..."
echo ""

if command_exists node; then
    NODE_VERSION=$(node -v)
    print_status 0 "Node.js installed: $NODE_VERSION"
    
    # Check if version is 18 or higher
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_warning "Node.js version should be 18 or higher"
        ERRORS=$((ERRORS + 1))
    fi
else
    print_status 1 "Node.js not found"
    print_info "Install from: https://nodejs.org/"
    ERRORS=$((ERRORS + 1))
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    print_status 0 "npm installed: $NPM_VERSION"
else
    print_status 1 "npm not found"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "Checking Project Files..."
echo ""

# Check package.json
if [ -f "package.json" ]; then
    print_status 0 "package.json exists"
else
    print_status 1 "package.json not found"
    ERRORS=$((ERRORS + 1))
fi

# Check tsconfig.json
if [ -f "tsconfig.json" ]; then
    print_status 0 "tsconfig.json exists"
else
    print_status 1 "tsconfig.json not found"
    ERRORS=$((ERRORS + 1))
fi

# Check jest.setup.js
if [ -f "jest.setup.js" ]; then
    print_status 0 "jest.setup.js exists"
else
    print_status 1 "jest.setup.js not found"
    ERRORS=$((ERRORS + 1))
fi

# Check .eslintrc.js
if [ -f ".eslintrc.js" ]; then
    print_status 0 ".eslintrc.js exists"
else
    print_status 1 ".eslintrc.js not found"
    ERRORS=$((ERRORS + 1))
fi

# Check .prettierrc.js
if [ -f ".prettierrc.js" ]; then
    print_status 0 ".prettierrc.js exists"
else
    print_status 1 ".prettierrc.js not found"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "Checking Test Directory Structure..."
echo ""

# Check test directories
if [ -d "src/__tests__" ]; then
    print_status 0 "src/__tests__/ directory exists"
else
    print_status 1 "src/__tests__/ directory not found"
    ERRORS=$((ERRORS + 1))
fi

if [ -d "src/__tests__/components" ]; then
    print_status 0 "src/__tests__/components/ directory exists"
    TEST_COUNT=$(find src/__tests__/components -name "*.test.tsx" -o -name "*.test.ts" | wc -l | xargs)
    print_info "Found $TEST_COUNT component test file(s)"
else
    print_status 1 "src/__tests__/components/ directory not found"
    ERRORS=$((ERRORS + 1))
fi

if [ -d "src/__tests__/screens" ]; then
    print_status 0 "src/__tests__/screens/ directory exists"
    TEST_COUNT=$(find src/__tests__/screens -name "*.test.tsx" -o -name "*.test.ts" | wc -l | xargs)
    print_info "Found $TEST_COUNT screen test file(s)"
else
    print_status 1 "src/__tests__/screens/ directory not found"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "Checking Dependencies..."
echo ""

if [ -d "node_modules" ]; then
    print_status 0 "node_modules exists (dependencies installed)"
    
    # Check key dependencies
    if [ -d "node_modules/jest" ]; then
        print_status 0 "Jest installed"
    else
        print_status 1 "Jest not installed"
        ERRORS=$((ERRORS + 1))
    fi
    
    if [ -d "node_modules/@testing-library/react-native" ]; then
        print_status 0 "React Testing Library installed"
    else
        print_status 1 "React Testing Library not installed"
        ERRORS=$((ERRORS + 1))
    fi
    
    if [ -d "node_modules/eslint" ]; then
        print_status 0 "ESLint installed"
    else
        print_status 1 "ESLint not installed"
        ERRORS=$((ERRORS + 1))
    fi
    
    if [ -d "node_modules/prettier" ]; then
        print_status 0 "Prettier installed"
    else
        print_status 1 "Prettier not installed"
        ERRORS=$((ERRORS + 1))
    fi
else
    print_status 1 "node_modules not found"
    print_info "Run: npm install"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "Checking npm Scripts..."
echo ""

# Check if package.json has required scripts
if grep -q '"test":' package.json; then
    print_status 0 "test script configured"
else
    print_status 1 "test script not found"
    ERRORS=$((ERRORS + 1))
fi

if grep -q '"test:watch":' package.json; then
    print_status 0 "test:watch script configured"
else
    print_status 1 "test:watch script not found"
    ERRORS=$((ERRORS + 1))
fi

if grep -q '"test:coverage":' package.json; then
    print_status 0 "test:coverage script configured"
else
    print_status 1 "test:coverage script not found"
    ERRORS=$((ERRORS + 1))
fi

if grep -q '"lint":' package.json; then
    print_status 0 "lint script configured"
else
    print_status 1 "lint script not found"
    ERRORS=$((ERRORS + 1))
fi

if grep -q '"format":' package.json; then
    print_status 0 "format script configured"
else
    print_status 1 "format script not found"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Your testing infrastructure is properly set up."
    echo ""
    echo "Next steps:"
    echo "  1. Run tests:           npm test"
    echo "  2. Run with coverage:   npm run test:coverage"
    echo "  3. Run in watch mode:   npm run test:watch"
    echo "  4. Check linting:       npm run lint"
    echo "  5. Format code:         npm run format"
    echo ""
    echo "Documentation:"
    echo "  • Quick Start:  ./TEST_QUICKSTART.md"
    echo "  • Full Guide:   ../TESTING.md"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS issue(s)${NC}"
    echo ""
    echo "Please fix the issues above and run this script again."
    echo ""
    echo "If dependencies are missing, run:"
    echo "  npm install"
    echo ""
    exit 1
fi

