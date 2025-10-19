// bootstrap.js
import { register } from 'tsconfig-paths';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables before anything else
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✅ Loaded .env configuration');
}

// Register tsconfig paths for dist runtime
const tsconfigPath = path.resolve('./tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
  const rawPaths = tsconfig.compilerOptions?.paths || {};
  // At runtime our compiled code lives in ./dist. Rewrite targets so 'src/*' -> 'dist/*'
  const adjustedPaths = {};
  Object.keys(rawPaths).forEach((key) => {
    adjustedPaths[key] = rawPaths[key].map((p) => {
      if (p.startsWith('src/')) return p.replace(/^src\//, 'dist/');
      if (p.startsWith('./src/')) return p.replace(/^\.\/src\//, 'dist/');
      return p;
    });
  });
  const baseUrl = path.resolve('./');
  register({ baseUrl, paths: adjustedPaths });
}

// Run main app
await import('./dist/main.js');
