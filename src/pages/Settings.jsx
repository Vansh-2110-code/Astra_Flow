import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Building2, Palette, Shield, Plug, Bell, AlertTriangle, Check, Loader2, Globe, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { updateWorkspace, getWorkspaceDetail, deleteWorkspace, uploadWorkspaceLogo, getWorkspaceMembers } from '../services/workspaceService';
import { initiateFacebookLogin, initiateInstagramLogin, initiateLinkedInLogin, initiateTwitterLogin, getConnectedChannels, disconnectChannel, verifyChannel, getFacebookPosts } from '../services/channelService';
import ConnectFacebookButton from '../components/ConnectFacebookButton';

const TABS = [
    { id: 'workspace', label: 'Workspace Info', icon: Building2 },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'notifications', label: 'Workspace Notifications', icon: Bell },
    { id: 'dangerZone', label: 'Danger Zone', icon: AlertTriangle }
];

const ROLES = ['Admin', 'Editor', 'Viewer'];
const PERMISSIONS = ['Create Post', 'Edit Post', 'Approve', 'Publish', 'Schedule', 'Delete', 'Manage Team'];

const INTEGRATION_APPS = [
    { id: 'facebook', name: 'Facebook' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'twitter', name: 'X (Twitter)' },
    { id: 'canva', name: 'Canva' },
    { id: 'slack', name: 'Slack' },
    { id: 'gdrive', name: 'Google Drive' },
    { id: 'figma', name: 'Figma' },
    { id: 'notion', name: 'Notion' }
];

const TIMEZONES = [
    { label: "UTC", value: "UTC" },
    { label: "Asia/Kolkata (IST)", value: "Asia/Kolkata" },
    { label: "America/New_York (EST)", value: "America/New_York" },
    { label: "America/Los_Angeles (PST)", value: "America/Los_Angeles" },
    { label: "Europe/London (GMT)", value: "Europe/London" },
    { label: "Europe/Paris (CET)", value: "Europe/Paris" },
    { label: "Australia/Sydney (AEST)", value: "Australia/Sydney" }
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
    const [activeTab, setActiveTab] = useState('workspace');
    const [workspaceName, setWorkspaceName] = useState('Loading...');
    const [timezone, setTimezone] = useState('UTC');
    const [permMatrix, setPermMatrix] = useState(defaultMatrix);
    const [workspaceLogo, setWorkspaceLogo] = useState(null);
    const [logoLoading, setLogoLoading] = useState(false);
    const [membersCount, setMembersCount] = useState(0);
    const [postsCount, setPostsCount] = useState(0);

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
        return {
            facebook: false,
            canva: true,
            slack: false,
            gdrive: true,
            figma: false,
            notion: false
        };
    });

    // Workspace-specific notification settings
    const [workspaceNotifications, setWorkspaceNotifications] = useState(() => {
        try {
            const stored = localStorage.getItem(`workspace_${workspaceId}_notifications`);
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to load workspace notifications from localStorage:', e);
        }
        return {
            notifyReviewer: true,
            notifyAuthor: true,
            alertOnDisconnect: true,
            weeklyDigest: true,
            slackIntegration: false
        };
    });

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [connectedChannels, setConnectedChannels] = useState([]);
    const [verificationStatuses, setVerificationStatuses] = useState({});

    // Save integrations to localStorage whenever they change
    useEffect(() => {
        if (workspaceId) {
            localStorage.setItem(`workspace_${workspaceId}_integrations`, JSON.stringify(integrations));
        }
    }, [integrations, workspaceId]);

    // Save workspace notification preferences to localStorage
    useEffect(() => {
        if (workspaceId) {
            localStorage.setItem(`workspace_${workspaceId}_notifications`, JSON.stringify(workspaceNotifications));
        }
    }, [workspaceNotifications, workspaceId]);

    const togglePerm = (role, perm) => {
        const key = `${role}-${perm}`;
        setPermMatrix(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleIntegration = async (id) => {
        const redirectUri = window.location.href;
        if (id === 'facebook') {
            try {
                await initiateFacebookLogin(workspaceId, redirectUri);
            } catch (error) {
                console.error('Failed to initiate Facebook login:', error);
                setToast({
                    type: 'error',
                    message: 'Failed to connect Facebook. Please try again.'
                });
                setTimeout(() => setToast(null), 4000);
            }
            return;
        }
        if (id === 'instagram') {
            try {
                await initiateInstagramLogin(workspaceId, redirectUri);
            } catch (error) {
                console.error('Failed to initiate Instagram login:', error);
                setToast({
                    type: 'error',
                    message: 'Failed to connect Instagram. Please try again.'
                });
                setTimeout(() => setToast(null), 4000);
            }
            return;
        }
        if (id === 'linkedin') {
            try {
                await initiateLinkedInLogin(workspaceId, redirectUri);
            } catch (error) {
                console.error('Failed to initiate LinkedIn login:', error);
                setToast({
                    type: 'error',
                    message: 'Failed to connect LinkedIn. Please try again.'
                });
                setTimeout(() => setToast(null), 4000);
            }
            return;
        }
        if (id === 'twitter') {
            try {
                await initiateTwitterLogin(workspaceId, redirectUri);
            } catch (error) {
                console.error('Failed to initiate Twitter login:', error);
                setToast({
                    type: 'error',
                    message: 'Failed to connect X (Twitter). Please try again.'
                });
                setTimeout(() => setToast(null), 4000);
            }
            return;
        }
        setIntegrations(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDisconnectSingleChannel = async (channelId) => {
        try {
            await disconnectChannel(channelId);
            setConnectedChannels(prev => prev.filter(c => c.id !== channelId));
            setToast({
                type: 'success',
                message: 'Account disconnected successfully.'
            });
        } catch (error) {
            console.error('Failed to disconnect channel:', error);
            setToast({
                type: 'error',
                message: 'Failed to disconnect account. Please try again.'
            });
        }
        setTimeout(() => setToast(null), 3000);
    };

    const handleVerifyChannel = async (channelId) => {
        setVerificationStatuses(prev => ({ ...prev, [channelId]: 'verifying' }));
        try {
            const data = await verifyChannel(channelId);
            if (data.verified) {
                setVerificationStatuses(prev => ({ ...prev, [channelId]: 'verified' }));
                setToast({
                    type: 'success',
                    message: data.message || 'Channel verified successfully!'
                });
            } else {
                setVerificationStatuses(prev => ({ ...prev, [channelId]: 'failed' }));
                setToast({
                    type: 'error',
                    message: data.error || 'Verification failed.'
                });
            }
        } catch (error) {
            console.error('Failed to verify channel:', error);
            setVerificationStatuses(prev => ({ ...prev, [channelId]: 'failed' }));
            setToast({
                type: 'error',
                message: 'Failed to complete channel verification.'
            });
        }
        setTimeout(() => setToast(null), 3000);
    };

    // Load workspace details on mount
    useEffect(() => {
        const fetchDetails = async () => {
            if (!workspaceId) return;
            try {
                const data = await getWorkspaceDetail(workspaceId);
                setWorkspaceName(data.name || '');
                setTimezone(data.timezone || 'Asia/Kolkata');
                setWorkspaceLogo(data.logo || null);
            } catch (err) {
                console.error('Failed to fetch workspace details:', err);
                setToast({ type: 'error', message: 'Failed to load workspace settings' });
                setTimeout(() => setToast(null), 3000);
            }

            try {
                const members = await getWorkspaceMembers(workspaceId);
                setMembersCount(members?.length || 0);
            } catch (err) {
                console.error('Failed to fetch workspace members:', err);
            }
        };
        fetchDetails();
    }, [workspaceId]);

    // Handle OAuth redirect callbacks
    useEffect(() => {
        const facebookStatus = searchParams.get('facebook');
        const instagramStatus = searchParams.get('instagram');
        const linkedinStatus = searchParams.get('linkedin');
        const twitterStatus = searchParams.get('twitter');

        if (facebookStatus || instagramStatus || linkedinStatus || twitterStatus) {
            setActiveTab('integrations');

            const status = facebookStatus || instagramStatus || linkedinStatus || twitterStatus;
            const platformName = facebookStatus ? 'Facebook' : (instagramStatus ? 'Instagram' : (linkedinStatus ? 'LinkedIn' : 'X (Twitter)'));

            switch (status) {
                case 'success':
                    setToast({
                        type: 'success',
                        message: `${platformName} connected successfully!`
                    });
                    if (workspaceId) {
                        getConnectedChannels(workspaceId).then(data => {
                            setConnectedChannels(data || []);
                        }).catch(console.error);
                    }
                    break;

                case 'error':
                    setToast({
                        type: 'error',
                        message: `Failed to connect ${platformName}. Please try again.`
                    });
                    break;

                default:
                    setToast({
                        type: 'error',
                        message: 'An unexpected error occurred.'
                    });
            }

            setTimeout(() => setToast(null), 4000);

            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
        }
    }, [searchParams, workspaceId]);

    // Check connected state on load
    useEffect(() => {
        if (!workspaceId) return;
        getConnectedChannels(workspaceId).then(data => {
            const list = data || [];
            setConnectedChannels(list);
            setIntegrations(prev => ({
                ...prev,
                facebook: list.some(c => c.platform === 'facebook'),
                instagram: list.some(c => c.platform === 'instagram'),
                linkedin: list.some(c => c.platform === 'linkedin'),
                twitter: list.some(c => c.platform === 'twitter')
            }));
        }).catch(err => console.error("Failed to load connected channels", err));
    }, [workspaceId]);

    // Fetch posts count based on connected channels
    useEffect(() => {
        if (!workspaceId) return;
        if (!connectedChannels || connectedChannels.length === 0) {
            setPostsCount(0);
            return;
        }

        const fetchPostsCount = async () => {
            try {
                const promises = connectedChannels.map(ch => getFacebookPosts(ch.id).catch(() => []));
                const results = await Promise.all(promises);
                const total = results.reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0);
                setPostsCount(total);
            } catch (err) {
                console.error("Failed to load posts count", err);
            }
        };
        fetchPostsCount();
    }, [workspaceId, connectedChannels]);

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

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            setToast({ type: 'error', message: 'File is too large. Max size of 2MB.' });
            setTimeout(() => setToast(null), 3000);
            return;
        }
        setLogoLoading(true);
        try {
            const data = await uploadWorkspaceLogo(workspaceId, file);
            setWorkspaceLogo(data.logo);
            setToast({ type: 'success', message: 'Workspace logo uploaded successfully!' });
        } catch (err) {
            console.error('Failed to upload logo:', err);
            setToast({ type: 'error', message: err.message || 'Failed to upload logo' });
        } finally {
            setLogoLoading(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const toggleWorkspaceNotification = (key) => {
        setWorkspaceNotifications(prev => ({ ...prev, [key]: !prev[key] }));
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
                <h1 className="text-h1">Workspace Settings</h1>
                <p className="text-muted">Manage workspace configuration, integrations, permissions, and danger zone.</p>
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
                            {React.createElement(Icon, { size: 18 })}
                            {label}
                        </button>
                    ))}
                </nav>

                <div style={{ minWidth: 0 }}>
                    {activeTab === 'workspace' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Card>
                                <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>General Settings</h3>
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
                                            {workspaceLogo ? (
                                                <img src={workspaceLogo} alt="Logo" style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                                            ) : (
                                                <div className="avatar avatar-lg" style={{ background: '#e0e7ff', width: 64, height: 64, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                                    {workspaceName[0]?.toUpperCase() || 'W'}
                                                </div>
                                            )}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                style={{ fontSize: '0.9rem' }}
                                                onClick={() => document.getElementById('logo-file-input').click()}
                                                disabled={logoLoading}
                                            >
                                                {logoLoading ? <Loader2 className="animate-spin" size={16} /> : 'Upload logo'}
                                            </Button>
                                            <input
                                                id="logo-file-input"
                                                type="file"
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                disabled={logoLoading}
                                            />
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
                                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{membersCount}</div>
                                    </div>
                                    <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)' }}>
                                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>Posts</div>
                                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{postsCount}</div>
                                    </div>
                                    <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)' }}>
                                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>Connected</div>
                                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{connectedChannels.length}</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'branding' && (
                        <Card>
                            <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Branding</h3>
                            <p className="text-muted" style={{ marginBottom: '1rem' }}>Customize workspace appearance and brand parameters.</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                {workspaceLogo ? (
                                    <img src={workspaceLogo} alt="Logo" style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                                ) : (
                                    <div className="avatar avatar-lg" style={{ background: '#e0e7ff', width: 56, height: 56, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                        {workspaceName[0]?.toUpperCase() || 'W'}
                                    </div>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('branding-logo-file-input').click()}
                                    disabled={logoLoading}
                                >
                                    {logoLoading ? <Loader2 className="animate-spin" size={16} /> : 'Change logo'}
                                </Button>
                                <input
                                    id="branding-logo-file-input"
                                    type="file"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    disabled={logoLoading}
                                />
                            </div>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Primary Brand Color</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: '#6366f1', border: '1px solid var(--input-border)' }} />
                                        <input className="input" type="text" defaultValue="#6366f1" style={{ maxWidth: '120px' }} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'roles' && (
                        <Card>
                            <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Roles & Permissions</h3>
                            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Permission matrix by role for members of this workspace.</p>
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
                            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Connect external channels and apps for publishing posts and assets in this workspace.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                                {INTEGRATION_APPS.map(app => {
                                    const isSocial = ['facebook', 'instagram', 'linkedin', 'twitter'].includes(app.id);
                                    const platformChannels = connectedChannels.filter(c => c.platform === app.id);
                                    const connected = isSocial ? platformChannels.length > 0 : integrations[app.id];

                                    let AppIcon = Plug;
                                    let iconColor = 'var(--text-muted)';
                                    if (app.id === 'facebook') { AppIcon = Facebook; iconColor = '#1877f2'; }
                                    else if (app.id === 'instagram') { AppIcon = Instagram; iconColor = '#E1306C'; }
                                    else if (app.id === 'linkedin') { AppIcon = Linkedin; iconColor = '#0A66C2'; }
                                    else if (app.id === 'twitter') { AppIcon = Twitter; iconColor = '#1DA1F2'; }

                                    return (
                                        <Card
                                            key={app.id}
                                            style={{
                                                padding: '1.25rem',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between'
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
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                                    <AppIcon size={20} color={iconColor} />
                                                    <div style={{ fontWeight: 600 }}>{app.name}</div>
                                                </div>
                                                <span style={{
                                                    display: 'inline-block',
                                                    fontSize: '0.75rem',
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '999px',
                                                    background: connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0,0,0,0.06)',
                                                    color: connected ? '#059669' : 'var(--text-muted)',
                                                    fontWeight: 600,
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    {connected ? (isSocial ? `${platformChannels.length} Linked` : 'Connected') : 'Not connected'}
                                                </span>

                                                {/* If social, list connected channels */}
                                                {isSocial && platformChannels.length > 0 && (
                                                    <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem' }}>
                                                        {platformChannels.map(ch => (
                                                            <div key={ch.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.4rem 0', fontSize: '0.8rem' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                    <img src={ch.profile_picture || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=150'} alt={ch.name} style={{ width: 20, height: 20, borderRadius: '50%' }} />
                                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                        <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                                                                            {ch.name || ch.page_name}
                                                                        </span>
                                                                        {verificationStatuses[ch.id] && (
                                                                            <span style={{ 
                                                                                fontSize: '0.7rem', 
                                                                                fontWeight: 600, 
                                                                                color: verificationStatuses[ch.id] === 'verified' ? '#10B981' : (verificationStatuses[ch.id] === 'verifying' ? 'var(--text-muted)' : '#EF4444')
                                                                            }}>
                                                                                {verificationStatuses[ch.id] === 'verified' ? '● Verified' : (verificationStatuses[ch.id] === 'verifying' ? 'Verifying...' : '● Failed')}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                                    <button
                                                                        onClick={() => handleVerifyChannel(ch.id)}
                                                                        disabled={verificationStatuses[ch.id] === 'verifying'}
                                                                        style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                                    >
                                                                        {verificationStatuses[ch.id] === 'verifying' ? 'Verifying...' : 'Verify'}
                                                                    </button>
                                                                    <span style={{ color: 'rgba(0,0,0,0.1)' }}>|</span>
                                                                    <button
                                                                        onClick={() => handleDisconnectSingleChannel(ch.id)}
                                                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {app.id === 'facebook' ? (
                                                <ConnectFacebookButton
                                                    workspaceId={workspaceId}
                                                    style={{ marginTop: '1rem', width: '100%', fontSize: '0.85rem' }}
                                                />
                                            ) : (
                                                <Button
                                                    variant={(!isSocial && connected) ? 'ghost' : 'outline'}
                                                    style={{ marginTop: '1rem', width: '100%', fontSize: '0.85rem' }}
                                                    onClick={() => toggleIntegration(app.id)}
                                                >
                                                    {isSocial ? 'Link Account' : (connected ? 'Disconnect' : 'Connect')}
                                                </Button>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <Card>
                            <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>Workspace Alerts</h3>
                            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '2rem' }}>Configure notification behaviors and triggers specific to this workspace.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--input-border)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Reviewer Notifications</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Email review team immediately when posts are submitted for approval.</div>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={workspaceNotifications.notifyReviewer}
                                        onClick={() => toggleWorkspaceNotification('notifyReviewer')}
                                        style={{
                                            width: 44,
                                            height: 24,
                                            borderRadius: 12,
                                            border: 'none',
                                            background: workspaceNotifications.notifyReviewer ? 'var(--color-primary)' : '#d1d5db',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'background 0.2s',
                                            flexShrink: 0
                                        }}
                                    >
                                        <span style={{
                                            position: 'absolute',
                                            top: 2,
                                            left: workspaceNotifications.notifyReviewer ? 22 : 2,
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            background: 'white',
                                            transition: 'left 0.2s'
                                        }} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--input-border)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Author Feedback</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Send immediate update alerts to post authors when a reviewer approves or rejects their draft.</div>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={workspaceNotifications.notifyAuthor}
                                        onClick={() => toggleWorkspaceNotification('notifyAuthor')}
                                        style={{
                                            width: 44,
                                            height: 24,
                                            borderRadius: 12,
                                            border: 'none',
                                            background: workspaceNotifications.notifyAuthor ? 'var(--color-primary)' : '#d1d5db',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'background 0.2s',
                                            flexShrink: 0
                                        }}
                                    >
                                        <span style={{
                                            position: 'absolute',
                                            top: 2,
                                            left: workspaceNotifications.notifyAuthor ? 22 : 2,
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            background: 'white',
                                            transition: 'left 0.2s'
                                        }} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--input-border)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Integrations Disconnection Warnings</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Send emergency notifications if a connected social media account token expires or gets disconnected.</div>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={workspaceNotifications.alertOnDisconnect}
                                        onClick={() => toggleWorkspaceNotification('alertOnDisconnect')}
                                        style={{
                                            width: 44,
                                            height: 24,
                                            borderRadius: 12,
                                            border: 'none',
                                            background: workspaceNotifications.alertOnDisconnect ? 'var(--color-primary)' : '#d1d5db',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'background 0.2s',
                                            flexShrink: 0
                                        }}
                                    >
                                        <span style={{
                                            position: 'absolute',
                                            top: 2,
                                            left: workspaceNotifications.alertOnDisconnect ? 22 : 2,
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            background: 'white',
                                            transition: 'left 0.2s'
                                        }} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Weekly Workspace Performance Reports</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Distribute a weekly digest of published posts and engagement insights to workspace members.</div>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={workspaceNotifications.weeklyDigest}
                                        onClick={() => toggleWorkspaceNotification('weeklyDigest')}
                                        style={{
                                            width: 44,
                                            height: 24,
                                            borderRadius: 12,
                                            border: 'none',
                                            background: workspaceNotifications.weeklyDigest ? 'var(--color-primary)' : '#d1d5db',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'background 0.2s',
                                            flexShrink: 0
                                        }}
                                    >
                                        <span style={{
                                            position: 'absolute',
                                            top: 2,
                                            left: workspaceNotifications.weeklyDigest ? 22 : 2,
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            background: 'white',
                                            transition: 'left 0.2s'
                                        }} />
                                    </button>
                                </div>
                            </div>
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
