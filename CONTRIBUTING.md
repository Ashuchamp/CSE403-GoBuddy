
## Contributing and Linting

This repository aims to be professional and contributor-friendly. Every PR is required to pass automated checks before it can be merged. The checks include linters and formatters for Go, Python, and JavaScript/TypeScript, plus formatting checks.

What runs on PRs
- GitHub Actions workflow (`.github/workflows/lint.yml`) runs:
   - golangci-lint for Go
   - ruff for Python
   - eslint for JS/TS

Local setup and quickstart

1. Install the language runtimes you need (Go, Python, Node). Recommended versions used in CI: Go 1.21, Python 3.11, Node 18.

2. Install developer tools (recommended):

    - golangci-lint:

       curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.59.0

    - ruff:

       python -m pip install --upgrade pip
       pip install ruff

    - node/npm (then inside repo):

       npm ci

3. Install pre-commit hooks (recommended):

    python -m pip install pre-commit
    pre-commit install

Running checks locally

- Run all linters locally with pre-commit hooks enabled by committing; or run each directly:

   - Go: golangci-lint run --config .golangci.yml ./...
   - Python: ruff check . --config pyproject.toml
   - JS/TS: npm run lint

Branching and PR rules
- Use feature branches and open a PR against `main` (or the target release branch).
- Ensure your branch is up-to-date with the target branch and that all CI checks pass.
- Pull requests should reference an issue when appropriate and follow the `PULL_REQUEST_TEMPLATE.md`.

Code ownership and reviews
- `CODEOWNERS` defines who should review changes. Owners will be requested as reviewers automatically.

Formatting and tooling
- Use `gofmt`/`gofumpt` formatting for Go, `ruff` for Python formatting/fixes, and `prettier`/`eslint --fix` for JS/TS where applicable.

If a rule is too noisy
- Open a PR that updates the relevant config with a clear rationale and include examples showing why the change is safe.

Thank you for contributing!
