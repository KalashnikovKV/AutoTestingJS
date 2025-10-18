import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const huskyDir = path.join(process.cwd(), '.husky');
  if (!fs.existsSync(huskyDir)) {
    fs.mkdirSync(huskyDir, { recursive: true });
  }

  const preCommitPath = path.join(huskyDir, 'pre-commit');
  if (fs.existsSync(preCommitPath)) {
    fs.chmodSync(preCommitPath, '755');
  }

  execSync('npx husky install', { stdio: 'inherit' });
} catch (error) {
  console.error('error:', error.message);
  process.exit(1);
}
