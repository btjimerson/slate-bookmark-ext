// Content script injected on-demand by background.js to clip the current page.
// Runs in the page's isolated world. Sibling files in the same executeScript
// call have already loaded Readability and TurndownService as globals.
//
// The result of the IIFE is what chrome.scripting.executeScript returns to
// the service worker — keep that contract.

// eslint-disable-next-line no-unused-expressions
(() => {
	// Selection takes priority. If the user has highlighted text, clip ONLY
	// that — clear signal of intent. Otherwise fall back to article extraction.
	const sel = window.getSelection?.();
	const hasSelection = sel && sel.toString().trim().length > 0;

	let html;
	let title = document.title;
	let byline = null;
	let siteName = null;
	let excerpt = null;
	let mode;

	if (hasSelection) {
		const container = document.createElement('div');
		for (let i = 0; i < sel.rangeCount; i++) {
			container.appendChild(sel.getRangeAt(i).cloneContents());
		}
		html = container.innerHTML;
		mode = 'selection';
	} else {
		// Clone so Readability's destructive parse doesn't touch the live DOM.
		// eslint-disable-next-line no-undef
		const article = new Readability(document.cloneNode(true)).parse();
		if (article && article.content) {
			html = article.content;
			title = article.title || title;
			byline = article.byline || null;
			siteName = article.siteName || null;
			excerpt = article.excerpt || null;
			mode = 'article';
		} else {
			// Readability gave up — happens on homepages, dashboards, anywhere
			// without a clear article block. Last-resort: take <article>, <main>,
			// or the body.
			const root =
				document.querySelector('article') ||
				document.querySelector('main') ||
				document.body;
			html = root ? root.innerHTML : '';
			mode = 'fallback';
		}
	}

	// eslint-disable-next-line no-undef
	const turndown = new TurndownService({
		headingStyle: 'atx',
		bulletListMarker: '-',
		codeBlockStyle: 'fenced',
		emDelimiter: '_'
	});
	// Drop noisy elements that survive Readability when it's not invoked.
	turndown.remove(['script', 'style', 'noscript', 'iframe', 'svg']);

	const body = html ? turndown.turndown(html) : '';

	return {
		title,
		body,
		url: window.location.href,
		byline,
		siteName,
		excerpt,
		mode
	};
})();
