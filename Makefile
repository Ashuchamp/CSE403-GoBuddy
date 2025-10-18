.PHONY: help install-tools lint lint-go lint-py lint-js

help:
	@echo "Available targets: install-tools, lint, lint-go, lint-py, lint-js"

install-tools:
	@echo "Installing developer tools..."
	@echo "Install golangci-lint (mac/linux)"
	@curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.59.0 || true
	@python -m pip install --user --upgrade pip || true
	@python -m pip install --user pre-commit ruff || true
	@npm ci || true

lint: lint-go lint-py lint-js

lint-go:
	@golangci-lint run --config .golangci.yml ./... || true

lint-py:
	@ruff check . --config pyproject.toml || true

lint-js:
	@npm run lint || true
