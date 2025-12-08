# Coding Guidelines

This guide shows you how to write consistent, high-quality code for GoBuddy.

---

## Quick Start

Before committing code, run:

```bash
npm run lint        # Check code style
npm run format      # Auto-format code
npm run type-check  # Verify TypeScript types
```

Or run all checks at once:

```bash
./pre-pr-check.sh   # From project root
```

---

## Style Standards

We follow these industry-standard guidelines:

| Area | Standard | Configuration |
|------|----------|---------------|
| **JavaScript/TypeScript** | [Google Style Guide](https://google.github.io/styleguide/jsguide.html) | `eslint-config-google` |
| **TypeScript Types** | [TypeScript ESLint](https://typescript-eslint.io/) | `@typescript-eslint/recommended` |
| **React/React Native** | [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react) | `plugin:react/recommended` |
| **Code Formatting** | [Prettier](https://prettier.io/) | Custom config (100 chars, single quotes, trailing commas) |

### Why These Standards?

- **Google Style Guide**: Industry-proven, comprehensive, easy to learn
- **TypeScript ESLint**: Catches type errors and enforces best practices
- **React ESLint**: Prevents common React mistakes (hooks, dependencies)
- **Prettier**: Eliminates formatting debates, ensures consistency

---

## Formatting Rules

Prettier automatically formats your code with these settings:

```javascript
{
  printWidth: 100,      // Max line length
  singleQuote: true,    // Use 'text' not "text"
  trailingComma: 'all', // Add trailing commas
  semi: true,           // Always use semicolons
  tabWidth: 2,          // 2 spaces for indentation
  endOfLine: 'lf'       // Unix line endings
}
```

**Your IDE should auto-format on save.** If not, run `npm run format`.

---

## Common Commands

```bash
# Frontend (go-buddy/)
npm run lint           # Check for style issues
npm run lint:fix       # Auto-fix style issues
npm run format         # Format all code
npm run format:check   # Check if code is formatted
npm run type-check     # TypeScript type checking

# Backend (backend/)
npm run lint           # Check backend code style
npm run lint:fix       # Auto-fix backend issues
```

---

## Enforcement

### ✅ Automatic (Your IDE)
- ESLint highlights issues as you type
- Prettier formats code when you save

### ✅ Pre-Commit
- Run `./pre-pr-check.sh` before committing
- Checks linting, formatting, types, and tests

### ✅ CI/CD (GitHub Actions)
- Runs on every pull request
- Blocks merge if any check fails
- Tests on Node.js 20.x and 22.x

---

## IDE Setup

### VS Code / Cursor

1. **Install extensions:**
   - ESLint
   - Prettier

2. **Enable format on save** (Settings → Editor: Format On Save)

3. **Set Prettier as default formatter** (Settings → Default Formatter)

### Other IDEs

Check documentation for ESLint and Prettier integration.

---

## Troubleshooting

### "ESLint errors won't go away"

```bash
cd go-buddy
npm run lint:fix
```

### "Prettier formatting conflicts with ESLint"

Prettier and ESLint are configured to work together. If you see conflicts, run:

```bash
npm run format
npm run lint:fix
```

### "CI checks fail but local checks pass"

Make sure you're running the same Node.js version (18.x or 20.x):

```bash
node -v
```

---

## Reference Links

- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [TypeScript ESLint Rules](https://typescript-eslint.io/)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [Prettier Documentation](https://prettier.io/docs/en/)
