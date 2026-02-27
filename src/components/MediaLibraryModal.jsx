import React, { useState } from 'react';
import { X, Upload, Image, Film, FileText, Search, Grid, List } from 'lucide-react';

const SAMPLE_MEDIA = [
    { id: 1, name: 'campaign-hero.jpg', type: 'image', size: '2.4 MB', date: 'Feb 20, 2026', url: '' },
    { id: 2, name: 'product-demo.mp4', type: 'video', size: '15.8 MB', date: 'Feb 18, 2026', url: '' },
    { id: 3, name: 'social-banner.png', type: 'image', size: '890 KB', date: 'Feb 15, 2026', url: '' },
    { id: 4, name: 'logo-dark.svg', type: 'image', size: '24 KB', date: 'Feb 10, 2026', url: '' },
    { id: 5, name: 'promo-reel.mp4', type: 'video', size: '8.2 MB', date: 'Feb 8, 2026', url: '' },
    { id: 6, name: 'team-photo.jpg', type: 'image', size: '3.1 MB', date: 'Feb 5, 2026', url: '' },
];

const MediaLibraryModal = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [activeFilter, setActiveFilter] = useState('all');
    const [dragActive, setDragActive] = useState(false);

    if (!isOpen) return null;

    const filteredMedia = SAMPLE_MEDIA.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'image': return <Image size={20} />;
            case 'video': return <Film size={20} />;
            default: return <FileText size={20} />;
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        // Files would be handled here in production
    };

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'image', label: 'Images' },
        { id: 'video', label: 'Videos' },
    ];

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'white', borderRadius: 12, width: '90%', maxWidth: 720,
                    maxHeight: '80vh', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem 1.25rem', borderBottom: '1px solid var(--input-border)'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Media Library</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Toolbar */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--input-border)', gap: '0.75rem', flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {filters.map(f => (
                            <button
                                key={f.id}
                                onClick={() => setActiveFilter(f.id)}
                                style={{
                                    padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 500,
                                    border: '1px solid',
                                    borderColor: activeFilter === f.id ? 'var(--color-primary)' : 'var(--input-border)',
                                    background: activeFilter === f.id ? 'var(--color-primary)' : 'transparent',
                                    color: activeFilter === f.id ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer', transition: 'all 0.15s'
                                }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search media..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    padding: '5px 8px 5px 28px', borderRadius: 8,
                                    border: '1px solid var(--input-border)', fontSize: '0.8rem',
                                    width: 160, outline: 'none'
                                }}
                            />
                        </div>
                        <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                            {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflow: 'auto', padding: '1rem 1.25rem' }}>
                    {/* Upload zone */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        style={{
                            border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--input-border)'}`,
                            borderRadius: 10, padding: '1.5rem', textAlign: 'center',
                            marginBottom: '1rem', cursor: 'pointer',
                            background: dragActive ? 'rgba(99,102,241,0.05)' : 'rgba(249,250,251,0.5)',
                            transition: 'all 0.15s'
                        }}
                    >
                        <Upload size={24} style={{ color: 'var(--color-primary)', marginBottom: 8 }} />
                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>
                            Drop files here or click to upload
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                            Supports JPG, PNG, GIF, MP4, MOV (max 50MB)
                        </div>
                    </div>

                    {/* Media grid/list */}
                    {viewMode === 'grid' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                            {filteredMedia.map(item => (
                                <div key={item.id} style={{
                                    borderRadius: 8, border: '1px solid var(--input-border)', overflow: 'hidden',
                                    cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s'
                                }}>
                                    <div style={{
                                        height: 100, background: item.type === 'video' ? '#1e293b' : '#f1f5f9',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: item.type === 'video' ? '#94a3b8' : '#64748b'
                                    }}>
                                        {getIcon(item.type)}
                                    </div>
                                    <div style={{ padding: '0.5rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.size}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {filteredMedia.map(item => (
                                <div key={item.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.5rem 0.75rem', borderRadius: 8,
                                    cursor: 'pointer', transition: 'background 0.15s',
                                    border: '1px solid transparent'
                                }}>
                                    <div style={{ color: item.type === 'video' ? '#6366f1' : '#64748b' }}>{getIcon(item.type)}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{item.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.size} • {item.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaLibraryModal;
