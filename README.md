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

## Install

### From the Chrome Web Store

One-click install with auto-updates. _Listing pending review — see
[btjimerson/slate#36](https://github.com/btjimerson/slate/issues/36)._

<!-- TODO: once published, replace the line above with:
     [**Install Slate Bookmarks**](https://chromewebstore.google.com/detail/<extension-id>) — one-click install with auto-updates. -->

Edge users can install the same listing directly from Chrome's store.

### Developer mode (no review needed)

1. Clone this repo.
2. In Chrome, open `chrome://extensions`.
3. Toggle **Developer mode** on (top-right corner).
4. Click **Load unpacked** and select this directory.
5. Pin the **Slate Bookmarks** icon to the toolbar from the extensions menu.

The extension stays installed across browser restarts. It does **not** read
page contents — `activeTab` only grants access to the URL and title.

## Packaging for the Chrome Web Store

```bash
npm run package
```

Builds `dist/slate-bookmark-ext-<version>.zip` containing only the runtime
files (no README, dev scripts, lockfile, or icon source) with `manifest.json`
at the archive root — ready to upload in the
[developer console](https://chrome.google.com/webstore/devconsole). Bump
`version` in `manifest.json` before packaging a new release.

## Icons

PNGs at the three Chrome-required sizes (16, 48, 128) are checked in under
`icons/`. The design lives as an SVG in `scripts/make-icons.mjs` and mirrors
the Slate PWA's tile icon — three offset bars on a Frost-blue rounded
square with an Aurora-green accent on the middle bar.

To regenerate after a design change:

```bash
npm install
node scripts/make-icons.mjs
```

## License

MIT.
