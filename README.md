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
6. **Swagger API + UI Integration** (`swagger-api-ui.spec.js`) - Complete workflow combining API and UI testing:
   - Create user via API
   - Authenticate user via API
   - Add books to collection via API
   - Login via UI and validate collection
   - Delete book via API
   - Verify deletion via UI

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
runThis="swagger" npm test  # Run API+UI integration tests
```

### Running API Tests

The Swagger API + UI integration test combines API testing with UI automation:

```bash
# Run only the Swagger API + UI integration test
npm test -- tests/swagger-api-ui.spec.js

# Run with headed browser (to see UI interactions)
npm run test:headed -- tests/swagger-api-ui.spec.js

# Run in debug mode
npm run test:debug -- tests/swagger-api-ui.spec.js

# Run with specific browser
npm run test:chrome -- tests/swagger-api-ui.spec.js
npm run test:firefox -- tests/swagger-api-ui.spec.js
```

**API Test Workflow:**
1. Creates a new user via `/Account/v1/User` endpoint
2. Authenticates the user via `/Account/v1/GenerateToken` endpoint
3. Fetches available books and adds at least 2 books via `/BookStore/v1/Books` endpoint
4. Logs in via UI and validates books are displayed in Profile page
5. Deletes one book via `/BookStore/v1/Book` DELETE endpoint
6. Refreshes Profile page and verifies the book was removed from UI

**API Endpoints Used:**
- `POST /Account/v1/User` - Create user
- `POST /Account/v1/GenerateToken` - Generate authentication token
- `GET /BookStore/v1/Books` - Get list of available books
- `POST /BookStore/v1/Books` - Add books to user collection
- `GET /Account/v1/User/{userId}` - Get user information
- `DELETE /BookStore/v1/Book` - Delete book from collection

**Base URL:** `https://demoqa.com`

## Project Structure

```
AutoTestingJS/
├── .github/workflows/      # CI/CD configuration
├── pages/                  # Page Object Model classes
│   ├── LoginPage.js        # Login page object
│   ├── ProfilePage.js      # Profile page object
│   └── ...                 # Other page objects
├── tests/                  # Test files
│   └── swagger-api-ui.spec.js  # API + UI integration test
├── utils/                  # Utilities
│   ├── apiClient.js        # API client for Swagger Demo API
│   ├── testData.js         # Test data generators
│   └── constants.js        # Constants and configuration
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
