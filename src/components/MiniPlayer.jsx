import React, { useState, useEffect, useRef } from 'react';

// ─── Inline SVG Icons ────────────────────────────────────────────────────────
const Ic = {
  Play: (p) => (
    <svg {...p} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z" />
    </svg>
  ),
  Pause: (p) => (
    <svg {...p} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ),
  SkipBack: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" y1="19" x2="5" y2="5" />
    </svg>
  ),
  SkipForward: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  ),
  Volume: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  VolumeX: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ),
  Music: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  X: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ChevronDown: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ChevronUp: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
};

// ─── Spinning Vinyl Disc (mini) ───────────────────────────────────────────────
function MiniVinyl({ isPlaying, size = 48 }) {
  return (
    <div
      className={`relative flex-shrink-0 rounded-full overflow-hidden shadow-lg ${isPlaying ? 'vinyl-spinning' : 'vinyl-paused'}`}
      style={{ width: size, height: size }}
    >
      {/* Outer grooves */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #27272a 0%, #18181b 30%, #27272a 38%, #18181b 46%, #27272a 54%, #18181b 62%, #27272a 70%, #18181b 78%, #27272a 86%, #18181b 100%)',
        }}
      />
      {/* Label center */}
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          inset: '28%',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        }}
      >
        {/* Spindle hole */}
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-950/80" />
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ progress, onSeek }) {
  const barRef = useRef(null);

  const handleClick = (e) => {
    if (!barRef.current || !onSeek) return;
    const rect = barRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio);
  };

  return (
    <div
      ref={barRef}
      onClick={handleClick}
      className="relative h-1 rounded-full bg-zinc-700/60 cursor-pointer group"
      style={{ width: '100%' }}
    >
      {/* Filled */}
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-emerald-500 transition-all"
        style={{ width: `${Math.min(100, progress * 100)}%` }}
      />
      {/* Thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `calc(${Math.min(100, progress * 100)}% - 5px)` }}
      />
    </div>
  );
}

// ─── MiniPlayer Component ─────────────────────────────────────────────────────
/**
 * Props:
 *   isPlaying      {boolean}       — current playback state
 *   track          {object|null}   — { title, artist }
 *   progress       {number}        — 0–1, current seek ratio
 *   duration       {number}        — total seconds (0 if unknown)
 *   currentTime    {number}        — elapsed seconds
 *   volume         {number}        — 0–100
 *   isMuted        {boolean}
 *   onPlayPause    {function}
 *   onPrev         {function}
 *   onNext         {function}
 *   onSeek         {function(ratio)}
 *   onVolumeChange {function(vol)}
 *   onMuteToggle   {function}
 *   onDismiss      {function}      — hide the mini player
 */
export default function MiniPlayer({
  isPlaying = false,
  track = null,
  progress = 0,
  duration = 0,
  currentTime = 0,
  volume = 70,
  isMuted = false,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onDismiss,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showVol, setShowVol] = useState(false);
  const [visible, setVisible] = useState(false);

  // Slide in when player becomes active
  useEffect(() => {
    if (isPlaying) {
      setVisible(true);
    }
  }, [isPlaying]);

  // Don't mount if never played
  if (!visible && !isPlaying) return null;

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div
      className="mini-player-root"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        width: 300,
        borderRadius: 16,
        background: 'rgba(24,24,27,0.92)',
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
        border: '1px solid rgba(63,63,70,0.7)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.08)',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* ── Header bar ── */}
      <div
        className="flex items-center justify-between px-3 pt-2.5 pb-0"
        style={{ gap: 6 }}
      >
        {/* Vinyl + Track info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <MiniVinyl isPlaying={isPlaying} size={40} />
          <div className="min-w-0">
            <p
              className="text-xs font-semibold text-zinc-100 truncate leading-tight"
              style={{ maxWidth: 160 }}
            >
              {track?.title || 'No track'}
            </p>
            <p className="text-[10px] text-zinc-400 truncate leading-tight mt-0.5">
              {track?.artist || '—'}
            </p>
          </div>
        </div>

        {/* Action buttons: collapse + close */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/50 transition-colors"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed
              ? <Ic.ChevronUp className="w-3.5 h-3.5" />
              : <Ic.ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onDismiss}
            className="p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-zinc-700/50 transition-colors"
            title="Close mini player"
          >
            <Ic.X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Collapsible body ── */}
      <div
        style={{
          maxHeight: collapsed ? 0 : 200,
          overflow: 'hidden',
          transition: 'max-height 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Progress bar + timestamps */}
        <div className="px-3 pt-2.5 pb-1">
          <ProgressBar progress={progress} onSeek={onSeek} />
          {(duration > 0 || currentTime > 0) && (
            <div className="flex justify-between text-[9px] text-zinc-500 mt-1 font-mono">
              <span>{fmt(currentTime)}</span>
              <span>{duration > 0 ? fmt(duration) : '--:--'}</span>
            </div>
          )}
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-center gap-1 px-3 pb-2.5">
          {/* Prev */}
          <button
            onClick={onPrev}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/60 transition-all"
          >
            <Ic.SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause (primary) */}
          <button
            onClick={onPlayPause}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-md transition-all active:scale-95"
          >
            {isPlaying
              ? <Ic.Pause className="w-4 h-4" />
              : <Ic.Play className="w-4 h-4 translate-x-0.5" />}
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/60 transition-all"
          >
            <Ic.SkipForward className="w-4 h-4" />
          </button>

          {/* Volume toggle + slider */}
          <div className="relative flex items-center ml-1">
            <button
              onClick={() => setShowVol((v) => !v)}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              onContextMenu={(e) => { e.preventDefault(); onMuteToggle?.(); }}
            >
              {isMuted
                ? <Ic.VolumeX className="w-3.5 h-3.5" />
                : <Ic.Volume className="w-3.5 h-3.5" />}
            </button>

            {/* Inline volume slider — shown when toggled */}
            {showVol && (
              <div className="flex items-center ml-1.5">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange?.(Number(e.target.value))}
                  className="mini-player-vol-slider"
                  style={{ width: 64, accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Collapsed state: just controls in one line ── */}
      {collapsed && (
        <div className="flex items-center justify-center gap-1 px-3 pb-2">
          <button onClick={onPrev} className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 transition-colors">
            <Ic.SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onPlayPause}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white transition-all"
          >
            {isPlaying
              ? <Ic.Pause className="w-3 h-3" />
              : <Ic.Play className="w-3 h-3 translate-x-px" />}
          </button>
          <button onClick={onNext} className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 transition-colors">
            <Ic.SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Playing indicator bar at very bottom */}
      {isPlaying && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent, #10b981, #34d399, #10b981, transparent)',
            backgroundSize: '200% 100%',
            animation: 'mini-player-bar-slide 2s linear infinite',
          }}
        />
      )}
    </div>
  );
}
