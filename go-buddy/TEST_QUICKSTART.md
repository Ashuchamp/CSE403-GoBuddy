# Testing Quick Start Guide

This is a quick reference guide for running and writing tests in GoBuddy. For comprehensive documentation, see [TESTING.md](../TESTING.md).

## 🚀 Quick Start

### Install Dependencies

```bash
cd go-buddy
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## ✍️ Writing Your First Test

### 1. Create a Test File

Create a file in `src/__tests__/components/` or `src/__tests__/screens/`:

```typescript
// src/__tests__/components/MyComponent.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {MyComponent} from '../../components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const {getByText} = render(<MyComponent title="Hello" />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('should handle button press', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(<MyComponent onPress={onPressMock} />);
    
    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
```

### 2. Run Your Test

```bash
# Run specific test file
npm test -- MyComponent

# Run in watch mode (recommended during development)
npm run test:watch
```

## 📋 Test Checklist

Before submitting a PR, ensure:

- [ ] All tests pass: `npm test`
- [ ] Code is linted: `npm run lint`
- [ ] Code is formatted: `npm run format:check`
- [ ] Types are valid: `npm run type-check`
- [ ] Coverage meets thresholds (≥80% statements, ≥70% branches)

## 🎯 Coverage Requirements

| Metric     | Minimum |
|------------|---------|
| Statements | ≥ 80%   |
| Branches   | ≥ 70%   |
| Functions  | ≥ 80%   |
| Lines      | ≥ 80%   |

## 🔍 Common Testing Patterns

### Testing a Button Click

```typescript
const onPressMock = jest.fn();
const {getByText} = render(<Button onPress={onPressMock}>Click</Button>);
fireEvent.press(getByText('Click'));
expect(onPressMock).toHaveBeenCalledTimes(1);
```

### Testing Text Input

```typescript
const onChangeTextMock = jest.fn();
const {getByPlaceholderText} = render(
  <Input placeholder="Enter text" onChangeText={onChangeTextMock} />
);
fireEvent.changeText(getByPlaceholderText('Enter text'), 'New text');
expect(onChangeTextMock).toHaveBeenCalledWith('New text');
```

### Testing Async Operations

```typescript
it('should load data', async () => {
  const {findByText} = render(<DataComponent />);
  const data = await findByText('Loaded Data');
  expect(data).toBeTruthy();
});
```

### Testing Conditional Rendering

```typescript
it('should show error when error prop is provided', () => {
  const {getByText} = render(<Input error="Invalid" />);
  expect(getByText('Invalid')).toBeTruthy();
});

it('should not show error when no error prop', () => {
  const {queryByText} = render(<Input />);
  expect(queryByText('Invalid')).toBeNull();
});
```

## 🐛 Troubleshooting

### Tests won't run?

```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Module not found?

Check your import paths - they should be relative:
```typescript
// ✅ Good
import {Button} from '../../components/Button';

// ❌ Bad
import {Button} from '@/components/Button';
```

## 📚 Additional Resources

- [Full Testing Documentation](../TESTING.md)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)

## 💡 Tips

1. **Write tests as you code** - Don't wait until the end
2. **Test behavior, not implementation** - Focus on what users see/do
3. **Use descriptive test names** - `it('should show error when email is invalid')`
4. **Keep tests simple** - One concept per test
5. **Run tests in watch mode** - Get instant feedback

---

**Need Help?** Check the [full TESTING.md guide](../TESTING.md) or ask the team!

