/**
 * Simple script to run a specific test
 * Usage: node run-test.js <test-file-path>
 * Example: node run-test.js __tests__/unit/validator.test.js
 */

const { execSync } = require('child_process');
const path = require('path');

// Get test file path from command line arguments
const testFile = process.argv[2];

if (!testFile) {
  console.error('Error: Please provide a test file path');
  console.log('Usage: node run-test.js <test-file-path>');
  console.log('Example: node run-test.js __tests__/unit/validator.test.js');
  process.exit(1);
}

// Resolve the test file path
const testFilePath = path.resolve(testFile);

try {
  // Run the test
  console.log(`Running test: ${testFilePath}`);
  execSync(`npx jest ${testFilePath} --verbose`, { stdio: 'inherit' });
} catch (error) {
  // Jest will already output the error
  process.exit(1);
} 