import React from 'react';
import { createPortal } from 'react-dom';

const Icons = {
  Play: (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z" />
    </svg>
  ),
  Pause: (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ),
  SkipBack: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" y1="19" x2="5" y2="5" />
    </svg>
  ),
  SkipForward: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  ),
  Volume: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  VolumeX: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ),
};

export default function DesktopPipWindow({
  pipWindow,
  isPlaying,
  track,
  progress,
  duration,
  currentTime,
  volume,
  isMuted,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onMuteToggle,
}) {
  if (!pipWindow || !pipWindow.document?.body) return null;

  const fmt = (s) => {
    const m = Math.floor((s || 0) / 60);
    const sec = Math.floor((s || 0) % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek?.(ratio);
  };

  return createPortal(
    <div
      style={{
        width: '100vw',
        height: '100vh',
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
        color: '#f4f4f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px 14px',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Track Info & Vinyl Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Spinning Vinyl */}
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'radial-gradient(circle at 50% 50%, #27272a 0%, #18181b 35%, #27272a 45%, #18181b 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            animation: isPlaying ? 'pip-spin 3s linear infinite' : 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '28%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#09090b' }} />
          </div>
        </div>

        {/* Title and Artist */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.3,
            }}
          >
            {track?.title || 'No track'}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: '#a1a1aa',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: '2px',
            }}
          >
            {track?.artist || '—'}
          </div>
        </div>

        {/* Badge Indicator */}
        <div
          style={{
            fontSize: '9px',
            padding: '2px 6px',
            borderRadius: '999px',
            background: isPlaying ? 'rgba(16,185,129,0.18)' : 'rgba(113,113,122,0.2)',
            color: isPlaying ? '#34d399' : '#a1a1aa',
            border: isPlaying ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(113,113,122,0.3)',
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          {isPlaying ? 'PLAYING' : 'PAUSED'}
        </div>
      </div>

      {/* Progress Bar & Timestamps */}
      <div style={{ marginTop: '8px' }}>
        <div
          onClick={handleBarClick}
          style={{
            height: '4px',
            borderRadius: '999px',
            background: 'rgba(63,63,70,0.6)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: '999px',
              background: '#10b981',
              width: `${Math.min(100, Math.max(0, (progress || 0) * 100))}%`,
              transition: 'width 0.3s linear',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '9px',
            color: '#71717a',
            fontFamily: 'monospace',
            marginTop: '3px',
          }}
        >
          <span>{fmt(currentTime)}</span>
          <span>{duration > 0 ? fmt(duration) : '--:--'}</span>
        </div>
      </div>

      {/* Control Buttons & Volume */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '6px',
        }}
      >
        <button
          onClick={onPrev}
          title="Previous Track"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#a1a1aa',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icons.SkipBack style={{ width: '15px', height: '15px' }} />
        </button>

        <button
          onClick={onPlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#10b981',
            border: 'none',
            cursor: 'pointer',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(16,185,129,0.4)',
          }}
        >
          {isPlaying ? (
            <Icons.Pause style={{ width: '15px', height: '15px' }} />
          ) : (
            <Icons.Play style={{ width: '15px', height: '15px', marginLeft: '2px' }} />
          )}
        </button>

        <button
          onClick={onNext}
          title="Next Track"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#a1a1aa',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icons.SkipForward style={{ width: '15px', height: '15px' }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
          <button
            onClick={onMuteToggle}
            title={isMuted ? 'Unmute' : 'Mute'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#a1a1aa',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isMuted ? (
              <Icons.VolumeX style={{ width: '14px', height: '14px' }} />
            ) : (
              <Icons.Volume style={{ width: '14px', height: '14px' }} />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange?.(Number(e.target.value))}
            style={{ width: '50px', height: '3px', accentColor: '#10b981', cursor: 'pointer' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes pip-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        button:hover {
          color: #ffffff !important;
          transform: scale(1.06);
        }
        button:active {
          transform: scale(0.94);
        }
      `}</style>
    </div>,
    pipWindow.document.body
  );
}
