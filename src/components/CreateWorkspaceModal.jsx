
import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import { X, Plus, Trash2, Globe, Mail, User, ArrowRight, ArrowLeft, CheckCircle, Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SocialPlatformCard, { platforms } from './SocialPlatformCard';
import { AnimatePresence, motion } from 'framer-motion';

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

const Step1Details = ({ name, setName, timezone, setTimezone, onNext, onCancel, error }) => {
    const timezones = [
        "UTC", "Asia/Kolkata (IST)", "America/New_York (EST)",
        "America/Los_Angeles (PST)", "Europe/London (GMT)",
        "Europe/Paris (CET)", "Australia/Sydney (AEST)"
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
                        className="input"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 2.5rem 0.75rem 1rem',
                            border: '1px solid var(--input-border)',
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s',
                            background: 'white',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none'
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                            e.currentTarget.style.outline = 'none';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--input-border)';
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--text-muted)';
                        }}
                        onMouseLeave={(e) => {
                            if (document.activeElement !== e.currentTarget) {
                                e.currentTarget.style.borderColor = 'var(--input-border)';
                            }
                        }}
                    >
                        {timezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
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
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    onClick={onNext} 
                    disabled={!name.trim()}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    Next <ArrowRight size={16} />
                </Button>
            </div>
        </motion.div>
    );
};

const Step2Members = ({ members, setMembers, onNext, onBack }) => {
    const roles = ["Admin", "Approver", "Contributor", "Writer", "Guest"];

    const addMember = () => setMembers([...members, { email: '', role: 'Contributor' }]);

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
                        <div style={{ flex: 1.5, position: 'relative' }}>
                            <select
                                className="input"
                                value={member.role}
                                onChange={(e) => updateMember(index, 'role', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 2.5rem 0.75rem 1rem',
                                    border: '1px solid var(--input-border)',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    background: 'white',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                    e.currentTarget.style.outline = 'none';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--input-border)';
                                }}
                            >
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                                <User size={16} />
                            </div>
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
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <ArrowLeft size={16} /> Back
                </Button>
                <Button 
                    variant="primary" 
                    onClick={onNext}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    Next <ArrowRight size={16} />
                </Button>
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
    const [members, setMembers] = useState([{ email: '', role: 'Contributor' }]);
    const [connectedSocials, setConnectedSocials] = useState([]);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleNext = () => {
        if (step === 1 && !name.trim()) {
            setError('Please enter a workspace name');
            return;
        }
        setError('');
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const handleSubmit = () => {
        // Mock API Call
        console.log("Created Workspace", { name, timezone, members, connectedSocials });
        const newId = Date.now();
        onClose();
        navigate(`/workspace/${newId}/content`);
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
                        />
                    )}
                    {step === 2 && (
                        <Step2Members
                            key="s2"
                            members={members} setMembers={setMembers}
                            onNext={handleNext}
                            onBack={handleBack}
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
