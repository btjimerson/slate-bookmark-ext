// Slate Bookmarks — MV3 service worker.
//
// Two entry points:
//   * Toolbar click / ⌘⇧D — saves the active tab as a bookmark in Slate.
//   * ⌘⇧S / right-click → "Clip page to Slate" — extracts the article body
//     (Readability), converts to markdown (Turndown), and opens Slate's
//     /clip route with the result.
//
// The Slate origin is configurable via the extension's options page (right-
// click the toolbar icon → Options) and persists across browsers via
// chrome.storage.sync.

export const DEFAULT_SLATE_ORIGIN = 'https://slate.pintobean.xyz';
const CONTEXT_MENU_ID = 'slate-clip-page';

async function getSlateOrigin() {
	const { slateOrigin } = await chrome.storage.sync.get({ slateOrigin: DEFAULT_SLATE_ORIGIN });
	try {
		const u = new URL(slateOrigin);
		return `${u.protocol}//${u.host}${u.pathname.replace(/\/$/, '')}`;
	} catch {
		return DEFAULT_SLATE_ORIGIN;
	}
}

function isClippable(url) {
	return !!url && /^https?:/.test(url);
}

// --- Bookmark path -----------------------------------------------------------

chrome.action.onClicked.addListener(async (tab) => {
	if (!isClippable(tab.url)) return;
	const origin = await getSlateOrigin();
	const params = new URLSearchParams({
		url: tab.url,
		title: tab.title ?? ''
	});
	await chrome.tabs.create({ url: `${origin}/bookmarks/new?${params.toString()}` });
});

// --- Clip path ---------------------------------------------------------------

async function clipActiveTab(tab) {
	if (!tab || !tab.id || !isClippable(tab.url)) return;

	// Inject Readability + Turndown first (they leave globals on the page's
	// isolated world), then run clip.js which uses them and returns the payload.
	let results;
	try {
		results = await chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: ['vendor/Readability.js', 'vendor/turndown.js', 'clip.js']
		});
	} catch (e) {
		console.error('Slate clip: executeScript failed', e);
		return;
	}
	// executeScript returns one result per frame. We only want the top frame.
	const payload = results?.[0]?.result;
	if (!payload || !payload.body) {
		console.warn('Slate clip: no content extracted');
		return;
	}

	const origin = await getSlateOrigin();
	const hash = encodeHash(payload);
	await chrome.tabs.create({ url: `${origin}/clip#${hash}` });
}

// JSON → UTF-8 → base64 → URI-safe base64. Slate's /clip route decodes this
// back; see src/routes/clip/+page.svelte.
function encodeHash(obj) {
	const json = JSON.stringify(obj);
	const bytes = new TextEncoder().encode(json);
	let bin = '';
	for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
	const b64 = btoa(bin);
	return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

chrome.commands.onCommand.addListener(async (command) => {
	if (command !== 'clip-page') return;
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	await clipActiveTab(tab);
});

// --- Context menu ------------------------------------------------------------

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: CONTEXT_MENU_ID,
		title: 'Clip page to Slate',
		contexts: ['page', 'selection'],
		documentUrlPatterns: ['http://*/*', 'https://*/*']
	});
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId !== CONTEXT_MENU_ID) return;
	await clipActiveTab(tab);
});
