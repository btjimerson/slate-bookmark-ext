import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';

// Mirror of slate/scripts/make-icons.mjs at the same revision. Keep the two
// in sync when redesigning the Slate icon so the extension's toolbar button
// matches the PWA tile / favicon.

const FROST = '#5e81ac';
const SNOW = '#eceff4';
const AURORA_GREEN = '#a3be8c';

const BARS = [
	{ x: 120, y: 174, w: 272, h: 36, rx: 18, fill: SNOW },
	{ x: 170, y: 238, w: 172, h: 36, rx: 18, fill: AURORA_GREEN },
	{ x: 120, y: 302, w: 232, h: 36, rx: 18, fill: SNOW }
];

function barsSvg() {
	return BARS.map(
		(b) =>
			`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${b.rx}" fill="${b.fill}"/>`
	).join('\n\t');
}

function iconSvg(size) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
	<rect width="512" height="512" rx="115" fill="${FROST}"/>
	${barsSvg()}
</svg>`;
}

async function render(svgText, out) {
	await sharp(Buffer.from(svgText)).png().toFile(out);
	console.log('wrote', out);
}

await mkdir('icons', { recursive: true });

// Chrome extension icon sizes (manifest.icons). 16 is the address-bar /
// extension-list icon, 48 is the management page, 128 is the install dialog
// and the Web Store listing thumbnail.
await render(iconSvg(16), 'icons/icon-16.png');
await render(iconSvg(48), 'icons/icon-48.png');
await render(iconSvg(128), 'icons/icon-128.png');

// Also save the SVG source for reference.
await writeFile('icons/icon.svg', iconSvg(512));
console.log('done');
