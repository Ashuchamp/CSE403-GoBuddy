# GoBuddy Testing Infrastructure - Setup Guide

This guide will help you set up and verify the testing infrastructure for the GoBuddy application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or 20.x ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Verify Prerequisites

```bash
node -v    # Should show v18.x or v20.x
npm -v     # Should show 9.x or higher
git --version
```

## 🚀 Quick Setup (5 Minutes)

### Step 1: Clone Repository (if not already cloned)

```bash
git clone <repository-url>
cd CSE403-GoBuddy
```

### Step 2: Navigate to App Directory

```bash
cd go-buddy
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all dependencies including:
- Jest (testing framework)
- React Testing Library
- ESLint (code linting)
- Prettier (code formatting)
- TypeScript (type checking)

**Note**: This may take 2-5 minutes depending on your internet connection.

### Step 4: Verify Setup

```bash
# Run verification script
./verify-setup.sh

# Or manually verify by running tests
npm test
```

If all tests pass, you're ready to go! 🎉

## 📖 Detailed Setup

### Full Installation Steps

1. **Install Node.js**
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the LTS version (18.x or 20.x)
   - Run the installer
   - Verify: `node -v`

2. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd CSE403-GoBuddy/go-buddy
   ```

3. **Install Project Dependencies**
   ```bash
   npm install
   ```

4. **Verify Installation**
   ```bash
   ./verify-setup.sh
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

### What Gets Installed?

#### Testing Dependencies
- `jest` - Test runner and framework
- `@testing-library/react-native` - Component testing utilities
- `@testing-library/jest-native` - Custom matchers for React Native
- `jest-expo` - Jest preset for Expo
- `react-test-renderer` - React renderer for tests

#### Code Quality Tools
- `eslint` - JavaScript/TypeScript linter
- `eslint-config-google` - Google style guide
- `prettier` - Code formatter
- `typescript` - TypeScript compiler

#### Total Installation Size
- Approximately 400-600 MB (including all dependencies)

## ✅ Verification Checklist

After installation, verify the following:

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] Test directories exist (`src/__tests__/`)
- [ ] Configuration files exist (`.eslintrc.js`, `.prettierrc.js`, `jest.setup.js`)
- [ ] Tests run successfully (`npm test`)
- [ ] Linting works (`npm run lint`)
- [ ] Formatting works (`npm run format:check`)

### Using the Verification Script

```bash
cd go-buddy
./verify-setup.sh
```

The script will check:
- ✓ Node.js and npm versions
- ✓ Required project files
- ✓ Test directory structure
- ✓ Dependencies installation
- ✓ npm scripts configuration

## 🧪 Running Your First Tests

### Basic Test Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- Button.test

# Run tests for a specific component
npm test -- components/
```

### Expected Output

When you run `npm test`, you should see:

```
PASS  src/__tests__/components/Button.test.tsx
PASS  src/__tests__/components/Card.test.tsx
PASS  src/__tests__/components/ActivityCard.test.tsx
PASS  src/__tests__/components/Badge.test.tsx
PASS  src/__tests__/components/Input.test.tsx
PASS  src/__tests__/screens/BrowseScreen.test.tsx

Test Suites: 6 passed, 6 total
Tests:       100 passed, 100 total
Snapshots:   0 total
Time:        X.XXXs
```

## 🛠️ Configuration Files

### Files Created

The following configuration files have been set up:

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `jest.setup.js` | Jest configuration and mocks |
| `.eslintrc.js` | ESLint (linting) rules |
| `.prettierrc.js` | Prettier (formatting) rules |
| `.prettierignore` | Files to ignore for Prettier |
| `tsconfig.json` | TypeScript configuration |

### Key Settings

**Jest Configuration** (in `package.json`)
```json
{
  "preset": "jest-expo",
  "coverageThreshold": {
    "global": {
      "statements": 80,
      "branches": 70,
      "functions": 80,
      "lines": 80
    }
  }
}
```

**Coverage Thresholds**
- Statements: ≥80%
- Branches: ≥70%
- Functions: ≥80%
- Lines: ≥80%

## 📚 Available Commands

Once setup is complete, you have access to these commands:

### Testing Commands
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:ci       # Run tests in CI mode
```

### Code Quality Commands
```bash
npm run lint          # Check code quality
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code
npm run format:check  # Check if code is formatted
npm run type-check    # Check TypeScript types
```

### Development Commands
```bash
npm start            # Start Expo dev server
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator
npm run web          # Run in web browser
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue 1: "npm install" fails

**Symptoms**: Errors during dependency installation

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue 2: Tests won't run

**Symptoms**: `npm test` command fails or hangs

**Solutions**:
```bash
# Clear Jest cache
npm test -- --clearCache

# Make sure dependencies are installed
npm install

# Try running with verbose output
npm test -- --verbose
```

#### Issue 3: "Module not found" errors

**Symptoms**: Import errors in tests

**Solutions**:
- Check that the file path is correct and relative
- Ensure the module is exported correctly
- Verify TypeScript paths in `tsconfig.json`

#### Issue 4: Coverage threshold not met

**Symptoms**: Tests pass but coverage check fails

**Solutions**:
```bash
# Generate coverage report to see what's missing
npm run test:coverage

# Open detailed HTML report
open coverage/lcov-report/index.html

# Write more tests for uncovered code
```

#### Issue 5: ESLint errors

**Symptoms**: `npm run lint` shows errors

**Solutions**:
```bash
# Auto-fix many issues
npm run lint:fix

# Format code first
npm run format

# Then check linting again
npm run lint
```

### Getting Help

If you encounter issues not covered here:

1. Check the [TESTING.md](./TESTING.md) documentation
2. Review the [TEST_QUICKSTART.md](./go-buddy/TEST_QUICKSTART.md) guide
3. Search for the error message online
4. Ask the team on Slack/Discord
5. Create an issue on GitHub

## 📖 Documentation Structure

The testing infrastructure comes with comprehensive documentation:

```
CSE403-GoBuddy/
├── SETUP_GUIDE.md (this file)           # Setup instructions
├── TESTING.md                           # Comprehensive testing guide
├── TESTING_IMPLEMENTATION_SUMMARY.md    # What was implemented
└── go-buddy/
    ├── README.md                        # Project overview
    └── TEST_QUICKSTART.md               # Quick reference guide
```

### Reading Order

1. **Start here**: `SETUP_GUIDE.md` - Set up your environment
2. **Quick reference**: `go-buddy/TEST_QUICKSTART.md` - Common tasks
3. **Deep dive**: `TESTING.md` - Comprehensive guide
4. **Implementation details**: `TESTING_IMPLEMENTATION_SUMMARY.md`

## 🎯 Next Steps

After completing setup:

### 1. Verify Everything Works

```bash
cd go-buddy
./verify-setup.sh
npm test
```

### 2. Run Tests in Watch Mode

```bash
npm run test:watch
```

This is recommended during development for instant feedback.

### 3. Review Example Tests

Check out the example tests to understand patterns:
- `src/__tests__/components/Button.test.tsx`
- `src/__tests__/components/ActivityCard.test.tsx`
- `src/__tests__/screens/BrowseScreen.test.tsx`

### 4. Write Your First Test

Create a new test file and start writing tests:

```typescript
// src/__tests__/components/MyComponent.test.tsx
import React from 'react';
import {render} from '@testing-library/react-native';
import {MyComponent} from '../../components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const {getByText} = render(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
```

### 5. Review Documentation

Read through:
- [TEST_QUICKSTART.md](./go-buddy/TEST_QUICKSTART.md) for quick patterns
- [TESTING.md](./TESTING.md) for comprehensive guide

### 6. Configure Your Editor

#### VS Code

Install recommended extensions:
- ESLint
- Prettier
- Jest Runner

#### Settings

Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🎓 Learning Resources

### Official Documentation
- [Jest](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [ESLint](https://eslint.org/docs/latest/)
- [Prettier](https://prettier.io/docs/en/index.html)

### Tutorials
- [Jest Crash Course](https://www.youtube.com/watch?v=7r4xVDI2vho)
- [React Testing Library Tutorial](https://www.youtube.com/watch?v=JKOwJUM4_RM)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 📊 Success Metrics

You'll know the setup is successful when:

- ✅ All dependencies install without errors
- ✅ `npm test` runs and passes all tests
- ✅ `./verify-setup.sh` shows all green checkmarks
- ✅ `npm run lint` passes without errors
- ✅ `npm run format:check` passes
- ✅ Coverage report generates successfully

## 🎉 You're Ready!

Congratulations! Your testing infrastructure is set up and ready to use.

### Quick Reference Card

```bash
# Daily Development Workflow
npm run test:watch     # Run tests while coding
npm run lint          # Check code quality
npm run format        # Format code
npm test             # Run all tests before committing

# Before Creating PR
npm run type-check    # Check types
npm run lint         # Check linting
npm run format:check # Check formatting
npm run test:coverage # Check coverage
```

### Remember

- Write tests as you code
- Aim for ≥80% coverage
- Run tests before committing
- Use watch mode for instant feedback
- Review test examples for patterns

---

**Happy Testing! 🚀**

For questions or issues, refer to the documentation or ask the team.

**Last Updated**: October 28, 2025

