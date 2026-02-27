// Invite member panel — calls inviteToWorkspace API.
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import { X, Loader2 } from 'lucide-react';
import { inviteToWorkspace } from '../services/workspaceService';

// Role tooltip added (UI only) — detailed permission descriptions
const ROLE_DESCRIPTIONS = {
    Admin: [
        'Full workspace control',
        'Manage members',
        'Manage content'
    ],
    Editor: [
        'Create and edit posts',
        'Cannot manage workspace members'
    ],
    Viewer: [
        'View content only',
        'No editing permissions'
    ],
};

const ROLES = ['Admin', 'Editor', 'Viewer'];

const InviteMemberModal = ({ isOpen, onClose, onInvite }) => {
    const { workspaceId } = useParams();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Editor');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hoveredRole, setHoveredRole] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed || !workspaceId) return;

        setLoading(true);
        setError('');
        try {
            await inviteToWorkspace(workspaceId, trimmed, role.toLowerCase());
            // Add to local list so UI updates immediately
            const name = trimmed.split('@')[0] || 'Invited User';
            onInvite({ id: Date.now(), name, email: trimmed, role, status: 'Invited' });
            setEmail('');
            setRole('Editor');
            onClose();
        } catch (err) {
            // Error is already mapped to a friendly message by the api interceptor
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'flex-end',
            backdropFilter: 'blur(4px)'
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: 'white',
                    padding: '1.25rem',
                    borderRadius: 0,
                    borderLeft: '1px solid var(--glass-border)',
                    boxShadow: '0 0 40px rgba(15,23,42,0.25)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div>
                        <h2 className="text-h3" style={{ fontSize: '1.05rem' }}>Invite member</h2>
                        <p className="text-sm text-muted" style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                            Add collaborators to this workspace.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.35rem', borderRadius: '999px' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="text-sm" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, color: 'var(--text-main)' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            className="input"
                            placeholder="colleague@example.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            style={{ width: '100%' }}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-sm" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, color: 'var(--text-main)' }}>
                            Role
                        </label>
                        {/* Role tooltip added (UI only) */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {ROLES.map((r) => {
                                const active = role === r;
                                return (
                                    <div key={r} className="role-tooltip-wrapper"
                                        onMouseEnter={() => setHoveredRole(r)}
                                        onMouseLeave={() => setHoveredRole(null)}
                                    >
                                        {hoveredRole === r && (
                                            <div className="role-tooltip" style={{ whiteSpace: 'normal', minWidth: 180, textAlign: 'left' }}>
                                                <strong style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.78rem' }}>{r}</strong>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                    {ROLE_DESCRIPTIONS[r].map((desc, i) => (
                                                        <li key={i} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0.1rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />
                                                            {desc}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            disabled={loading}
                                            style={{
                                                padding: '0.35rem 0.9rem',
                                                fontSize: '0.8rem',
                                                borderRadius: '999px',
                                                borderColor: active ? 'var(--color-primary)' : undefined,
                                                background: active ? 'rgba(99,102,241,0.06)' : 'transparent',
                                                color: active ? 'var(--color-primary)' : 'var(--text-muted)'
                                            }}
                                            onClick={() => setRole(r)}
                                        >
                                            {r}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {error && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--input-error)', padding: '0.5rem 0' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--input-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!email.trim() || loading}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {loading ? (
                                <><Loader2 size={16} className="spin-icon" /> Sending...</>
                            ) : (
                                'Send invite'
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default InviteMemberModal;
