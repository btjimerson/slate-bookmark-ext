// Turn any raw screen capture into a Chrome Web Store listing screenshot at the
// exact required 1280×800 (PNG, no alpha). Capture the extension in action —
// e.g. the toolbar button / "Clip page to Slate" context menu on a real article,
// or the resulting Slate /bookmarks/new page — at any size, then run:
//
//   node scripts/make-screenshot.mjs <input.png> [bg-hex]
//   npm run screenshot -- screenshot-raw.png "#eceff4"
//
// Output: dist/screenshot-1280x800.png — upload that. Repeat for up to 5 shots.
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const input = process.argv[2];
const bg = process.argv[3] ?? '#eceff4'; // Snow Storm — matches Slate's light surface

if (!input) {
	console.error('Usage: node scripts/make-screenshot.mjs <input.png> [bg-hex]');
	process.exit(1);
}

mkdirSync('dist', { recursive: true });
const out = 'dist/screenshot-1280x800.png';

// `contain` fits the whole capture inside 1280×800 and pads with `bg`, so the
// capture is never cropped or stretched; `flatten` drops the alpha channel the
// store rejects.
await sharp(input)
	.resize(1280, 800, { fit: 'contain', background: bg })
	.flatten({ background: bg })
	.png()
	.toFile(out);

const meta = await sharp(out).metadata();
console.log(`Wrote ${out} (${meta.width}×${meta.height})`);
