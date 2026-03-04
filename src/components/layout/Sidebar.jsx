
import React, { useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import {
    FileText,
    CheckSquare,
    Image,
    BarChart2,
    Users,
    Settings,
    Instagram,
    Facebook,
    Linkedin,
    Twitter,
    Music,
    LayoutGrid,
    Youtube,
    MessageCircle,
    Globe,
    ChevronDown,
    Check,
    LogOut
} from 'lucide-react';
import { logout, getUserData } from '../../services/authService';
import { getFacebookChannels } from '../../services/channelService';

const Sidebar = ({ isOpen = true }) => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const baseUrl = `/workspace/${workspaceId}`;
    // Connected Apps: one dropdown; when open, scrollable list of apps (no Dashboard in nav).
    const [connectedAppsOpen, setConnectedAppsOpen] = useState(false);
    const [expandedApp, setExpandedApp] = useState(null);
    const [selectedAccounts, setSelectedAccounts] = useState({ 'Instagram': ['@main_account'], 'Facebook': ['@page1'], 'LinkedIn': ['@profile1'] });
    const [showUserPopup, setShowUserPopup] = useState(false);

    const user = getUserData();
    const userName = user
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'User'
        : 'User';
    const userEmail = user?.email || '';
    const userInitials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Dashboard removed from sidebar per request.
    const navItems = [
        { icon: FileText, label: 'Content', path: `${baseUrl}/content` },
        { icon: CheckSquare, label: 'Approvals', path: `${baseUrl}/approvals` },
        { icon: Image, label: 'Media Library', path: `${baseUrl}/media` },
        { icon: BarChart2, label: 'Analytics', path: `${baseUrl}/analytics` },
        { icon: Users, label: 'Team', path: `${baseUrl}/team` },
        { icon: Settings, label: 'Settings', path: `${baseUrl}/settings` },
    ];

    // Connected Apps: Base static apps
    const baseConnectedApps = [
        { id: 'Instagram', icon: Instagram, name: 'Instagram', count: 2, color: '#E1306C', accounts: [{ handle: '@main_account' }, { handle: '@brand_account' }] },
        { id: 'LinkedIn', icon: Linkedin, name: 'LinkedIn', count: 1, color: '#0A66C2', accounts: [{ handle: '@profile1' }] },
        { id: 'Twitter', icon: Twitter, name: 'X (Twitter)', count: 2, color: '#000000', accounts: [{ handle: '@company' }, { handle: '@personal' }] },
        { id: 'TikTok', icon: Music, name: 'TikTok', count: 1, color: '#000000', accounts: [{ handle: '@brand' }] },
        { id: 'Pinterest', icon: LayoutGrid, name: 'Pinterest', count: 1, color: '#E60023', accounts: [{ handle: '@boards' }] },
        { id: 'YouTube', icon: Youtube, name: 'YouTube', count: 1, color: '#FF0000', accounts: [{ handle: '@channel' }] },
        { id: 'Slack', icon: MessageCircle, name: 'Slack', count: 1, color: '#4A154B', accounts: [{ handle: 'workspace' }] },
        { id: 'Google', icon: Globe, name: 'Google My Business', count: 1, color: '#4285F4', accounts: [{ handle: 'Location' }] },
    ];

    const [connectedApps, setConnectedApps] = useState(baseConnectedApps);

    // Fetch dynamic channels (Facebook)
    React.useEffect(() => {
        if (!workspaceId) return;

        getFacebookChannels(workspaceId)
            .then(data => {
                if (data.channels && data.channels.length > 0) {
                    // Map the backend channels to our UI accounts format
                    const fbAccounts = data.channels.map(ch => ({
                        id: ch.id,           // We need the ID for API calls later
                        handle: ch.name      // Display name from API
                    }));

                    const dynamicFb = {
                        id: 'Facebook',
                        icon: Facebook,
                        name: 'Facebook',
                        count: fbAccounts.length,
                        color: '#1877F2',
                        accounts: fbAccounts
                    };

                    // Insert Facebook at index 1 to maintain relative position
                    const newApps = [...baseConnectedApps];
                    newApps.splice(1, 0, dynamicFb);
                    setConnectedApps(newApps);
                } else {
                    // If no FB channels, just ensure the static list is used (which has no FB now)
                    setConnectedApps(baseConnectedApps);
                }
            })
            .catch(err => {
                console.error("Failed to load Facebook channels for Sidebar:", err);
                setConnectedApps(baseConnectedApps);
            });
    }, [workspaceId]);


    const toggleAccountSelection = (platformId, handle) => {
        setSelectedAccounts((prev) => {
            const list = prev[platformId] || [];
            const next = list.includes(handle) ? list.filter((h) => h !== handle) : [...list, handle];
            return { ...prev, [platformId]: next };
        });
    };

    // UI redesign inspired by Plannable
    // Layout restructuring (non-breaking)
    const handleConnectedAccountClick = (appId, handle, accountId) => {
        toggleAccountSelection(appId, handle);

        if (!workspaceId) return;

        let view = 'feed';
        let platform = appId;

        if (appId === 'LinkedIn') {
            view = 'list';
        }

        // Pass the channel ID if we have it (for Facebook)
        const params = new URLSearchParams();
        params.append('platform', platform);
        params.append('view', view);
        if (accountId) {
            params.append('channel_id', accountId);
        }

        navigate(`/workspace/${workspaceId}/content?${params.toString()}`);
    };

    return (
        <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
            <div className="sidebar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    <div style={{ padding: 5, background: 'var(--color-primary)', color: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>L</div>
                    <span style={{ fontSize: '1rem' }}>LintCollab</span>
                </div>
            </div>

            <nav style={{ flex: 1, overflowY: 'auto' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={16} style={{ flexShrink: 0 }} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
                {/* Connected Apps: after Settings; single dropdown with scrollable app list. */}
                <div style={{ padding: '0.5rem 0', marginTop: '0.25rem' }}>
                    <button
                        type="button"
                        className="nav-item"
                        style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'transparent', font: 'inherit', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', marginBottom: 0, fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        onClick={() => setConnectedAppsOpen(!connectedAppsOpen)}
                    >
                        <span>Connected Apps</span>
                        <ChevronDown size={12} style={{ transform: connectedAppsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginLeft: 'auto' }} />
                    </button>
                    {connectedAppsOpen && (
                        <div style={{ paddingRight: '0.25rem' }}>
                            {connectedApps.map((app) => {
                                const Icon = app.icon;
                                const isExpanded = expandedApp === app.id;
                                const selected = selectedAccounts[app.id] || [];
                                return (
                                    <div key={app.id} style={{ marginBottom: '0.2rem' }}>
                                        <button
                                            type="button"
                                            className="nav-item"
                                            style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'transparent', font: 'inherit', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', marginBottom: 0, fontSize: '0.75rem' }}
                                            onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                                        >
                                            <Icon size={16} style={{ flexShrink: 0 }} />
                                            <span style={{ flex: 1, fontSize: '0.75rem' }}>{app.name}</span>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '20px', height: '20px', padding: '0 4px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 600, background: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>{app.count}</span>
                                            <ChevronDown size={12} style={{ flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                        </button>
                                        {isExpanded && (
                                            <div style={{ paddingLeft: '0.75rem', paddingRight: '0.25rem', paddingBottom: '0.35rem', marginLeft: '1rem', marginTop: '0.15rem' }}>
                                                {app.accounts.map((acc) => {
                                                    const isSelected = selected.includes(acc.handle);
                                                    return (
                                                        <button
                                                            key={acc.id || acc.handle}
                                                            type="button"
                                                            className={`app-nav-item ${isSelected ? 'active' : ''}`}
                                                            style={{
                                                                // Dynamically inject the brand color for the ::before pseudo-element vertical bar
                                                                '--color-primary': app.color,
                                                                fontSize: '0.7rem'
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleConnectedAccountClick(app.id, acc.handle, acc.id);
                                                            }}
                                                        >
                                                            {/* If active, use brand color. If inactive, CSS rules fallback to grey */}
                                                            <Icon size={12} color={isSelected ? app.color : undefined} />
                                                            <span style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                                {acc.handle}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </nav>

            {/* User section at bottom with popup */}
            <div
                style={{ marginTop: 'auto', padding: '0.75rem 0', position: 'relative' }}
                onMouseEnter={() => setShowUserPopup(true)}
                onMouseLeave={() => setShowUserPopup(false)}
            >
                {/* User popup — appears above the avatar card */}
                {showUserPopup && (
                    <div className="dropdown-menu-premium" style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '0.5rem',
                        right: '0.5rem',
                        marginBottom: '0.25rem',
                        padding: '0.85rem',
                    }}>
                        {/* Invisible bridge to prevent mouseleave during transition */}
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '0.5rem', background: 'transparent' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem' }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0,
                            }}>
                                {userInitials}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {userName}
                                </div>
                                {userEmail && (
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {userEmail}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ height: 1, background: 'var(--input-border)', margin: '0.25rem 0 0.5rem' }} />
                        <button
                            onClick={logout}
                            className="dropdown-item-premium"
                            style={{ color: '#ef4444' }}
                        >
                            <LogOut size={15} />
                            Log Out
                        </button>
                    </div>
                )}

                {/* User card trigger */}
                <div
                    className="nav-item"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                    <div className="avatar avatar-sm" style={{
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '0.7rem', fontWeight: 600,
                    }}>
                        {userInitials}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500 }}>{userName}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {userEmail ? userEmail : 'Member'}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
