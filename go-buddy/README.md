# GoBuddy Mobile App

A React Native mobile application for connecting students with shared interests and activities.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Studio (for Android development)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 🧪 Testing

This project has a comprehensive testing infrastructure with Jest, React Testing Library, and automated CI/CD.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run in CI mode
npm run test:ci
```

### Quick Links

- [Testing Quick Start](./TEST_QUICKSTART.md) - Get started with testing in 5 minutes
- [Full Testing Guide](../TESTING.md) - Comprehensive testing documentation

### Coverage Requirements

All code must meet the following coverage thresholds:

- **Statements**: ≥ 80%
- **Branches**: ≥ 70%
- **Functions**: ≥ 80%
- **Lines**: ≥ 80%

## 🛠️ Code Quality

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format code
npm run format

# TypeScript type checking
npm run type-check
```

### Pre-commit Checklist

Before committing, ensure:

- ✅ Tests pass: `npm test`
- ✅ Code is linted: `npm run lint`
- ✅ Code is formatted: `npm run format:check`
- ✅ Types are valid: `npm run type-check`

## 🏗️ Project Structure

```
go-buddy/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── screens/           # Screen components
│   │   ├── BrowseScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ...
│   ├── navigation/        # Navigation configuration
│   ├── data/              # Mock data and constants
│   ├── __tests__/         # Test files
│   │   ├── components/    # Component tests
│   │   └── screens/       # Screen tests
│   ├── types.ts           # TypeScript type definitions
│   └── theme.ts           # Theme configuration
├── assets/                # Images, fonts, etc.
├── ios/                   # iOS native code
├── package.json
├── tsconfig.json
└── jest.setup.js
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo development server |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:ci` | Run tests in CI mode |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript type checking |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |

## 🔄 Continuous Integration

This project uses GitHub Actions for automated testing and quality checks.

### CI Pipeline

On every pull request and push to `main`/`dev` branches:

1. ✅ Install dependencies
2. ✅ Run TypeScript type checking
3. ✅ Run ESLint
4. ✅ Run Prettier checks
5. ✅ Run all tests with coverage
6. ✅ Generate coverage reports
7. ✅ Enforce coverage thresholds

### Branch Protection

Pull requests cannot be merged until:

- All CI checks pass
- Code coverage meets minimum thresholds
- At least 1 code review approval

## 🧩 Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📚 Documentation

- [Testing Guide](../TESTING.md) - Comprehensive testing documentation
- [Testing Quick Start](./TEST_QUICKSTART.md) - Quick start guide
- [Code Guidelines](../coding-guidelines.md) - Coding standards
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute

## 🤝 Contributing

1. Create a feature branch from `dev`
2. Write tests for new features
3. Ensure all tests pass and coverage meets thresholds
4. Run linting and formatting checks
5. Submit a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

## 📊 Test Examples

### Component Test Example

```typescript
import {render, fireEvent} from '@testing-library/react-native';
import {Button} from '../components/Button';

it('should call onPress when pressed', () => {
  const onPress = jest.fn();
  const {getByText} = render(<Button onPress={onPress}>Click</Button>);
  fireEvent.press(getByText('Click'));
  expect(onPress).toHaveBeenCalled();
});
```

### Screen Test Example

```typescript
import {render, fireEvent} from '@testing-library/react-native';
import {BrowseScreen} from '../screens/BrowseScreen';

it('should switch categories', () => {
  const {getByText} = render(<BrowseScreen {...props} />);
  fireEvent.press(getByText('Activities'));
  expect(getByText('Discover activities to join')).toBeTruthy();
});
```

## 🐛 Troubleshooting

### Tests won't run

```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build issues

```bash
# Clear Expo cache
expo start -c

# Clear iOS build
cd ios && pod install && cd ..
```

## 📄 License

This project is for educational purposes as part of CSE 403.

## 👥 Team

University of Washington - CSE 403 Team

---

**Need help?** Check the documentation or contact the team!

