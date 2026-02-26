
import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { X, Plus, Trash2, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { createWorkspace, inviteToWorkspace } from '../services/workspaceService';

const Step1Details = ({ name, setName, timezone, setTimezone, onNext, onCancel, error, loading }) => {
    const timezones = [
        { label: "UTC", value: "UTC" },
        { label: "Asia/Kolkata (IST)", value: "Asia/Kolkata" },
        { label: "America/New_York (EST)", value: "America/New_York" },
        { label: "America/Los_Angeles (PST)", value: "America/Los_Angeles" },
        { label: "Europe/London (GMT)", value: "Europe/London" },
        { label: "Europe/Paris (CET)", value: "Europe/Paris" },
        { label: "Australia/Sydney (AEST)", value: "Australia/Sydney" },
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 className="text-h2" style={{ marginBottom: '0.5rem' }}>Workspace Details</h2>
                <p className="text-muted">Let's start with the basics for your new workspace.</p>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Workspace Name
                </label>
                <input
                    className={`input ${error ? 'error' : ''}`}
                    type="text"
                    placeholder="Enter workspace name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: error ? '2px solid var(--input-error)' : '1px solid var(--input-border)',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s',
                        background: 'white',
                        color: 'var(--text-main)'
                    }}
                    onFocus={(e) => {
                        if (!error) e.currentTarget.style.borderColor = 'var(--color-primary)';
                        e.currentTarget.style.outline = 'none';
                    }}
                    onBlur={(e) => {
                        if (!error) e.currentTarget.style.borderColor = 'var(--input-border)';
                    }}
                />
                {error && <span style={{ color: 'var(--input-error)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>{error}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Time Zone
                </label>
                <div style={{ position: 'relative' }}>
                    <select
                        className="themed-select"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        style={{ padding: '0.75rem 2.5rem 0.75rem 1rem' }}
                    >
                        {timezones.map(tz => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                        ))}
                    </select>
                    <div style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Globe size={18} />
                    </div>
                </div>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '1rem',
                paddingTop: '1.5rem',
                marginTop: '1.5rem',
                borderTop: '1px solid var(--input-border)'
            }}>
                <Button variant="secondary" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={onNext}
                    disabled={!name.trim() || loading}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {loading ? (
                        <><Loader2 size={16} className="spin-icon" /> Creating...</>
                    ) : (
                        <>Next <ArrowRight size={16} /></>
                    )}
                </Button>
            </div>
        </motion.div>
    );
};

const ROLES = ['Admin', 'Editor', 'Viewer'];
const ROLE_DESCRIPTIONS = {
    Admin: 'Full access — manage members, posts & settings',
    Editor: 'Can create, edit & schedule posts',
    Viewer: 'Read-only access to posts',
};

const Step2Members = ({ members, setMembers, onSubmit, onSkip, loading }) => {
    const [tooltip, setTooltip] = useState({ role: null, x: 0, y: 0 });

    const addMember = () => setMembers([...members, { email: '', role: 'Editor' }]);

    const removeMember = (index) => {
        if (members.length > 1) setMembers(members.filter((_, i) => i !== index));
    };

    const updateMember = (index, field, value) => {
        const updated = [...members];
        updated[index][field] = value;
        setMembers(updated);
    };

    const handleRoleHover = (e, roleKey) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({ role: roleKey, x: rect.left + rect.width / 2, y: rect.bottom + 8 });
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Fixed-position tooltip rendered outside modal overflow */}
            {tooltip.role && ROLE_DESCRIPTIONS[tooltip.role.split('-')[1]] && (
                <div style={{
                    position: 'fixed',
                    top: tooltip.y,
                    left: tooltip.x,
                    transform: 'translateX(-50%)',
                    background: '#1f2937',
                    color: 'white',
                    fontSize: '0.75rem',
                    padding: '6px 10px',
                    borderRadius: '7px',
                    zIndex: 999999,
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                }}>
                    {ROLE_DESCRIPTIONS[tooltip.role.split('-')[1]]}
                    <div style={{
                        position: 'absolute',
                        top: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderBottom: '4px solid #1f2937',
                    }} />
                </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>
                    Invite Team
                </h2>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7280' }}>
                    Add collaborators to this workspace (optional).
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '1.5rem' }}>
                {members.map((member, index) => (
                    <div key={index}>
                        {/* Email row */}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '0.55rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={member.email}
                                    onChange={e => updateMember(index, 'email', e.target.value)}
                                    placeholder="colleague@example.com"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        padding: '0.6rem 0.8rem',
                                        border: '1.5px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.88rem',
                                        color: '#111827',
                                        outline: 'none',
                                        transition: 'border-color 0.15s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                            {members.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeMember(index)}
                                    style={{
                                        color: '#ef4444',
                                        padding: '0.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        height: '38px',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        {/* Role row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', flexShrink: 0 }}>
                                Role:
                            </label>
                            {ROLES.map(r => {
                                const active = member.role === r;
                                return (
                                    <button
                                        key={r}
                                        type="button"
                                        disabled={loading}
                                        onClick={() => updateMember(index, 'role', r)}
                                        onMouseEnter={e => handleRoleHover(e, `${index}-${r}`)}
                                        onMouseLeave={() => setTooltip({ role: null, x: 0, y: 0 })}
                                        style={{
                                            padding: '0.3rem 0.85rem',
                                            borderRadius: '999px',
                                            border: `1.5px solid ${active ? '#6366f1' : '#e5e7eb'}`,
                                            background: active ? 'rgba(99,102,241,0.08)' : 'white',
                                            color: active ? '#6366f1' : '#6b7280',
                                            fontSize: '0.82rem',
                                            fontWeight: active ? 600 : 400,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        {r}
                                    </button>
                                );
                            })}
                        </div>

                        {index < members.length - 1 && (
                            <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '1.1rem' }} />
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addMember}
                    style={{
                        color: '#6366f1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontWeight: 500,
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        marginTop: '0.25rem',
                        alignSelf: 'flex-start',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <Plus size={15} /> Add another member
                </button>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                <button
                    type="button"
                    disabled={loading}
                    onClick={onSkip}
                    style={{
                        padding: '0.55rem 1.1rem',
                        borderRadius: '8px',
                        border: '1.5px solid #e5e7eb',
                        background: 'white',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        color: '#374151',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                    Skip
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    onClick={onSubmit}
                    style={{
                        padding: '0.55rem 1.2rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'opacity 0.2s',
                    }}
                >
                    {loading ? (
                        <><Loader2 size={15} style={{ animation: 'ws-spin 0.7s linear infinite' }} /> Sending…</>
                    ) : (
                        'Send Invitations'
                    )}
                </button>
            </div>
        </motion.div>
    );
};

const CreateWorkspaceModal = ({ isOpen, onClose, onCreated }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [members, setMembers] = useState([{ email: '', role: 'Editor' }]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [createdWorkspaceId, setCreatedWorkspaceId] = useState(null);

    if (!isOpen) return null;

    const handleNext = async () => {
        if (step === 1) {
            if (!name.trim()) {
                setError('Please enter a workspace name');
                return;
            }
            setError('');
            setLoading(true);
            try {
                const result = await createWorkspace(name.trim(), timezone);
                console.log('Workspace created:', result);
                setCreatedWorkspaceId(result.data.id);
                setStep(2);
            } catch (err) {
                console.error('Workspace creation failed:', err);
                setError(err.message || 'Failed to create workspace');
            } finally {
                setLoading(false);
            }
            return;
        }
    };

    const handleSubmit = async () => {
        const validMembers = members.filter(m => m.email && m.email.trim());
        if (validMembers.length > 0 && createdWorkspaceId) {
            setLoading(true);
            try {
                const results = await Promise.allSettled(
                    validMembers.map(m =>
                        inviteToWorkspace(createdWorkspaceId, m.email.trim(), m.role.toLowerCase())
                    )
                );
                const failed = results.filter(r => r.status === 'rejected');
                if (failed.length > 0) {
                    console.warn(`${failed.length} invitation(s) failed:`, failed);
                }
                console.log('Invitations sent:', results);
            } catch (err) {
                console.error('Invitation error:', err);
            } finally {
                setLoading(false);
            }
        }

        const workspaceId = createdWorkspaceId || Date.now();
        console.log('Finalizing workspace', { workspaceId, name, timezone, members });
        
        if (onCreated) {
            onCreated({ id: workspaceId, name, timezone });
        }
        onClose();
        navigate(`/workspace/${workspaceId}/content`);
    };

    const handleSkip = () => {
        handleSubmit();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(4px)'
        }}>
            <Card
                className="modal-content"
                style={{
                    width: '100%',
                    maxWidth: '700px',
                    background: 'white',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2rem'
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        zIndex: 10,
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--text-main)';
                        e.currentTarget.style.background = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.background = 'none';
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '2.5rem',
                    marginTop: '0.25rem',
                    paddingRight: '3rem'
                }}>
                    {[1, 2].map(s => (
                        <div
                            key={s}
                            style={{
                                flex: 1,
                                height: 4,
                                borderRadius: 2,
                                background: s <= step ? 'var(--color-primary)' : 'var(--input-border)',
                                transition: 'all 0.3s'
                            }}
                        ></div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <Step1Details
                            key="s1"
                            name={name}
                            setName={setName}
                            timezone={timezone}
                            setTimezone={setTimezone}
                            onNext={handleNext}
                            onCancel={onClose}
                            error={error}
                            loading={loading}
                        />
                    )}
                    {step === 2 && (
                        <Step2Members
                            key="s2"
                            members={members}
                            setMembers={setMembers}
                            onSubmit={handleSubmit}
                            onSkip={handleSkip}
                            loading={loading}
                        />
                    )}
                </AnimatePresence>
            </Card>
        </div>
    );
};

export default CreateWorkspaceModal;
