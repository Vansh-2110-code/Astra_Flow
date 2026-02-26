import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Building2, Palette, Shield, Plug, Lock, Bell, AlertTriangle, Copy, Check, User, Camera, Loader2, Globe, Facebook } from 'lucide-react';
import { updateWorkspace, getWorkspaceDetail, deleteWorkspace } from '../services/workspaceService';
import { initiateFacebookLogin } from '../services/channelService';

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
    { id: 'facebook', name: 'Facebook' },
    { id: 'canva', name: 'Canva' },
    { id: 'slack', name: 'Slack' },
    { id: 'gdrive', name: 'Google Drive' },
    { id: 'figma', name: 'Figma' },
    { id: 'notion', name: 'Notion' }
];

const TIMEZONES = [
    { value: 'Asia/Kolkata', label: '(GMT+05:30) India Standard Time - Kolkata' },
    { value: 'UTC', label: '(GMT+00:00) Central Standard Time - UTC' },
    { value: 'America/New_York', label: '(GMT-05:00) Eastern Standard Time - New York' },
    { value: 'Europe/London', label: '(GMT+00:00) Western European Time - London' },
    { value: 'Asia/Dubai', label: '(GMT+04:00) Gulf Standard Time - Dubai' },
    { value: 'Australia/Sydney', label: '(GMT+11:00) Australian Eastern Daylight Time - Sydney' }
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
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
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
    const [workspaceName, setWorkspaceName] = useState('Loading...');
    const [timezone, setTimezone] = useState('UTC');
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [permMatrix, setPermMatrix] = useState(defaultMatrix);
    
    // Initialize integrations from localStorage
    const [integrations, setIntegrations] = useState(() => {
        try {
            const stored = localStorage.getItem(`workspace_${workspaceId}_integrations`);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (err) {
            console.error('Failed to load integrations from localStorage:', err);
        }
        // Default state if nothing stored
        return {
            facebook: false,
            canva: true,
            slack: false,
            gdrive: true,
            figma: false,
            notion: false
        };
    });
    
    const [maskedKey, setMaskedKey] = useState('lc_live_••••••••••••••••••••');
    const [keyCopied, setKeyCopied] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    
    // Save integrations to localStorage whenever they change
    useEffect(() => {
        if (workspaceId) {
            localStorage.setItem(`workspace_${workspaceId}_integrations`, JSON.stringify(integrations));
        }
    }, [integrations, workspaceId]);

    const togglePerm = (role, perm) => {
        const key = `${role}-${perm}`;
        setPermMatrix(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleIntegration = async (id) => {
        if (id === 'facebook') {
            if (!integrations.facebook) {
                // Connect Facebook
                try {
                    // Use the channelService to initiate Facebook OAuth
                    await initiateFacebookLogin(workspaceId);
                    // The function will handle the redirect, so no further action needed
                } catch (error) {
                    console.error('Failed to initiate Facebook login:', error);
                    setToast({ 
                        type: 'error', 
                        message: 'Failed to connect Facebook. Please try again.' 
                    });
                    setTimeout(() => setToast(null), 4000);
                }
            } else {
                // Disconnect Facebook
                setIntegrations(prev => ({ ...prev, facebook: false }));
                setToast({ 
                    type: 'success', 
                    message: 'Facebook disconnected successfully.' 
                });
                setTimeout(() => setToast(null), 3000);
                // TODO: Call backend API to disconnect Facebook when available
                // await disconnectChannel(facebookChannelId);
            }
            return;
        }
        setIntegrations(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCopyKey = () => {
        setKeyCopied(true);
        setTimeout(() => setKeyCopied(false), 2000);
    };

    // Load workspace details on mount
    useEffect(() => {
        const fetchDetails = async () => {
            if (!workspaceId) return;
            try {
                const data = await getWorkspaceDetail(workspaceId);
                setWorkspaceName(data.name || '');
                setTimezone(data.timezone || 'Asia/Kolkata');
            } catch (err) {
                console.error('Failed to fetch workspace details:', err);
                setToast({ type: 'error', message: 'Failed to load workspace settings' });
                setTimeout(() => setToast(null), 3000);
            }
        };
        fetchDetails();
    }, [workspaceId]);

    // Handle Facebook OAuth redirect callbacks
    useEffect(() => {
        const facebookStatus = searchParams.get('facebook');
        
        if (facebookStatus) {
            // Set active tab to integrations
            setActiveTab('integrations');
            
            // Handle different Facebook OAuth responses
            switch (facebookStatus) {
                case 'success':
                    setIntegrations(prev => ({ ...prev, facebook: true }));
                    setToast({ 
                        type: 'success', 
                        message: 'Facebook connected successfully!' 
                    });
                    break;
                    
                case 'error':
                    setToast({ 
                        type: 'error', 
                        message: 'Failed to connect Facebook. Please try again.' 
                    });
                    break;
                    
                case 'invalid_workspace':
                    setToast({ 
                        type: 'error', 
                        message: 'Invalid workspace. Please check your workspace ID.' 
                    });
                    break;
                    
                case 'token_failed':
                    setToast({ 
                        type: 'error', 
                        message: 'Failed to obtain Facebook token. Please try again.' 
                    });
                    break;
                    
                default:
                    setToast({ 
                        type: 'error', 
                        message: 'An unexpected error occurred.' 
                    });
            }
            
            // Clear toast after 4 seconds
            setTimeout(() => setToast(null), 4000);
            
            // Clean up URL parameters and Facebook hash
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
        }
    }, [searchParams]);

    const handleUpdateWorkspace = async () => {
        setLoading(true);
        try {
            await updateWorkspace(workspaceId, {
                name: workspaceName,
                timezone: timezone
            });
            setToast({ type: 'success', message: 'Workspace updated successfully' });
        } catch (err) {
            setToast({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleDeleteWorkspace = async () => {
        setLoading(true);
        try {
            await deleteWorkspace(workspaceId);
            setToast({ type: 'success', message: 'Workspace deleted successfully' });
            setTimeout(() => {
                navigate('/workspace');
            }, 1500);
        } catch (err) {
            setToast({ type: 'error', message: err.message });
            setLoading(false);
        } finally {
            setDeleteConfirmOpen(false);
        }
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
                                        <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-main)' }}>Timezone</label>
                                        <div style={{ position: 'relative' }}>
                                            <select
                                                className="input"
                                                value={timezone}
                                                onChange={(e) => setTimezone(e.target.value)}
                                                style={{ width: '100%', paddingRight: '2.5rem', appearance: 'none' }}
                                            >
                                                {TIMEZONES.map(tz => (
                                                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                                                ))}
                                            </select>
                                            <Globe size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Logo</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div className="avatar avatar-lg" style={{ background: '#e0e7ff', width: 64, height: 64, borderRadius: 'var(--radius-md)' }} />
                                            <Button variant="outline" style={{ fontSize: '0.9rem' }}>Upload logo</Button>
                                        </div>
                                    </div>
                                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--input-border)', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="primary"
                                            onClick={handleUpdateWorkspace}
                                            disabled={loading}
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save changes'}
                                        </Button>
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
                                    const AppIcon = app.id === 'facebook' ? Facebook : Plug;
                                    
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
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                                <AppIcon size={20} color={app.id === 'facebook' ? '#1877f2' : 'var(--text-muted)'} />
                                                <div style={{ fontWeight: 600 }}>{app.name}</div>
                                            </div>
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
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={() => setDeleteConfirmOpen(false)}
                >
                    <div
                        className="dropdown-menu-premium"
                        style={{
                            padding: '1.5rem 2rem',
                            minWidth: 360,
                            zIndex: '1101 !important',
                            borderRadius: 'var(--radius-lg)',
                            background: 'white',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Delete workspace?</h3>
                        <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>This action cannot be undone. All data will be permanently removed.</p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} disabled={loading}>Cancel</Button>
                            <Button variant="danger" onClick={handleDeleteWorkspace} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    padding: '1rem 1.5rem',
                    background: toast.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    {toast.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
                    <span style={{ fontWeight: 500 }}>{toast.message}</span>
                </div>
            )}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </DashboardLayout>
    );
};

export default Settings;
