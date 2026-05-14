// Slate Bookmarks — MV3 service worker.
//
// Architecture: the extension is intentionally thin. On click (or shortcut),
// it grabs the active tab's URL + title and opens
//   <SLATE_ORIGIN>/bookmarks/new?url=…&title=…
// in a new tab. Slate's `/bookmarks/new` route handles creation + redirect.
//
// The Slate origin is configurable via the extension's options page (right-
// click the toolbar icon → Options) and persists across browsers via
// chrome.storage.sync. Default points at slate.pintobean.xyz, my hosted
// instance; anyone running their own Slate just changes the setting.
//
// No PAT, no sync code, no auth — Slate already has all that. The PWA route
// is also wired up as a Web Share Target, so anything that changes here
// stays in sync with the OS share-sheet path (see slate#34).

export const DEFAULT_SLATE_ORIGIN = 'https://slate.pintobean.xyz';

async function getSlateOrigin() {
	const { slateOrigin } = await chrome.storage.sync.get({ slateOrigin: DEFAULT_SLATE_ORIGIN });
	// Defensive: a typo in the options page (e.g. trailing slash, missing
	// scheme) shouldn't blow up the action handler. Normalize, fall back to
	// the default on anything unparseable.
	try {
		const u = new URL(slateOrigin);
		// Strip trailing slash from pathname so we don't end up with double slashes.
		return `${u.protocol}//${u.host}${u.pathname.replace(/\/$/, '')}`;
	} catch {
		return DEFAULT_SLATE_ORIGIN;
	}
}

chrome.action.onClicked.addListener(async (tab) => {
	if (!tab.url || !/^https?:/.test(tab.url)) {
		// chrome://, about:, file:// — nothing useful to bookmark.
		return;
	}
	const origin = await getSlateOrigin();
	const params = new URLSearchParams({
		url: tab.url,
		title: tab.title ?? ''
	});
	await chrome.tabs.create({ url: `${origin}/bookmarks/new?${params.toString()}` });
});
