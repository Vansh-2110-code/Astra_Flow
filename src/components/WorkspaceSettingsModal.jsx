// WorkspaceSettingsModal — edit workspace name & timezone with API integration
import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { updateWorkspace } from '../services/workspaceService';

/* Common IANA timezones list */
const TIMEZONES = [
    { label: 'UTC (GMT+0)', value: 'UTC' },
    { label: 'London (GMT+0)', value: 'Europe/London' },
    { label: 'Paris / Berlin (GMT+1)', value: 'Europe/Paris' },
    { label: 'Istanbul (GMT+3)', value: 'Europe/Istanbul' },
    { label: 'Dubai (GMT+4)', value: 'Asia/Dubai' },
    { label: 'Kolkata (GMT+5:30)', value: 'Asia/Kolkata' },
    { label: 'Bangkok (GMT+7)', value: 'Asia/Bangkok' },
    { label: 'Singapore (GMT+8)', value: 'Asia/Singapore' },
    { label: 'Tokyo (GMT+9)', value: 'Asia/Tokyo' },
    { label: 'Sydney (GMT+10)', value: 'Australia/Sydney' },
    { label: 'São Paulo (GMT-3)', value: 'America/Sao_Paulo' },
    { label: 'New York (GMT-5)', value: 'America/New_York' },
    { label: 'Chicago (GMT-6)', value: 'America/Chicago' },
    { label: 'Denver (GMT-7)', value: 'America/Denver' },
    { label: 'Los Angeles (GMT-8)', value: 'America/Los_Angeles' },
];

const overlay = {
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const WorkspaceSettingsModal = ({ isOpen, onClose, workspace, onSave }) => {
    const [name, setName] = useState('');
    const [timezone, setTimezone] = useState('UTC');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Sync fields when workspace changes
    useEffect(() => {
        if (workspace) {
            setName(workspace.name || '');
            setTimezone(workspace.timezone || 'UTC');
        }
        setError('');
        setSuccess(false);
    }, [workspace, isOpen]);

    if (!isOpen) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        setLoading(true);
        setError('');
        try {
            const updated = await updateWorkspace(workspace.id, { name: trimmed, timezone });
            setSuccess(true);
            onSave && onSave(updated);
            setTimeout(() => { setSuccess(false); onClose(); }, 800);
        } catch (err) {
            setError(err?.response?.data?.detail || err.message || 'Failed to save changes.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={overlay} onClick={onClose}>
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'white',
                    borderRadius: '16px',
                    width: '100%', maxWidth: '460px',
                    padding: '1.75rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                    display: 'flex', flexDirection: 'column', gap: '1.25rem',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
                            Workspace Settings
                        </h2>
                        <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#6b7280' }}>
                            Edit name and timezone for this workspace.
                        </p>
                    </div>
                    <button
                        onClick={onClose} disabled={loading}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', borderRadius: '8px' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {/* Workspace name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
                            Workspace name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => { setName(e.target.value); setError(''); }}
                            placeholder="e.g. Acme Marketing"
                            disabled={loading}
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                padding: '0.6rem 0.8rem',
                                border: '1.5px solid #e5e7eb',
                                borderRadius: '8px', fontSize: '0.88rem',
                                color: '#111827', outline: 'none',
                                transition: 'border-color 0.15s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#6366f1'}
                            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    {/* Workspace timezone */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
                            Workspace Timezone
                        </label>
                        <select
                            value={timezone}
                            onChange={e => setTimezone(e.target.value)}
                            disabled={loading}
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                padding: '0.6rem 0.8rem',
                                border: '1.5px solid #e5e7eb',
                                borderRadius: '8px', fontSize: '0.88rem',
                                color: '#111827', background: 'white',
                                cursor: 'pointer', outline: 'none',
                                transition: 'border-color 0.15s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#6366f1'}
                            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                        >
                            {TIMEZONES.map(tz => (
                                <option key={tz.value} value={tz.value}>{tz.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ fontSize: '0.78rem', color: '#ef4444', background: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', paddingTop: '0.25rem' }}>
                        <button
                            type="button" onClick={onClose} disabled={loading}
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
                            disabled={!name.trim() || loading}
                            style={{
                                padding: '0.55rem 1.2rem', borderRadius: '8px', border: 'none',
                                background: success ? '#10b981' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: 'white', fontSize: '0.85rem', fontWeight: 600,
                                cursor: name.trim() && !loading ? 'pointer' : 'not-allowed',
                                opacity: name.trim() && !loading ? 1 : 0.6,
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                transition: 'background 0.2s',
                            }}
                        >
                            {loading ? (
                                <><Loader2 size={15} style={{ animation: 'ws-spin 0.7s linear infinite' }} /> Saving…</>
                            ) : success ? (
                                'Saved!'
                            ) : (
                                <><Save size={15} /> Save changes</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkspaceSettingsModal;
