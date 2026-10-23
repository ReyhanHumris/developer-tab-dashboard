import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import Navbar from './components/Navbar';
import VinylMusicPlayer from './components/VinylMusicPlayer';
import WorkspaceManagerModal from './components/WorkspaceManagerModal';


    // --- SOUND UTILITY (Web Audio API for Pomodoro chime) ---
    const playNotificationBeep = () => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      } catch (e) {
        console.warn("Audio not permitted yet:", e);
      }
    };

    // --- INLINE PRODUCTION SVG ICONS (Crisp Lucide paths, zero CDN dependency lag) ---
    const Icons = {
      Search: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
      Clock: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
      Terminal: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
      Globe: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
      DollarSign: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      Settings: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
      Copy: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
      Check: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
      Trash: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
      Plus: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
      ExternalLink: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
      Play: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
      Pause: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
      RotateCcw: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
      RefreshCw: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>,
      X: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
      Code: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
      CheckSquare: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
      Square: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>,
      Edit2: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
      Moon: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
      Sun: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
      ArrowLeftRight: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="17 8 21 12 17 16"/><line x1="21" y1="12" x2="9" y2="12"/><polyline points="7 16 3 12 7 8"/><line x1="3" y1="12" x2="15" y2="12"/></svg>,
      Cpu: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
      Compass: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
      Table: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>,
      LayoutGrid: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
      Columns: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>,
      List: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
      Calendar: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      Sunrise: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2v6"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>,
      Sunset: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 10V4"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>,
      MapPin: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
      Sparkles: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
      Download: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
      ChevronDown: (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
    };

    const UI_TRANSLATIONS = {
      en: {
        'Subuh': 'Fajr',
        'Terbit / Syuruq': 'Sunrise',
        'Dzuhur': 'Dhuhr',
        'Ashar': 'Asr',
        'Isya': 'Isha',
        'Waktu': 'Time',
        'Batas Mulai Puasa': 'Start of fasting',
        'Fajar Shodiq': 'True dawn',
        'Matahari Terbit': 'Sunrise',
        'Tergelincir Matahari': 'Sun passes its zenith',
        'Bayangan Meninggi': 'Shadow lengthens',
        'Matahari Terbenam': 'Sunset',
        'Syafaq Merah Hilang': 'Red twilight ends',
        'Selesai': 'Finished',
        'Aktif': 'Active',
        'Nonaktif': 'Disabled',
        'Tinggi': 'High',
        'Sedang': 'Medium',
        'Rendah': 'Low',
        'Mulai': 'Start',
        'Jeda': 'Pause',
        'Reset': 'Reset',
        'Kerja': 'Work',
        'Istirahat Singkat': 'Short Break',
        'Istirahat Panjang': 'Long Break',
        'Berikutnya:': 'Next:',
        'Saat ini:': 'Current:',
        'Hari ini': 'Today',
        'Besok': 'Tomorrow',
        'Imsak': 'Imsak',
        'Maghrib': 'Maghrib'
      },
      id: {
        'Developer New Tab': 'Tab Baru Developer',
        'Language': 'Bahasa',
        'Next:': 'Berikutnya:',
        'Start': 'Mulai',
        'Pause': 'Jeda',
        'Work': 'Kerja',
        'Short Break': 'Istirahat Singkat',
        'Long Break': 'Istirahat Panjang',
        'Today': 'Hari ini',
        'Tomorrow': 'Besok',
        'Current:': 'Saat ini:',
        'gh (GitHub)': 'gh (GitHub)',
        'dev (DevDocs)': 'dev (DevDocs)',
        'so (StackOverflow)': 'so (StackOverflow)',
        'yt (YouTube)': 'yt (YouTube)',
        'Dev Utility': 'Utilitas Developer',
        'Diagnostic': 'Diagnostik',
        'Appearance': 'Tampilan',
        'Finance': 'Keuangan',
        'Bookmarks': 'Bookmark',
        'Navigation': 'Navigasi',
        'Shortcut': 'Pintasan',
        'Click for USD/IDR Instant Converter': 'Klik untuk membuka konverter USD/IDR',
        'Quick FX Calculator': 'Kalkulator Kurs Cepat',
        'Open Dev Toolbox (JSON, Base64, UUID)': 'Buka Kotak Alat Developer (JSON, Base64, UUID)',
        'Scan Localhost Port Statuses (3000, 8000, 5173, 8080)': 'Pindai Status Port Localhost (3000, 8000, 5173, 8080)',
        'Customize Wallpaper & Dimmer Overlay': 'Atur Wallpaper dan Lapisan Penggelap',
        'Open USD to IDR Quick Converter': 'Buka Konverter USD ke IDR',
        'Add New Custom Bookmark Shortcut': 'Tambah Pintasan Bookmark Baru',
        'Focus Main Search Bar': 'Fokus ke Kolom Pencarian',
        'USD Amount ($)': 'Jumlah USD ($)',
        'IDR Amount (Rp)': 'Jumlah IDR (Rp)',
        'Live cached rate:': 'Kurs tersimpan terbaru:',
        'Dev Tools': 'Alat Developer',
        'Customize Wallpaper & Dimmer': 'Atur Wallpaper dan Kecerahan',
        'Prefixes:': 'Prefix:',
        'Workspace Quick Links': 'Tautan Cepat Workspace',
        '(Keys 1-9 direct jump)': '(Tekan tombol 1-9 untuk membuka)',
        'Add Shortcut': 'Tambah Pintasan',
        'Edit Shortcut': 'Edit Pintasan',
        'Delete Shortcut': 'Hapus Pintasan',
        'Dev Scratchpad': 'Catatan Developer',
        'Copied': 'Tersalin',
        'Copy': 'Salin',
        'Clear': 'Hapus',
        'Paste snippets, temporary keys, API routes...': 'Tempel cuplikan kode, kunci sementara, atau rute API...',
        'Auto-saved to storage': 'Tersimpan otomatis',
        'Sprint Tasks': 'Daftar Tugas Sprint',
        'No sprint tasks yet.': 'Belum ada tugas sprint.',
        'New sprint task...': 'Tugas sprint baru...',
        'High': 'Tinggi',
        'Med': 'Sedang',
        'Low': 'Rendah',
        'Local Ports Ping': 'Pemeriksaan Port Lokal',
        'Scanning': 'Memindai',
        'Scan': 'Pindai',
        'Down': 'Mati',
        'Ready': 'Siap',
        'Focus Timer': 'Timer Fokus',
        'Reset timer': 'Atur ulang timer',
        'Default Solid Zinc-950 Dark Mode:': 'Mode gelap Zinc-950 bawaan:',
        'Active': 'Aktif',
        'Disabled': 'Nonaktif',
        'Custom Image Source': 'Sumber Gambar Kustom',
        'Paste Image URL (https://...)': 'Tempel URL gambar (https://...)',
        'Or Upload Local Image file:': 'Atau unggah file gambar lokal:',
        'Dark Dimmer Overlay:': 'Lapisan penggelap:',
        'Background Blur:': 'Buramkan latar:',
        'Done': 'Selesai',
        'Integrated Dev Toolbox': 'Kotak Alat Developer',
        'JSON Formatter': 'Pemformat JSON',
        'UUID Gen': 'Pembuat UUID',
        'Input / Output JSON payload:': 'Masukan / keluaran data JSON:',
        'Prettify (2)': 'Rapikan (2)',
        'Prettify (4)': 'Rapikan (4)',
        'Minify': 'Ringkas',
        'Invalid JSON Syntax:': 'Sintaks JSON tidak valid:',
        'Mode selector:': 'Pilih mode:',
        'Encode Plaintext': 'Enkode Teks',
        'Decode Base64': 'Dekode Base64',
        'Input Text:': 'Teks masukan:',
        'Result Output:': 'Hasil keluaran:',
        'Copy Result': 'Salin Hasil',
        'Generate Count:': 'Jumlah:',
        '1 UUID': '1 UUID',
        '5 UUIDs': '5 UUID',
        '10 UUIDs': '10 UUID',
        '20 UUIDs': '20 UUID',
        'Generate New': 'Buat Baru',
        'Copied All': 'Semua Tersalin',
        'Copy All': 'Salin Semua',
        'Copy single UUID': 'Salin satu UUID',
        'Add New Shortcut': 'Tambah Pintasan Baru',
        'Title Name': 'Nama Judul',
        'e.g. Linear, Postgres Admin': 'mis. Linear, Admin Postgres',
        'Destination URL': 'URL Tujuan',
        'Category / Tag': 'Kategori / Tag',
        'Dev, Cloud, AI': 'Dev, Cloud, AI',
        'Quick Key (1-9)': 'Tombol Pintas (1-9)',
        'Optional': 'Opsional',
        'Cancel': 'Batal',
        'Save Shortcut': 'Simpan Pintasan',
        'Type a command, tool, or shortcut name...': 'Ketik perintah, alat, atau nama pintasan...',
        'No matching dev tools or bookmarks found.': 'Alat developer atau bookmark tidak ditemukan.',
        'Navigation: ↑ / ↓ to navigate • ↵ to execute': 'Navigasi: ↑ / ↓ untuk memilih • ↵ untuk menjalankan',
        'Raycast style palette': 'Palet gaya Raycast',
        'Wallpaper & Dimmer Controls': 'Pengaturan Wallpaper dan Kecerahan',
        'Current Prayer': 'Salat Saat Ini',
        'Next Prayer': 'Salat Berikutnya'
      }
    };

    const translateUiText = (value, language) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      const translated = UI_TRANSLATIONS[language]?.[trimmed];
      if (translated) return value.replace(trimmed, translated);
      if (language === 'en') {
        const prayerTimeMatch = trimmed.match(/^(.+) time$/);
        if (prayerTimeMatch) {
          return value.replace(trimmed, `${translateUiText(prayerTimeMatch[1], language)} time`);
        }
        const elapsedMatch = trimmed.match(/^(\d+)j(?: (\d+)m)? lalu$/);
        if (elapsedMatch) {
          const [, hours, minutes] = elapsedMatch;
          return value.replace(trimmed, `${hours !== undefined ? `${hours}h ` : ''}${minutes || '0'}m ago`);
        }
        const remainingMatch = trimmed.match(/^dalam (?:(\d+)j )?(\d+)m$/);
        if (remainingMatch) {
          const [, hours, minutes] = remainingMatch;
          return value.replace(trimmed, `in ${hours ? `${hours}h ` : ''}${minutes}m`);
        }
        const hoursMatch = trimmed.match(/^(\d+)j lalu$/);
        if (hoursMatch) return value.replace(trimmed, `${hoursMatch[1]}h ago`);
        const countdownMatch = trimmed.match(/^(\d+)j (\d+)m (\d+)d$/);
        if (countdownMatch) return value.replace(trimmed, `${countdownMatch[1]}h ${countdownMatch[2]}m ${countdownMatch[3]}s`);
      }
      if (language !== 'id') return value;
      const shortcutCategoryMatch = trimmed.match(/^Shortcut \[(.+)\]$/);
      if (shortcutCategoryMatch) return value.replace(trimmed, `Pintasan [${shortcutCategoryMatch[1]}]`);
      const searchMatch = trimmed.match(/^Search with (.+)\.\.\.$/);
      if (searchMatch) return value.replace(trimmed, `Cari dengan ${searchMatch[1]}...`);
      const timeMatch = trimmed.match(/^(.+) time$/);
      if (timeMatch) return value.replace(trimmed, `Waktu ${timeMatch[1]}`);
      const goToMatch = trimmed.match(/^Go to (.+)$/);
      if (goToMatch) return value.replace(trimmed, `Buka ${goToMatch[1]}`);
      return value;
    };

    const localizeNode = (node, language) => {
      if (typeof node === 'string') return translateUiText(node, language);
      if (Array.isArray(node)) return node.map(child => localizeNode(child, language));
      if (!React.isValidElement(node)) return node;
      const localizedProps = {};
      ['placeholder', 'title', 'aria-label'].forEach((prop) => {
        if (typeof node.props[prop] === 'string') {
          localizedProps[prop] = translateUiText(node.props[prop], language);
        }
      });
      if (node.props.children !== undefined) {
        localizedProps.children = localizeNode(node.props.children, language);
      }
      return React.cloneElement(node, localizedProps);
    };

    // --- PRAYER TIMES CONSTANTS & CITIES (INDONESIA) ---
    const INDONESIAN_CITIES = [
      { city: 'Ende', label: 'Ende (WITA)', tz: 'WITA' },
      { city: 'Kupang', label: 'Kupang (WITA)', tz: 'WITA' },
      { city: 'Jakarta', label: 'Jakarta (WIB)', tz: 'WIB' },
      { city: 'Surabaya', label: 'Surabaya (WIB)', tz: 'WIB' },
      { city: 'Bandung', label: 'Bandung (WIB)', tz: 'WIB' },
      { city: 'Yogyakarta', label: 'Yogyakarta (WIB)', tz: 'WIB' },
      { city: 'Semarang', label: 'Semarang (WIB)', tz: 'WIB' },
      { city: 'Makassar', label: 'Makassar (WITA)', tz: 'WITA' },
      { city: 'Denpasar', label: 'Denpasar (WITA)', tz: 'WITA' },
      { city: 'Mataram', label: 'Mataram (WITA)', tz: 'WITA' },
      { city: 'Balikpapan', label: 'Balikpapan (WITA)', tz: 'WITA' },
      { city: 'Medan', label: 'Medan (WIB)', tz: 'WIB' },
      { city: 'Palembang', label: 'Palembang (WIB)', tz: 'WIB' },
      { city: 'Banjarmasin', label: 'Banjarmasin (WITA)', tz: 'WITA' },
      { city: 'Jayapura', label: 'Jayapura (WIT)', tz: 'WIT' },
      { city: 'Ambon', label: 'Ambon (WIT)', tz: 'WIT' }
    ];

    const PRAYER_DEFINITIONS = [
      { key: 'Imsak', name: 'Imsak', desc: 'Batas Mulai Puasa', icon: 'Sparkles', fardhu: false },
      { key: 'Subuh', name: 'Subuh', desc: 'Fajar Shodiq', icon: 'Sunrise', fardhu: true },
      { key: 'Terbit', name: 'Terbit / Syuruq', desc: 'Matahari Terbit', icon: 'Sun', fardhu: false },
      { key: 'Dzuhur', name: 'Dzuhur', desc: 'Tergelincir Matahari', icon: 'Sun', fardhu: true },
      { key: 'Ashar', name: 'Ashar', desc: 'Bayangan Meninggi', icon: 'Sun', fardhu: true },
      { key: 'Maghrib', name: 'Maghrib', desc: 'Matahari Terbenam', icon: 'Sunset', fardhu: true },
      { key: 'Isya', name: 'Isya', desc: 'Syafaq Merah Hilang', icon: 'Moon', fardhu: true }
    ];

    // --- INITIAL DEFAULT LAUNCHER SHORTCUTS ---
    const DEFAULT_SHORTCUTS = [
      { id: '1', title: 'GitHub', url: 'https://github.com', category: 'Dev', key: '1' },
      { id: '2', title: 'Vercel', url: 'https://vercel.com/dashboard', category: 'Cloud', key: '2' },
      { id: '3', title: 'Supabase', url: 'https://supabase.com/dashboard', category: 'Cloud', key: '3' },
      { id: '4', title: 'Laravel Docs', url: 'https://laravel.com/docs', category: 'Docs', key: '4' },
      { id: '5', title: 'Next.js Docs', url: 'https://nextjs.org/docs', category: 'Docs', key: '5' },
      { id: '6', title: 'Tailwind CSS', url: 'https://tailwindcss.com/docs', category: 'Docs', key: '6' },
      { id: '7', title: 'Figma', url: 'https://www.figma.com', category: 'Design', key: '7' },
      { id: '8', title: 'ChatGPT', url: 'https://chatgpt.com', category: 'AI', key: '8' },
      { id: '9', title: 'Claude', url: 'https://claude.ai', category: 'AI', key: '9' },
      { id: '10', title: 'Localhost:3000', url: 'http://localhost:3000', category: 'Local', key: '0' },
      { id: '11', title: 'Localhost:8000', url: 'http://localhost:8000', category: 'Local', key: null }
    ];

    const getShortcutFaviconUrl = (url) => {
      try {
        const { hostname } = new URL(url);
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return '';
        return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=64`;
      } catch {
        return '';
      }
    };

    // --- MAIN REACT APPLICATION ---
    function App() {
      const [language, setLanguage] = useState(() => (
        localStorage.getItem('dt_language') === 'id' ? 'id' : 'en'
      ));

      const handleLanguageChange = (nextLanguage) => {
        setLanguage(nextLanguage);
        localStorage.setItem('dt_language', nextLanguage);
      };

      useEffect(() => {
        document.documentElement.lang = language;
        document.title = language === 'id' ? 'Tab Baru Developer' : 'Developer New Tab';
      }, [language]);

      // 1. Digital Clock State
      const [now, setNow] = useState(new Date());

      useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
      }, []);

      // 2. Prayer Times State & Multi-Layout System
      const [prayerCity, setPrayerCity] = useState(() => {
        return localStorage.getItem('dt_prayer_city') || 'Ende';
      });
      const [prayerLayout, setPrayerLayout] = useState(() => {
        // Supported layouts: 'table', 'cards', 'split', 'compact'
        return localStorage.getItem('dt_prayer_layout') || 'table';
      });
      const [prayerTimes, setPrayerTimes] = useState(() => {
        const saved = localStorage.getItem('dt_prayer_cache_v2');
        if (saved) {
          try { return JSON.parse(saved); } catch (e) {}
        }
        return {
          Imsak: '04:22',
          Subuh: '04:32',
          Terbit: '05:45',
          Dzuhur: '11:53',
          Ashar: '15:11',
          Maghrib: '17:58',
          Isya: '19:07'
        };
      });
      const [hijriDate, setHijriDate] = useState(() => {
        return localStorage.getItem('dt_hijri_date') || '26 Rabi\'ul Akhir 1448 H';
      });
      const [nextPrayerInfo, setNextPrayerInfo] = useState({ 
        name: 'Subuh', 
        time: '04:32', 
        countdown: '--:--:--', 
        humanCountdown: '',
        currentName: 'Isya',
        isTomorrow: false
      });
      const [showMonthlyModal, setShowMonthlyModal] = useState(false);
      const [monthlySchedule, setMonthlySchedule] = useState([]);
      const [loadingMonthly, setLoadingMonthly] = useState(false);
      const [monthlyFilter, setMonthlyFilter] = useState('');
      const [copyScheduleCopied, setCopyScheduleCopied] = useState(false);

      // Active City Meta
      const activeCityInfo = useMemo(() => {
        return INDONESIAN_CITIES.find(c => c.city.toLowerCase() === prayerCity.toLowerCase()) || {
          city: prayerCity,
          label: `${prayerCity} (WITA)`,
          tz: 'WITA'
        };
      }, [prayerCity]);

      // Fetch Prayer Times for selected city
      const fetchPrayers = useCallback(async (cityName = prayerCity) => {
        try {
          const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityName)}&country=Indonesia&method=11`);
          const data = await res.json();
          if (data?.data?.timings) {
            const t = data.data.timings;
            const formatted = {
              Imsak: t.Imsak?.slice(0, 5) || '04:22',
              Subuh: t.Fajr?.slice(0, 5) || '04:32',
              Terbit: t.Sunrise?.slice(0, 5) || '05:45',
              Dzuhur: t.Dhuhr?.slice(0, 5) || '11:53',
              Ashar: t.Asr?.slice(0, 5) || '15:11',
              Maghrib: t.Maghrib?.slice(0, 5) || '17:58',
              Isya: t.Isha?.slice(0, 5) || '19:07'
            };
            setPrayerTimes(formatted);
            localStorage.setItem('dt_prayer_cache_v2', JSON.stringify(formatted));

            if (data.data.date?.hijri) {
              const h = data.data.date.hijri;
              const hStr = `${h.day} ${h.month.en} ${h.year} H`;
              setHijriDate(hStr);
              localStorage.setItem('dt_hijri_date', hStr);
            }
          }
        } catch (err) {
          console.warn('Using cached or default prayer times', err);
        }
      }, [prayerCity]);

      useEffect(() => {
        fetchPrayers(prayerCity);
      }, [prayerCity, fetchPrayers]);

      // Calculate Next, Current, and Detailed Prayer list with real-time countdown
      const detailedPrayers = useMemo(() => {
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentSeconds = now.getSeconds();
        const currentTotalSec = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

        const list = PRAYER_DEFINITIONS.map(def => {
          const time = prayerTimes[def.key] || '00:00';
          const [h, m] = time.split(':').map(Number);
          const pSec = (h || 0) * 3600 + (m || 0) * 60;
          return {
            ...def,
            time,
            pSec
          };
        });

        // Determine Next Prayer
        let nextPrayer = null;
        let targetTotalSec = 0;
        let isTomorrow = false;

        for (const p of list) {
          if (p.pSec > currentTotalSec) {
            nextPrayer = p;
            targetTotalSec = p.pSec;
            break;
          }
        }

        if (!nextPrayer) {
          // If all prayers passed today, next is tomorrow morning (Imsak / Subuh)
          nextPrayer = list[0]; // Imsak
          targetTotalSec = (24 * 3600) + list[0].pSec;
          isTomorrow = true;
        }

        // Determine Current Prayer (the one that has started most recently)
        let currentPrayer = null;
        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i].pSec <= currentTotalSec) {
            currentPrayer = list[i];
            break;
          }
        }
        if (!currentPrayer) {
          // Early morning before Imsak -> Isya from last night
          currentPrayer = list[list.length - 1]; // Isya
        }

        const diffSec = Math.max(0, targetTotalSec - currentTotalSec);
        const diffH = Math.floor(diffSec / 3600);
        const diffM = Math.floor((diffSec % 3600) / 60);
        const diffS = diffSec % 60;

        const pad = (n) => String(n).padStart(2, '0');
        const countdownStr = `${pad(diffH)}:${pad(diffM)}:${pad(diffS)}`;
        const humanCountdown = `${diffH > 0 ? `${diffH}j ` : ''}${diffM}m ${diffS}d`;

        // Today's timeline progress percent (0 - 100%)
        const dayProgress = Math.min(100, Math.max(0, Math.round((currentTotalSec / 86400) * 100)));

        const mappedList = list.map(item => {
          let status = 'upcoming';
          if (item.key === nextPrayer.key) {
            status = 'next';
          } else if (item.key === currentPrayer?.key && !isTomorrow) {
            status = 'current';
          } else if (item.pSec < currentTotalSec) {
            status = 'passed';
          }

          let countdownText = '';
          if (status === 'next') {
            countdownText = `-${countdownStr}`;
          } else if (status === 'current') {
            const elapsedSec = currentTotalSec - item.pSec;
            const elH = Math.floor(elapsedSec / 3600);
            const elM = Math.floor((elapsedSec % 3600) / 60);
            countdownText = elH > 0 ? `${elH}j ${elM}m lalu` : `${elM}m lalu`;
          } else if (status === 'passed') {
            countdownText = 'Selesai';
          } else {
            const waitSec = item.pSec - currentTotalSec;
            const wH = Math.floor(waitSec / 3600);
            const wM = Math.floor((waitSec % 3600) / 60);
            countdownText = `dalam ${wH > 0 ? `${wH}j ` : ''}${wM}m`;
          }

          return {
            ...item,
            status,
            countdownText
          };
        });

        return {
          items: mappedList,
          nextPrayer,
          currentPrayer,
          countdownStr,
          humanCountdown,
          isTomorrow,
          dayProgress
        };
      }, [now, prayerTimes]);

      // Sync top header pill state
      useEffect(() => {
        setNextPrayerInfo({
          name: detailedPrayers.nextPrayer?.name || 'Subuh',
          time: detailedPrayers.nextPrayer?.time || '04:32',
          countdown: detailedPrayers.countdownStr,
          humanCountdown: detailedPrayers.humanCountdown,
          currentName: detailedPrayers.currentPrayer?.name || 'Isya',
          isTomorrow: detailedPrayers.isTomorrow
        });
      }, [detailedPrayers]);

      const handleCityChange = (newCity) => {
        setPrayerCity(newCity);
        localStorage.setItem('dt_prayer_city', newCity);
      };

      const handleLayoutChange = (newLayout) => {
        setPrayerLayout(newLayout);
        localStorage.setItem('dt_prayer_layout', newLayout);
      };

      const openMonthlyCalendar = async () => {
        setShowMonthlyModal(true);
        if (monthlySchedule.length > 0) return;
        setLoadingMonthly(true);
        try {
          const month = now.getMonth() + 1;
          const year = now.getFullYear();
          const res = await fetch(`https://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(prayerCity)}&country=Indonesia&method=11&month=${month}&year=${year}`);
          const data = await res.json();
          if (Array.isArray(data?.data)) {
            setMonthlySchedule(data.data);
          }
        } catch (e) {
          console.warn('Error fetching monthly prayer schedule', e);
        } finally {
          setLoadingMonthly(false);
        }
      };

      const copyMonthlySchedule = () => {
        if (!monthlySchedule.length) return;
        const locale = language === 'id' ? 'id-ID' : 'en-US';
        const scheduleTitle = language === 'id' ? 'Jadwal Sholat' : 'Prayer Schedule';
        const headers = language === 'id'
          ? 'Tgl\tHari\tImsak\tSubuh\tTerbit\tDzuhur\tAshar\tMaghrib\tIsya'
          : 'Date\tDay\tImsak\tFajr\tSunrise\tDhuhr\tAsr\tMaghrib\tIsha';
        let text = `${scheduleTitle} ${prayerCity} (${activeCityInfo.tz}) - ${now.toLocaleString(locale, { month: 'long', year: 'numeric' })}\n`;
        text += `${headers}\n`;
        monthlySchedule.forEach((day, idx) => {
          const t = day.timings;
          text += `${idx + 1}\t${day.date?.gregorian?.weekday?.en || ''}\t${t.Imsak?.slice(0, 5)}\t${t.Fajr?.slice(0, 5)}\t${t.Sunrise?.slice(0, 5)}\t${t.Dhuhr?.slice(0, 5)}\t${t.Asr?.slice(0, 5)}\t${t.Maghrib?.slice(0, 5)}\t${t.Isha?.slice(0, 5)}\n`;
        });
        navigator.clipboard.writeText(text);
        setCopyScheduleCopied(true);
        setTimeout(() => setCopyScheduleCopied(false), 1500);
      };

      // Helper to render prayer icons
      const renderPrayerIcon = (iconName, className = "w-4 h-4") => {
        if (iconName === 'Sunrise') return <Icons.Sunrise className={className} />;
        if (iconName === 'Sunset') return <Icons.Sunset className={className} />;
        if (iconName === 'Moon') return <Icons.Moon className={className} />;
        if (iconName === 'Sparkles') return <Icons.Sparkles className={className} />;
        return <Icons.Sun className={className} />;
      };

      // 3. Currency Widget (USD -> IDR) State
      const [currencyRate, setCurrencyRate] = useState(() => {
        const saved = localStorage.getItem('dt_usd_idr_cache');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Date.now() - parsed.timestamp < 3600000) return parsed.rate;
          } catch (e) {}
        }
        return 16250;
      });
      const [showCurrencyPopover, setShowCurrencyPopover] = useState(false);
      const [calcUsd, setCalcUsd] = useState('1');
      const [calcIdr, setCalcIdr] = useState(() => String(16250));

      useEffect(() => {
        const fetchCurrency = async () => {
          try {
            const res = await fetch('https://open.er-api.com/v6/latest/USD');
            const data = await res.json();
            if (data?.rates?.IDR) {
              const rate = Math.round(data.rates.IDR);
              setCurrencyRate(rate);
              localStorage.setItem('dt_usd_idr_cache', JSON.stringify({ rate, timestamp: Date.now() }));
            }
          } catch (e) {
            console.warn('Currency rate fetch fallback to local value', e);
          }
        };
        fetchCurrency();
      }, []);

      const handleUsdChange = (val) => {
        setCalcUsd(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
          setCalcIdr(Math.round(num * currencyRate).toString());
        } else {
          setCalcIdr('');
        }
      };

      const handleIdrChange = (val) => {
        setCalcIdr(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
          setCalcUsd((num / currencyRate).toFixed(2));
        } else {
          setCalcUsd('');
        }
      };

      // 4. Custom Background Engine State
      const [bgConfig, setBgConfig] = useState(() => {
        const saved = localStorage.getItem('dt_bg_config');
        return saved ? JSON.parse(saved) : {
          type: 'solid', // 'solid', 'custom'
          url: '',
          dimmer: 40, // 0 - 90
          blur: 0,    // 0 - 10px
        };
      });
      const [showBgDrawer, setShowBgDrawer] = useState(false);

      const updateBgConfig = (updates) => {
        const updated = { ...bgConfig, ...updates };
        setBgConfig(updated);
        localStorage.setItem('dt_bg_config', JSON.stringify(updated));
      };

      const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            updateBgConfig({ type: 'custom', url: reader.result });
          };
          reader.readAsDataURL(file);
        }
      };

      // 5. Multi-Engine Search State
      const [searchQuery, setSearchQuery] = useState('');
      const searchInputRef = useRef(null);

      // Search engine prefix detection
      const activeEngine = useMemo(() => {
        const q = searchQuery;
        if (q.startsWith('gh ')) return { name: 'GitHub', prefix: 'gh ', url: 'https://github.com/search?q=' };
        if (q.startsWith('dev ')) return { name: 'DevDocs', prefix: 'dev ', url: 'https://devdocs.io/#q=' };
        if (q.startsWith('so ')) return { name: 'Stack Overflow', prefix: 'so ', url: 'https://stackoverflow.com/search?q=' };
        if (q.startsWith('yt ')) return { name: 'YouTube', prefix: 'yt ', url: 'https://www.youtube.com/results?search_query=' };
        return { name: 'Google', prefix: '', url: 'https://www.google.com/search?q=' };
      }, [searchQuery]);

      const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (!trimmed) return;
        const actualQuery = activeEngine.prefix ? trimmed.slice(activeEngine.prefix.length).trim() : trimmed;
        if (!actualQuery) return;
        window.location.href = `${activeEngine.url}${encodeURIComponent(actualQuery)}`;
      };

      // 6. Command Palette (Cmd+K / Ctrl+K / /)
      const [showCmdPalette, setShowCmdPalette] = useState(false);
      const [cmdQuery, setCmdQuery] = useState('');
      const [cmdSelectedIndex, setCmdSelectedIndex] = useState(0);

      // --- MUSIC PLAYER STATE (VINYL TURNTABLE) ---
      const [showMusicPlayer, setShowMusicPlayer] = useState(() => {
        return localStorage.getItem('dt_show_music') !== 'false';
      });
      const [musicInfo, setMusicInfo] = useState({
        title: 'Lofi Study Session',
        artist: 'Chill Vinyl Deck',
        isPlaying: false,
        color: '#10b981'
      });
      const [externalMusicPlaying, setExternalMusicPlaying] = useState(null);

      const handleMusicInfoChange = useCallback((info) => {
        setMusicInfo(prev => {
          const isSame = prev.title === info.title && prev.artist === info.artist && prev.isPlaying === info.isPlaying && prev.color === info.color;
          return isSame ? prev : info;
        });
      }, []);

      const toggleMusicPlayerVisibility = () => {
        setShowMusicPlayer(prev => {
          const nextVal = !prev;
          localStorage.setItem('dt_show_music', String(nextVal));
          return nextVal;
        });
      };

      // --- WORKSPACE & TAG CONFIGURATION STATE ---
      const [showWorkspaceManager, setShowWorkspaceManager] = useState(false);
      const [workspaceLayout, setWorkspaceLayout] = useState(() => {
        return localStorage.getItem('dt_workspace_layout') || 'grid';
      });
      const [openInNewTab, setOpenInNewTab] = useState(() => {
        return localStorage.getItem('dt_open_new_tab') !== 'false';
      });

      const handleChangeWorkspaceLayout = (mode) => {
        setWorkspaceLayout(mode);
        localStorage.setItem('dt_workspace_layout', mode);
      };

      const handleChangeOpenInNewTab = (val) => {
        setOpenInNewTab(val);
        localStorage.setItem('dt_open_new_tab', String(val));
      };

      // 7. Launcher Shortcuts State (CRUD)
      const [shortcuts, setShortcuts] = useState(() => {
        const saved = localStorage.getItem('dt_shortcuts');
        return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
      });
      const [shortcutQuery, setShortcutQuery] = useState('');
      const [shortcutCategory, setShortcutCategory] = useState('All');
      const [showShortcutModal, setShowShortcutModal] = useState(false);
      const [editingShortcut, setEditingShortcut] = useState(null);
      const [shortcutForm, setShortcutForm] = useState({ title: '', url: '', category: 'Dev', key: '' });

      const shortcutCategories = useMemo(
        () => [...new Set(shortcuts.map(shortcut => shortcut.category || 'General'))].sort(),
        [shortcuts]
      );

      // Tag counts for tab badges
      const tagCounts = useMemo(() => {
        const counts = { All: shortcuts.length };
        shortcuts.forEach(s => {
          const cat = s.category || 'General';
          counts[cat] = (counts[cat] || 0) + 1;
        });
        return counts;
      }, [shortcuts]);

      const filteredShortcuts = useMemo(() => {
        const query = shortcutQuery.trim().toLowerCase();
        return shortcuts.filter(shortcut => {
          const matchesCategory = shortcutCategory === 'All' || (shortcut.category || 'General') === shortcutCategory;
          const matchesQuery = !query || `${shortcut.title} ${shortcut.category} ${shortcut.url}`.toLowerCase().includes(query);
          return matchesCategory && matchesQuery;
        });
      }, [shortcuts, shortcutQuery, shortcutCategory]);

      const saveShortcuts = (newList) => {
        setShortcuts(newList);
        localStorage.setItem('dt_shortcuts', JSON.stringify(newList));
      };

      const handleQuickAddTag = () => {
        const name = window.prompt(
          language === 'id'
            ? 'Masukkan nama Tag / Kategori baru untuk workspace:'
            : 'Enter new Tag / Category name for workspace:'
        );
        if (!name || !name.trim()) return;
        const trimmed = name.trim();
        if (!shortcutCategories.includes(trimmed)) {
          const newShortcut = {
            id: Date.now().toString(),
            title: `${trimmed} Home`,
            url: 'https://',
            category: trimmed,
            key: null
          };
          saveShortcuts([...shortcuts, newShortcut]);
        }
        setShortcutCategory(trimmed);
      };

      const handleResetShortcuts = () => {
        saveShortcuts(DEFAULT_SHORTCUTS);
        setShortcutCategory('All');
      };

      const handleOpenShortcutModal = (item = null) => {
        if (item) {
          setEditingShortcut(item);
          setShortcutForm({ title: item.title, url: item.url, category: item.category, key: item.key || '' });
        } else {
          setEditingShortcut(null);
          setShortcutForm({ title: '', url: 'https://', category: 'Dev', key: '' });
        }
        setShowShortcutModal(true);
      };

      const handleSaveShortcut = (e) => {
        e.preventDefault();
        if (!shortcutForm.title || !shortcutForm.url) return;
        if (editingShortcut) {
          const updated = shortcuts.map(s => s.id === editingShortcut.id ? { ...s, ...shortcutForm } : s);
          saveShortcuts(updated);
        } else {
          const newItem = {
            id: Date.now().toString(),
            title: shortcutForm.title,
            url: shortcutForm.url,
            category: shortcutForm.category || 'General',
            key: shortcutForm.key || null
          };
          saveShortcuts([...shortcuts, newItem]);
        }
        setShowShortcutModal(false);
      };

      const handleDeleteShortcut = (id) => {
        const filtered = shortcuts.filter(s => s.id !== id);
        saveShortcuts(filtered);
      };

      // 8. Port Status Checker
      const [portStatuses, setPortStatuses] = useState({
        3000: 'idle',
        8000: 'idle',
        5173: 'idle',
        8080: 'idle'
      });
      const [checkingPorts, setCheckingPorts] = useState(false);

      const checkLocalhostPorts = useCallback(async () => {
        setCheckingPorts(true);
        const ports = [3000, 8000, 5173, 8080];
        const newStatuses = {};

        for (const port of ports) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1200);
            
            // Fetching localhost with no-cors: Active port returns opaque response (status 0).
            // Inactive port will reject with TypeError: Failed to fetch or AbortError!
            await fetch(`http://127.0.0.1:${port}`, {
              mode: 'no-cors',
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            newStatuses[port] = 'online';
          } catch (err) {
            newStatuses[port] = 'offline';
          }
        }
        setPortStatuses(newStatuses);
        setCheckingPorts(false);
      }, []);

      // 9. Quick Scratchpad
      const [scratchpad, setScratchpad] = useState(() => {
        return localStorage.getItem('dt_scratchpad_content') || '# Quick Dev Scratchpad\n- Key endpoints to test:\n- JWT Bearer tokens & payloads';
      });
      const [scratchpadCopied, setScratchpadCopied] = useState(false);

      const handleScratchpadChange = (e) => {
        const val = e.target.value;
        setScratchpad(val);
        localStorage.setItem('dt_scratchpad_content', val);
      };

      const copyScratchpad = () => {
        navigator.clipboard.writeText(scratchpad);
        setScratchpadCopied(true);
        setTimeout(() => setScratchpadCopied(false), 1500);
      };

      const wordCount = useMemo(() => {
        const trimmed = scratchpad.trim();
        return trimmed ? trimmed.split(/\s+/).length : 0;
      }, [scratchpad]);

      // 10. Sprint Todo List
      const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem('dt_sprint_todos');
        return saved ? JSON.parse(saved) : [
          { id: 't1', text: 'Refactor DB Connection Pool in API Gateway', priority: 'High', done: false },
          { id: 't2', text: 'Update Next.js middleware headers for CORS', priority: 'Med', done: true },
          { id: 't3', text: 'Profile Redis cache hit-ratio on staging', priority: 'Low', done: false }
        ];
      });
      const [newTodoText, setNewTodoText] = useState('');
      const [newTodoPriority, setNewTodoPriority] = useState('High');

      const saveTodos = (newTodoList) => {
        setTodos(newTodoList);
        localStorage.setItem('dt_sprint_todos', JSON.stringify(newTodoList));
      };

      const addTodo = (e) => {
        e.preventDefault();
        if (!newTodoText.trim()) return;
        const task = {
          id: Date.now().toString(),
          text: newTodoText.trim(),
          priority: newTodoPriority,
          done: false
        };
        saveTodos([task, ...todos]);
        setNewTodoText('');
      };

      const toggleTodo = (id) => {
        const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
        saveTodos(updated);
      };

      const removeTodo = (id) => {
        saveTodos(todos.filter(t => t.id !== id));
      };

      const todoStats = useMemo(() => {
        const total = todos.length;
        const completed = todos.filter(t => t.done).length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, percent };
      }, [todos]);

      // 11. Pomodoro Focus Timer
      const [pomoMode, setPomoMode] = useState('work'); // 'work' (25m), 'short' (5m), 'long' (15m)
      const [pomoSecondsLeft, setPomoSecondsLeft] = useState(25 * 60);
      const [pomoRunning, setPomoRunning] = useState(false);

      useEffect(() => {
        let interval = null;
        if (pomoRunning) {
          interval = setInterval(() => {
            setPomoSecondsLeft(prev => {
              if (prev <= 1) {
                playNotificationBeep();
                setPomoRunning(false);
                return pomoMode === 'work' ? 5 * 60 : 25 * 60;
              }
              return prev - 1;
            });
          }, 1000);
        }
        return () => clearInterval(interval);
      }, [pomoRunning, pomoMode]);

      const setPomodoroMode = (mode) => {
        setPomoMode(mode);
        setPomoRunning(false);
        if (mode === 'work') setPomoSecondsLeft(25 * 60);
        if (mode === 'short') setPomoSecondsLeft(5 * 60);
        if (mode === 'long') setPomoSecondsLeft(15 * 60);
      };

      const formatPomoTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      };

      // 12. Dev Toolbox Modal State
      const [showDevToolbox, setShowDevToolbox] = useState(false);
      const [toolboxTab, setToolboxTab] = useState('json'); // 'json', 'base64', 'uuid'
      
      // JSON Formatter
      const [jsonInput, setJsonInput] = useState('{\n  "status": "success",\n  "code": 200,\n  "data": {"user": "lead_architect"}\n}');
      const [jsonError, setJsonError] = useState('');
      const [jsonCopied, setJsonCopied] = useState(false);

      const formatJson = (spaces = 2) => {
        try {
          const parsed = JSON.parse(jsonInput);
          setJsonInput(JSON.stringify(parsed, null, spaces));
          setJsonError('');
        } catch (err) {
          setJsonError(err.message);
        }
      };

      const minifyJson = () => {
        try {
          const parsed = JSON.parse(jsonInput);
          setJsonInput(JSON.stringify(parsed));
          setJsonError('');
        } catch (err) {
          setJsonError(err.message);
        }
      };

      // Base64 Converter
      const [b64Input, setB64Input] = useState('Authorization: Bearer dev-secret-token');
      const [b64Output, setB64Output] = useState('');
      const [b64Mode, setB64Mode] = useState('encode'); // 'encode', 'decode'

      useEffect(() => {
        try {
          if (!b64Input) {
            setB64Output('');
            return;
          }
          if (b64Mode === 'encode') {
            setB64Output(btoa(unescape(encodeURIComponent(b64Input))));
          } else {
            setB64Output(decodeURIComponent(escape(atob(b64Input))));
          }
        } catch (e) {
          setB64Output('Invalid format for conversion: ' + e.message);
        }
      }, [b64Input, b64Mode]);

      // UUID Generator
      const [uuidCount, setUuidCount] = useState(5);
      const [generatedUuids, setGeneratedUuids] = useState([]);
      const [uuidCopied, setUuidCopied] = useState(false);

      const generateUuids = () => {
        const arr = [];
        for (let i = 0; i < uuidCount; i++) {
          arr.push(crypto.randomUUID ? crypto.randomUUID() : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
          ));
        }
        setGeneratedUuids(arr);
      };

      useEffect(() => {
        if (toolboxTab === 'uuid' && generatedUuids.length === 0) {
          generateUuids();
        }
      }, [toolboxTab]);

      // 13. Global Keyboard Shortcuts Handler (Cmd+K, 1-9 shortcuts, etc.)
      useEffect(() => {
        const handleKeyDown = (e) => {
          // Check if user is typing in an input or textarea
          const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

          // Cmd+K or Ctrl+K or '/' to toggle command palette
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            setShowCmdPalette(prev => !prev);
            return;
          }

          if (e.key === '/' && !isInputFocused) {
            e.preventDefault();
            setShowCmdPalette(true);
            return;
          }

          // Number keys 1-9 for quick link jump when not in input
          if (!isInputFocused && !e.metaKey && !e.ctrlKey && !e.altKey) {
            if (/^[1-9]$/.test(e.key)) {
              const matched = shortcuts.find(s => s.key === e.key);
              if (matched) {
                e.preventDefault();
                window.location.href = matched.url;
              }
            }
          }

          // Escape key closes modals
          if (e.key === 'Escape') {
            setShowCmdPalette(false);
            setShowDevToolbox(false);
            setShowShortcutModal(false);
            setShowBgDrawer(false);
            setShowCurrencyPopover(false);
          }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [shortcuts]);

      // Focus search input on start
      useEffect(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, []);

      // 14. Command Palette Actions Registry
      const commandItems = useMemo(() => {
        const baseActions = [
          {
            id: 'act-toolbox',
            title: 'Open Dev Toolbox (JSON, Base64, UUID)',
            category: 'Dev Utility',
            action: () => { setShowDevToolbox(true); setShowCmdPalette(false); }
          },
          {
            id: 'act-ports',
            title: 'Scan Localhost Port Statuses (3000, 8000, 5173, 8080)',
            category: 'Diagnostic',
            action: () => { checkLocalhostPorts(); setShowCmdPalette(false); }
          },
          {
            id: 'act-bg',
            title: 'Customize Wallpaper & Dimmer Overlay',
            category: 'Appearance',
            action: () => { setShowBgDrawer(true); setShowCmdPalette(false); }
          },
          {
            id: 'act-currency',
            title: 'Open USD to IDR Quick Converter',
            category: 'Finance',
            action: () => { setShowCurrencyPopover(true); setShowCmdPalette(false); }
          },
          {
            id: 'act-new-link',
            title: 'Add New Custom Bookmark Shortcut',
            category: 'Bookmarks',
            action: () => { handleOpenShortcutModal(); setShowCmdPalette(false); }
          },
          {
            id: 'act-focus-search',
            title: 'Focus Main Search Bar',
            category: 'Navigation',
            action: () => { searchInputRef.current?.focus(); setShowCmdPalette(false); }
          }
        ];

        const shortcutActions = shortcuts.map(s => ({
          id: `link-${s.id}`,
          title: `Go to ${s.title} (${s.url})`,
          category: `Shortcut [${s.category}]`,
          action: () => { window.location.href = s.url; }
        }));

        const all = [...baseActions, ...shortcutActions];
        if (!cmdQuery.trim()) return all;
        const q = cmdQuery.toLowerCase();
        return all.filter(item =>
          translateUiText(item.title, language).toLowerCase().includes(q) ||
          translateUiText(item.category, language).toLowerCase().includes(q)
        );
      }, [shortcuts, cmdQuery, checkLocalhostPorts, language]);

      // Command palette keyboard navigation
      const handleCmdKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCmdSelectedIndex(prev => (prev + 1) % (commandItems.length || 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCmdSelectedIndex(prev => (prev - 1 + commandItems.length) % (commandItems.length || 1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (commandItems[cmdSelectedIndex]) {
            commandItems[cmdSelectedIndex].action();
          }
        }
      };

      // Formatted date string
      const dateString = useMemo(() => {
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        return now.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', options);
      }, [now, language]);

      const timeString = useMemo(() => {
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        return `${h}:${m}:${s}`;
      }, [now]);

      return localizeNode((
        <div className="relative min-h-screen text-zinc-100 flex flex-col justify-between selection:bg-zinc-800">
          
          {/* BACKGROUND LAYER */}
          {bgConfig.type === 'custom' && bgConfig.url ? (
            <div 
              className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300 pointer-events-none z-0"
              style={{
                backgroundImage: `url(${bgConfig.url})`,
                filter: `blur(${bgConfig.blur}px)`
              }}
            />
          ) : (
            <div className="fixed inset-0 bg-zinc-950 backdrop-noise pointer-events-none z-0" />
          )}

          {/* BACKGROUND DIMMER OVERLAY */}
          {bgConfig.type === 'custom' && (
            <div 
              className="fixed inset-0 bg-black pointer-events-none transition-opacity duration-200 z-0"
              style={{ opacity: bgConfig.dimmer / 100 }}
            />
          )}

          {/* TOP NAVBAR (NAV DI ATAS) */}
          <Navbar
            language={language}
            onLanguageChange={handleLanguageChange}
            onOpenWorkspaceManager={() => setShowWorkspaceManager(true)}
            onToggleMusicPlayer={toggleMusicPlayerVisibility}
            isMusicPlayerOpen={showMusicPlayer}
            musicInfo={musicInfo}
            onToggleMusicPlay={() => setExternalMusicPlaying(prev => !musicInfo.isPlaying)}
            currencyRate={currencyRate}
            showCurrencyPopover={showCurrencyPopover}
            onToggleCurrencyPopover={() => setShowCurrencyPopover(!showCurrencyPopover)}
            onOpenDevToolbox={() => setShowDevToolbox(true)}
            onOpenWallpaperSettings={() => setShowBgDrawer(true)}
            onOpenCmdPalette={() => setShowCmdPalette(true)}
          />

          {/* MAIN CONTENT CONTAINER */}
          <div className="app-shell relative z-10 flex flex-col flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
            
            {/* Popover Currency Converter (dari Navbar) */}
            {showCurrencyPopover && (
              <div className="fixed top-14 right-4 sm:right-16 z-50 w-72 bg-zinc-900 border border-zinc-700/80 rounded-xl p-4 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Icons.DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Quick FX Calculator
                  </span>
                  <button 
                    onClick={() => setShowCurrencyPopover(false)}
                    className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded"
                  >
                    <Icons.X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">USD Amount ($)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-zinc-500">$</span>
                      <input 
                        type="number"
                        value={calcUsd}
                        onChange={(e) => handleUsdChange(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-1.5 pl-6 pr-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/60"
                        placeholder="1.00"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center text-zinc-500 py-0.5">
                    <Icons.ArrowLeftRight className="w-3.5 h-3.5" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">IDR Amount (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-zinc-500 text-[10px]">Rp</span>
                      <input 
                        type="number"
                        value={calcIdr}
                        onChange={(e) => handleIdrChange(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-1.5 pl-8 pr-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/60"
                        placeholder="16000"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500">
                    <span>Live cached rate:</span>
                    <span className="font-semibold text-zinc-300">1 USD = {currencyRate.toLocaleString('id-ID')} IDR</span>
                  </div>
                </div>
              </div>
            )}


            {/* 2. CENTER SECTION: CLOCK & MULTI-ENGINE SEARCH */}
            <section className="my-8 flex flex-col items-center justify-center text-center">
              
              {/* Digital Clock */}
              <div className="font-mono tracking-tight select-none">
                <div className="text-5xl sm:text-7xl font-bold tracking-tighter text-zinc-100 flex items-baseline justify-center">
                  <span>{timeString}</span>
                </div>
                <div className="mt-1 text-sm font-sans tracking-wide text-zinc-400 font-medium">
                  {dateString}
                </div>
              </div>

              {/* Floating Multi-Engine Search Bar */}
              <div className="mt-7 w-full max-w-2xl relative">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Icons.Search className="w-4 h-4" />
                  </div>

                  {/* Prefix Engine Visual Tag */}
                  {activeEngine.prefix && (
                    <div className="absolute left-10 flex items-center gap-1 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded text-[11px] font-mono font-medium text-emerald-400">
                      <span>{activeEngine.name}</span>
                    </div>
                  )}

                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      activeEngine.prefix
                        ? (language === 'id' ? `Cari dengan ${activeEngine.name}...` : `Search with ${activeEngine.name}...`)
                        : (language === 'id'
                          ? "Cari di Google, atau gunakan prefix 'gh ', 'dev ', 'so ', 'yt '..."
                          : "Search Google, or prefix with 'gh ', 'dev ', 'so ', 'yt '...")
                    }
                    className={`w-full bg-zinc-900/95 border border-zinc-800 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 rounded-xl py-3.5 pr-20 text-sm text-zinc-100 placeholder-zinc-500 shadow-xl transition focus:outline-none ${
                      activeEngine.prefix ? 'pl-36' : 'pl-11'
                    }`}
                  />

                  <div className="absolute right-3 flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                    <span className="bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60">Enter ↵</span>
                  </div>
                </form>

                {/* Quick Hint Chips for prefixes */}
                <div className="flex items-center justify-center gap-2 mt-2.5 text-[11px] text-zinc-500 font-mono">
                  <span>Prefixes:</span>
                  <button type="button" onClick={() => { setSearchQuery('gh '); searchInputRef.current?.focus(); }} className="hover:text-zinc-300 underline decoration-zinc-700">gh (GitHub)</button>
                  <span>•</span>
                  <button type="button" onClick={() => { setSearchQuery('dev '); searchInputRef.current?.focus(); }} className="hover:text-zinc-300 underline decoration-zinc-700">dev (DevDocs)</button>
                  <span>•</span>
                  <button type="button" onClick={() => { setSearchQuery('so '); searchInputRef.current?.focus(); }} className="hover:text-zinc-300 underline decoration-zinc-700">so (StackOverflow)</button>
                  <span>•</span>
                  <button type="button" onClick={() => { setSearchQuery('yt '); searchInputRef.current?.focus(); }} className="hover:text-zinc-300 underline decoration-zinc-700">yt (YouTube)</button>
                </div>
              </div>
            </section>

            {/* 3. CATEGORIZED LAUNCHER GRID (WORKSPACE PER TAG) */}
            <section className="workspace-layout" id="workspace-section">
              <div className="workspace-links min-w-0">
                
                {/* WORKSPACE TOOLBAR & CONTROLS */}
                <div className="workspace-toolbar pb-3 mb-3 border-b border-zinc-800/60 flex flex-col gap-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-mono tracking-wider text-zinc-200 font-bold flex items-center gap-1.5">
                        <Icons.LayoutGrid className="w-4 h-4 text-emerald-400" />
                        <span>{language === 'id' ? 'Workspace & Tautan' : 'Workspace & Quick Links'}</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {filteredShortcuts.length} / {shortcuts.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Search shortcut filter */}
                      <label className="shortcut-filter flex items-center gap-1.5">
                        <Icons.Search className="w-3.5 h-3.5 text-zinc-500" />
                        <input
                          type="search"
                          value={shortcutQuery}
                          onChange={(e) => setShortcutQuery(e.target.value)}
                          placeholder={language === 'id' ? 'Cari tautan...' : 'Filter links...'}
                          aria-label={language === 'id' ? 'Cari tautan' : 'Filter links'}
                        />
                      </label>

                      {/* Tombol Pengaturan Workspace per Tag (Dedicated) */}
                      <button
                        onClick={() => setShowWorkspaceManager(true)}
                        className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 transition px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 font-mono"
                        title={language === 'id' ? 'Atur Workspace & Kelola Tag' : 'Manage Workspace & Tags'}
                      >
                        <Icons.Settings className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline font-semibold">{language === 'id' ? 'Atur Workspace' : 'Settings'}</span>
                      </button>

                      {/* Tombol Tambah Shortcut */}
                      <button
                        onClick={() => handleOpenShortcutModal()}
                        className="flex items-center gap-1 text-xs text-zinc-200 hover:text-white transition px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-750 border border-zinc-700/60 font-sans"
                        title={language === 'id' ? 'Tambah shortcut baru' : 'Add shortcut'}
                      >
                        <Icons.Plus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{language === 'id' ? 'Tambah' : 'Add'}</span>
                      </button>
                    </div>
                  </div>

                  {/* WORKSPACE PER TAG - TAB BAR */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs scrollbar-none">
                    <button
                      onClick={() => setShortcutCategory('All')}
                      className={`tag-tab-pill px-3 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition ${
                        shortcutCategory === 'All'
                          ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      <span>{language === 'id' ? 'Semua' : 'All'}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        shortcutCategory === 'All' ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {tagCounts['All'] || shortcuts.length}
                      </span>
                    </button>

                    {shortcutCategories.map((category) => {
                      const count = tagCounts[category] || 0;
                      const isSelected = shortcutCategory === category;
                      return (
                        <button
                          key={category}
                          onClick={() => setShortcutCategory(category)}
                          className={`tag-tab-pill px-3 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap flex items-center gap-1.5 transition ${
                            isSelected
                              ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                              : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                          }`}
                        >
                          <span>{category}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            isSelected ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}

                    {/* Tombol Tambah Tag Cepat */}
                    <button
                      onClick={handleQuickAddTag}
                      className="tag-tab-pill px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-400 hover:text-emerald-300 bg-zinc-900/70 hover:bg-zinc-800 border border-dashed border-zinc-700/80 transition flex items-center gap-1 whitespace-nowrap"
                      title={language === 'id' ? 'Tambah tag kategori baru' : 'Add new tag category'}
                    >
                      <Icons.Plus className="w-3 h-3 text-emerald-400" />
                      <span>{language === 'id' ? 'Tag Baru' : 'New Tag'}</span>
                    </button>
                  </div>
                </div>

                {/* MODE 1: GRID VIEW (KARTU DEFAULT) */}
                {workspaceLayout === 'grid' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                    {filteredShortcuts.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-xl p-2.5 transition flex flex-col justify-between shadow-sm cursor-pointer hover:-translate-y-0.5"
                        onClick={() => window.open(item.url, openInNewTab ? '_blank' : '_self', 'noopener,noreferrer')}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                            {item.category || 'General'}
                          </span>
                          <div className="flex items-center gap-1">
                            {item.key && (
                              <span className="text-[9px] font-mono px-1 py-0.2 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                                {item.key}
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenShortcutModal(item);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-zinc-200 transition"
                              title="Edit Shortcut"
                            >
                              <Icons.Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteShortcut(item.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-500 hover:text-rose-400 transition"
                              title="Delete Shortcut"
                            >
                              <Icons.Trash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-2.5 flex items-center gap-2 min-w-0">
                          <span className="shortcut-icon" aria-hidden="true">
                            <span className="shortcut-icon-fallback">{item.title.trim().charAt(0).toUpperCase() || '?'}</span>
                            {getShortcutFaviconUrl(item.url) && (
                              <img
                                src={getShortcutFaviconUrl(item.url)}
                                alt=""
                                loading="lazy"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            )}
                          </span>
                          <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate min-w-0 flex-1">
                            {item.title}
                          </span>
                          <Icons.ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* MODE 2: COMPACT LIST VIEW */}
                {workspaceLayout === 'compact' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {filteredShortcuts.map((item) => (
                      <div
                        key={item.id}
                        className="group flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer text-xs"
                        onClick={() => window.open(item.url, openInNewTab ? '_blank' : '_self', 'noopener,noreferrer')}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="shortcut-icon w-6 h-6 text-[10px]" aria-hidden="true">
                            <span className="shortcut-icon-fallback">{item.title.trim().charAt(0).toUpperCase() || '?'}</span>
                            {getShortcutFaviconUrl(item.url) && (
                              <img
                                src={getShortcutFaviconUrl(item.url)}
                                alt=""
                                loading="lazy"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            )}
                          </span>
                          <span className="font-semibold text-zinc-200 truncate">{item.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                            {item.category || 'General'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {item.key && (
                            <span className="text-[9px] font-mono px-1 py-0.2 bg-zinc-800 text-zinc-400 rounded">
                              {item.key}
                            </span>
                          )}
                          <Icons.ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-300 transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* MODE 3: MINIMAL CHIPS VIEW */}
                {workspaceLayout === 'minimal' && (
                  <div className="flex flex-wrap gap-2">
                    {filteredShortcuts.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => window.open(item.url, openInNewTab ? '_blank' : '_self', 'noopener,noreferrer')}
                        className="tag-tab-pill flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-850 text-xs cursor-pointer shadow-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="font-semibold text-zinc-200">{item.title}</span>
                        <span className="text-[9px] font-mono text-zinc-500">[{item.category}]</span>
                      </div>
                    ))}
                  </div>
                )}

                {filteredShortcuts.length === 0 && (
                  <div className="col-span-full rounded-xl border border-dashed border-zinc-700/80 px-4 py-8 text-center text-xs text-zinc-500">
                    {language === 'id' ? 'Shortcut tidak ditemukan. Coba kata kunci atau kategori lain.' : 'No shortcuts found. Try another search or category.'}
                  </div>
                )}

                {/* COMPACT VINYL AUDIO PLAYER TERSELIP DI BAWAH WORKSPACE LINKS */}
                <VinylMusicPlayer
                  language={language}
                  isOpen={showMusicPlayer}
                  onClose={() => setShowMusicPlayer(false)}
                  onTrackChange={handleMusicInfoChange}
                  externalIsPlaying={externalMusicPlaying}
                  onTogglePlay={(playing) => setMusicInfo(prev => ({ ...prev, isPlaying: playing }))}
                />
              </div>


              <aside className="prayer-widget" aria-label={language === 'id' ? 'Jadwal waktu salat' : 'Prayer times'}>
                <div className="prayer-widget-heading">
                  <div>
                    <div className="prayer-widget-title">
                      <Icons.Compass className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'id' ? 'Waktu Salat' : 'Prayer times'}</span>
                    </div>
                    <p>{hijriDate}</p>
                  </div>
                  <span className="prayer-live-dot" title={language === 'id' ? 'Jadwal diperbarui' : 'Schedule updated'} />
                </div>
                <label className="prayer-city-select">
                  <span>{language === 'id' ? 'Lokasi' : 'Location'}</span>
                  <select value={prayerCity} onChange={(e) => handleCityChange(e.target.value)} aria-label={language === 'id' ? 'Pilih kota' : 'Choose city'}>
                    {INDONESIAN_CITIES.map(city => <option key={city.city} value={city.city}>{city.label}</option>)}
                  </select>
                </label>
                <div className="prayer-next">
                  <span>{language === 'id' ? 'Berikutnya' : 'Next'} · {nextPrayerInfo.name}</span>
                  <strong>{nextPrayerInfo.countdown}</strong>
                </div>
                <table className="prayer-times-table">
                  <tbody>
                    {detailedPrayers.items.map(prayer => (
                      <tr key={prayer.key} className={prayer.status === 'next' ? 'is-next' : ''}>
                        <th scope="row">{prayer.name}</th>
                        <td>{prayer.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="prayer-widget-footer">
                  <span>{activeCityInfo.tz} · {dateString}</span>
                  <button type="button" onClick={() => fetchPrayers(prayerCity)} title={language === 'id' ? 'Perbarui jadwal' : 'Refresh schedule'}>
                    <Icons.RefreshCw className="w-3 h-3" />
                    <span>{language === 'id' ? 'Perbarui' : 'Refresh'}</span>
                  </button>
                </div>
              </aside>
            </section>

            {/* 4. INTEGRATED DEV UTILITIES & PANELS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* PANEL 1: Quick Scratchpad */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Icons.Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-zinc-200">Dev Scratchpad</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={copyScratchpad}
                      className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-100 px-1.5 py-0.5 rounded hover:bg-zinc-800 transition"
                    >
                      {scratchpadCopied ? <Icons.Check className="w-3 h-3 text-emerald-400" /> : <Icons.Copy className="w-3 h-3" />}
                      <span>{scratchpadCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => { setScratchpad(''); localStorage.removeItem('dt_scratchpad_content'); }}
                      className="text-[11px] font-mono text-zinc-500 hover:text-rose-400 px-1.5 py-0.5 rounded hover:bg-zinc-800 transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <textarea
                  value={scratchpad}
                  onChange={handleScratchpadChange}
                  placeholder="Paste snippets, temporary keys, API routes..."
                  className="w-full flex-grow h-36 bg-zinc-950 border border-zinc-800/80 rounded-lg p-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700 resize-none"
                />

                <div className="flex items-center justify-between pt-2 text-[10px] text-zinc-500 font-mono">
                  <span>Auto-saved to storage</span>
                  <span>{wordCount} {language === 'id' ? 'kata' : 'words'} • {scratchpad.length} {language === 'id' ? 'karakter' : 'chars'}</span>
                </div>
              </div>

              {/* PANEL 2: Sprint Todo List */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Icons.CheckSquare className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-zinc-200">Sprint Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-400">{todoStats.completed}/{todoStats.total}</span>
                    <div className="w-14 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-1.5 transition-all duration-300"
                        style={{ width: `${todoStats.percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Todo items scroll list */}
                <div className="h-32 overflow-y-auto space-y-1.5 pr-1">
                  {todos.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-600 font-mono">No sprint tasks yet.</div>
                  ) : (
                    todos.map((todo) => (
                      <div 
                        key={todo.id}
                        className="group flex items-center justify-between p-1.5 rounded hover:bg-zinc-850 border border-transparent hover:border-zinc-800 transition text-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <button
                            onClick={() => toggleTodo(todo.id)}
                            className="text-zinc-500 hover:text-indigo-400 flex-shrink-0"
                          >
                            {todo.done ? <Icons.CheckSquare className="w-3.5 h-3.5 text-indigo-400" /> : <Icons.Square className="w-3.5 h-3.5" />}
                          </button>
                          <span className={`truncate text-[11px] ${todo.done ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                            {todo.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                          <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-medium ${
                            todo.priority === 'High' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                            todo.priority === 'Med' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                            'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}>
                            {todo.priority}
                          </span>
                          <button
                            onClick={() => removeTodo(todo.id)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-400 p-0.5"
                          >
                            <Icons.X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Todo Form */}
                <form onSubmit={addTodo} className="pt-2 border-t border-zinc-800 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="New sprint task..."
                    className="flex-grow bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/60"
                  />
                  <select
                    value={newTodoPriority}
                    onChange={(e) => setNewTodoPriority(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded px-1.5 py-1 text-[11px] font-mono text-zinc-300 focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Med">Med</option>
                    <option value="Low">Low</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-1 rounded transition"
                  >
                    <Icons.Plus className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* PANEL 3: Localhost Port Checker & Pomodoro Focus */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between">
                
                {/* Upper: Port Status Badges */}
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <Icons.Cpu className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-zinc-200">Local Ports Ping</span>
                    </div>
                    <button
                      onClick={checkLocalhostPorts}
                      disabled={checkingPorts}
                      className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded transition disabled:opacity-50"
                    >
                      <Icons.RefreshCw className={`w-3 h-3 ${checkingPorts ? 'animate-spin' : ''}`} />
                      <span>{checkingPorts ? 'Scanning' : 'Scan'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
                    {[3000, 8000, 5173, 8080].map(port => {
                      const status = portStatuses[port];
                      return (
                        <a
                          key={port}
                          href={`http://localhost:${port}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 p-1.5 rounded transition group"
                        >
                          <div className="text-[11px] font-semibold text-zinc-300 group-hover:text-white">:{port}</div>
                          <div className="mt-1 flex items-center justify-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              status === 'online' ? 'bg-emerald-400' :
                              status === 'offline' ? 'bg-zinc-600' : 'bg-amber-400'
                            }`} />
                            <span className="text-[9px] uppercase tracking-wider text-zinc-400">
                              {status === 'online' ? 'Active' : status === 'offline' ? 'Down' : 'Ready'}
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Lower: Pomodoro Focus Timer */}
                <div className="pt-3 border-t border-zinc-800 mt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                      <Icons.Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Focus Timer</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      <button
                        onClick={() => setPomodoroMode('work')}
                        className={`px-1.5 py-0.5 rounded ${pomoMode === 'work' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-500'}`}
                      >
                        25m
                      </button>
                      <button
                        onClick={() => setPomodoroMode('short')}
                        className={`px-1.5 py-0.5 rounded ${pomoMode === 'short' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-500'}`}
                      >
                        5m
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 font-mono">
                    <span className="text-lg font-bold tracking-wider text-amber-400">
                      {formatPomoTime(pomoSecondsLeft)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPomoRunning(!pomoRunning)}
                        className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-2.5 py-1 rounded text-xs flex items-center gap-1 transition"
                      >
                        {pomoRunning ? <Icons.Pause className="w-3 h-3" /> : <Icons.Play className="w-3 h-3" />}
                        <span>{pomoRunning ? 'Pause' : 'Start'}</span>
                      </button>
                      <button
                        onClick={() => setPomodoroMode(pomoMode)}
                        className="text-zinc-500 hover:text-zinc-300 p-1"
                        title="Reset timer"
                      >
                        <Icons.RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </section>
          </div>

          {/* 5. WALLPAPER & CONTROLS DRAWER / MODAL */}
          {showBgDrawer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <Icons.Settings className="w-4 h-4 text-zinc-400" /> Wallpaper & Dimmer Controls
                  </span>
                  <button onClick={() => setShowBgDrawer(false)} className="text-zinc-500 hover:text-zinc-300">
                    <Icons.X className="w-4 h-4" />
                  </button>
                </div>

                {/* Solid Dark vs Custom Toggle */}
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-zinc-300">Default Solid Zinc-950 Dark Mode:</span>
                  <button
                    onClick={() => updateBgConfig({ type: bgConfig.type === 'solid' ? 'custom' : 'solid' })}
                    className={`px-3 py-1 rounded-md font-mono text-xs transition ${
                      bgConfig.type === 'solid' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {bgConfig.type === 'solid' ? 'Active' : 'Disabled'}
                  </button>
                </div>

                {/* Image Upload / URL Input */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="block text-xs font-medium text-zinc-300">Custom Image Source</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste Image URL (https://...)"
                      value={bgConfig.type === 'custom' && !bgConfig.url.startsWith('data:') ? bgConfig.url : ''}
                      onChange={(e) => updateBgConfig({ type: 'custom', url: e.target.value })}
                      className="flex-grow bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-xs text-zinc-400 mb-1">Or Upload Local Image file:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Dimmer Overlay Slider */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">Dark Dimmer Overlay:</span>
                    <span className="text-zinc-400">{bgConfig.dimmer}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={bgConfig.dimmer}
                    onChange={(e) => updateBgConfig({ dimmer: Number(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Blur Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">Background Blur:</span>
                    <span className="text-zinc-400">{bgConfig.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={bgConfig.blur}
                    onChange={(e) => updateBgConfig({ blur: Number(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-zinc-800 flex justify-end">
                  <button
                    onClick={() => setShowBgDrawer(false)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-4 py-1.5 rounded-lg transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. DEV TOOLBOX MODAL (JSON Formatter, Base64, UUID) */}
          {showDevToolbox && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
              <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl p-5 shadow-2xl flex flex-col space-y-4">
                
                {/* Modal Header & Tabs */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Icons.Code className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-semibold text-zinc-100">Integrated Dev Toolbox</span>
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
                    <button
                      onClick={() => setToolboxTab('json')}
                      className={`px-2.5 py-1 rounded-md transition ${toolboxTab === 'json' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                      JSON Formatter
                    </button>
                    <button
                      onClick={() => setToolboxTab('base64')}
                      className={`px-2.5 py-1 rounded-md transition ${toolboxTab === 'base64' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                      Base64
                    </button>
                    <button
                      onClick={() => setToolboxTab('uuid')}
                      className={`px-2.5 py-1 rounded-md transition ${toolboxTab === 'uuid' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                      UUID Gen
                    </button>
                  </div>
                  <button onClick={() => setShowDevToolbox(false)} className="text-zinc-500 hover:text-zinc-300">
                    <Icons.X className="w-4 h-4" />
                  </button>
                </div>

                {/* TAB 1: JSON Formatter & Validator */}
                {toolboxTab === 'json' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Input / Output JSON payload:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => formatJson(2)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded text-xs transition"
                        >
                          Prettify (2)
                        </button>
                        <button
                          onClick={() => formatJson(4)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded text-xs transition"
                        >
                          Prettify (4)
                        </button>
                        <button
                          onClick={minifyJson}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded text-xs transition"
                        >
                          Minify
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(jsonInput);
                            setJsonCopied(true);
                            setTimeout(() => setJsonCopied(false), 1200);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded text-xs transition flex items-center gap-1"
                        >
                          {jsonCopied ? <Icons.Check className="w-3 h-3" /> : <Icons.Copy className="w-3 h-3" />}
                          <span>{jsonCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      rows={10}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 font-mono focus:outline-none focus:border-zinc-700"
                    />

                    {jsonError && (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
                        ⚠️ Invalid JSON Syntax: {jsonError}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: Base64 Encoder / Decoder */}
                {toolboxTab === 'base64' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Mode selector:</span>
                      <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded border border-zinc-800">
                        <button
                          onClick={() => setB64Mode('encode')}
                          className={`px-2 py-0.5 rounded ${b64Mode === 'encode' ? 'bg-indigo-600 text-white' : 'text-zinc-400'}`}
                        >
                          Encode Plaintext
                        </button>
                        <button
                          onClick={() => setB64Mode('decode')}
                          className={`px-2 py-0.5 rounded ${b64Mode === 'decode' ? 'bg-indigo-600 text-white' : 'text-zinc-400'}`}
                        >
                          Decode Base64
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Input Text:</label>
                      <textarea
                        value={b64Input}
                        onChange={(e) => setB64Input(e.target.value)}
                        rows={4}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-zinc-700"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-zinc-400">Result Output:</label>
                        <button
                          onClick={() => navigator.clipboard.writeText(b64Output)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <Icons.Copy className="w-3 h-3" /> Copy Result
                        </button>
                      </div>
                      <textarea
                        readOnly
                        value={b64Output}
                        rows={4}
                        className="w-full bg-zinc-950/70 border border-zinc-800 rounded-lg p-2.5 text-xs text-emerald-400 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: Random UUID Generator */}
                {toolboxTab === 'uuid' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400">Generate Count:</span>
                        <select
                          value={uuidCount}
                          onChange={(e) => setUuidCount(Number(e.target.value))}
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200"
                        >
                          <option value={1}>1 UUID</option>
                          <option value={5}>5 UUIDs</option>
                          <option value={10}>10 UUIDs</option>
                          <option value={20}>20 UUIDs</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={generateUuids}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded text-xs transition"
                        >
                          Generate New
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedUuids.join('\n'));
                            setUuidCopied(true);
                            setTimeout(() => setUuidCopied(false), 1200);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-xs transition flex items-center gap-1"
                        >
                          {uuidCopied ? <Icons.Check className="w-3 h-3" /> : <Icons.Copy className="w-3 h-3" />}
                          <span>{uuidCopied ? 'Copied All' : 'Copy All'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 max-h-56 overflow-y-auto space-y-1.5">
                      {generatedUuids.map((id, idx) => (
                        <div key={idx} className="flex items-center justify-between group py-0.5 border-b border-zinc-900 last:border-0">
                          <span className="text-zinc-300 select-all">{id}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(id)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-200 p-0.5"
                            title="Copy single UUID"
                          >
                            <Icons.Copy className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* 7. SHORTCUT CRUD MODAL */}
          {showShortcutModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
              <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-200">
                    {editingShortcut ? 'Edit Shortcut' : 'Add New Shortcut'}
                  </span>
                  <button onClick={() => setShowShortcutModal(false)} className="text-zinc-500 hover:text-zinc-300">
                    <Icons.X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveShortcut} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1">Title Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Linear, Postgres Admin"
                      value={shortcutForm.title}
                      onChange={(e) => setShortcutForm({ ...shortcutForm, title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Destination URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={shortcutForm.url}
                      onChange={(e) => setShortcutForm({ ...shortcutForm, url: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-400 mb-1">Category / Tag</label>
                      <input
                        type="text"
                        placeholder="Dev, Cloud, AI"
                        value={shortcutForm.category}
                        onChange={(e) => setShortcutForm({ ...shortcutForm, category: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Quick Key (1-9)</label>
                      <input
                        type="text"
                        maxLength="1"
                        placeholder="Optional"
                        value={shortcutForm.key}
                        onChange={(e) => setShortcutForm({ ...shortcutForm, key: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-zinc-100 font-mono focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setShowShortcutModal(false)}
                      className="px-3 py-1.5 rounded-md text-zinc-400 hover:text-zinc-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md font-medium transition"
                    >
                      Save Shortcut
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 8. COMMAND PALETTE MODAL (Cmd+K / Ctrl+K / /) */}
          {showCmdPalette && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
              <div 
                className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                onKeyDown={handleCmdKeyDown}
              >
                {/* Search Bar Input */}
                <div className="relative flex items-center border-b border-zinc-800 px-4 py-3 bg-zinc-900">
                  <Icons.Search className="w-4 h-4 text-zinc-500 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    value={cmdQuery}
                    onChange={(e) => {
                      setCmdQuery(e.target.value);
                      setCmdSelectedIndex(0);
                    }}
                    placeholder="Type a command, tool, or shortcut name..."
                    className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans"
                  />
                  <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-700">ESC</span>
                </div>

                {/* Filtered Action Items List */}
                <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                  {commandItems.length === 0 ? (
                    <div className="text-center py-8 text-xs text-zinc-500 font-mono">
                      No matching dev tools or bookmarks found.
                    </div>
                  ) : (
                    commandItems.map((item, index) => {
                      const isSelected = index === cmdSelectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => item.action()}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition ${
                            isSelected ? 'bg-indigo-600 text-white' : 'text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          <span className="font-medium truncate">{item.title}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {item.category}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Palette Footer */}
                <div className="border-t border-zinc-800 px-4 py-2 bg-zinc-950 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                  <span>Navigation: ↑ / ↓ to navigate • ↵ to execute</span>
                  <span>Raycast style palette</span>
                </div>
              </div>
            </div>
          )}

          {/* 9. WORKSPACE & TAG SETTINGS MODAL */}
          <WorkspaceManagerModal
            isOpen={showWorkspaceManager}
            onClose={() => setShowWorkspaceManager(false)}
            language={language}
            shortcuts={shortcuts}
            onSaveShortcuts={saveShortcuts}

            activeTag={shortcutCategory}
            onSelectTag={(tag) => setShortcutCategory(tag)}
            workspaceLayout={workspaceLayout}
            onChangeLayout={handleChangeWorkspaceLayout}
            openInNewTab={openInNewTab}
            onChangeOpenInNewTab={handleChangeOpenInNewTab}
            onResetDefault={handleResetShortcuts}
          />

        </div>
      ), language);
    }


    // Render the React application into root
    const root = createRoot(document.getElementById('root'));
    root.render(<App />);
  