import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image, Film, FileText, Search, Grid, List, Loader, Filter } from 'lucide-react';
import api from '../services/api';

const MediaLibraryModal = ({ isOpen, onClose, workspaceId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'image', 'video'
    const [appFilter, setAppFilter] = useState('all'); // 'all', 'facebook', 'instagram', 'library'
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const loadMedia = () => {
        if (!workspaceId) return;
        setLoading(true);
        api.get(`/workspaces/${workspaceId}/media/`)
            .then(res => {
                setItems(res.data || []);
            })
            .catch(err => {
                console.error("Failed to load workspace media in modal:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (isOpen) {
            loadMedia();
        }
    }, [isOpen, workspaceId]);

    if (!isOpen) return null;

    const filteredMedia = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
        const matchesApp = appFilter === 'all' || 
            (appFilter === 'library' && item.platform === 'library') ||
            (appFilter === 'facebook' && item.platform === 'facebook') ||
            (appFilter === 'instagram' && item.platform === 'instagram') ||
            (appFilter === 'linkedin' && item.platform === 'linkedin') ||
            (appFilter === 'twitter' && item.platform === 'twitter');
        return matchesSearch && matchesFilter && matchesApp;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'image': return <Image size={20} />;
            case 'video': return <Film size={20} />;
            default: return <FileText size={20} />;
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        api.post(`/workspaces/${workspaceId}/media/upload/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(() => {
            loadMedia();
        })
        .catch(err => {
            console.error("Failed to upload media:", err);
            alert(`Upload failed: ${err.message}`);
        })
        .finally(() => {
            setUploading(false);
        });

        e.target.value = '';
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
        
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            api.post(`/workspaces/${workspaceId}/media/upload/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(() => {
                loadMedia();
            })
            .catch(err => {
                console.error("Failed to upload dragged file:", err);
                alert(`Upload failed: ${err.message}`);
            })
            .finally(() => {
                setUploading(false);
            });
        }
    };

    const typeFilters = [
        { id: 'all', label: 'All Assets' },
        { id: 'image', label: 'Images' },
        { id: 'video', label: 'Videos' },
    ];

    const appFilters = [
        { id: 'all', label: 'All Sources' },
        { id: 'facebook', label: 'Facebook' },
        { id: 'instagram', label: 'Instagram' },
        { id: 'linkedin', label: 'LinkedIn' },
        { id: 'twitter', label: 'X (Twitter)' },
        { id: 'library', label: 'Library' }
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
                    background: 'white', borderRadius: 12, width: '90%', maxWidth: 740,
                    height: '80vh', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem 1.25rem', borderBottom: '1px solid var(--input-border)'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Media Library</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Toolbar */}
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--input-border)', gap: '0.5rem'
                }}>
                    {/* First Row: Filters */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {typeFilters.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    style={{
                                        padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500,
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
                                        width: 150, outline: 'none'
                                    }}
                                />
                            </div>
                            <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                                {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Second Row: App Filters */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                        <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
                            <Filter size={12} /> Source App:
                        </span>
                        {appFilters.map(f => (
                            <button
                                key={f.id}
                                onClick={() => setAppFilter(f.id)}
                                style={{
                                    padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 500,
                                    border: '1px solid',
                                    borderColor: appFilter === f.id ? 'var(--color-primary)' : 'var(--input-border)',
                                    background: appFilter === f.id ? 'var(--color-primary)' : 'transparent',
                                    color: appFilter === f.id ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer', transition: 'all 0.15s'
                                }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflow: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column' }}>
                    {/* Upload zone */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--input-border)'}`,
                            borderRadius: 10, padding: '1.25rem', textAlign: 'center',
                            marginBottom: '1rem', cursor: 'pointer',
                            background: dragActive ? 'rgba(99,102,241,0.05)' : 'rgba(249,250,251,0.5)',
                            transition: 'all 0.15s'
                        }}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleUpload}
                            style={{ display: 'none' }}
                        />
                        <Upload size={22} style={{ color: 'var(--color-primary)', marginBottom: 6 }} />
                        <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-main)' }}>
                            {uploading ? 'Uploading media...' : 'Drop files here or click to upload'}
                        </div>
                    </div>

                    {/* Media grid/list */}
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Loader className="animate-spin" size={24} style={{ color: 'var(--color-primary)' }} />
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Image size={40} style={{ marginBottom: '0.5rem', opacity: 0.5, alignSelf: 'center' }} />
                            <h4 style={{ margin: 0 }}>No media found</h4>
                            <p style={{ fontSize: '0.78rem', margin: '4px 0 0' }}>Upload assets or create posts to see files.</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                            {filteredMedia.map(item => (
                                <div 
                                    key={item.id} 
                                    style={{
                                        borderRadius: 8, border: '1px solid var(--input-border)', overflow: 'hidden',
                                        cursor: 'pointer', position: 'relative', height: 140
                                    }}
                                    onClick={() => window.open(item.url, '_blank')}
                                >
                                    <div style={{
                                        height: 95, background: item.type === 'video' ? '#1e293b' : '#f8fafc',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#64748b', overflow: 'hidden'
                                    }}>
                                        {item.type === 'video' ? <Film size={20} /> : (
                                            <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        )}
                                    </div>
                                    <div style={{ padding: '0.4rem', borderTop: '1px solid var(--input-border)' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                                            <span>{item.size || 'N/A'}</span>
                                            <span style={{ fontWeight: 600 }}>{item.platform === 'library' ? 'Lib' : item.platform === 'facebook' ? 'FB' : item.platform === 'instagram' ? 'IG' : item.platform === 'linkedin' ? 'LI' : 'TW'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {filteredMedia.map(item => (
                                <div 
                                    key={item.id} 
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.5rem 0.75rem', borderRadius: 8,
                                        cursor: 'pointer', border: '1px solid #f1f5f9',
                                        background: '#f8fafc'
                                    }}
                                    onClick={() => window.open(item.url, '_blank')}
                                >
                                    <div style={{ color: item.type === 'video' ? '#6366f1' : '#64748b' }}>{getIcon(item.type)}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.78rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.size || 'N/A'} • Source: {item.platform === 'library' ? 'Library' : item.platform === 'facebook' ? 'Facebook' : item.platform === 'instagram' ? 'Instagram' : item.platform === 'linkedin' ? 'LinkedIn' : 'X (Twitter)'}</div>
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
