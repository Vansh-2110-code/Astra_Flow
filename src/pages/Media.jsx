// Added: Media library grid (Plannable-style). Upload mock, filters, search, selection – local state only; no backend.
import React, { useState, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import { Upload, Image as ImageIcon, Film, Eye, Check, Trash2 } from 'lucide-react';

const initialItems = Array.from({ length: 12 }, (_, i) => ({
    id: `mock-${i}`,
    type: i % 3 === 0 ? 'video' : 'image',
    url: `https://source.unsplash.com/random/300x300?sig=${i}`,
    name: i % 3 === 0 ? `video_${i + 1}.mp4` : `image_${i + 1}.jpg`
}));

const Media = () => {
    const [items, setItems] = useState(initialItems);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const counts = {
        all: items.length,
        image: items.filter((i) => i.type === 'image').length,
        video: items.filter((i) => i.type === 'video').length,
    };

    const filtered = items.filter((item) => {
        const matchType = filter === 'all' || item.type === filter;
        const matchSearch = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
        return matchType && matchSearch;
    });

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const isVideo = (file.type || '').startsWith('video/');
        const type = isVideo ? 'video' : 'image';
        setUploading(true);
        const url = URL.createObjectURL(file);
        const id = `upload-${Date.now()}`;
        const newItem = { id, type, url, name: file.name };
        setTimeout(() => {
            setItems((prev) => [...prev, newItem]);
            setUploading(false);
        }, 800);
        e.target.value = '';
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleDelete = (id, e) => {
        e?.stopPropagation();
        setItems((prev) => prev.filter((i) => i.id !== id));
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const handlePreview = (item) => (e) => {
        e?.stopPropagation();
        window.open(item.url, '_blank');
    };

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="text-h1">Media Library</h1>
                    <p className="text-muted">Manage your assets.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                        type="text"
                        className="input text-sm"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '180px', padding: '0.5rem 0.75rem' }}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleUpload}
                        style={{ display: 'none' }}
                    />
                    <Button
                        variant="primary"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {uploading ? 'Uploading...' : <><Upload size={18} /> Upload Media</>}
                    </Button>
                </div>
            </div>

            <div className="card" style={{ padding: '0.5rem 0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['all', 'image', 'video'].map((f) => {
                        const active = filter === f;
                        const label = f === 'all' ? 'All' : f === 'image' ? 'Images' : 'Videos';
                        return (
                            <button
                                key={f}
                                type="button"
                                className={`btn ${active ? 'btn-primary' : 'btn-outline'}`}
                                style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderRadius: '999px' }}
                                onClick={() => setFilter(f)}
                            >
                                {label} <span style={{ opacity: 0.9 }}>({counts[f]})</span>
                            </button>
                        );
                    })}
                </div>
                <div className="text-sm text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    {filtered.length} item{filtered.length === 1 ? '' : 's'}
                </div>
            </div>

            {uploading && (
                <div className="card text-sm text-muted" style={{ marginBottom: '1rem', padding: '0.75rem' }}>
                    Uploading... (mock)
                </div>
            )}

            <div className="media-grid">
                {filtered.map((item) => {
                    const isSelected = selectedIds.has(item.id);
                    return (
                        <div
                            key={item.id}
                            className="media-item"
                            style={{
                                border: isSelected ? '2px solid var(--color-primary)' : undefined,
                                boxShadow: isSelected ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : undefined
                            }}
                        >
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.type === 'video' ? (
                                    <div style={{ width: '100%', height: '100%', background: 'var(--input-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Film size={32} color="var(--text-muted)" />
                                    </div>
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        loading="lazy"
                                    />
                                )}
                            </div>
                            <div style={{ position: 'absolute', top: 6, right: 6 }}>
                                <span className="badge" style={{ background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.65rem' }}>
                                    {item.type === 'video' ? 'Video' : 'Image'}
                                </span>
                            </div>
                            <div
                                className="media-item-overlay"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    opacity: 0,
                                    transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = 0; }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    style={{ color: 'white', padding: '0.4rem' }}
                                    onClick={handlePreview(item)}
                                    title="Preview"
                                >
                                    <Eye size={18} />
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    style={{ color: isSelected ? 'var(--color-primary)' : 'white', padding: '0.4rem' }}
                                    onClick={() => toggleSelect(item.id)}
                                    title="Select"
                                >
                                    <Check size={18} />
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    style={{ color: 'white', padding: '0.4rem' }}
                                    onClick={(e) => handleDelete(item.id, e)}
                                    title="Delete (mock)"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '0.5rem', paddingTop: '1.5rem' }}>
                                <span className="text-sm" style={{ color: 'white', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                                    {item.name}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </DashboardLayout>
    );
};

export default Media;
