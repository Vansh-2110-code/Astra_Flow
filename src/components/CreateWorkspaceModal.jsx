
import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import { X, Plus, Trash2, Globe, Mail, User, ArrowRight, ArrowLeft, CheckCircle, Link2, SkipForward, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SocialPlatformCard, { platforms } from './SocialPlatformCard';
import { AnimatePresence, motion } from 'framer-motion';
import { createWorkspace, inviteToWorkspace } from '../services/workspaceService';

// Social Connect Modal Component
const SocialConnectModal = ({ isOpen, platform, onClose, onConnectReal, onConnectMock }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(4px)'
        }}>
            <Card style={{
                width: '100%',
                maxWidth: '450px',
                background: 'white',
                position: 'relative',
                padding: '2rem'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        transition: 'color 0.2s',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <X size={20} />
                </button>

                <div style={{ marginBottom: '2rem', paddingRight: '2rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            background: platform.color + '15',
                            color: platform.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <platform.icon size={24} />
                        </div>
                        <div>
                            <h2 className="text-h3" style={{ marginBottom: '0.25rem' }}>
                                Connect to {platform.name}
                            </h2>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                                Choose how you'd like to connect
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                }}>
                    <button
                        onClick={() => {
                            onConnectReal(platform);
                            onClose();
                        }}
                        style={{
                            padding: '1.25rem',
                            border: '2px solid var(--color-primary)',
                            borderRadius: '12px',
                            background: 'rgba(99, 102, 241, 0.05)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Link2 size={20} style={{ color: 'var(--color-primary)' }} />
                            <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                Connect Real Account
                            </span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.85rem', marginLeft: '2rem' }}>
                            Authenticate with your {platform.name} account
                        </p>
                    </button>

                    <button
                        onClick={() => {
                            onConnectMock(platform);
                            onClose();
                        }}
                        style={{
                            padding: '1.25rem',
                            border: '1px solid var(--input-border)',
                            borderRadius: '12px',
                            background: 'white',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-hover)';
                            e.currentTarget.style.borderColor = 'var(--text-muted)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = 'var(--input-border)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Plus size={20} style={{ color: 'var(--text-muted)' }} />
                            <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                Add Mockup Page
                            </span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.85rem', marginLeft: '2rem' }}>
                            Add a demo {platform.name} page to your workspace
                        </p>
                    </button>
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--input-border)' }}>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        style={{ width: '100%' }}
                    >
                        Cancel
                    </Button>
                </div>
            </Card>
        </div>
    );
};

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

            {/* Footer with buttons */}
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

const ROLE_DESCRIPTIONS = {
    Admin: 'Full access — create, edit, approve, delete posts, manage members & settings',
    Editor: 'Can create, edit & schedule posts',
    Viewer: 'Read-only — can view posts',
};

const Step2Members = ({ members, setMembers, onNext, onBack, onSkip, loading }) => {
    const roles = ["Admin", "Editor", "Viewer"];
    const [hoveredRole, setHoveredRole] = useState(null);

    const addMember = () => setMembers([...members, { email: '', role: 'Editor' }]);

    const removeMember = (index) => {
        if (members.length > 1) {
            const newMembers = [...members];
            newMembers.splice(index, 1);
            setMembers(newMembers);
        }
    };

    const updateMember = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 className="text-h2" style={{ marginBottom: '0.5rem' }}>Invite Team</h2>
                <p className="text-muted">Collaborate with your team members.</p>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '2rem' }}>
                {members.map((member, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 2 }}>
                            <input
                                className="input"
                                type="email"
                                placeholder="Email address"
                                value={member.email}
                                onChange={(e) => updateMember(index, 'email', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid var(--input-border)',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    background: 'white'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                    e.currentTarget.style.outline = 'none';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--input-border)';
                                }}
                            />
                        </div>
                        <div style={{ flex: 1.5, display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            {roles.map(r => {
                                const active = member.role === r;
                                const roleKey = `${index}-${r}`;
                                return (
                                    <div key={r} className="role-tooltip-wrapper"
                                        onMouseEnter={() => setHoveredRole(roleKey)}
                                        onMouseLeave={() => setHoveredRole(null)}
                                    >
                                        {hoveredRole === roleKey && (
                                            <div className="role-tooltip">
                                                <strong>{r}:</strong> {ROLE_DESCRIPTIONS[r]}
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => updateMember(index, 'role', r)}
                                            style={{
                                                padding: '0.4rem 0.75rem',
                                                fontSize: '0.8rem',
                                                borderRadius: '999px',
                                                border: `1px solid ${active ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                                background: active ? 'rgba(99,102,241,0.08)' : 'transparent',
                                                color: active ? 'var(--color-primary)' : 'var(--text-muted)',
                                                cursor: 'pointer',
                                                fontWeight: active ? 600 : 400,
                                                transition: 'all 0.15s',
                                                fontFamily: 'var(--font-body)',
                                            }}
                                        >
                                            {r}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        {members.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeMember(index)}
                                className="btn-ghost"
                                style={{
                                    color: 'var(--input-error)',
                                    padding: '0.75rem 0.5rem',
                                    minHeight: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    className="btn-ghost"
                    onClick={addMember}
                    style={{
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 500,
                        marginTop: '1rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <Plus size={16} /> Add another member
                </button>
            </div>

            {/* Footer with proper spacing */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                paddingTop: '1.5rem',
                marginTop: '1.5rem',
                borderTop: '1px solid var(--input-border)'
            }}>
                <Button
                    variant="secondary"
                    onClick={onBack}
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <ArrowLeft size={16} /> Back
                </Button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Button
                        variant="ghost"
                        onClick={onSkip}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-muted)',
                            fontWeight: 500,
                            fontSize: '0.9rem'
                        }}
                    >
                        Skip <SkipForward size={14} />
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onNext}
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {loading ? (
                            <><Loader2 size={16} className="spin-icon" /> Sending...</>
                        ) : (
                            <>Next <ArrowRight size={16} /></>
                        )}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

const Step3Socials = ({ connected, setConnected, onSubmit, onBack }) => {
    const [connectModal, setConnectModal] = useState({ isOpen: false, platform: null });

    const handleConnect = (platform) => {
        // Check if already connected - if so, disconnect
        if (connected.includes(platform.id)) {
            setConnected(connected.filter(id => id !== platform.id));
        } else {
            // Open connection modal
            setConnectModal({ isOpen: true, platform });
        }
    };

    const handleConnectReal = (platform) => {
        console.log('Connecting real account for:', platform.name);
        setConnected([...connected, platform.id]);
    };

    const handleConnectMock = (platform) => {
        console.log('Adding mockup page for:', platform.name);
        setConnected([...connected, platform.id]);
    };

    return (
        <>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 className="text-h2" style={{ marginBottom: '0.5rem' }}>Connect Socials</h2>
                    <p className="text-muted">Add your social media pages to this workspace.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    paddingRight: '0.5rem'
                }}>
                    {platforms.map(p => (
                        <SocialPlatformCard
                            key={p.id}
                            platform={p}
                            isConnected={connected.includes(p.id)}
                            onConnect={handleConnect}
                        />
                    ))}
                </div>

                {/* Footer with proper spacing */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    paddingTop: '1.5rem',
                    marginTop: '1.5rem',
                    borderTop: '1px solid var(--input-border)'
                }}>
                    <Button
                        variant="secondary"
                        onClick={onBack}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <ArrowLeft size={16} /> Back
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onSubmit}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <CheckCircle size={16} /> Create Workspace
                    </Button>
                </div>
            </motion.div>

            {/* Social Connect Modal */}
            {connectModal.isOpen && connectModal.platform && (
                <SocialConnectModal
                    isOpen={connectModal.isOpen}
                    platform={connectModal.platform}
                    onClose={() => setConnectModal({ isOpen: false, platform: null })}
                    onConnectReal={handleConnectReal}
                    onConnectMock={handleConnectMock}
                />
            )}
        </>
    );
};

const CreateWorkspaceModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [members, setMembers] = useState([{ email: '', role: 'Editor' }]);
    const [connectedSocials, setConnectedSocials] = useState([]);
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

        if (step === 2) {
            // Send invitations for members with non-empty emails
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
            setStep(3);
            return;
        }

        setError('');
        setStep(step + 1);
    };

    const handleSkipMembers = () => {
        setStep(3);
    };

    const handleBack = () => setStep(step - 1);

    const handleSubmit = () => {
        const workspaceId = createdWorkspaceId || Date.now();
        console.log('Finalizing workspace', { workspaceId, name, timezone, members, connectedSocials });
        onClose();
        navigate(`/workspace/${workspaceId}/content`);
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
                {/* Close Button - properly positioned to avoid collision */}
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

                {/* Progress Indicator - with padding to avoid close button */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '2.5rem',
                    marginTop: '0.25rem',
                    paddingRight: '3rem'
                }}>
                    {[1, 2, 3].map(s => (
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
                            name={name} setName={setName}
                            timezone={timezone} setTimezone={setTimezone}
                            onNext={handleNext}
                            onCancel={onClose}
                            error={error}
                            loading={loading}
                        />
                    )}
                    {step === 2 && (
                        <Step2Members
                            key="s2"
                            members={members} setMembers={setMembers}
                            onNext={handleNext}
                            onBack={handleBack}
                            onSkip={handleSkipMembers}
                            loading={loading}
                        />
                    )}
                    {step === 3 && (
                        <Step3Socials
                            key="s3"
                            connected={connectedSocials} setConnected={setConnectedSocials}
                            onSubmit={handleSubmit}
                            onBack={handleBack}
                        />
                    )}
                </AnimatePresence>
            </Card>
        </div>
    );
};

export default CreateWorkspaceModal;
