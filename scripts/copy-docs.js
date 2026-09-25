import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const assetsDir = path.join(rootDir, 'assets');

if (fs.existsSync(distDir)) {
  const distHtmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(distHtmlPath)) {
    let html = fs.readFileSync(distHtmlPath, 'utf8');
    // Strip redirect block from production bundle
    const redirectRegex = /<!-- GITHUB_PAGES_ROOT_REDIRECT_START -->[\s\S]*?<!-- GITHUB_PAGES_ROOT_REDIRECT_END -->/;
    html = html.replace(redirectRegex, '');
    fs.writeFileSync(distHtmlPath, html, 'utf8');
  }

  // Sync dist to docs/
  fs.cpSync(distDir, docsDir, { recursive: true });
  console.log('✅ Synced dist/ -> docs/');

  // Also sync dist/assets to root assets/
  const distAssets = path.join(distDir, 'assets');
  if (fs.existsSync(distAssets)) {
    fs.cpSync(distAssets, assetsDir, { recursive: true });
    console.log('✅ Synced dist/assets -> root assets/');
  }

  // Ensure .nojekyll exists in docs/, dist/, and root
  fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  fs.writeFileSync(path.join(rootDir, '.nojekyll'), '');
  console.log('✅ Ensured .nojekyll in root, dist/, and docs/');
} else {
  console.warn('⚠️ dist/ folder does not exist. Run vite build first.');
}
