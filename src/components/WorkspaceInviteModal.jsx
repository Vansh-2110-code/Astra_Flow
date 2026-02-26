// WorkspaceInviteModal — invite member to a workspace by email + role, with API integration
import React, { useState } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { inviteToWorkspace } from '../services/workspaceService';

const ROLES = ['Admin', 'Editor', 'Viewer'];
const ROLE_DESCRIPTIONS = {
    Admin: 'Full access — create, edit, approve, delete posts, manage members & settings',
    Editor: 'Can create, edit & schedule posts',
    Viewer: 'Read-only — can view posts',
};

const overlay = {
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const WorkspaceInviteModal = ({ isOpen, onClose, workspaceId }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Editor');
    const [hoveredRole, setHoveredRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const reset = () => { setEmail(''); setRole('Editor'); setError(''); setSuccess(false); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed || !workspaceId) return;
        setLoading(true);
        setError('');
        try {
            await inviteToWorkspace(workspaceId, trimmed, role.toLowerCase());
            setSuccess(true);
            setTimeout(() => { reset(); onClose(); }, 900);
        } catch (err) {
            setError(err?.response?.data?.detail || err.message || 'Failed to send invite.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={overlay} onClick={() => { if (!loading) { reset(); onClose(); } }}>
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'white', borderRadius: '16px',
                    width: '100%', maxWidth: '440px',
                    padding: '1.75rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                    display: 'flex', flexDirection: 'column', gap: '1.25rem',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
                            Invite member
                        </h2>
                        <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#6b7280' }}>
                            Add a collaborator to this workspace.
                        </p>
                    </div>
                    <button
                        onClick={() => { if (!loading) { reset(); onClose(); } }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', borderRadius: '8px' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {/* Email */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError(''); }}
                            placeholder="colleague@example.com"
                            disabled={loading}
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                padding: '0.6rem 0.8rem',
                                border: '1.5px solid #e5e7eb', borderRadius: '8px',
                                fontSize: '0.88rem', color: '#111827', outline: 'none',
                                transition: 'border-color 0.15s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#6366f1'}
                            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    {/* Role */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Role</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {ROLES.map(r => {
                                const active = role === r;
                                return (
                                    <div
                                        key={r}
                                        style={{ position: 'relative' }}
                                        onMouseEnter={() => setHoveredRole(r)}
                                        onMouseLeave={() => setHoveredRole(null)}
                                    >
                                        {/* Tooltip — appears BELOW the role button */}
                                        {hoveredRole === r && (
                                            <div style={{
                                                position: 'absolute', top: 'calc(100% + 7px)', left: '50%',
                                                transform: 'translateX(-50%)',
                                                background: '#1f2937', color: 'white',
                                                fontSize: '0.72rem', padding: '8px 11px', borderRadius: '8px',
                                                zIndex: 10, pointerEvents: 'none',
                                                width: '190px', textAlign: 'left',
                                                boxShadow: '0 6px 18px rgba(0,0,0,0.22)',
                                                lineHeight: 1.4,
                                            }}>
                                                <div style={{ fontWeight: 700, marginBottom: '3px', fontSize: '0.75rem' }}>{r}</div>
                                                <div style={{ color: '#d1d5db' }}>{ROLE_DESCRIPTIONS[r]}</div>
                                                {/* Arrow pointing up */}
                                                <div style={{
                                                    position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)',
                                                    width: 0, height: 0,
                                                    borderLeft: '5px solid transparent',
                                                    borderRight: '5px solid transparent',
                                                    borderBottom: '5px solid #1f2937',
                                                }} />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => setRole(r)}
                                            style={{
                                                padding: '0.38rem 0.95rem', borderRadius: '999px',
                                                border: `1.5px solid ${active ? '#6366f1' : '#e5e7eb'}`,
                                                background: active ? 'rgba(99,102,241,0.07)' : 'white',
                                                color: active ? '#6366f1' : '#6b7280',
                                                fontSize: '0.82rem', fontWeight: active ? 600 : 400,
                                                cursor: 'pointer', transition: 'all 0.15s',
                                            }}
                                        >
                                            {r}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ fontSize: '0.78rem', color: '#ef4444', background: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', paddingTop: '0.25rem', borderTop: '1px solid #f3f4f6' }}>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => { if (!loading) { reset(); onClose(); } }}
                            style={{
                                padding: '0.55rem 1.1rem', borderRadius: '8px',
                                border: '1.5px solid #e5e7eb', background: 'white',
                                fontSize: '0.85rem', cursor: 'pointer', color: '#374151',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!email.trim() || loading}
                            style={{
                                padding: '0.55rem 1.2rem', borderRadius: '8px', border: 'none',
                                background: success ? '#10b981' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: 'white', fontSize: '0.85rem', fontWeight: 600,
                                cursor: email.trim() && !loading ? 'pointer' : 'not-allowed',
                                opacity: email.trim() && !loading ? 1 : 0.6,
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                transition: 'background 0.2s',
                            }}
                        >
                            {loading ? (
                                <><Loader2 size={15} style={{ animation: 'ws-spin 0.7s linear infinite' }} /> Sending…</>
                            ) : success ? (
                                'Invite sent!'
                            ) : (
                                <><Send size={15} /> Send invite</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkspaceInviteModal;
