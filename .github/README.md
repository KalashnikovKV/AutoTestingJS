# GitHub Actions for AutoTestingJS

This project uses GitHub Actions for CI/CD process automation.

## Available Workflows

### 1. `ci.yml` - Full CI/CD Pipeline
Performs the following stages:
- **Lint**: Code checking with ESLint
- **Test**: Running tests
- **Coverage**: Code coverage analysis
- **Coverage Check**: Coverage threshold verification

## Triggers

Workflows are triggered on:
- Push to any branch
- Pull Request to any branch
- Manual dispatch

## Artifacts

After execution, the following artifacts are created:
- `test-results`: HTML test report
- `coverage-reports`: HTML code coverage reports

## Setup

1. Make sure your repository is on GitHub
2. Files are already configured and ready to use
3. On first push to any branch, workflows will run automatically

## Local Testing

For local testing, use:

```bash
# Linting
npm run lint

# Tests
npm run test

# Coverage
npm run coverage

# Coverage threshold check
npm run coverage:check
```
