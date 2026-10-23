/**
 * Content Script — Floating MiniPlayer injected into every tab.
 * Uses Shadow DOM so page styles don't conflict.
 */
(function () {
  'use strict';

  // Prevent duplicate insertion, but wake up existing player on tab switch
  if (window.__dws_mini_player_injected) {
    if (typeof window.__dws_mini_player_wake === 'function') {
      window.__dws_mini_player_wake();
    }
    return;
  }
  window.__dws_mini_player_injected = true;

  // ── SVG icon strings ──────────────────────────────────────────────────────
  const SVG_PLAY = `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z"/></svg>`;
  const SVG_PAUSE = `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
  const SVG_PREV = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>`;
  const SVG_NEXT = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>`;
  const SVG_VOL = `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
  const SVG_VOLX = `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
  const SVG_X = `<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  const SVG_CHEVDOWN = `<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>`;
  const SVG_CHEVUP = `<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>`;
  const SVG_PIP = `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><rect x="11" y="9" width="9" height="6" rx="1" ry="1" fill="currentColor" fill-opacity="0.2"/></svg>`;

  // ── State ─────────────────────────────────────────────────────────────────
  let S = {
    isPlaying: false,
    track: { title: '', artist: '' },
    volume: 70,
    isMuted: false,
    progress: 0,
    currentTime: 0,
    duration: 0,
  };
  let dismissed = false;
  let everShown = false;
  let collapsed = false;
  let volOpen = false;
  let lastTrackTitle = '';

  // ── Shadow DOM Host ───────────────────────────────────────────────────────
  const host = document.createElement('div');
  host.id = '__dws-mini-player-host';
  host.style.cssText = [
    'position: fixed !important',
    'bottom: 20px !important',
    'right: 20px !important',
    'z-index: 2147483647 !important',
    'pointer-events: none !important',
    'width: auto !important',
    'height: auto !important',
    'margin: 0 !important',
    'padding: 0 !important',
    'border: none !important',
    'background: transparent !important',
    'display: block !important',
    'box-shadow: none !important',
    'transform: none !important',
    'opacity: 1 !important',
    'visibility: visible !important'
  ].join(';');

  function mountHost() {
    const parent = document.body || document.documentElement;
    if (parent && !document.getElementById('__dws-mini-player-host')) {
      parent.appendChild(host);
    }
  }

  if (document.body) {
    mountHost();
  } else {
    document.addEventListener('DOMContentLoaded', mountHost);
  }

  const shadow = host.attachShadow({ mode: 'open' });

  // ── CSS Inside Shadow DOM ─────────────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    #card {
      width: 300px;
      border-radius: 16px;
      background: rgba(24, 24, 27, 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(63, 63, 70, 0.75);
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(16, 185, 129, 0.12);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e4e4e7;
      pointer-events: auto;
      opacity: 0;
      transform: translateY(20px) scale(0.96);
      transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
      user-select: none;
    }
    #card.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    /* ── Vinyl Animation ── */
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    #vinyl {
      width: 40px; height: 40px; flex-shrink: 0;
      border-radius: 50%;
      position: relative; overflow: hidden;
      background: radial-gradient(circle at 50% 50%,
        #27272a 0%, #18181b 30%, #27272a 38%, #18181b 46%,
        #27272a 54%, #18181b 62%, #27272a 70%, #18181b 78%,
        #27272a 86%, #18181b 100%);
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }
    #vinyl.spinning { animation: spin 3s linear infinite; }
    #vinyl-label {
      position: absolute; inset: 28%; border-radius: 50%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      display: flex; align-items: center; justify-content: center;
    }
    #vinyl-hole { width: 6px; height: 6px; border-radius: 50%; background: rgba(9,9,11,0.9); }

    /* ── Header ── */
    #hdr { display: flex; align-items: center; gap: 10px; padding: 10px 12px 0; }
    #tinfo { flex: 1; min-width: 0; }
    #ttitle {
      font-size: 12px; font-weight: 600; color: #f4f4f5;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3;
    }
    #tartist {
      font-size: 10px; color: #71717a; margin-top: 1px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3;
    }
    #hdr-actions { display: flex; gap: 2px; flex-shrink: 0; }
    .ibtn {
      background: none; border: none; cursor: pointer;
      color: #71717a; padding: 4px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      transition: color 0.15s, background 0.15s; line-height: 0;
    }
    .ibtn:hover { color: #e4e4e7; background: rgba(63,63,70,0.5); }
    #pip-btn:hover { color: #34d399; }
    #cls-btn:hover { color: #f87171; }

    /* ── Body ── */
    #body { overflow: hidden; transition: max-height 0.22s ease; max-height: 120px; }
    #body.collapsed { max-height: 0; }

    /* ── Progress ── */
    #prog-wrap { padding: 8px 12px 2px; }
    #prog-bar {
      height: 3px; border-radius: 999px;
      background: rgba(63,63,70,0.65); cursor: pointer; position: relative;
    }
    #prog-bar:hover #prog-thumb { opacity: 1; }
    #prog-fill {
      height: 100%; border-radius: 999px; background: #10b981;
      transition: width 0.3s linear; pointer-events: none;
    }
    #prog-thumb {
      position: absolute; top: 50%; transform: translateY(-50%);
      width: 10px; height: 10px; border-radius: 50%;
      background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      opacity: 0; transition: opacity 0.15s; pointer-events: none;
    }
    #ts { display: flex; justify-content: space-between; font-size: 9px; color: #52525b; margin-top: 3px; font-family: monospace; }

    /* ── Controls ── */
    #ctrl { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 4px 12px 10px; }
    .cbtn {
      background: none; border: none; cursor: pointer; color: #a1a1aa;
      padding: 6px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      transition: color 0.15s, background 0.15s; line-height: 0;
    }
    .cbtn:hover { color: #e4e4e7; background: rgba(63,63,70,0.5); }
    #play-btn {
      width: 36px; height: 36px; border-radius: 50%;
      background: #10b981; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #fff; transition: background 0.15s, transform 0.1s;
      box-shadow: 0 2px 10px rgba(16,185,129,0.35); line-height: 0;
    }
    #play-btn:hover { background: #34d399; }
    #play-btn:active { transform: scale(0.92); }

    #vol-wrap { display: flex; align-items: center; gap: 2px; margin-left: 2px; }
    #vol-slide { width: 0; overflow: hidden; transition: width 0.2s ease; display: flex; align-items: center; }
    #vol-slide.open { width: 62px; }
    #vol-inp {
      -webkit-appearance: none; appearance: none; width: 62px;
      height: 3px; border-radius: 999px; background: #3f3f46;
      outline: none; cursor: pointer; accent-color: #10b981;
    }
    #vol-inp::-webkit-slider-thumb {
      -webkit-appearance: none; width: 10px; height: 10px;
      border-radius: 50%; background: #10b981; cursor: pointer;
    }

    /* ── Bottom Playing Indicator ── */
    @keyframes bar-run { 0%{background-position:200% center} 100%{background-position:-200% center} }
    #play-bar {
      height: 2px;
      background: linear-gradient(90deg, transparent, #10b981, #34d399, #10b981, transparent);
      background-size: 200% 100%;
      animation: bar-run 2s linear infinite;
      opacity: 0; transition: opacity 0.3s;
    }
    #play-bar.on { opacity: 1; }
  `;

  // ── HTML Template ─────────────────────────────────────────────────────────
  const card = document.createElement('div');
  card.id = 'card';
  card.innerHTML = `
    <div id="hdr">
      <div id="vinyl"><div id="vinyl-label"><div id="vinyl-hole"></div></div></div>
      <div id="tinfo">
        <div id="ttitle">Loading…</div>
        <div id="tartist">—</div>
      </div>
      <div id="hdr-actions">
        <button class="ibtn" id="pip-btn" title="Pop-out Desktop (Tetap melayang saat Chrome di-minimize)">${SVG_PIP}</button>
        <button class="ibtn" id="col-btn" title="Collapse">${SVG_CHEVDOWN}</button>
        <button class="ibtn" id="cls-btn" title="Close">${SVG_X}</button>
      </div>
    </div>
    <div id="body">
      <div id="prog-wrap">
        <div id="prog-bar">
          <div id="prog-fill" style="width:0%"></div>
          <div id="prog-thumb"></div>
        </div>
        <div id="ts"><span id="ts-cur">0:00</span><span id="ts-tot">--:--</span></div>
      </div>
      <div id="ctrl">
        <button class="cbtn" id="prev-btn">${SVG_PREV}</button>
        <button id="play-btn">${SVG_PLAY}</button>
        <button class="cbtn" id="next-btn">${SVG_NEXT}</button>
        <div id="vol-wrap">
          <button class="ibtn" id="vol-btn">${SVG_VOL}</button>
          <div id="vol-slide"><input type="range" id="vol-inp" min="0" max="100" value="70"></div>
        </div>
      </div>
    </div>
    <div id="play-bar"></div>
  `;

  shadow.appendChild(styleEl);
  shadow.appendChild(card);

  // ── Element References ────────────────────────────────────────────────────
  const el = (id) => shadow.getElementById(id);
  const vinyl   = el('vinyl');
  const ttitle  = el('ttitle');
  const tartist = el('tartist');
  const progFill = el('prog-fill');
  const progThumb= el('prog-thumb');
  const tsCur   = el('ts-cur');
  const tsTot   = el('ts-tot');
  const playBtn = el('play-btn');
  const bodyEl  = el('body');
  const playBar = el('play-bar');
  const volSlide= el('vol-slide');
  const volInp  = el('vol-inp');
  const volBtn  = el('vol-btn');

  function fmt(s) {
    const m = Math.floor((s || 0) / 60);
    const sec = Math.floor((s || 0) % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  }

  function showCard() {
    mountHost();
    host.style.pointerEvents = 'auto';
    card.classList.add('visible');
  }

  function hideCard() {
    host.style.pointerEvents = 'none';
    card.classList.remove('visible');
  }

  function render() {
    if (!S.track?.title) {
      hideCard();
      return;
    }

    // Reset dismiss if a new track starts
    if (S.track.title !== lastTrackTitle) {
      lastTrackTitle = S.track.title;
      dismissed = false;
    }

    ttitle.textContent  = S.track?.title  || 'No track';
    tartist.textContent = S.track?.artist || '—';

    const pct = Math.min(100, Math.max(0, (S.progress || 0) * 100));
    progFill.style.width  = `${pct}%`;
    progThumb.style.left  = `calc(${pct}% - 5px)`;
    tsCur.textContent = fmt(S.currentTime);
    tsTot.textContent = S.duration > 0 ? fmt(S.duration) : '--:--';

    if (S.isPlaying) {
      vinyl.classList.add('spinning');
      playBtn.innerHTML = SVG_PAUSE;
      playBar.classList.add('on');
    } else {
      vinyl.classList.remove('spinning');
      playBtn.innerHTML = SVG_PLAY;
      playBar.classList.remove('on');
    }

    volInp.value = S.isMuted ? 0 : (S.volume ?? 70);
    volBtn.innerHTML = S.isMuted ? SVG_VOLX : SVG_VOL;

    // Show when playing or if played and not manually closed
    if ((S.isPlaying || everShown) && !dismissed) {
      everShown = true;
      showCard();
    } else {
      hideCard();
    }
  }

  // ── Wake-up handler: called whenever tab becomes active ───────────────────
  window.__dws_mini_player_wake = () => {
    try {
      chrome.storage.local.get(['dt_player_state'], (res) => {
        if (res && res.dt_player_state) {
          S = { ...S, ...res.dt_player_state };
          render();
        }
      });
    } catch (e) {}
  };

  // Instant wake when tab gains focus or visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      window.__dws_mini_player_wake();
    }
  });

  window.addEventListener('focus', () => {
    window.__dws_mini_player_wake();
  });

  // ── Dispatch commands back to new-tab ────────────────────────────────────
  function cmd(c, payload) {
    try {
      chrome.runtime.sendMessage({ type: 'MP_CMD', cmd: c, payload: payload || {} }).catch(() => {});
    } catch (e) {}

    try {
      chrome.storage.local.set({
        dt_player_cmd: { cmd: c, payload: payload || {}, ts: Date.now() + Math.random() }
      });
    } catch (e) {}
  }

  el('cls-btn').addEventListener('click', () => {
    dismissed = true;
    hideCard();
  });

  el('pip-btn').addEventListener('click', () => {
    cmd('TOGGLE_PIP');
  });

  el('col-btn').addEventListener('click', () => {
    collapsed = !collapsed;
    bodyEl.classList.toggle('collapsed', collapsed);
    el('col-btn').innerHTML = collapsed ? SVG_CHEVUP : SVG_CHEVDOWN;
  });

  el('prev-btn').addEventListener('click', () => cmd('PREV'));
  el('next-btn').addEventListener('click', () => cmd('NEXT'));
  playBtn.addEventListener('click', () => cmd('PLAY_PAUSE'));

  el('prog-bar').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    cmd('SEEK', { progress: ratio });
  });

  volBtn.addEventListener('click', () => {
    volOpen = !volOpen;
    volSlide.classList.toggle('open', volOpen);
  });

  volInp.addEventListener('input', (e) => {
    cmd('VOLUME', { volume: Number(e.target.value) });
  });

  // ── Multi-Channel Real-time State Synchronization ─────────────────────────
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.dt_player_state?.newValue) {
        S = { ...S, ...changes.dt_player_state.newValue };
        render();
      }
    });

    chrome.storage.local.get(['dt_player_state'], (res) => {
      if (res && res.dt_player_state) {
        S = { ...S, ...res.dt_player_state };
        render();
      }
    });

    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'MP_STATE') {
        S = { ...S, ...msg.payload };
        render();
      }
    });

    chrome.runtime.sendMessage({ type: 'MP_GET_STATE' }, (resp) => {
      if (chrome.runtime.lastError) return;
      if (resp) {
        S = { ...S, ...resp };
        render();
      }
    });
  } catch (e) {}

  render();
})();
