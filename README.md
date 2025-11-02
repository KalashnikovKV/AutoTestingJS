# AutoTestingJS

Automated testing project for demoqa.com using Playwright, Page Object Model pattern, and CI/CD with GitHub Actions.

## Features

- **Playwright** testing framework
- **Page Object Model** architecture
- **Cross-browser testing** (Chrome, Firefox)
- **CI/CD** with GitHub Actions
- **Parallel execution** support
- **Automatic screenshots** on failure
- **Test reporting** (HTML, JSON, JUnit)

## Test Scenarios

1. **Alerts** (`/alerts`) - Testing all alert types (Alert, Timer Alert, Confirm, Prompt)
2. **Automation Practice Form** (`/automation-practice-form`) - Form filling with validation
3. **Text Box** (`/text-box`) - Text input with random data validation
4. **Tool Tips** (`/tool-tips`) - Tooltip functionality verification
5. **Select Menu** (`/select-menu`) - Dropdown selections (Group 2 option 1, Other, Green, Black/Blue)

## Installation

```bash
git clone <repository-url>
cd AutoTestingJS
npm install
npm run install:browsers
```

## Running Tests

### Basic Commands

```bash
npm test                    # Run all tests
npm run test:headed         # Run in headed mode
npm run test:chrome         # Run in Chrome only
npm run test:firefox        # Run in Firefox only
npm run test:debug          # Debug mode
npm run test:ui             # UI mode
npm run test:report         # View HTML report
```

### With Parameters

```bash
# Viewport resolution
VIEWPORT_WIDTH=1920 VIEWPORT_HEIGHT=1080 npm test
VIEWPORT_WIDTH=1366 VIEWPORT_HEIGHT=768 npm test

# Parallel workers
workers=4 npm test

# Run specific test by keyword
runThis="alerts" npm test
```

## Project Structure

```
AutoTestingJS/
├── .github/workflows/      # CI/CD configuration
├── pages/                  # Page Object Model classes
├── tests/                  # Test files
├── utils/                  # Test data generators
└── playwright.config.js    # Playwright configuration
```

## Configuration

- **Browsers**: Chrome, Firefox
- **Viewports**: 1920x1080, 1366x768 (via `VIEWPORT_WIDTH`/`VIEWPORT_HEIGHT`)
- **Parallel execution**: Via `workers` flag
- **Test selection**: Via `runThis` flag
- **Screenshots**: Auto-saved on failure
- **Reports**: HTML, JSON, JUnit formats

## CI/CD

Tests run automatically:
- On push to main/develop branches
- On pull requests to main
- Daily at midnight UTC
- With `runThis` flag in commit message

Matrix configuration:
- Browsers: Chrome, Firefox
- Viewports: 1920x1080, 1366x768
- Workers: 2

## Reporting

Reports are saved as GitHub Actions artifacts:
- `playwright-report/` - HTML report
- `test-results.json` - JSON report
- `test-results.xml` - JUnit report
