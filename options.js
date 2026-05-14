// Options page logic. Keep this dependency-free so the extension stays
// load-unpacked-friendly without a build step.

const DEFAULT_SLATE_ORIGIN = 'https://slate.pintobean.xyz';

const input = document.getElementById('origin');
const button = document.getElementById('save');
const status = document.getElementById('status');

// Load current value (or default) into the form on open.
chrome.storage.sync.get({ slateOrigin: DEFAULT_SLATE_ORIGIN }, ({ slateOrigin }) => {
	input.value = slateOrigin;
});

button.addEventListener('click', save);
input.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		e.preventDefault();
		save();
	}
});

function save() {
	const raw = input.value.trim();
	if (!raw) {
		showStatus('URL is required.', 'err');
		return;
	}
	let normalized;
	try {
		const u = new URL(raw);
		if (u.protocol !== 'http:' && u.protocol !== 'https:') {
			showStatus('Must be an http(s) URL.', 'err');
			return;
		}
		// Store the bare origin (no trailing path/slash) — background.js appends
		// `/bookmarks/new`, so anything else here would be ignored or worse.
		normalized = `${u.protocol}//${u.host}`;
	} catch {
		showStatus('Not a valid URL.', 'err');
		return;
	}

	chrome.storage.sync.set({ slateOrigin: normalized }, () => {
		input.value = normalized;
		showStatus('Saved.', 'ok');
	});
}

function showStatus(text, kind) {
	status.textContent = text;
	status.className = `status ${kind}`;
	if (kind === 'ok') {
		setTimeout(() => {
			status.textContent = '';
			status.className = 'status';
		}, 1500);
	}
}
