## Code Guidelines

**TypeScript/JavaScript (Frontend):** https://google.github.io/styleguide/tsguide.html — Google's TypeScript Style Guide covers type safety, naming conventions, module structure, and React best practices.

**Python (Backend):** https://google.github.io/styleguide/pyguide.html — Google's Python Style Guide (based on PEP 8) covers formatting, naming, documentation, and Python-specific patterns.

**Rationale:** Chose Google style guides because they are industry standard, comprehensive (cover formatting, naming, structure, best practices), well-supported by linters (ESLint, Prettier, Pylint, Black), and team members have prior experience.

**Enforcement:** ESLint + Prettier for TypeScript/JavaScript (config: `eslint-config-google`), Pylint/Flake8 + Black for Python. All linters run in GitHub Actions CI pipeline on every PR; PRs must pass linting before merge. Pre-commit hooks via husky (frontend) and pre-commit framework (backend). PRs require 1 reviewer approval; reviewers check style adherence. Style guides linked in `CONTRIBUTING.md`; examples in developer guide; required review during onboarding.