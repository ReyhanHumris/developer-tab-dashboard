import React, { useState } from 'react';

const ModalIcons = {
  Settings: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Tag: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  ),
  Folder: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  ),
  Layout: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  Plus: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Trash: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Edit2: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  Download: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Upload: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Check: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  RotateCcw: (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
};

export default function WorkspaceManagerModal({
  isOpen,
  onClose,
  language = 'id',
  shortcuts = [],
  onSaveShortcuts,
  activeTag = 'All',
  onSelectTag,
  workspaceLayout = 'grid',
  onChangeLayout,
  openInNewTab = true,
  onChangeOpenInNewTab,
  onResetDefault
}) {
  const [activeTab, setActiveTab] = useState('tags'); // 'tags' | 'shortcuts' | 'settings'
  const [newTagName, setNewTagName] = useState('');
  const [editingTagName, setEditingTagName] = useState(null);
  const [renamedTagValue, setRenamedTagValue] = useState('');
  const [selectedTagForList, setSelectedTagForList] = useState('All');
  const [searchShortcutQuery, setSearchShortcutQuery] = useState('');

  // Shortcut Edit inline state
  const [editingShortcut, setEditingShortcut] = useState(null);
  const [shortcutForm, setShortcutForm] = useState({
    title: '',
    url: '',
    category: 'Dev',
    key: ''
  });

  // Extract unique tags and count shortcuts per tag
  const tagList = React.useMemo(() => {
    const counts = {};
    shortcuts.forEach((s) => {
      const tag = s.category || 'General';
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return Object.keys(counts).sort().map((tag) => ({
      name: tag,
      count: counts[tag]
    }));
  }, [shortcuts]);

  if (!isOpen) return null;

  // Add new Tag
  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmed = newTagName.trim();
    if (!trimmed) return;
    if (tagList.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      alert(language === 'id' ? 'Tag sudah ada!' : 'Tag already exists!');
      return;
    }
    // Add a starter placeholder shortcut or switch active tag to this tag
    const newShortcut = {
      id: Date.now().toString(),
      title: `${trimmed} Home`,
      url: 'https://',
      category: trimmed,
      key: null
    };
    onSaveShortcuts([...shortcuts, newShortcut]);
    setNewTagName('');
    if (onSelectTag) onSelectTag(trimmed);
  };

  // Rename a Tag across all shortcuts
  const handleRenameTag = (oldTag) => {
    const trimmed = renamedTagValue.trim();
    if (!trimmed || trimmed === oldTag) {
      setEditingTagName(null);
      return;
    }
    const updated = shortcuts.map((s) => {
      if ((s.category || 'General') === oldTag) {
        return { ...s, category: trimmed };
      }
      return s;
    });
    onSaveShortcuts(updated);
    setEditingTagName(null);
    setRenamedTagValue('');
    if (activeTag === oldTag && onSelectTag) {
      onSelectTag(trimmed);
    }
  };

  // Delete Tag (move shortcuts to 'General')
  const handleDeleteTag = (tagName) => {
    const confirmMsg =
      language === 'id'
        ? `Hapus tag "${tagName}"? Tautan di dalam tag ini akan dipindahkan ke tag "General".`
        : `Delete tag "${tagName}"? Shortcuts inside will be moved to "General".`;
    if (!window.confirm(confirmMsg)) return;

    const updated = shortcuts.map((s) => {
      if ((s.category || 'General') === tagName) {
        return { ...s, category: 'General' };
      }
      return s;
    });
    onSaveShortcuts(updated);
    if (activeTag === tagName && onSelectTag) {
      onSelectTag('All');
    }
  };

  // Delete a specific shortcut
  const handleDeleteShortcut = (id) => {
    const filtered = shortcuts.filter((s) => s.id !== id);
    onSaveShortcuts(filtered);
  };

  // Save shortcut (edit / add)
  const handleSaveShortcutForm = (e) => {
    e.preventDefault();
    if (!shortcutForm.title || !shortcutForm.url) return;

    if (editingShortcut) {
      const updated = shortcuts.map((s) =>
        s.id === editingShortcut.id ? { ...s, ...shortcutForm } : s
      );
      onSaveShortcuts(updated);
      setEditingShortcut(null);
    } else {
      const newItem = {
        id: Date.now().toString(),
        title: shortcutForm.title,
        url: shortcutForm.url,
        category: shortcutForm.category || 'General',
        key: shortcutForm.key || null
      };
      onSaveShortcuts([...shortcuts, newItem]);
    }
    setShortcutForm({ title: '', url: 'https://', category: selectedTagForList === 'All' ? 'Dev' : selectedTagForList, key: '' });
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(shortcuts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rey_workspace_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          onSaveShortcuts(imported);
          alert(language === 'id' ? 'Berhasil mengimpor shortcut workspace!' : 'Workspace shortcuts imported successfully!');
        } else {
          alert('Format JSON tidak valid (harus berupa array).');
        }
      } catch (err) {
        alert('Gagal membaca file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Filtered shortcuts for Tab 2
  const filteredShortcutsForList = shortcuts.filter((s) => {
    const matchesTag =
      selectedTagForList === 'All' ||
      (s.category || 'General') === selectedTagForList;
    const matchesQuery =
      !searchShortcutQuery ||
      `${s.title} ${s.url} ${s.category}`
        .toLowerCase()
        .includes(searchShortcutQuery.toLowerCase());
    return matchesTag && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl p-5 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-300">
              <ModalIcons.Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <span>{language === 'id' ? 'Pengaturan Workspace' : 'Workspace Settings'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {shortcuts.length} {language === 'id' ? 'Tautan' : 'Links'} · {tagList.length} Tag
                </span>
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition"
          >
            <ModalIcons.X className="w-4 h-4" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 py-2.5 border-b border-zinc-800/80 text-xs font-mono flex-shrink-0">
          <button
            onClick={() => setActiveTab('tags')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'tags'
                ? 'bg-zinc-800 text-zinc-100 font-medium border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <ModalIcons.Tag className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Kelola Tag' : 'Manage Tags'}</span>
          </button>

          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'shortcuts'
                ? 'bg-zinc-800 text-zinc-100 font-medium border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <ModalIcons.Folder className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Tautan per Tag' : 'Links by Tag'}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'settings'
                ? 'bg-zinc-800 text-zinc-100 font-medium border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <ModalIcons.Layout className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Tampilan & Backup' : 'Layout & Backup'}</span>
          </button>
        </div>

        {/* TAB 1: KELOLA TAG / KATEGORI WORKSPACE */}
        {activeTab === 'tags' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
            
            {/* Form Tambah Tag Baru */}
            <form onSubmit={handleAddTag} className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl">
              <ModalIcons.Tag className="w-4 h-4 text-emerald-400 ml-1 flex-shrink-0" />
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder={language === 'id' ? 'Nama tag baru (misal: Frontend, AI, Tools)...' : 'New tag name (e.g. Frontend, AI, Tools)...'}
                className="flex-1 bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1 transition"
              >
                <ModalIcons.Plus className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Tambah Tag' : 'Add Tag'}</span>
              </button>
            </form>

            {/* List Semua Tag */}
            <div>
              <span className="text-[11px] font-mono uppercase text-zinc-400 mb-2 block font-semibold">
                {language === 'id' ? 'Daftar Tag Workspace Aktif:' : 'Active Workspace Tags:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tagList.map((tag) => (
                  <div
                    key={tag.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition"
                  >
                    {editingTagName === tag.name ? (
                      <div className="flex items-center gap-1.5 flex-1 mr-2">
                        <input
                          type="text"
                          value={renamedTagValue}
                          onChange={(e) => setRenamedTagValue(e.target.value)}
                          className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 w-full focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRenameTag(tag.name)}
                          className="p-1 rounded bg-emerald-500 text-zinc-950"
                          title="Simpan"
                        >
                          <ModalIcons.Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingTagName(null)}
                          className="p-1 text-zinc-400 hover:text-zinc-200"
                          title="Batal"
                        >
                          <ModalIcons.X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs font-semibold text-zinc-200 truncate">
                          {tag.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400">
                          {tag.count} {language === 'id' ? 'link' : 'links'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingTagName(tag.name);
                          setRenamedTagValue(tag.name);
                        }}
                        className="p-1 text-zinc-500 hover:text-zinc-300 rounded hover:bg-zinc-800 transition"
                        title={language === 'id' ? 'Ganti nama tag' : 'Rename tag'}
                      >
                        <ModalIcons.Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.name)}
                        className="p-1 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800 transition"
                        title={language === 'id' ? 'Hapus tag' : 'Delete tag'}
                      >
                        <ModalIcons.Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: TAUTAN PER TAG (CRUD SHORTCUT PER TAG) */}
        {activeTab === 'shortcuts' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
            
            {/* Tag Filter Pills & Search */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 text-xs">
                <button
                  onClick={() => setSelectedTagForList('All')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    selectedTagForList === 'All'
                      ? 'bg-emerald-500 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  {language === 'id' ? 'Semua' : 'All'}
                </button>
                {tagList.map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => setSelectedTagForList(tag.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                      selectedTagForList === tag.name
                        ? 'bg-emerald-500 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    {tag.name} ({tag.count})
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder={language === 'id' ? 'Cari tautan...' : 'Filter links...'}
                value={searchShortcutQuery}
                onChange={(e) => setSearchShortcutQuery(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none w-36"
              />
            </div>

            {/* Quick Add / Edit Shortcut Inline Form */}
            <form onSubmit={handleSaveShortcutForm} className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl space-y-2.5">
              <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold block">
                {editingShortcut
                  ? (language === 'id' ? '✏️ Edit Tautan' : '✏️ Edit Link')
                  : (language === 'id' ? '➕ Tambah Tautan Baru ke Tag ini' : '➕ Add New Link to this Tag')}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <input
                  type="text"
                  required
                  placeholder={language === 'id' ? 'Judul (misal: GitHub)' : 'Title (e.g. GitHub)'}
                  value={shortcutForm.title}
                  onChange={(e) => setShortcutForm({ ...shortcutForm, title: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700"
                />
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={shortcutForm.url}
                  onChange={(e) => setShortcutForm({ ...shortcutForm, url: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700 sm:col-span-2"
                />
                <select
                  value={shortcutForm.category}
                  onChange={(e) => setShortcutForm({ ...shortcutForm, category: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-zinc-200 focus:outline-none"
                >
                  {tagList.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                  <span>Key (1-9):</span>
                  <input
                    type="text"
                    maxLength="1"
                    placeholder="-"
                    value={shortcutForm.key}
                    onChange={(e) => setShortcutForm({ ...shortcutForm, key: e.target.value })}
                    className="w-10 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-center text-zinc-100 font-mono"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {editingShortcut && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingShortcut(null);
                        setShortcutForm({ title: '', url: 'https://', category: 'Dev', key: '' });
                      }}
                      className="px-3 py-1 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      {language === 'id' ? 'Batal' : 'Cancel'}
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition"
                  >
                    {editingShortcut ? (language === 'id' ? 'Perbarui' : 'Update') : (language === 'id' ? 'Simpan Tautan' : 'Save Link')}
                  </button>
                </div>
              </div>
            </form>

            {/* List Tautan pada Tag Terpilih */}
            <div className="space-y-1.5">
              {filteredShortcutsForList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/60 hover:border-zinc-700 transition group text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {item.category || 'General'}
                    </span>
                    <span className="font-semibold text-zinc-200 truncate">{item.title}</span>
                    <span className="text-zinc-500 truncate text-[11px] hidden sm:inline max-w-[200px]">
                      {item.url}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.key && (
                      <span className="text-[10px] font-mono px-1 py-0.2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                        Key: {item.key}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setEditingShortcut(item);
                        setShortcutForm({
                          title: item.title,
                          url: item.url,
                          category: item.category || 'General',
                          key: item.key || ''
                        });
                      }}
                      className="p-1 text-zinc-500 hover:text-zinc-200 transition"
                      title="Edit"
                    >
                      <ModalIcons.Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteShortcut(item.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 transition"
                      title="Hapus"
                    >
                      <ModalIcons.Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredShortcutsForList.length === 0 && (
                <div className="text-center py-8 text-xs text-zinc-500 font-mono">
                  {language === 'id' ? 'Tidak ada tautan pada tag ini.' : 'No shortcuts in this tag.'}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: TAMPILAN, LAYOUT, BACKUP & RESET */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1 text-xs">
            
            {/* Pilihan Layout Workspace */}
            <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2">
              <span className="font-semibold text-zinc-200 block">
                {language === 'id' ? 'Tata Letak Kartu Workspace:' : 'Workspace Card Layout:'}
              </span>
              <div className="grid grid-cols-3 gap-2 font-mono">
                <button
                  onClick={() => onChangeLayout && onChangeLayout('grid')}
                  className={`p-2.5 rounded-lg border text-center transition ${
                    workspaceLayout === 'grid'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-sm mb-1">⊞</div>
                  <div>Grid Kartu</div>
                </button>
                <button
                  onClick={() => onChangeLayout && onChangeLayout('compact')}
                  className={`p-2.5 rounded-lg border text-center transition ${
                    workspaceLayout === 'compact'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-sm mb-1">☰</div>
                  <div>Compact List</div>
                </button>
                <button
                  onClick={() => onChangeLayout && onChangeLayout('minimal')}
                  className={`p-2.5 rounded-lg border text-center transition ${
                    workspaceLayout === 'minimal'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-sm mb-1">🏷️</div>
                  <div>Minimal Chips</div>
                </button>
              </div>
            </div>

            {/* Opsi Target Buka Link */}
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-200 block">
                  {language === 'id' ? 'Buka tautan di Tab Baru (_blank)' : 'Open links in New Tab (_blank)'}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {language === 'id' ? 'Menjaga dashboard new tab tetap terbuka' : 'Keep developer dashboard open'}
                </span>
              </div>
              <button
                onClick={() => onChangeOpenInNewTab && onChangeOpenInNewTab(!openInNewTab)}
                className={`px-3 py-1 rounded-md font-mono text-xs transition ${
                  openInNewTab ? 'bg-emerald-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {openInNewTab ? (language === 'id' ? 'Aktif' : 'Active') : (language === 'id' ? 'Nonaktif' : 'Disabled')}
              </button>
            </div>

            {/* Backup & Restore JSON */}
            <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2.5">
              <span className="font-semibold text-zinc-200 block">
                {language === 'id' ? 'Cadangkan & Pulihkan Data Workspace:' : 'Backup & Restore Workspace Data:'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportJson}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5 transition font-mono"
                >
                  <ModalIcons.Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'id' ? 'Ekspor Backup JSON' : 'Export JSON Backup'}</span>
                </button>

                <label className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5 transition font-mono cursor-pointer">
                  <ModalIcons.Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{language === 'id' ? 'Impor File JSON' : 'Import JSON File'}</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Reset to Default */}
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-rose-400 block">
                  {language === 'id' ? 'Reset ke Pintasan Bawaan' : 'Reset to Default Shortcuts'}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {language === 'id' ? 'Kembalikan susunan tautan ke setelan awal' : 'Restore shortcuts to factory presets'}
                </span>
              </div>
              <button
                onClick={() => {
                  if (window.confirm(language === 'id' ? 'Reset semua shortcut ke default?' : 'Reset all shortcuts to default?')) {
                    onResetDefault && onResetDefault();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 font-mono transition"
              >
                <ModalIcons.RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono flex-shrink-0">
          <span>{language === 'id' ? 'Tersimpan otomatis di storage' : 'Auto-saved to local storage'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition font-sans font-medium"
          >
            {language === 'id' ? 'Selesai' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
}
