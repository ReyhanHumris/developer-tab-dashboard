/**
 * Background Service Worker — MiniPlayer State Relay
 *
 * Flow:
 *   New-tab page  ──MP_STATE_UPDATE──▶  background  ──MP_STATE──▶  content scripts (all tabs)
 *   Content script ──MP_CMD──▶  background  ──MP_CMD──▶  new-tab extension page
 */

'use strict';

// In-memory player state (reset if service worker sleeps; acceptable for this use case)
let playerState = {
  isPlaying: false,
  track: { title: '', artist: '' },
  volume: 70,
  isMuted: false,
  progress: 0,
  currentTime: 0,
  duration: 0,
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    // ── From new-tab page: state changed ──────────────────────────────────
    case 'MP_STATE_UPDATE': {
      playerState = { ...playerState, ...msg.payload };
      broadcastToContentScripts({ type: 'MP_STATE', payload: playerState });
      sendResponse({ ok: true });
      break;
    }

    // ── From content script on page load: fetch current state ─────────────
    case 'MP_GET_STATE': {
      sendResponse(playerState);
      break;
    }

    // ── From content script: user pressed a control button ────────────────
    case 'MP_CMD': {
      forwardToExtensionPage(msg);
      sendResponse({ ok: true });
      break;
    }

    default:
      break;
  }

  // Return false = synchronous response (we already called sendResponse above)
  return false;
});

/** Send a message to every normal (non-chrome://) tab that has a content script */
function broadcastToContentScripts(message) {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      const url = tab.url || '';
      if (
        !tab.id ||
        url.startsWith('chrome://') ||
        url.startsWith('chrome-extension://') ||
        url.startsWith('about:') ||
        url.startsWith('devtools:')
      ) {
        continue;
      }
      chrome.tabs.sendMessage(tab.id, message).catch(() => {
        // Tab may not have content script injected yet — silently ignore
      });
    }
  });
}

/** Forward a command back to the extension's own new-tab page(s) */
function forwardToExtensionPage(msg) {
  const prefix = `chrome-extension://${chrome.runtime.id}/`;
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.url?.startsWith(prefix)) {
        chrome.tabs.sendMessage(tab.id, msg).catch(() => {});
      }
    }
  });
}
