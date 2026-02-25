import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Building2, Palette, Shield, Plug, Lock, Bell, AlertTriangle, Copy, Check, User, Camera } from 'lucide-react';

const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Building2 },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'dangerZone', label: 'Danger Zone', icon: AlertTriangle }
];

const ROLES = ['Admin', 'Editor', 'Viewer'];
const PERMISSIONS = ['Create Post', 'Edit Post', 'Approve', 'Publish', 'Schedule', 'Delete', 'Manage Team'];

const INTEGRATION_APPS = [
    { id: 'canva', name: 'Canva' },
    { id: 'slack', name: 'Slack' },
    { id: 'gdrive', name: 'Google Drive' },
    { id: 'figma', name: 'Figma' },
    { id: 'notion', name: 'Notion' }
];

const defaultMatrix = () => {
    const m = {};
    ROLES.forEach(role => {
        PERMISSIONS.forEach(perm => {
            const key = `${role}-${perm}`;
            if (role === 'Admin') {
                m[key] = true;
            } else if (role === 'Editor') {
                m[key] = ['Create Post', 'Edit Post', 'Schedule'].includes(perm);
            } else {
                m[key] = false; // Viewer — read-only
            }
        });
    });
    return m;
};

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState({
        firstName: 'Alex',
        lastName: 'Rivera',
        email: 'alex.rivera@example.com',
        phone: '+1 (555) 000-0000',
        dob: '1995-06-15',
        gender: 'Male',
        avatar: null
    });
    const [workspaceName, setWorkspaceName] = useState('Marketing Campaign 2024');
    const [workspaceUrl] = useState('lintcollab.io/marketing-2024');
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [permMatrix, setPermMatrix] = useState(defaultMatrix);
    const [integrations, setIntegrations] = useState({ canva: true, slack: false, gdrive: true, figma: false, notion: false });
    const [maskedKey, setMaskedKey] = useState('lc_live_••••••••••••••••••••');
    const [keyCopied, setKeyCopied] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const togglePerm = (role, perm) => {
        const key = `${role}-${perm}`;
        setPermMatrix(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleIntegration = (id) => {
        setIntegrations(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCopyKey = () => {
        setKeyCopied(true);
        setTimeout(() => setKeyCopied(false), 2000);
    };

    const navStyle = (id) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        padding: '0.75rem 1rem',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        background: activeTab === id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        color: activeTab === id ? 'var(--color-primary)' : 'var(--text-main)',
        fontWeight: activeTab === id ? 600 : 500,
        fontSize: '0.9rem',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s'
    });

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-h1">Settings</h1>
                <p className="text-muted">Manage workspace configuration.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
                <nav style={{
                    position: 'sticky',
                    top: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    padding: '0.5rem',
                    border: '1px solid var(--input-border)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'white'
                }}>
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveTab(id)}
                            style={navStyle(id)}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    ))}
                </nav>

                <div style={{ minWidth: 0 }}>
                    {activeTab === 'profile' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Card>
                                <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Public Profile</h3>
                                <div style={{ display: 'grid', gap: '2rem' }}>
                                    {/* Avatar Section */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <div style={{ position: 'relative' }}>
                                            <div className="avatar avatar-xl" style={{
                                                width: 100,
                                                height: 100,
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '2rem',
                                                fontWeight: 600,
                                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                                            }}>
                                                {profile.firstName[0]}{profile.lastName[0]}
                                            </div>
                                            <button style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                background: 'white',
                                                border: '1px solid var(--input-border)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}>
                                                <Camera size={16} color="var(--text-muted)" />
                                            </button>
                                        </div>
                                        <div>
                                            <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Profile Picture</h4>
                                            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>JPG, GIF or PNG. Max size of 2MB.</p>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <Button variant="outline" style={{ fontSize: '0.85rem' }}>Upload New</Button>
                                                <Button variant="ghost" style={{ fontSize: '0.85rem', color: '#dc2626' }}>Remove</Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>First name</label>
                                            <input
                                                className="input"
                                                type="text"
                                                value={profile.firstName}
                                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Last name</label>
                                            <input
                                                className="input"
                                                type="text"
                                                value={profile.lastName}
                                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Phone number</label>
                                            <input
                                                className="input"
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                style={{ width: '100%' }}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Date of Birth</label>
                                            <input
                                                className="input"
                                                type="date"
                                                value={profile.dob}
                                                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Gender</label>
                                            <select
                                                className="themed-select"
                                                value={profile.gender}
                                                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                                style={{ width: '100%' }}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                                <option value="Prefer not to say">Prefer not to say</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Email Address</label>
                                            <input
                                                className="input"
                                                type="email"
                                                value={profile.email}
                                                readOnly
                                                style={{ width: '100%', background: 'rgba(0,0,0,0.03)', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--input-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                        <Button variant="ghost">Cancel</Button>
                                        <Button variant="primary">Save Changes</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'workspace' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Card>
                                <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Workspace</h3>
                                <div style={{ display: 'grid', gap: '1.25rem' }}>
                                    <div>
                                        <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-main)' }}>Workspace name</label>
                                        <input
                                            className="input"
                                            type="text"
                                            value={workspaceName}
                                            onChange={(e) => setWorkspaceName(e.target.value)}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-main)' }}>Workspace URL</label>
                                        <input className="input" type="text" value={workspaceUrl} readOnly style={{ width: '100%', background: 'rgba(0,0,0,0.03)' }} />
                                    </div>
                                    <div>
                                        <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Logo</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div className="avatar avatar-lg" style={{ background: '#e0e7ff', width: 64, height: 64, borderRadius: 'var(--radius-md)' }} />
                                            <Button variant="outline" style={{ fontSize: '0.9rem' }}>Upload logo</Button>
                                        </div>
                                    </div>
                                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--input-border)', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button variant="primary">Save changes</Button>
                                    </div>
                                </div>
                            </Card>
                            <Card style={{ padding: '1.25rem' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>Workspace stats</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)' }}>
                                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>Members</div>
                                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>12</div>
                                    </div>
                                    <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)' }}>
                                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>Posts</div>
                                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>24</div>
                                    </div>
                                    <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)' }}>
                                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>Connected</div>
                                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>3</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'branding' && (
                        <Card>
                            <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Branding</h3>
                            <p className="text-muted" style={{ marginBottom: '1rem' }}>Customize workspace appearance.</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="avatar avatar-lg" style={{ background: '#e0e7ff', width: 56, height: 56, borderRadius: 'var(--radius-md)' }} />
                                <Button variant="outline">Change logo</Button>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'roles' && (
                        <Card>
                            <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Roles & Permissions</h3>
                            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Permission matrix by role.</p>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--input-border)', fontWeight: 600, color: 'var(--text-main)' }}>Permission</th>
                                            {ROLES.map(role => (
                                                <th key={role} style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '2px solid var(--input-border)', fontWeight: 600, color: 'var(--text-main)' }}>{role}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PERMISSIONS.map(perm => (
                                            <tr key={perm} style={{ borderBottom: '1px solid var(--input-border)' }}>
                                                <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{perm}</td>
                                                {ROLES.map(role => {
                                                    const key = `${role}-${perm}`;
                                                    const on = permMatrix[key];
                                                    return (
                                                        <td key={key} style={{ textAlign: 'center', padding: '0.75rem' }}>
                                                            <button
                                                                type="button"
                                                                role="switch"
                                                                aria-checked={on}
                                                                onClick={() => togglePerm(role, perm)}
                                                                style={{
                                                                    width: 40,
                                                                    height: 22,
                                                                    borderRadius: 11,
                                                                    border: 'none',
                                                                    background: on ? 'var(--color-primary)' : '#d1d5db',
                                                                    cursor: 'pointer',
                                                                    position: 'relative',
                                                                    transition: 'background 0.2s'
                                                                }}
                                                            >
                                                                <span style={{
                                                                    position: 'absolute',
                                                                    top: 2,
                                                                    left: on ? 20 : 2,
                                                                    width: 18,
                                                                    height: 18,
                                                                    borderRadius: '50%',
                                                                    background: 'white',
                                                                    transition: 'left 0.2s'
                                                                }} />
                                                            </button>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'integrations' && (
                        <div>
                            <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Integrations</h3>
                            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Connect external apps and services.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                                {INTEGRATION_APPS.map(app => {
                                    const connected = integrations[app.id];
                                    return (
                                        <Card
                                            key={app.id}
                                            style={{
                                                padding: '1.25rem',
                                                transition: 'transform 0.2s, box-shadow 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'none';
                                                e.currentTarget.style.boxShadow = '';
                                            }}
                                        >
                                            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{app.name}</div>
                                            <span style={{
                                                display: 'inline-block',
                                                fontSize: '0.75rem',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '999px',
                                                background: connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0,0,0,0.06)',
                                                color: connected ? '#059669' : 'var(--text-muted)',
                                                fontWeight: 600
                                            }}>
                                                {connected ? 'Connected' : 'Not connected'}
                                            </span>
                                            <Button
                                                variant={connected ? 'ghost' : 'outline'}
                                                style={{ marginTop: '1rem', width: '100%', fontSize: '0.85rem' }}
                                                onClick={() => toggleIntegration(app.id)}
                                            >
                                                {connected ? 'Disconnect' : 'Connect'}
                                            </Button>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <Card>
                            <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Security</h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--input-border)', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Two-factor authentication</div>
                                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>Add an extra layer of security</div>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={twoFAEnabled}
                                    onClick={() => setTwoFAEnabled(v => !v)}
                                    style={{
                                        width: 44,
                                        height: 24,
                                        borderRadius: 12,
                                        border: 'none',
                                        background: twoFAEnabled ? 'var(--color-primary)' : '#d1d5db',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        top: 2,
                                        left: twoFAEnabled ? 22 : 2,
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        background: 'white',
                                        transition: 'left 0.2s'
                                    }} />
                                </button>
                            </div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>Last login</h4>
                            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Feb 10, 2026 at 2:34 PM • Windows</p>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>Active sessions</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--input-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Current session • Windows</span>
                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Active now</span>
                                </div>
                                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--input-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Chrome on Mac • Feb 8</span>
                                    <Button variant="ghost" style={{ fontSize: '0.8rem' }}>Revoke</Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'notifications' && (
                        <Card>
                            <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Notifications</h3>
                            <p className="text-muted">Configure notification preferences.</p>
                        </Card>
                    )}

                    {activeTab === 'dangerZone' && (
                        <Card style={{ borderColor: '#fecaca', borderWidth: 2 }}>
                            <h3 className="text-h3" style={{ marginBottom: '0.5rem', color: '#dc2626' }}>Danger Zone</h3>
                            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Irreversible actions for this workspace.</p>
                            <Button variant="danger" onClick={() => setDeleteConfirmOpen(true)}>Delete Workspace</Button>
                        </Card>
                    )}
                </div>
            </div>

            {deleteConfirmOpen && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            zIndex: 1000
                        }}
                        onClick={() => setDeleteConfirmOpen(false)}
                    />
                    <div
                        className="dropdown-menu-premium"
                        style={{
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            padding: '1.5rem 2rem',
                            minWidth: 360,
                            zIndex: 1001,
                            borderRadius: 'var(--radius-lg)',
                        }}
                    >
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Delete workspace?</h3>
                        <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>This action cannot be undone. All data will be permanently removed.</p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                            <Button variant="danger" onClick={() => setDeleteConfirmOpen(false)}>Delete</Button>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default Settings;
