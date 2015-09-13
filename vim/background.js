
chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('vim.html', {
		bounds: {
			width: 1080,
			height: 720,
			left: 100,
			top: 100
		},
		minWidth: 1080,
		minHeight: 720
	});
});

chrome.runtime.onSuspend.addListener(function() {
	// Do some simple clean-up tasks.
});

chrome.runtime.onInstalled.addListener(function() {
	// chrome.storage.local.set(object items, function callback);
});
