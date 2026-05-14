# Slate Bookmarks (Chrome extension)

One-click "save this tab" for [Slate](https://github.com/btjimerson/slate).
Pairs with the Slate-side `/bookmarks/new` route — also used by the PWA Web
Share Target on mobile (see slate#34).

## How it works

Click the toolbar button (or hit ⌘⇧D / Ctrl+Shift+D), and the extension opens
a new tab at:

```
https://slate-c4x.pages.dev/bookmarks/new?url=<tab url>&title=<tab title>
```

Slate creates the bookmark in local storage, redirects to the edit view, and
syncs to GitHub on the next push. No PAT lives in the extension; auth stays in
Slate.

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
