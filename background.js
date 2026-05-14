// Slate Bookmarks — MV3 service worker.
//
// Architecture: the extension is intentionally thin. On click (or shortcut),
// it grabs the active tab's URL + title and opens
//   https://slate.pintobean.xyz/bookmarks/new?url=…&title=…
// in a new tab. Slate's `/bookmarks/new` route handles creation + redirect.
//
// No PAT, no sync code, no auth — Slate already has all that. The PWA route
// is also wired up as a Web Share Target, so anything that changes here
// stays in sync with the OS share-sheet path (see slate#34).

const SLATE_URL = 'https://slate.pintobean.xyz/bookmarks/new';

chrome.action.onClicked.addListener(async (tab) => {
	if (!tab.url || !/^https?:/.test(tab.url)) {
		// chrome://, about:, file:// — nothing useful to bookmark.
		return;
	}
	const params = new URLSearchParams({
		url: tab.url,
		title: tab.title ?? ''
	});
	await chrome.tabs.create({ url: `${SLATE_URL}?${params.toString()}` });
});
