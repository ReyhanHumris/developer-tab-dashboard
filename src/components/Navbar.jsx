import React from 'react';

const NavIcons = {
  Disc: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Layers: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Compass: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  Code: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Clock: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Settings: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Globe: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
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
  Music: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
};

export default function Navbar({
  language = 'id',
  onLanguageChange,
  onOpenWorkspaceManager,
  onToggleMusicPlayer,
  isMusicPlayerOpen = true,
  musicInfo = null,
  onToggleMusicPlay = null,
  currencyRate = 16000,
  onToggleCurrencyPopover,
  onOpenDevToolbox,
  onOpenWallpaperSettings,
  onOpenCmdPalette
}) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
        
        {/* BRAND & SECTIONS */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-zinc-100 font-mono">
              WORKSPACE
            </span>
          </div>

          {/* MAIN NAV LINKS (CLEAN & SUBTLE) */}
          <nav className="hidden md:flex items-center gap-1 text-xs text-zinc-400">
            <button
              onClick={() => scrollToSection('workspace-section')}
              className="px-2.5 py-1 rounded-md hover:text-zinc-100 hover:bg-zinc-850 transition"
            >
              Workspace
            </button>

            <button
              onClick={onToggleMusicPlayer}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
                isMusicPlayerOpen
                  ? 'text-zinc-100 bg-zinc-850'
                  : 'hover:text-zinc-100 hover:bg-zinc-850'
              }`}
            >
              <NavIcons.Music className="w-3.5 h-3.5 text-zinc-400" />
              <span>{language === 'id' ? 'Audio' : 'Audio'}</span>
            </button>

            <button
              onClick={() => scrollToSection('prayer-section')}
              className="px-2.5 py-1 rounded-md hover:text-zinc-100 hover:bg-zinc-850 transition"
            >
              {language === 'id' ? 'Salat' : 'Prayers'}
            </button>

            <button
              onClick={onOpenDevToolbox}
              className="px-2.5 py-1 rounded-md hover:text-zinc-100 hover:bg-zinc-850 transition"
            >
              Dev Tools
            </button>

            <button
              onClick={() => scrollToSection('tools-section')}
              className="px-2.5 py-1 rounded-md hover:text-zinc-100 hover:bg-zinc-850 transition"
            >
              Timer
            </button>
          </nav>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2">
          
          {/* TOMBOL PENGATURAN WORKSPACE (CLEAN) */}
          <button
            onClick={onOpenWorkspaceManager}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-mono transition"
            title={language === 'id' ? 'Atur Workspace & Kelola Tag' : 'Configure Workspace & Tags'}
          >
            <NavIcons.Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">{language === 'id' ? 'Atur Workspace' : 'Workspace'}</span>
          </button>

          {/* MINI VINYL AUDIO STATUS (SUBTLE) */}
          {musicInfo && (
            <div
              className={`flex items-center gap-2 px-2 py-1 rounded-lg border text-xs font-mono transition cursor-pointer ${
                musicInfo.isPlaying
                  ? 'bg-zinc-900/90 border-zinc-700 text-zinc-200'
                  : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400'
              }`}
              onClick={onToggleMusicPlayer}
              title={language === 'id' ? 'Toggle Audio Player' : 'Toggle Audio Player'}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full vinyl-disc flex items-center justify-center flex-shrink-0 ${
                  musicInfo.isPlaying ? 'vinyl-spinning' : 'vinyl-paused'
                }`}
              >
                <div className="w-1 h-1 rounded-full bg-emerald-400" />
              </div>

              <span className="hidden lg:inline truncate max-w-[90px] text-[11px] text-zinc-300">
                {musicInfo.title}
              </span>

              {onToggleMusicPlay && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMusicPlay();
                  }}
                  className="p-0.5 text-zinc-400 hover:text-white"
                >
                  {musicInfo.isPlaying ? (
                    <NavIcons.Pause className="w-3 h-3" />
                  ) : (
                    <NavIcons.Play className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          )}

          {/* USD TO IDR WIDGET */}
          <button
            onClick={onToggleCurrencyPopover}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1.5 rounded-lg text-xs font-mono transition"
            title="USD/IDR FX Converter"
          >
            <span className="text-zinc-500">$</span>
            <span className="text-zinc-200 text-[11px]">
              Rp {currencyRate.toLocaleString('id-ID')}
            </span>
          </button>

          {/* LANGUAGE SELECTOR */}
          <label className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-400 cursor-pointer">
            <select
              value={language}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
              aria-label="Language"
              className="bg-transparent text-zinc-300 text-xs focus:outline-none cursor-pointer font-mono"
            >
              <option value="id" className="bg-zinc-900">ID</option>
              <option value="en" className="bg-zinc-900">EN</option>
            </select>
          </label>

          {/* WALLPAPER & APPEARANCE */}
          <button
            onClick={onOpenWallpaperSettings}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-zinc-200 transition"
            title={language === 'id' ? 'Atur Wallpaper & Tampilan' : 'Wallpaper & Appearance'}
          >
            <NavIcons.Settings className="w-3.5 h-3.5" />
          </button>

          {/* COMMAND PALETTE TRIGGER */}
          <button
            onClick={onOpenCmdPalette}
            className="hidden sm:flex items-center bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 px-2 py-1.5 rounded-lg text-[10px] text-zinc-400 hover:text-zinc-200 transition font-mono"
            title={language === 'id' ? 'Buka Pencarian Cepat (⌘K)' : 'Quick Command Palette (⌘K)'}
          >
            ⌘K
          </button>

        </div>

      </div>
    </header>
  );
}
