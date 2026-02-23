
import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
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

const Sidebar = () => {
    const { workspaceId } = useParams();
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

    // Connected Apps: only connected platforms; mock data; extra apps so scrolling is visible.
    const connectedApps = [
        { id: 'Instagram', icon: Instagram, name: 'Instagram', count: 2, accounts: [{ handle: '@main_account' }, { handle: '@brand_account' }] },
        { id: 'Facebook', icon: Facebook, name: 'Facebook', count: 1, accounts: [{ handle: '@page1' }] },
        { id: 'LinkedIn', icon: Linkedin, name: 'LinkedIn', count: 1, accounts: [{ handle: '@profile1' }] },
        { id: 'Twitter', icon: Twitter, name: 'X (Twitter)', count: 2, accounts: [{ handle: '@company' }, { handle: '@personal' }] },
        { id: 'TikTok', icon: Music, name: 'TikTok', count: 1, accounts: [{ handle: '@brand' }] },
        { id: 'Pinterest', icon: LayoutGrid, name: 'Pinterest', count: 1, accounts: [{ handle: '@boards' }] },
        { id: 'YouTube', icon: Youtube, name: 'YouTube', count: 1, accounts: [{ handle: '@channel' }] },
        { id: 'Slack', icon: MessageCircle, name: 'Slack', count: 1, accounts: [{ handle: 'workspace' }] },
        { id: 'Google', icon: Globe, name: 'Google My Business', count: 1, accounts: [{ handle: 'Location' }] },
    ];

    const toggleAccountSelection = (platformId, handle) => {
        setSelectedAccounts((prev) => {
            const list = prev[platformId] || [];
            const next = list.includes(handle) ? list.filter((h) => h !== handle) : [...list, handle];
            return { ...prev, [platformId]: next };
        });
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    <div style={{ padding: 5, background: 'var(--color-primary)', color: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>L</div>
                    <span style={{ fontSize: '1rem' }}>LintCollab</span>
                </div>
            </div>

            <nav style={{ flex: 1 }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        style={{ fontSize: '0.8rem' }}
                    >
                        <item.icon size={18} />
                        <span style={{ fontSize: '0.8rem' }}>{item.label}</span>
                    </NavLink>
                ))}
                {/* Connected Apps: after Settings; single dropdown with scrollable app list. */}
                <div style={{ padding: '0.5rem 0', marginTop: '0.25rem' }}>
                    <button
                        type="button"
                        className="nav-item"
                        style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'transparent', font: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', marginBottom: 0, fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        onClick={() => setConnectedAppsOpen(!connectedAppsOpen)}
                    >
                        <span>Connected Apps</span>
                        <ChevronDown size={12} style={{ transform: connectedAppsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginLeft: 'auto' }} />
                    </button>
                    {connectedAppsOpen && (
                        <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                            {connectedApps.map((app) => {
                                const Icon = app.icon;
                                const isExpanded = expandedApp === app.id;
                                const selected = selectedAccounts[app.id] || [];
                                return (
                                    <div key={app.id} style={{ marginBottom: '0.2rem' }}>
                                        <button
                                            type="button"
                                            className="nav-item"
                                            style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'transparent', font: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', marginBottom: 0, fontSize: '0.75rem' }}
                                            onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                                        >
                                            <Icon size={16} />
                                            <span style={{ flex: 1, fontSize: '0.75rem' }}>{app.name}</span>
                                            <span style={{ padding: '1px 5px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 600, background: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>{app.count}</span>
                                            <ChevronDown size={12} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                        </button>
                                        {isExpanded && (
                                            <div style={{ paddingLeft: '0.75rem', paddingRight: '0.25rem', paddingBottom: '0.35rem', borderLeft: '2px solid var(--input-border)', marginLeft: '1rem', marginTop: '0.15rem' }}>
                                                {app.accounts.map((acc) => {
                                                    const isSelected = selected.includes(acc.handle);
                                                    return (
                                                        <button
                                                            key={acc.handle}
                                                            type="button"
                                                            className="nav-item"
                                                            style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'transparent', font: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.5rem', marginBottom: '0.15rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', color: 'var(--text-muted)', minHeight: 'auto' }}
                                                            onClick={(e) => { e.stopPropagation(); toggleAccountSelection(app.id, acc.handle); }}
                                                        >
                                                            <Icon size={12} />
                                                            <span style={{ flex: 1, fontSize: '0.7rem' }}>{acc.handle}</span>
                                                            {isSelected ? <Check size={10} color="var(--color-primary)" /> : <span style={{ width: 10, height: 10, border: '1px solid var(--input-border)', borderRadius: 2 }} />}
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
            <div style={{ marginTop: 'auto', padding: '0.75rem 0', position: 'relative' }}>
                {/* User popup — appears above the avatar card */}
                {showUserPopup && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '0.5rem',
                            right: '0.5rem',
                            marginBottom: '0.5rem',
                            background: 'var(--glass-bg)',
                            backdropFilter: 'var(--glass-blur)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--glass-shadow)',
                            padding: '0.85rem',
                            zIndex: 100,
                            animation: 'fadeSlideUp 0.15s ease-out',
                        }}
                        onMouseEnter={() => setShowUserPopup(true)}
                        onMouseLeave={() => setShowUserPopup(false)}
                    >
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
                            style={{
                                width: '100%',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.45rem 0.5rem',
                                border: 'none', borderRadius: 'var(--radius-sm)',
                                background: 'transparent', cursor: 'pointer',
                                fontSize: '0.8rem', fontWeight: 500,
                                color: '#ef4444',
                                transition: 'background 0.15s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
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
                    onMouseEnter={() => setShowUserPopup(true)}
                    onMouseLeave={() => setShowUserPopup(false)}
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
