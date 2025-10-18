import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateHtmlReport() {
  try {
    const resultsPath = path.join(process.cwd(), 'test-results.json');

    if (!fs.existsSync(resultsPath)) {
      process.exit(1);
    }

    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

    const html = generateHtml(results);

    const outputPath = path.join(process.cwd(), 'test-report.html');
    fs.writeFileSync(outputPath, html, 'utf8');

    fs.unlinkSync(resultsPath);
  } catch (error) {
    console.error('Error creating HTML report:', error.message);
    process.exit(1);
  }
}

function generateHtml(results) {
  const stats = results.stats;
  const tests = results.tests;

  const passCount = stats.passes;
  const failCount = stats.failures;
  const pendingCount = stats.pending;
  const totalCount = stats.tests;

  const passRate =
    totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - AutoTestingJS</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 0;
            opacity: 0.9;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .stat-label {
            color: #666;
            font-size: 0.9em;
        }
        .pass { color: #28a745; }
        .fail { color: #dc3545; }
        .pending { color: #ffc107; }
        .total { color: #6c757d; }
        .results {
            padding: 30px;
        }
        .test-item {
            margin-bottom: 15px;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid;
        }
        .test-pass {
            background: #d4edda;
            border-color: #28a745;
        }
        .test-fail {
            background: #f8d7da;
            border-color: #dc3545;
        }
        .test-pending {
            background: #fff3cd;
            border-color: #ffc107;
        }
        .test-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .test-duration {
            color: #666;
            font-size: 0.9em;
        }
        .test-error {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
            font-family: monospace;
            font-size: 0.9em;
            color: #dc3545;
        }
        .summary {
            background: #e9ecef;
            padding: 20px;
            text-align: center;
            font-size: 1.1em;
        }
        .success { color: #28a745; }
        .failure { color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Test Report</h1>
            <p>AutoTestingJS - Automated Testing Results</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number pass">${passCount}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number fail">${failCount}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number pending">${pendingCount}</div>
                <div class="stat-label">Pending</div>
            </div>
            <div class="stat-card">
                <div class="stat-number total">${totalCount}</div>
                <div class="stat-label">Total Tests</div>
            </div>
        </div>
        
        <div class="summary">
            <strong>Coverage: ${passRate}%</strong> | 
            <strong>Execution Time: ${stats.duration}ms</strong>
        </div>
        
        <div class="results">
            <h2>Test Details</h2>
            ${generateTestResults(tests)}
        </div>
    </div>
</body>
</html>`;
}

function generateTestResults(tests) {
  if (!tests || tests.length === 0) {
    return '<p>No test data available</p>';
  }

  return tests
    .map((test) => {
      let statusClass = 'test-pass';
      let statusText = 'Passed';

      if (test.err && Object.keys(test.err).length > 0) {
        statusClass = 'test-fail';
        statusText = 'Failed';
      } else if (test.pending === true) {
        statusClass = 'test-pending';
        statusText = 'Pending';
      }

      const errorHtml =
        test.err && Object.keys(test.err).length > 0
          ? `<div class="test-error">${
            test.err.message || JSON.stringify(test.err)
          }</div>`
          : '';

      return `
      <div class="test-item ${statusClass}">
        <div class="test-title">${statusText} ${test.title}</div>
        <div class="test-duration">Duration: ${test.duration || 0}ms</div>
        ${errorHtml}
      </div>
    `;
    })
    .join('');
}

generateHtmlReport();
