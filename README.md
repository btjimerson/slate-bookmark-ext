# Slate Bookmarks (Chrome extension)

Save the current tab to [Slate](https://github.com/btjimerson/slate) — as a
bookmark, or clip the article as a note. No PAT lives in the extension; auth
stays in Slate.

## Two flows

### Bookmark — save the URL

Toolbar button or **⌘⇧D / Ctrl+Shift+D**. Opens:

```
<slate origin>/bookmarks/new?url=<tab url>&title=<tab title>
```

Slate's `/bookmarks/new` creates the row and drops you in the edit view to
add tags / pick a folder. (Same route the PWA Web Share Target uses on
mobile.)

### Clip — save the article as a note

**⌘⇧S / Ctrl+Shift+S** or right-click the page → **Clip page to Slate**.
The extension extracts the article body with
[Mozilla Readability](https://github.com/mozilla/readability), converts to
markdown with [Turndown](https://github.com/mixmark-io/turndown), and opens:

```
<slate origin>/clip#<base64-encoded JSON payload>
```

Slate's `/clip` route decodes the payload, creates a note titled like the
article with a small source/byline/date header, and drops you in the editor.
If you have text selected when you trigger the clip, only that selection is
captured. If Readability can't find an article (homepages, dashboards), it
falls back to `<article>` / `<main>` / `<body>`.

## Configuring the Slate origin

Defaults to `https://slate.pintobean.xyz`. To point at your own deployment:

1. Right-click the toolbar icon → **Options** (or chrome://extensions → Slate
   Bookmarks → Details → Extension options).
2. Enter your Slate URL (e.g. `https://slate.example.com`).
3. Save.

The setting lives in `chrome.storage.sync`, so it follows your Google account
across machines.

## Install (developer mode, no review needed)

1. Clone this repo.
2. In Chrome, open `chrome://extensions`.
3. Toggle **Developer mode** on (top-right corner).
4. Click **Load unpacked** and select this directory.
5. Pin the **Slate Bookmarks** icon to the toolbar from the extensions menu.

The extension stays installed across browser restarts. It does **not** read
page contents — `activeTab` only grants access to the URL and title.

## Icons

This repo ships without icon PNGs to keep the diff small. Drop the following
files in `icons/` before loading:

- `icons/icon-16.png` (16×16)
- `icons/icon-48.png` (48×48)
- `icons/icon-128.png` (128×128)

A quick way to generate them from `slate/static/icon-512.png`:

```bash
sips -Z 16  icon-512.png --out icon-16.png
sips -Z 48  icon-512.png --out icon-48.png
sips -Z 128 icon-512.png --out icon-128.png
```

(Or use `sharp`, `convert`, etc.)

## License

MIT.
