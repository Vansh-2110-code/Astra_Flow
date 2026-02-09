// Added: Team members UI (mock, non-breaking). Invite side panel – Plannable-style; no backend.
import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { X } from 'lucide-react';

const ROLES = ['Admin', 'Editor', 'Viewer'];

const InviteMemberModal = ({ isOpen, onClose, onInvite }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Editor');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed) return;
        const name = trimmed.split('@')[0] || 'Invited User';
        onInvite({ id: Date.now(), name, email: trimmed, role, status: 'Invited' });
        setEmail('');
        setRole('Editor');
        onClose();
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
                            Add collaborators to this workspace. Roles are visual only.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
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
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-sm" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 500, color: 'var(--text-main)' }}>
                            Role
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {ROLES.map((r) => {
                                const active = role === r;
                                return (
                                    <button
                                        key={r}
                                        type="button"
                                        className="btn btn-outline"
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
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--input-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={!email.trim()}>
                            Send invite
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default InviteMemberModal;
