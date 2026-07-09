import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import WorkspaceCard from '../components/WorkspaceCard';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';
import { Plus, Loader2, AlertTriangle, Check } from 'lucide-react';
import { getWorkspaces, deleteWorkspace } from '../services/workspaceService';

const FAVORITES_KEY = 'astraflow_favorite_workspaces';
const getFavorites = () => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); } catch { return []; }
};
const saveFavorites = (ids) => localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));

const WorkspaceSelection = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [favorites, setFavoritesState] = useState(getFavorites());
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchWorkspaces = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getWorkspaces();
            const list = Array.isArray(data) ? data : (data.results || data.data || []);
            setWorkspaces(list);
        } catch (err) {
            setError(err.message || 'Failed to load workspaces');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWorkspaces(); }, []);

    const handleWorkspaceClick = (id) => navigate(`/workspace/${id}/content`);

    const handleFavoriteToggle = (id) => {
        const idStr = String(id);
        const current = favorites.map(String);
        const next = current.includes(idStr)
            ? current.filter(f => f !== idStr)
            : [idStr, ...current];
        setFavoritesState(next);
        saveFavorites(next);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteWorkspace(deleteTarget.id);
            setWorkspaces(prev => prev.filter(w => w.id !== deleteTarget.id));
            setFavoritesState(prev => prev.filter(f => String(f) !== String(deleteTarget.id)));
            showToast('success', `"${deleteTarget.name}" has been deleted.`);
        } catch (err) {
            showToast('error', err.message || 'Failed to delete workspace');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    // Sort: favorites first, then by name
    const sorted = [...workspaces].sort((a, b) => {
        const aFav = favorites.map(String).includes(String(a.id));
        const bFav = favorites.map(String).includes(String(b.id));
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return (a.name || '').localeCompare(b.name || '');
    });

    return (
        <div className="dashboard-layout" style={{ flexDirection: 'column' }}>
            <CreateWorkspaceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={(ws) => {
                    setWorkspaces(prev => [...prev, ws]);
                    showToast('success', `Workspace "${ws.name}" created!`);
                }}
            />

            {/* Reuse the existing themed Topbar (has search + notifications + user menu) */}
            <div className="main-content" style={{ paddingTop: '60px' }}>
                <Topbar />

                <main className="page-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                    {/* Header row */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 className="text-h1">Workspaces</h1>
                        <p className="text-muted" style={{ marginTop: '0.25rem' }}>Select a workspace to start collaborating.</p>
                    </div>

                    {/* Error state */}
                    {error && (
                        <div style={{
                            padding: '1rem 1.25rem',
                            background: 'rgba(239,68,68,0.05)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--input-error)',
                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                            fontSize: '0.875rem', marginBottom: '1.5rem',
                        }}>
                            <AlertTriangle size={16} /> {error}
                        </div>
                    )}

                    {/* Loading state */}
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            <Loader2 size={28} className="spin-icon" />
                        </div>
                    ) : (
                        <div className="workspace-grid">
                            {/* Workspace Cards (favorites first) */}
                            {sorted.map(ws => (
                                <WorkspaceCard
                                    key={ws.id}
                                    workspace={ws}
                                    onClick={() => handleWorkspaceClick(ws.id)}
                                    onDelete={(w) => setDeleteTarget(w)}
                                    onFavoriteToggle={handleFavoriteToggle}
                                    isFavorite={favorites.map(String).includes(String(ws.id))}
                                />
                            ))}

                            {/* Create Workspace Card — always last */}
                            <div
                                className="card create-workspace-card"
                                onClick={() => setIsModalOpen(true)}
                                style={{ minHeight: '180px' }}
                            >
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--color-primary)',
                                }}>
                                    <Plus size={22} />
                                </div>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Create a workspace</span>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                        zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onClick={() => !deleting && setDeleteTarget(null)}
                >
                    <div
                        className="card"
                        style={{
                            minWidth: 380, maxWidth: '90vw',
                            padding: '1.75rem 2rem',
                            position: 'relative',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-h3" style={{ marginBottom: '0.5rem', color: '#dc2626' }}>Delete workspace?</h3>
                        <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                            This will permanently delete <strong>"{deleteTarget.name}"</strong>. This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="btn btn-danger"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                {deleting ? <><Loader2 size={15} className="spin-icon" /> Deleting...</> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    padding: '0.875rem 1.25rem',
                    background: toast.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white', borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--glass-shadow)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', gap: '0.6rem',
                    fontSize: '0.875rem', fontWeight: 500,
                    animation: 'fadeSlideUp 0.25s ease-out',
                }}>
                    {toast.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default WorkspaceSelection;
