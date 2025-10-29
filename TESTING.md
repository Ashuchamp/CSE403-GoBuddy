# Testing Guide for GoBuddy

This document provides comprehensive guidelines for testing in the GoBuddy application.

## Table of Contents

1. [Test Automation Infrastructure](#test-automation-infrastructure)
2. [Running Tests](#running-tests)
3. [Adding New Tests](#adding-new-tests)
4. [Test Organization](#test-organization)
5. [Coverage Requirements](#coverage-requirements)
6. [Continuous Integration](#continuous-integration)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Test Automation Infrastructure

### Tools and Frameworks

Our project uses the following testing tools:

- **Jest**: Core test runner and assertion library for unit and integration testing
- **React Testing Library**: Simulates realistic user interactions for React Native components
- **@testing-library/jest-native**: Provides custom matchers for React Native testing

### Why These Tools?

- ✅ Seamless integration with TypeScript/React Native and Node.js environment
- ✅ Jest provides built-in mocking, snapshot testing, and detailed coverage reports
- ✅ React Testing Library ensures components behave correctly under real user actions
- ✅ Industry-standard tools with excellent documentation and community support

## Running Tests

### Basic Commands

```bash
# Navigate to the project directory
cd go-buddy

# Run all tests once
npm test

# Run tests in watch mode (auto-reruns on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (used by GitHub Actions)
npm run test:ci

# Run a specific test file
npm test -- Button.test

# Run tests matching a pattern
npm test -- components/
```

### Other Quality Checks

```bash
# Run TypeScript type checking
npm run type-check

# Run ESLint (code quality)
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Check code formatting with Prettier
npm run format:check

# Format code with Prettier
npm run format
```

## Adding New Tests

### Frontend Component Tests

Create test files in the `src/__tests__/components/` directory.

**File naming convention**: `ComponentName.test.tsx`

**Example**: Testing a Button component

```typescript
// src/__tests__/components/Button.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Button} from '../../components/Button';

describe('Button Component', () => {
  it('should render with text content', () => {
    const {getByText} = render(<Button>Click Me</Button>);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(<Button onPress={onPressMock}>Press Me</Button>);
    
    fireEvent.press(getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
```

### Screen/Integration Tests

Create test files in the `src/__tests__/screens/` directory.

**File naming convention**: `ScreenName.test.tsx`

**Example**: Testing a screen component

```typescript
// src/__tests__/screens/BrowseScreen.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {BrowseScreen} from '../../screens/BrowseScreen';

describe('BrowseScreen Integration Tests', () => {
  it('should render the browse screen', () => {
    const {getByText} = render(
      <BrowseScreen 
        currentUser={mockUser} 
        activityIntents={mockIntents} 
      />
    );
    
    expect(getByText('Browse')).toBeTruthy();
  });
  
  it('should switch categories when button is pressed', () => {
    const {getByText} = render(
      <BrowseScreen 
        currentUser={mockUser} 
        activityIntents={mockIntents} 
      />
    );
    
    fireEvent.press(getByText('Activities'));
    expect(getByText('Discover activities to join')).toBeTruthy();
  });
});
```

## Test Organization

### Directory Structure

```
go-buddy/
├── src/
│   ├── __tests__/
│   │   ├── components/     # Component unit tests
│   │   │   ├── Button.test.tsx
│   │   │   ├── Card.test.tsx
│   │   │   └── ActivityCard.test.tsx
│   │   └── screens/        # Screen integration tests
│   │       ├── BrowseScreen.test.tsx
│   │       └── ProfileScreen.test.tsx
│   ├── components/
│   ├── screens/
│   └── ...
├── package.json
└── jest.config.js
```

### Test File Naming

- All test files must end with `.test.ts` or `.test.tsx`
- Name test files after the component/module they test
- Place tests in `__tests__/` directory matching source structure

### Test Structure

Use descriptive `describe` and `it` blocks:

```typescript
describe('ComponentName', () => {
  describe('Feature/Behavior Category', () => {
    it('should do something specific', () => {
      // Test implementation
    });
    
    it('should handle edge case', () => {
      // Test implementation
    });
  });
});
```

## Coverage Requirements

### Minimum Thresholds

Our project enforces the following coverage thresholds:

| Metric     | Minimum Required |
|------------|------------------|
| Statements | ≥ 80%            |
| Branches   | ≥ 70%            |
| Functions  | ≥ 80%            |
| Lines      | ≥ 80%            |

### Viewing Coverage Reports

After running `npm run test:coverage`, open the HTML report:

```bash
# macOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

### Files Excluded from Coverage

The following files are excluded from coverage requirements:

- Type definition files (`*.d.ts`)
- Configuration files (`types.ts`, `theme.ts`)
- Mock data files (`src/data/**`)

## Continuous Integration

### GitHub Actions Workflow

Our CI pipeline (`/.github/workflows/ci.yml`) automatically runs on:

- Every pull request to `main`, `dev`, or `develop` branches
- Every push to `main`, `dev`, or `develop` branches

### CI Pipeline Steps

1. **Install Dependencies**: `npm ci` for consistent installs
2. **Type Check**: Verifies TypeScript types
3. **ESLint**: Checks code quality and style
4. **Prettier**: Verifies code formatting
5. **Run Tests**: Executes all tests with coverage
6. **Coverage Report**: Posts coverage to PR comments
7. **Coverage Threshold**: Enforces minimum coverage requirements

### Pull Request Requirements

Before a PR can be merged:

- ✅ All tests must pass
- ✅ Linting must pass (no ESLint errors)
- ✅ Formatting must pass (Prettier check)
- ✅ Type checking must pass (no TypeScript errors)
- ✅ Coverage thresholds must be met (≥80% statements, ≥70% branches)
- ✅ At least 1 code review approval required

### Viewing CI Results

1. Navigate to your PR on GitHub
2. Scroll to the "Checks" section at the bottom
3. Click on "Details" for any failed check to see logs
4. Coverage report will be posted as a comment on the PR

## Best Practices

### Writing Good Tests

1. **Test Behavior, Not Implementation**
   ```typescript
   // ✅ Good - tests user behavior
   it('should show success message after form submission', () => {
     fireEvent.press(getByText('Submit'));
     expect(getByText('Success!')).toBeTruthy();
   });
   
   // ❌ Bad - tests implementation details
   it('should call setState with loading:true', () => {
     expect(component.state.loading).toBe(true);
   });
   ```

2. **Use Descriptive Test Names**
   ```typescript
   // ✅ Good
   it('should disable submit button when form is invalid', () => {});
   
   // ❌ Bad
   it('test button', () => {});
   ```

3. **Arrange-Act-Assert Pattern**
   ```typescript
   it('should update count when button is pressed', () => {
     // Arrange - set up test data
     const {getByText} = render(<Counter />);
     
     // Act - perform action
     fireEvent.press(getByText('Increment'));
     
     // Assert - verify result
     expect(getByText('Count: 1')).toBeTruthy();
   });
   ```

4. **Keep Tests Independent**
   - Each test should be able to run in isolation
   - Don't rely on test execution order
   - Clean up after each test if needed

5. **Mock External Dependencies**
   ```typescript
   jest.mock('../../services/api', () => ({
     fetchData: jest.fn(() => Promise.resolve(mockData)),
   }));
   ```

### Testing React Native Components

1. **Use React Testing Library Queries**
   ```typescript
   // Preferred queries (in order):
   getByText('Hello')           // Text content
   getByRole('button')          // Accessible role
   getByLabelText('Username')   // Label text
   getByTestId('custom-id')     // Last resort
   ```

2. **Test Accessibility**
   ```typescript
   it('should be accessible', () => {
     const {getByA11yLabel} = render(<Button>Click</Button>);
     expect(getByA11yLabel('Submit button')).toBeTruthy();
   });
   ```

3. **Test User Interactions**
   ```typescript
   fireEvent.press(button);
   fireEvent.changeText(input, 'New text');
   ```

### Common Testing Patterns

#### Testing Async Operations

```typescript
it('should load data asynchronously', async () => {
  const {getByText, findByText} = render(<DataComponent />);
  
  // Use findBy for async operations
  const data = await findByText('Loaded Data');
  expect(data).toBeTruthy();
});
```

#### Testing Props

```typescript
it('should render with custom props', () => {
  const {getByText} = render(
    <Button variant="primary" size="large">
      Custom Button
    </Button>
  );
  
  expect(getByText('Custom Button')).toBeTruthy();
});
```

#### Testing State Changes

```typescript
it('should update state on button press', () => {
  const {getByText} = render(<Counter />);
  
  fireEvent.press(getByText('Increment'));
  expect(getByText('Count: 1')).toBeTruthy();
  
  fireEvent.press(getByText('Increment'));
  expect(getByText('Count: 2')).toBeTruthy();
});
```

## Troubleshooting

### Common Issues

#### Jest can't find modules

**Problem**: `Cannot find module '@/components/Button'`

**Solution**: Check `tsconfig.json` and ensure paths are configured correctly.

#### Tests timing out

**Problem**: Tests hang or timeout

**Solution**: 
```typescript
// Increase timeout for specific test
it('slow test', async () => {
  // test code
}, 10000); // 10 second timeout
```

#### React Native component not rendering

**Problem**: Component doesn't render in tests

**Solution**: Ensure you're using `jest-expo` preset and have proper transformIgnorePatterns.

#### Coverage not updating

**Problem**: Coverage report shows old results

**Solution**:
```bash
# Clear Jest cache
npm test -- --clearCache

# Remove coverage directory
rm -rf coverage

# Run tests again
npm run test:coverage
```

### Getting Help

- Check [Jest documentation](https://jestjs.io/docs/getting-started)
- Check [React Testing Library docs](https://testing-library.com/docs/react-native-testing-library/intro/)
- Review existing test files in `src/__tests__/` for examples
- Ask team members in Slack/Discord

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Last Updated**: October 28, 2025

