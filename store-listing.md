# Chrome Web Store listing — copy & answers

Paste-ready content for the developer console submission (btjimerson/slate#36).
Keep this in sync with `manifest.json`.

## Product details

**Name:** Slate Bookmarks

**Summary (short description, ≤132 chars):**
Save the current tab to Slate — as a bookmark, or clip the article as a markdown note.

**Category:** Productivity

**Detailed description:**

> Slate Bookmarks is the companion extension for Slate, your private notes,
> bookmarks, and reminders app that syncs through your own GitHub repository.
>
> Two ways to capture the page you're on:
>
> • **Bookmark it** — click the toolbar button (or ⌘⇧D / Ctrl+Shift+D) to save
>   the tab's URL and title to Slate, then add tags and pick a folder.
>
> • **Clip it as a note** — press ⌘⇧S / Ctrl+Shift+S, or right-click → "Clip
>   page to Slate". The extension extracts the article with Mozilla Readability,
>   converts it to clean Markdown, and opens it as a new note in Slate. Select
>   text first to clip just that.
>
> No account or token lives in the extension — authentication stays in the Slate
> web app. Point it at your own Slate deployment from the options page.
>
> Open source: https://github.com/btjimerson/slate-bookmark-ext

**Homepage URL:** https://slate.pintobean.xyz

**Support URL:** https://github.com/btjimerson/slate-bookmark-ext/issues

## Privacy

**Privacy policy URL:** https://slate.pintobean.xyz/privacy

**Does this item collect user data?** No.

**Single purpose:**
Save the current web page to the user's Slate app — as a bookmark, or as a
Markdown note clipped from the page's article content.

**Permission justifications:**

- **activeTab** — Reads the active tab's URL and title (and, for a clip, its
  article text) only at the moment the user invokes the action. No background or
  cross-tab access.
- **scripting** — Injects the article-extraction script (Readability + Turndown)
  into the active tab when the user triggers a clip, to produce the Markdown.
- **storage** — Stores one setting: the user's Slate origin URL
  (`chrome.storage.sync`), so it follows their Google account.
- **contextMenus** — Adds the right-click "Clip page to Slate" menu item.
- **Host permissions** — None. The extension has no broad host access; `activeTab`
  grants page access only on user invocation.

**Data handling:** The extension transmits nothing to any third party or
analytics service. Captured URL/title/article content is handed directly to the
user's own Slate deployment via a navigation to its `/bookmarks/new` or `/clip`
route. Nothing is stored or sent except that hand-off.

## Listing assets checklist (manual)

- [x] 128×128 store icon — `icons/icon-128.png`
- [ ] At least one 1280×800 screenshot — capture the extension in action, then
      `npm run screenshot -- <capture>.png` to size it exactly (→ `dist/screenshot-1280x800.png`)
- [ ] Optional: 440×280 small promo tile, 1400×560 marquee tile
- [ ] Publish the privacy page at https://slate.pintobean.xyz/privacy (Slate repo)
