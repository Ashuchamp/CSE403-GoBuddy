#!/bin/bash

echo "🚀 Running pre-PR checks..."

# Frontend checks
echo "📱 Checking frontend..."
cd go-buddy
npm run type-check || exit 1
npm run lint || exit 1
npm run format:check || exit 1
npm run test:ci || exit 1

# Backend checks
echo "🔧 Checking backend..."
cd ../backend
npm run lint || exit 1

echo "✅ All checks passed! Ready to create PR."