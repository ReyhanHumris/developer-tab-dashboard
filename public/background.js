/**
 * Background Service Worker — Floating Cross-Tab MiniPlayer & State Relay
 */

'use strict';

let playerState = {
  isPlaying: false,
  track: { title: '', artist: '' },
  volume: 70,
  isMuted: false,
  progress: 0,
  currentTime: 0,
  duration: 0,
};

// Automatically inject content-script.js into all open tabs
function injectContentScriptToAllTabs() {
  chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] }, (tabs) => {
    if (!tabs || !chrome.scripting) return;
    for (const tab of tabs) {
      if (!tab.id) continue;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-script.js'],
      }).catch(() => {
        // Restricted tabs (like chrome web store) will be safely ignored
      });
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  injectContentScriptToAllTabs();
});

chrome.runtime.onStartup.addListener(() => {
  injectContentScriptToAllTabs();
});

// ── Instant auto-inject & wake-up whenever user switches tabs (NO REFRESH NEEDED) ──
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (
      !tab ||
      !tab.url ||
      tab.url.startsWith('chrome://') ||
      tab.url.startsWith('chrome-extension://') ||
      tab.url.startsWith('about:') ||
      tab.url.startsWith('devtools:')
    ) {
      return;
    }

    // Instantly inject / wake up content script
    if (chrome.scripting) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-script.js'],
      }).catch(() => {});
    }

    // Broadcast current state to the activated tab immediately
    const res = await chrome.storage.local.get(['dt_player_state']);
    const stateToSend = (res && res.dt_player_state) ? res.dt_player_state : playerState;
    if (stateToSend && stateToSend.track?.title) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'MP_STATE',
        payload: stateToSend,
      }).catch(() => {});
    }
  } catch (e) {}
});

// Also auto-inject when any tab finishes navigating
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    !tab.url.startsWith('chrome://') &&
    !tab.url.startsWith('chrome-extension://') &&
    !tab.url.startsWith('about:')
  ) {
    if (chrome.scripting) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ['content-script.js'],
      }).catch(() => {});
    }
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    // ── From new-tab page: player state changed ─────────────────────────────
    case 'MP_STATE_UPDATE': {
      playerState = { ...playerState, ...msg.payload };
      try {
        chrome.storage.local.set({ dt_player_state: playerState });
      } catch (e) {}
      broadcastToContentScripts({ type: 'MP_STATE', payload: playerState });
      sendResponse({ ok: true });
      break;
    }

    // ── From content script on page load: retrieve state ───────────────────
    case 'MP_GET_STATE': {
      try {
        chrome.storage.local.get(['dt_player_state'], (res) => {
          const state = (res && res.dt_player_state) ? res.dt_player_state : playerState;
          sendResponse(state);
        });
        return true; // asynchronous response
      } catch (e) {
        sendResponse(playerState);
      }
      break;
    }

    // ── From content script: control command (play/pause/prev/next/etc) ────
    case 'MP_CMD': {
      forwardToExtensionPage(msg);
      sendResponse({ ok: true });
      break;
    }

    default:
      break;
  }
  return false;
});

/** Broadcast message to every web tab */
function broadcastToContentScripts(message) {
  chrome.tabs.query({}, (tabs) => {
    if (!tabs) return;
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
      chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    }
  });
}

/** Forward command back to the new-tab React page where audio is playing */
function forwardToExtensionPage(msg) {
  const prefix = `chrome-extension://${chrome.runtime.id}/`;
  chrome.tabs.query({}, (tabs) => {
    if (!tabs) return;
    for (const tab of tabs) {
      if (tab.url?.startsWith(prefix)) {
        chrome.tabs.sendMessage(tab.id, msg).catch(() => {});
      }
    }
  });
}
