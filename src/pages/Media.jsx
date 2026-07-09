import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import { Upload, Image as ImageIcon, Film, Eye, Check, Trash2, Loader, Filter } from 'lucide-react';
import api from '../services/api';

const Media = () => {
    const { workspaceId } = useParams();
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'image', 'video'
    const [appFilter, setAppFilter] = useState('all'); // 'all', 'facebook', 'instagram', 'library'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    const loadMedia = () => {
        if (!workspaceId) return;
        setLoading(true);
        api.get(`/workspaces/${workspaceId}/media/`)
            .then(res => {
                setItems(res.data || []);
            })
            .catch(err => {
                console.error("Failed to load workspace media:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadMedia();
    }, [workspaceId]);

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
            alert(`Upload failed: ${err.response?.data?.detail || err.message}`);
        })
        .finally(() => {
            setUploading(false);
        });

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

    const handleDelete = async (id, e) => {
        e?.stopPropagation();
        if (window.confirm("Are you sure you want to delete this media item?")) {
            try {
                const target = items.find(i => i.id === id);
                if (target?.platform === 'library') {
                    await api.delete(`/workspaces/${workspaceId}/media/${id}/`);
                } else {
                    alert("This media is attached to a post. To remove it, please edit or delete the corresponding post.");
                    return;
                }
                loadMedia();
                setSelectedIds(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            } catch (err) {
                console.error("Failed to delete media:", err);
            }
        }
    };

    const handlePreview = (item) => (e) => {
        e?.stopPropagation();
        window.open(item.url, '_blank');
    };

    const counts = {
        all: items.length,
        image: items.filter((i) => i.type === 'image').length,
        video: items.filter((i) => i.type === 'video').length,
    };

    const filtered = items.filter((item) => {
        const matchType = filter === 'all' || item.type === filter;
        const matchApp = appFilter === 'all' || 
            (appFilter === 'library' && item.platform === 'library') ||
            (appFilter === 'facebook' && item.platform === 'facebook') ||
            (appFilter === 'instagram' && item.platform === 'instagram') ||
            (appFilter === 'linkedin' && item.platform === 'linkedin') ||
            (appFilter === 'twitter' && item.platform === 'twitter');
        const matchSearch = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
        return matchType && matchApp && matchSearch;
    });

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', alignItems: 'center', justifySpatially: 'space-between', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="text-h1">Media Library</h1>
                    <p className="text-muted">Manage your assets dynamically for this workspace.</p>
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

            {/* Media Type Filter */}
            <div style={{ 
                display: 'flex', 
                gap: '0.5rem',
                padding: '0.375rem',
                background: 'rgba(0, 0, 0, 0.02)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem'
            }}>
                {['all', 'image', 'video'].map((f) => {
                    const active = filter === f;
                    const label = f === 'all' ? 'All' : f === 'image' ? 'Images' : 'Videos';
                    return (
                        <button
                            key={f}
                            type="button"
                            style={{
                                flex: 1,
                                padding: '0.625rem 1rem',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                background: active ? 'white' : 'transparent',
                                color: active ? 'var(--color-primary)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: active ? 600 : 500,
                                transition: 'all 0.2s',
                                boxShadow: active ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                            }}
                            onClick={() => setFilter(f)}
                        >
                            {label} <span style={{ opacity: 0.8 }}>({counts[f]})</span>
                        </button>
                    );
                })}
            </div>

            {/* Source App Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="text-muted" style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
                    <Filter size={14} /> Filter by App:
                </span>
                {['all', 'facebook', 'instagram', 'linkedin', 'twitter', 'library'].map((app) => {
                    const active = appFilter === app;
                    const label = app === 'all' ? 'All Sources' : app === 'facebook' ? 'Facebook' : app === 'instagram' ? 'Instagram' : app === 'linkedin' ? 'LinkedIn' : app === 'twitter' ? 'X (Twitter)' : 'Library Uploads';
                    return (
                        <button
                            key={app}
                            type="button"
                            onClick={() => setAppFilter(app)}
                            style={{
                                padding: '4px 12px',
                                borderRadius: '999px',
                                fontSize: '0.78rem',
                                fontWeight: 500,
                                border: '1px solid',
                                borderColor: active ? 'var(--color-primary)' : 'var(--input-border)',
                                background: active ? 'var(--color-primary)' : 'transparent',
                                color: active ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                            }}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader className="animate-spin" size={32} style={{ color: 'var(--color-primary)' }} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <ImageIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <h3>No media found</h3>
                    <p>Upload some media or publish posts to build your asset library.</p>
                </div>
            ) : (
                <div className="media-grid">
                    {filtered.map((item) => {
                        const isSelected = selectedIds.has(item.id);
                        return (
                            <div
                                key={item.id}
                                className="media-item"
                                style={{
                                    border: isSelected ? '2px solid var(--color-primary)' : undefined,
                                    boxShadow: isSelected ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : undefined,
                                    position: 'relative'
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
                                <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: '4px' }}>
                                    <span className="badge" style={{ background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.65rem' }}>
                                        {item.platform === 'library' ? 'Library' : item.platform === 'facebook' ? 'Facebook' : item.platform === 'instagram' ? 'Instagram' : item.platform === 'linkedin' ? 'LinkedIn' : 'X (Twitter)'}
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
                                    {item.platform === 'library' && (
                                        <button
                                            type="button"
                                            className="btn btn-ghost"
                                            style={{ color: 'white', padding: '0.4rem' }}
                                            onClick={(e) => handleDelete(item.id, e)}
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
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
            )}
        </DashboardLayout>
    );
};

export default Media;
