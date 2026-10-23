import React, { useState, useEffect, useRef } from 'react';
import MiniPlayer from './MiniPlayer';

// Clean, precise inline SVG icons
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
  Volume2: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  VolumeX: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ),
  ListMusic: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15V6" />
      <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M12 12H3" />
      <path d="M16 6H3" />
      <path d="M12 18H3" />
    </svg>
  ),
  Plus: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Trash2: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Upload: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  ChevronDown: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ChevronUp: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  X: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
};

// INITIAL SEED PLAYLIST (3 Relaxing Presets)
const INITIAL_PLAYLIST = [
  {
    id: 'track-1',
    title: 'Lofi Study Session',
    artist: 'Chill Deck',
    type: 'synth',
    chords: [
      [261.63, 329.63, 392.00, 493.88],
      [220.00, 261.63, 329.63, 392.00],
      [174.61, 220.00, 261.63, 329.63],
      [196.00, 246.94, 293.66, 349.23]
    ],
    tempo: 75,
    crackle: 0.14
  },
  {
    id: 'track-2',
    title: 'Midnight Analog',
    artist: 'Night Drift',
    type: 'synth',
    chords: [
      [146.83, 220.00, 293.66, 369.99],
      [130.81, 196.00, 261.63, 329.63],
      [116.54, 174.61, 233.08, 293.66],
      [130.81, 196.00, 246.94, 329.63]
    ],
    tempo: 68,
    crackle: 0.10
  },
  {
    id: 'track-3',
    title: 'Rainy Cafe Piano',
    artist: 'Warm Vinyl',
    type: 'synth',
    chords: [
      [220.00, 277.18, 329.63, 415.30],
      [185.00, 220.00, 277.18, 329.63],
      [146.83, 185.00, 220.00, 277.18],
      [164.81, 207.65, 246.94, 293.66]
    ],
    tempo: 62,
    crackle: 0.16
  }
];

const LOCAL_AUDIO_DB = 'dt_vinyl_audio_v1';
const LOCAL_AUDIO_STORE = 'tracks';

const createUniqueTrackId = (existingIds = new Set()) => {
  let id;
  do {
    const uniquePart = globalThis.crypto?.randomUUID?.()
      || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    id = `custom-${uniquePart}`;
  } while (existingIds.has(id));
  return id;
};

const openLocalAudioDatabase = () => new Promise((resolve, reject) => {
  if (!window.indexedDB) {
    reject(new Error('IndexedDB is unavailable'));
    return;
  }

  const request = window.indexedDB.open(LOCAL_AUDIO_DB, 1);
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains(LOCAL_AUDIO_STORE)) {
      request.result.createObjectStore(LOCAL_AUDIO_STORE, { keyPath: 'id' });
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('Unable to open audio storage'));
});

const saveLocalAudio = async (id, blob) => {
  const database = await openLocalAudioDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(LOCAL_AUDIO_STORE, 'readwrite');
    transaction.objectStore(LOCAL_AUDIO_STORE).put({ id, blob });
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('Unable to save audio file'));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('Audio file save was cancelled'));
    };
  });
};

const getLocalAudio = async (id) => {
  const database = await openLocalAudioDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(LOCAL_AUDIO_STORE, 'readonly');
    const request = transaction.objectStore(LOCAL_AUDIO_STORE).get(id);
    request.onsuccess = () => {
      database.close();
      resolve(request.result?.blob || null);
    };
    request.onerror = () => {
      database.close();
      reject(request.error || new Error('Unable to load audio file'));
    };
  });
};

const deleteLocalAudio = async (id) => {
  const database = await openLocalAudioDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(LOCAL_AUDIO_STORE, 'readwrite');
    transaction.objectStore(LOCAL_AUDIO_STORE).delete(id);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('Unable to remove audio file'));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('Audio file removal was cancelled'));
    };
  });
};

export default function VinylMusicPlayer({
  language = 'id',
  isOpen = true,
  onClose = null,
  onTrackChange = null,
  externalIsPlaying = null,
  onTogglePlay = null
}) {  // Playlist State stored in localStorage
  const [playlist, setPlaylist] = useState(() => {
    const saved = localStorage.getItem('dt_vinyl_playlist_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const usedIds = new Set();
          const normalized = parsed.map(track => {
            if (track.id && !usedIds.has(track.id)) {
              usedIds.add(track.id);
              return track;
            }
            const id = createUniqueTrackId(usedIds);
            usedIds.add(id);
            return { ...track, id };
          });
          if (normalized.some((track, index) => track.id !== parsed[index].id)) {
            localStorage.setItem('dt_vinyl_playlist_v2', JSON.stringify(normalized));
          }
          return normalized;
        }
      } catch (e) {}
    }
    return INITIAL_PLAYLIST;
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylistDrawer, setShowPlaylistDrawer] = useState(false);
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const [isSavingTrack, setIsSavingTrack] = useState(false);
  const [visualizerData, setVisualizerData] = useState(new Array(8).fill(12));

  // Voice note audio waveform state & playback timer (matching user reference image)
  const DEFAULT_WAVE_HEIGHTS = [
    3, 8, 16, 22, 11, 17, 6, 19, 13, 18, 8, 5, 22, 18, 22, 11, 17, 9, 20, 18, 13, 7, 18, 19, 12, 16, 6
  ];
  const [waveformHeights, setWaveformHeights] = useState(DEFAULT_WAVE_HEIGHTS);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showMiniPlayer, setShowMiniPlayer] = useState(true);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Add Track Form State
  const [addForm, setAddForm] = useState({
    title: '',
    artist: '',
    sourceType: 'url', // 'url' | 'file' | 'synth'
    audioUrl: '',
    file: null
  });

  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const analyserRef = useRef(null);
  const synthLoopRef = useRef(null);
  const vinylNoiseRef = useRef(null);
  const audioElementRef = useRef(null);
  const audioSourceNodeRef = useRef(null);
  const animFrameRef = useRef(null);
  const fileInputRef = useRef(null);
  const localAudioUrlsRef = useRef(new Map());

  const activeTrack = playlist[currentTrackIndex] || playlist[0] || INITIAL_PLAYLIST[0];

  useEffect(() => {
    let cancelled = false;
    const restoreLocalAudio = async () => {
      const localTracks = playlist.filter(track => track.isLocalFile && !track.src);
      if (localTracks.length === 0) return;

      try {
        const restoredTracks = await Promise.all(localTracks.map(async (track) => {
          const blob = await getLocalAudio(track.id);
          if (!blob) return null;
          const src = URL.createObjectURL(blob);
          localAudioUrlsRef.current.set(track.id, src);
          return { id: track.id, src };
        }));
        if (cancelled) {
          restoredTracks.forEach(track => {
            if (track) {
              URL.revokeObjectURL(track.src);
              localAudioUrlsRef.current.delete(track.id);
            }
          });
          return;
        }

        const sources = new Map(restoredTracks.filter(Boolean).map(track => [track.id, track.src]));
        setPlaylist(current => current.map(track => (
          sources.has(track.id) ? { ...track, src: sources.get(track.id) } : track
        )));
      } catch (error) {
        if (!cancelled) {
          alert(language === 'id'
            ? `Gagal memuat file musik tersimpan: ${error.message}`
            : `Unable to load saved music files: ${error.message}`);
        }
      }
    };

    restoreLocalAudio();
    return () => {
      cancelled = true;
    };
  }, []);

  // Playback timer tracker (advances timer while playing)
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (audioElementRef.current && activeTrack?.src) {
          setPlaybackSeconds(Math.floor(audioElementRef.current.currentTime || 0));
        } else {
          setPlaybackSeconds((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeTrack]);

  useEffect(() => {
    if (onTrackChange && activeTrack) {
      onTrackChange({
        title: activeTrack.title,
        artist: activeTrack.artist || 'Audio Track',
        isPlaying
      });
    }
  }, [activeTrack, isPlaying, onTrackChange]);

  // Save playlist to localStorage
  const savePlaylist = (newTracks) => {
    const storable = newTracks.map(t => {
      if (t.isLocalFile) {
        return { ...t, src: '' };
      }
      return t;
    });
    localStorage.setItem('dt_vinyl_playlist_v2', JSON.stringify(storable));
    setPlaylist(newTracks);
  };

  // Sync external play state
  useEffect(() => {
    if (externalIsPlaying !== null && externalIsPlaying !== isPlaying) {
      if (externalIsPlaying) {
        startPlayback();
      } else {
        stopPlayback();
      }
    }
  }, [externalIsPlaying, isPlaying]);

  // Audio Engine Initialization
  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.85;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume / 100, ctx.currentTime);

      masterGain.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      masterGainRef.current = masterGain;
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const startVinylCrackle = (intensity = 0.12) => {
    if (!audioContextRef.current || !masterGainRef.current) return;
    const ctx = audioContextRef.current;

    try {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut * 0.95) + (white * 0.05);
        const isClick = Math.random() < 0.0015;
        data[i] = (lastOut * 0.3) + (isClick ? (Math.random() * 2 - 1) * 0.6 : 0);
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1400;
      noiseFilter.Q.value = 1.0;

      const noiseGain = ctx.createGain();
      noiseGain.gain.value = intensity * 0.12;

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGainRef.current);

      noiseSource.start();
      vinylNoiseRef.current = { source: noiseSource, gain: noiseGain };
    } catch (e) {
      console.warn('Crackle note:', e);
    }
  };

  const stopVinylCrackle = () => {
    if (vinylNoiseRef.current) {
      try {
        vinylNoiseRef.current.source.stop();
        vinylNoiseRef.current.source.disconnect();
      } catch (e) {}
      vinylNoiseRef.current = null;
    }
  };

  const startSynthChords = (track = activeTrack) => {
    if (!audioContextRef.current || !masterGainRef.current) return;
    const ctx = audioContextRef.current;
    if (!track.chords) return;
    let chordIndex = 0;

    const playChord = () => {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
      const now = ctx.currentTime;
      const chord = track.chords[chordIndex % track.chords.length];
      chordIndex++;

      const chordDuration = (60 / (track.tempo || 70)) * 4;

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const chordGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = i === 0 ? 'sine' : 'triangle';
        const detune = (Math.random() - 0.5) * 6;
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detune, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(580 + (i * 200), now);
        filter.frequency.exponentialRampToValueAtTime(320, now + chordDuration);

        chordGain.gain.setValueAtTime(0.001, now);
        chordGain.gain.linearRampToValueAtTime(0.1 / chord.length, now + 0.35);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + chordDuration - 0.05);

        osc.connect(filter);
        filter.connect(chordGain);
        chordGain.connect(masterGainRef.current);

        osc.start(now);
        osc.stop(now + chordDuration);
      });
    };

    playChord();
    const intervalMs = ((60 / (track.tempo || 70)) * 4) * 1000;
    synthLoopRef.current = setInterval(playChord, intervalMs);
  };

  const stopSynthChords = () => {
    if (synthLoopRef.current) {
      clearInterval(synthLoopRef.current);
      synthLoopRef.current = null;
    }
  };

  const runVisualizer = () => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const update = () => {
      if (!isPlaying) {
        setWaveformHeights(DEFAULT_WAVE_HEIGHTS);
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArray);

      // Dynamic voice-note waveform bars responding to audio frequencies
      const animatedWave = DEFAULT_WAVE_HEIGHTS.map((baseH, idx) => {
        const bin = Math.floor((idx / DEFAULT_WAVE_HEIGHTS.length) * (bufferLength / 2));
        const freqRatio = (dataArray[bin] || 30) / 255;
        // Natural pulsing around baseline height
        return Math.max(3, Math.min(24, Math.round(baseH * (0.45 + freqRatio * 0.9))));
      });
      setWaveformHeights(animatedWave);

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);
  };

  const startPlayback = (track = activeTrack) => {
    initAudio();
    setIsPlaying(true);

    if (track.src) {
      // HTML5 Audio Stream / Local File
      stopSynthChords();
      stopVinylCrackle();

      if (!audioElementRef.current) {
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.loop = false;
        audio.volume = volume / 100;

        // Auto play next track when ended
        audio.addEventListener('ended', () => {
          handleNextTrack();
        });

        // Track duration for MiniPlayer progress bar
        audio.addEventListener('loadedmetadata', () => {
          setAudioDuration(isFinite(audio.duration) ? Math.floor(audio.duration) : 0);
        });
        audio.addEventListener('durationchange', () => {
          setAudioDuration(isFinite(audio.duration) ? Math.floor(audio.duration) : 0);
        });

        const ctx = audioContextRef.current;
        const source = ctx.createMediaElementSource(audio);
        source.connect(masterGainRef.current);

        audioElementRef.current = audio;
        audioSourceNodeRef.current = source;
      }

      if (audioElementRef.current.src !== track.src) {
        audioElementRef.current.pause();
        audioElementRef.current.src = track.src;
        audioElementRef.current.currentTime = 0;
        setAudioDuration(0);
      }
      audioElementRef.current.play().catch(e => {
        console.warn('Audio stream failed or blocked', e);
      });
    } else {
      // Procedural Synthesizer
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      stopSynthChords();
      stopVinylCrackle();
      startVinylCrackle(track.crackle || 0.12);
      startSynthChords(track);
    }

    runVisualizer();
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    stopSynthChords();
    stopVinylCrackle();
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setWaveformHeights(DEFAULT_WAVE_HEIGHTS);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
    if (onTogglePlay) onTogglePlay(!isPlaying);
  };

  const handleSelectTrack = (index) => {
    const track = playlist[index];
    if (!track) return;
    stopPlayback();
    setPlaybackSeconds(0);
    setCurrentTrackIndex(index);
    startPlayback(track);
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    handleSelectTrack(prevIdx);
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % playlist.length;
    handleSelectTrack(nextIdx);
  };

  // Add new track to playlist (User input)
  const handleAddTrackSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.title.trim() || isSavingTrack) return;
    if (addForm.sourceType === 'file' && !addForm.file) {
      alert(language === 'id' ? 'Pilih file audio terlebih dahulu.' : 'Choose an audio file first.');
      return;
    }

    let src = '';
    let isLocalFile = false;

    const newTrack = {
      id: createUniqueTrackId(new Set(playlist.map(track => track.id))),
      title: addForm.title.trim(),
      artist: addForm.artist.trim() || (language === 'id' ? 'Lagu Kustom' : 'Custom Track'),
      type: addForm.sourceType === 'synth' ? 'synth' : 'audio',
      src: src,
      isLocalFile,
      chords: [
        [220.00, 261.63, 329.63, 392.00],
        [174.61, 220.00, 261.63, 329.63],
        [196.00, 246.94, 293.66, 349.23],
        [261.63, 329.63, 392.00, 493.88]
      ],
      tempo: 65,
      crackle: 0.12
    };

    if (addForm.sourceType === 'url') {
      src = addForm.audioUrl.trim();
    } else if (addForm.sourceType === 'file' && addForm.file) {
      isLocalFile = true;
      setIsSavingTrack(true);
      try {
        await saveLocalAudio(newTrack.id, addForm.file);
        src = URL.createObjectURL(addForm.file);
        localAudioUrlsRef.current.set(newTrack.id, src);
      } catch (error) {
        alert(language === 'id'
          ? `Gagal menyimpan file musik: ${error.message}`
          : `Unable to save music file: ${error.message}`);
        setIsSavingTrack(false);
        return;
      }
    }

    try {
      const addedTrack = { ...newTrack, src, isLocalFile };
      const updated = [...playlist, addedTrack];
      savePlaylist(updated);

      setCurrentTrackIndex(updated.length - 1);
      setPlaybackSeconds(0);
      setShowAddTrackModal(false);
      setAddForm({ title: '', artist: '', sourceType: 'url', audioUrl: '', file: null });

      startPlayback(addedTrack);
    } catch (error) {
      if (isLocalFile) {
        URL.revokeObjectURL(src);
        localAudioUrlsRef.current.delete(newTrack.id);
        try {
          await deleteLocalAudio(newTrack.id);
        } catch (cleanupError) {
          alert(language === 'id'
            ? `Gagal membersihkan file musik: ${cleanupError.message}`
            : `Unable to clean up music file: ${cleanupError.message}`);
        }
      }
      alert(language === 'id'
        ? `Gagal menyimpan playlist: ${error.message}`
        : `Unable to save playlist: ${error.message}`);
    } finally {
      setIsSavingTrack(false);
    }
  };

  // Remove track from playlist
  const handleDeleteTrack = (id, e) => {
    e.stopPropagation();
    if (playlist.length <= 1) {
      alert(language === 'id' ? 'Playlist minimal menyisakan 1 lagu.' : 'Playlist must keep at least 1 track.');
      return;
    }
    const idx = playlist.findIndex(t => t.id === id);
    const updated = playlist.filter(t => t.id !== id);
    savePlaylist(updated);
    if (playlist[idx]?.isLocalFile) {
      const audioUrl = localAudioUrlsRef.current.get(id);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      localAudioUrlsRef.current.delete(id);
      deleteLocalAudio(id).catch(error => {
        alert(language === 'id'
          ? `Gagal menghapus file musik: ${error.message}`
          : `Unable to remove music file: ${error.message}`);
      });
    }

    if (idx === currentTrackIndex) {
      stopPlayback();
      setCurrentTrackIndex(Math.max(0, idx - 1));
    } else if (idx < currentTrackIndex) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddForm(prev => ({
      ...prev,
      sourceType: 'file',
      title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      artist: prev.artist || (language === 'id' ? 'File Komputer' : 'Local Audio'),
      file
    }));
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    if (isMuted && newVol > 0) setIsMuted(false);
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(newVol / 100, audioContextRef.current.currentTime);
    }
    if (audioElementRef.current) {
      audioElementRef.current.volume = newVol / 100;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(nextMute ? 0 : volume / 100, audioContextRef.current.currentTime);
    }
    if (audioElementRef.current) {
      audioElementRef.current.muted = nextMute;
    }
  };

  // Seek handler: ratio 0–1 → set audio currentTime
  const handleSeek = (ratio) => {
    if (audioElementRef.current && audioDuration > 0) {
      const newTime = ratio * audioDuration;
      audioElementRef.current.currentTime = newTime;
      setPlaybackSeconds(Math.floor(newTime));
    }
  };

  useEffect(() => {
    return () => {
      stopPlayback();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch (e) {}
      }
      localAudioUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      localAudioUrlsRef.current.clear();
    };
  }, []);

  if (!isOpen) return null;

  // Compute seek progress for MiniPlayer
  const seekProgress = audioDuration > 0
    ? Math.min(1, playbackSeconds / audioDuration)
    : 0;

  return (
    <>
      {/* ── Inline playlist player widget ── */}
      <div className="w-full bg-zinc-900/60 hover:bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3 transition-colors mt-3 mb-1 shadow-sm">
      
      {/* 1. COMPACT PLAYER BAR (Sleek Horizontal Deck) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* KIRI: Mini Spinning Vinyl + Track Info + Subtle Visualizer */}
        <div className="flex items-center gap-3 min-w-0">
          
          {/* THE MINI VINYL DISC */}
          <div
            onClick={togglePlay}
            className="relative cursor-pointer flex-shrink-0 group select-none"
            title={isPlaying ? (language === 'id' ? 'Klik untuk jeda' : 'Click to pause') : (language === 'id' ? 'Klik untuk memutar' : 'Click to play')}
          >
            <div
              className={`w-10 h-10 rounded-full vinyl-disc relative flex items-center justify-center border border-zinc-700/60 shadow-sm ${
                isPlaying ? 'vinyl-spinning' : 'vinyl-paused'
              }`}
            >
              <div className="absolute inset-1.5 rounded-full border border-zinc-700/30 pointer-events-none" />
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-zinc-300" />
              </div>
            </div>

          {/* Subtle Stylus Arm */}
            <div
              className={`absolute -top-1 -right-0.5 w-3.5 h-4 pointer-events-none transition-transform duration-500 origin-top-right ${
                isPlaying ? 'rotate-12 translate-x-0' : '-rotate-12 -translate-x-0.5 opacity-60'
              }`}
            >
              <div className="w-0.5 h-3.5 bg-zinc-400 rounded-full ml-auto" />
              <div className="w-1.5 h-1 bg-amber-400/80 rounded-sm ml-auto -mt-0.5" />
            </div>
          </div>

          {/* EFEK WAVEFORM AUDIO DI SAMPING PIRINGAN (PERSIS SEPERTI GAMBAR) */}
          <div
            onClick={togglePlay}
            className="flex items-center gap-2 bg-black border border-zinc-800 px-2.5 sm:px-3 py-1.5 rounded-full shadow-inner flex-shrink-0 cursor-pointer hover:border-zinc-700 transition select-none"
            title={isPlaying ? (language === 'id' ? 'Klik untuk jeda' : 'Click to pause') : (language === 'id' ? 'Klik untuk memutar' : 'Click to play')}
          >
            {/* Centered vertical rounded bars */}
            <div className="flex items-center gap-[2px] sm:gap-[2.5px] h-6 overflow-hidden">
              {waveformHeights.map((h, idx) => (
                <div
                  key={idx}
                  className="w-[2px] sm:w-[2.5px] bg-white rounded-full transition-all duration-75"
                  style={{
                    height: `${h}px`,
                    opacity: isPlaying ? 0.95 : 0.65
                  }}
                />
              ))}
            </div>
            {/* Timestamp timer (misal 0:14) */}
            <span className="text-[11px] font-mono text-zinc-300 font-medium tracking-tight pl-0.5 select-none">
              {formatTimer(playbackSeconds)}
            </span>
          </div>

          {/* Track Details */}
          <div className="min-w-0 flex flex-col justify-center">
            <span className="text-xs font-semibold text-zinc-100 truncate max-w-[120px] sm:max-w-[180px]">
              {activeTrack.title}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono mt-0.5">
              <span className="truncate max-w-[100px]">{activeTrack.artist || 'Lo-Fi'}</span>
              <span>•</span>
              <span className={isPlaying ? 'text-emerald-400' : 'text-zinc-500'}>
                {isPlaying ? (language === 'id' ? 'Memutar' : 'Playing') : (language === 'id' ? 'Jeda' : 'Paused')}
              </span>
            </div>
          </div>

        </div>

        {/* KANAN: Controls, Playlist Drawer Toggle & Add Track Button */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          
          {/* Tombol Buka/Tutup Playlist */}
          <button
            onClick={() => setShowPlaylistDrawer(!showPlaylistDrawer)}
            className={`px-2 py-1 rounded-lg text-xs font-mono transition flex items-center gap-1.5 border ${
              showPlaylistDrawer
                ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                : 'bg-zinc-950/80 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border-zinc-800'
            }`}
            title={language === 'id' ? 'Lihat daftar playlist' : 'Toggle playlist'}
          >
            <Icons.ListMusic className="w-3.5 h-3.5 text-zinc-400" />
            <span>Playlist ({playlist.length})</span>
            {showPlaylistDrawer ? <Icons.ChevronUp className="w-3 h-3" /> : <Icons.ChevronDown className="w-3 h-3" />}
          </button>

          {/* Tombol Tambah Lagu */}
          <button
            onClick={() => setShowAddTrackModal(true)}
            className="px-2 py-1 rounded-lg text-xs font-mono bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white transition flex items-center gap-1"
            title={language === 'id' ? 'Input lagu baru ke playlist' : 'Add custom song to playlist'}
          >
            <Icons.Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{language === 'id' ? 'Tambah Lagu' : 'Add Song'}</span>
          </button>

          {/* Playback Buttons: Prev, Play, Next */}
          <div className="flex items-center gap-0.5 pl-1 border-l border-zinc-800/80">
            <button
              onClick={handlePrevTrack}
              className="p-1 text-zinc-400 hover:text-zinc-200 transition"
              title={language === 'id' ? 'Sebelumnya' : 'Previous'}
            >
              <Icons.SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center transition shadow-sm active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Icons.Pause className="w-3.5 h-3.5" />
              ) : (
                <Icons.Play className="w-3.5 h-3.5 ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNextTrack}
              className="p-1 text-zinc-400 hover:text-zinc-200 transition"
              title={language === 'id' ? 'Berikutnya' : 'Next'}
            >
              <Icons.SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-1.5 pl-1 border-l border-zinc-800/80">
            <button
              onClick={toggleMute}
              className="text-zinc-400 hover:text-zinc-200 transition p-0.5"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <Icons.VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Icons.Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-14 accent-zinc-300 h-1 bg-zinc-800 rounded-lg cursor-pointer"
              title={`Volume: ${isMuted ? 0 : volume}%`}
            />
          </div>

        </div>

      </div>

      {/* 2. PLAYLIST DRAWER (Daftar Lagu Rapi & Minimalis) */}
      {showPlaylistDrawer && (
        <div className="mt-2.5 pt-2.5 border-t border-zinc-800/80 animate-in fade-in">
          <div className="flex items-center justify-between pb-1.5 mb-1 text-[11px] font-mono text-zinc-400">
            <span>{language === 'id' ? 'DAFTAR LAGU PLAYLIST:' : 'PLAYLIST QUEUE:'}</span>
            <span className="text-[10px] text-zinc-500">
              {language === 'id' ? 'Klik baris untuk memutar' : 'Click row to play'}
            </span>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1 pr-1 font-sans text-xs">
            {playlist.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              return (
                <div
                  key={track.id || idx}
                  onClick={() => handleSelectTrack(idx)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition ${
                    isCurrent
                      ? 'bg-zinc-800 text-zinc-100 font-medium border border-zinc-700/80'
                      : 'hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-4 text-[11px] font-mono text-zinc-500 text-center">
                      {isCurrent && isPlaying ? (
                        <span className="text-emerald-400 font-bold animate-pulse">▶</span>
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <span className="truncate text-xs">{track.title}</span>
                    <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline truncate max-w-[100px]">
                      {track.artist}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-mono text-zinc-500 px-1 py-0.2 rounded bg-zinc-950/60 border border-zinc-800">
                      {track.src ? 'Audio' : 'Lo-Fi'}
                    </span>
                    <button
                      onClick={(e) => handleDeleteTrack(track.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-500 hover:text-rose-400 transition"
                      title={language === 'id' ? 'Hapus lagu dari playlist' : 'Remove track'}
                    >
                      <Icons.Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. MODAL INPUT TAMBAH LAGU (User Input Form) */}
      {showAddTrackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-xl p-4 shadow-2xl space-y-3 font-sans text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="font-semibold text-zinc-100 text-sm">
                {language === 'id' ? 'Tambah Lagu ke Playlist' : 'Add Track to Playlist'}
              </span>
              <button
                onClick={() => setShowAddTrackModal(false)}
                className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTrackSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-400 text-[11px] mb-1">
                  {language === 'id' ? 'Judul Lagu:' : 'Track Title:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'id' ? 'misal: Favorite Song / Chill Track' : 'e.g. Favorite Song'}
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] mb-1">
                  {language === 'id' ? 'Artis / Keterangan:' : 'Artist / Tag:'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'id' ? 'misal: Lo-Fi, Podcast, Acoustic' : 'e.g. Lo-Fi, Acoustic'}
                  value={addForm.artist}
                  onChange={(e) => setAddForm({ ...addForm, artist: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700"
                />
              </div>

              {/* Source Type Selector */}
              <div>
                <label className="block text-zinc-400 text-[11px] mb-1">
                  {language === 'id' ? 'Sumber Audio:' : 'Audio Source:'}
                </label>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setAddForm({ ...addForm, sourceType: 'url' })}
                    className={`p-1.5 rounded-lg border text-center transition ${
                      addForm.sourceType === 'url'
                        ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-medium'
                        : 'bg-zinc-950 border-zinc-850 text-zinc-500'
                    }`}
                  >
                    URL Audio
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddForm({ ...addForm, sourceType: 'file' });
                      fileInputRef.current?.click();
                    }}
                    className={`p-1.5 rounded-lg border text-center transition ${
                      addForm.sourceType === 'file'
                        ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-medium'
                        : 'bg-zinc-950 border-zinc-850 text-zinc-500'
                    }`}
                  >
                    {language === 'id' ? 'File Komputer' : 'Local File'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddForm({ ...addForm, sourceType: 'synth' })}
                    className={`p-1.5 rounded-lg border text-center transition ${
                      addForm.sourceType === 'synth'
                        ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-medium'
                        : 'bg-zinc-950 border-zinc-850 text-zinc-500'
                    }`}
                  >
                    Lo-Fi Chords
                  </button>
                </div>
              </div>

              {/* URL Input */}
              {addForm.sourceType === 'url' && (
                <div>
                  <label className="block text-zinc-400 text-[11px] mb-1">
                    {language === 'id' ? 'URL Audio (.mp3 / stream):' : 'Audio URL (.mp3 / stream):'}
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://.../music.mp3"
                    value={addForm.audioUrl}
                    onChange={(e) => setAddForm({ ...addForm, audioUrl: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700 font-mono text-[11px]"
                  />
                </div>
              )}

              {/* File upload prompt */}
              {addForm.sourceType === 'file' && (
                <div>
                  <label className="block text-zinc-400 text-[11px] mb-1">
                    {language === 'id' ? 'File Audio Dipilih:' : 'Selected File:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 text-xs flex items-center gap-1.5"
                    >
                      <Icons.Upload className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{language === 'id' ? 'Pilih File...' : 'Choose File...'}</span>
                    </button>
                    <span className="text-[11px] text-zinc-400 truncate max-w-[150px]">
                      {addForm.file?.name || (language === 'id' ? 'Belum ada file' : 'No file')}
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {addForm.sourceType === 'synth' && (
                <p className="text-[11px] text-zinc-500 font-mono">
                  {language === 'id'
                    ? 'Track akan menggunakan Web Audio Lo-Fi Rhodes chord generator otomatis.'
                    : 'Track will use automatic Web Audio Lo-Fi Rhodes chord generator.'}
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddTrackModal(false)}
                  className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200"
                >
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSavingTrack}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium transition"
                >
                  {isSavingTrack
                    ? (language === 'id' ? 'Menyimpan...' : 'Saving...')
                    : (language === 'id' ? 'Simpan Lagu' : 'Save Track')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>

      {/* ── Fixed MiniPlayer: visible when song is playing ── */}
      {showMiniPlayer && (
        <MiniPlayer
          isPlaying={isPlaying}
          track={activeTrack}
          progress={seekProgress}
          duration={audioDuration}
          currentTime={playbackSeconds}
          volume={volume}
          isMuted={isMuted}
          onPlayPause={togglePlay}
          onPrev={handlePrevTrack}
          onNext={handleNextTrack}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={toggleMute}
          onDismiss={() => setShowMiniPlayer(false)}
        />
      )}
    </>
  );
}
