// Build a Chrome Web Store upload zip containing only the runtime files —
// no README, package.json, lockfile, dev scripts, icon source SVG, or
// node_modules. Output lands in dist/ (gitignored). Run: `npm run package`.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';

// Exactly what the extension needs at runtime. manifest.json references the
// PNG icons (not icon.svg), background.js (service worker), options.html/js
// (options_ui), clip.js (injected for the article-clip flow), and the two
// vendored libraries it uses. Keep this list in sync if the manifest grows.
const FILES = [
	'manifest.json',
	'background.js',
	'clip.js',
	'options.html',
	'options.js',
	'icons/icon-16.png',
	'icons/icon-48.png',
	'icons/icon-128.png',
	'vendor/Readability.js',
	'vendor/turndown.js'
];

const { version } = JSON.parse(readFileSync('manifest.json', 'utf8'));
const out = `dist/slate-bookmark-ext-${version}.zip`;

mkdirSync('dist', { recursive: true });
rmSync(out, { force: true });

// `zip` ships on macOS/Linux; on Windows use WSL or 7-Zip. Storing relative
// paths keeps the archive rooted at the extension directory, as the store
// expects (manifest.json at the zip root).
execFileSync('zip', ['-q', out, ...FILES], { stdio: 'inherit' });

console.log(`Packaged ${out} (${FILES.length} files, v${version})`);
