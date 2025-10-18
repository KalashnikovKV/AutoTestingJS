# AutoTestingJS

A comprehensive JavaScript testing framework with Mocha, Chai, code coverage analysis, and automated CI/CD pipeline.

## Features

- **Unit Testing**: Complete test coverage using Mocha and Chai
- **Code Coverage**: 100% code coverage analysis with c8
- **Linting**: ESLint configuration with strict coding standards
- **CI/CD**: GitLab CI/CD pipeline for automated testing
- **Pre-commit Hooks**: Husky integration for code quality checks
- **HTML Reports**: Automated test report generation
- **Babel Support**: Modern JavaScript transpilation

## Project Structure

```
├── .github/workflows/     # GitHub Actions workflows
├── .vscode/              # VS Code settings
├── src/utils/            # Source code utilities
├── test/                 # Test files
├── scripts/              # Build and utility scripts
├── coverage/             # Code coverage reports
├── eslint.config.js      # ESLint configuration
├── babel.config.js       # Babel configuration
├── .gitlab-ci.yml       # GitLab CI/CD pipeline
└── package.json         # Project dependencies and scripts
```

## Installation

```bash
# Install dependencies
npm install

# Setup pre-commit hooks
npm run setup
```

## Available Scripts

### Testing
```bash
# Run all tests
npm test

# Run tests with HTML report generation
npm run test:html

# Run tests in watch mode
npm run test:watch
```

### Code Coverage
```bash
# Generate coverage report
npm run coverage

# Check coverage thresholds (80%+)
npm run coverage:check
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

### Build
```bash
# Transpile source code with Babel
npm run build
```

## Test Coverage

The project maintains **100% code coverage** across all utility functions:

- **Array Utils**: `findMax`, `findMin`, `removeDuplicates`
- **Math Utils**: `add`, `subtract`, `multiply`, `divide`
- **String Utils**: `capitalize`, `reverseString`, `isPalindrome`
- **Student Knowledge Checker**: `checkStudentKnowledge`
- **Users List Utils**: `filterUsersByAge`, `sortUsersByName`, `findUserById`, `isEmailTaken`

## Configuration

### ESLint Rules
- Single quotes for strings
- 2-space indentation
- Maximum line length: 120 characters
- Trailing commas in multiline structures
- Strict equality operators (===, !==)
- No unused variables
- And many more quality rules...

### Babel Configuration
- ES2021 target
- Modern JavaScript features support
- Module transpilation

## CI/CD Pipeline

### GitLab CI/CD
The project includes automated CI/CD pipeline that:
- Installs dependencies
- Runs ESLint checks
- Executes test suite
- Validates code coverage

### Pre-commit Hooks
Husky integration ensures code quality before commits:
- ESLint validation
- Test execution
- Coverage verification

## Code Quality Metrics

- **ESLint**: Zero errors, zero warnings
- **Test Coverage**: 100% (lines, functions, branches, statements)
- **Code Style**: Consistent formatting and naming conventions
- **Documentation**: Comprehensive JSDoc comments

## Usage Examples

### Array Operations
```javascript
import { findMax, findMin, removeDuplicates } from './src/utils/arrayUtils.js';

const numbers = [1, 5, 3, 9, 2];
console.log(findMax(numbers)); // 9
console.log(findMin(numbers)); // 1
console.log(removeDuplicates([1, 2, 2, 3])); // [1, 2, 3]
```

### Mathematical Operations
```javascript
import { add, subtract, multiply, divide } from './src/utils/mathUtils.js';

console.log(add(5, 3)); // 8
console.log(divide(10, 2)); // 5
```

### String Manipulation
```javascript
import { capitalize, reverseString, isPalindrome } from './src/utils/stringUtils.js';

console.log(capitalize('hello')); // 'Hello'
console.log(reverseString('world')); // 'dlrow'
console.log(isPalindrome('racecar')); // true
```

##  Development Workflow

1. **Write Code**: Implement utility functions
2. **Write Tests**: Create comprehensive test cases
3. **Run Linting**: `npm run lint:fix`
4. **Run Tests**: `npm test`
5. **Check Coverage**: `npm run coverage:check`
6. **Commit**: Pre-commit hooks validate code quality

##  Performance

- **Test Execution**: ~50ms for full test suite
- **Coverage Analysis**: Real-time coverage reporting
- **Linting**: Fast ESLint execution
- **Build Process**: Optimized Babel transpilation

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure 100% test coverage
5. Run linting and fix issues
6. Submit a pull request

##  License

MIT License - see LICENSE file for details.

##  Achievements

-  **100% Test Coverage**
-  **Zero ESLint Errors**
-  **Complete CI/CD Pipeline**
-  **Automated Quality Checks**
-  **Modern JavaScript Standards**
-  **Comprehensive Documentation**