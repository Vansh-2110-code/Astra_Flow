
import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, ChevronDown, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import NotificationPanel from '../NotificationPanel';
import { useNotifications } from '../../contexts/NotificationContext';
import { logout, getUserData } from '../../services/authService';
import { getWorkspaces } from '../../services/workspaceService';

// Compact header redesign — Plannable-style topbar
// Left: workspace picker + page-injected breadcrumb/actions
// Right: search, notifications, user avatar
const Topbar = ({ children }) => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const { getUnreadCount } = useNotifications();
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const unreadCount = getUnreadCount();
    const userMenuRef = useRef(null);

    // Workspace switcher state
    const [workspaces, setWorkspaces] = useState([]);
    const [showWsDropdown, setShowWsDropdown] = useState(false);
    const wsDropdownRef = useRef(null);

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

    // Fetch workspaces when on a workspace page
    useEffect(() => {
        if (!workspaceId) return;
        getWorkspaces()
            .then((data) => {
                const list = Array.isArray(data) ? data : (data.results || data.data || []);
                setWorkspaces(list);
            })
            .catch(() => { });
    }, [workspaceId]);

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
            if (wsDropdownRef.current && !wsDropdownRef.current.contains(e.target)) {
                setShowWsDropdown(false);
            }
        };
        if (showUserMenu || showWsDropdown) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenu, showWsDropdown]);

    const handleNotificationClick = (postId) => {
        if (workspaceId) {
            navigate(`/workspace/${workspaceId}/content`);
        }
        setIsNotificationPanelOpen(false);
    };

    const currentWs = workspaces.find((ws) => String(ws.id) === String(workspaceId));

    return (
        <>
            <header className="topbar">
                {/* Left section: workspace picker + page-injected content (breadcrumb, view switcher, etc.) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    {/* Workspace switcher — only on workspace pages */}
                    {workspaceId && (
                        <div ref={wsDropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
                            <button
                                onClick={() => setShowWsDropdown(!showWsDropdown)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                                    padding: '0.3rem 0.55rem',
                                    border: '1px solid var(--input-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    background: showWsDropdown ? 'rgba(255,255,255,0.9)' : 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    color: 'var(--text-main)',
                                    fontFamily: 'var(--font-body)',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <span style={{
                                    width: 20, height: 20, borderRadius: 5,
                                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
                                }}>
                                    {currentWs ? currentWs.name.charAt(0) : '?'}
                                </span>
                                {currentWs ? currentWs.name : 'Workspace'}
                                <ChevronDown size={12} style={{
                                    color: 'var(--text-muted)',
                                    transition: 'transform 0.15s',
                                    transform: showWsDropdown ? 'rotate(180deg)' : 'rotate(0)',
                                }} />
                            </button>

                            {showWsDropdown && (
                                <div className="dropdown-menu-premium" style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 6px)',
                                    left: 0,
                                    minWidth: '220px',
                                    padding: '0.5rem',
                                }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.25rem 0.5rem 0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        Workspaces
                                    </div>
                                    {workspaces.map((ws) => {
                                        const isActive = String(ws.id) === String(workspaceId);
                                        return (
                                            <button
                                                key={ws.id}
                                                onClick={() => {
                                                    setShowWsDropdown(false);
                                                    navigate(`/workspace/${ws.id}/content`);
                                                }}
                                                className={`dropdown-item-premium ${isActive ? 'active' : ''}`}
                                            >
                                                <span style={{
                                                    width: 24, height: 24, borderRadius: 6,
                                                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'white', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
                                                }}>
                                                    {ws.name.charAt(0)}
                                                </span>
                                                {ws.name}
                                            </button>
                                        );
                                    })}
                                    <div style={{ height: 1, background: 'var(--input-border)', margin: '0.4rem 0' }} />
                                    <button
                                        onClick={() => {
                                            setShowWsDropdown(false);
                                            navigate('/workspace');
                                        }}
                                        className="dropdown-item-premium"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        <ArrowLeft size={14} />
                                        All Workspaces
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Breadcrumb separator after workspace picker */}
                    {workspaceId && children && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 0.15rem' }}>/</span>
                    )}

                    {/* Page-injected content: breadcrumb continuation, view switcher, spacer, actions */}
                    {children && (
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, gap: '0.5rem' }}>
                            {children}
                        </div>
                    )}
                </div>

                {/* Right section: search, notifications, user avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{
                                padding: '5px 8px 5px 28px',
                                borderRadius: '20px',
                                border: '1px solid var(--input-border)',
                                background: 'rgba(255,255,255,0.5)',
                                fontSize: '0.8rem',
                                width: '140px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button
                        onClick={() => setIsNotificationPanelOpen(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', position: 'relative' }}
                    >
                        <Bell size={16} />
                        {unreadCount > 0 && (
                            <>
                                <span style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, background: 'var(--color-secondary)', borderRadius: '50%' }}></span>
                                {unreadCount > 9 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        minWidth: '16px',
                                        height: '16px',
                                        background: 'var(--color-secondary)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        fontSize: '0.6rem',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0 3px'
                                    }}>
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </>
                        )}
                    </button>

                    {/* User avatar with dropdown */}
                    <div ref={userMenuRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            style={{
                                width: 28, height: 28, borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '0.65rem', fontWeight: 600,
                                border: 'none', cursor: 'pointer',
                                transition: 'box-shadow 0.15s',
                                boxShadow: showUserMenu ? '0 0 0 2px var(--color-primary)' : 'none',
                            }}
                        >
                            {userInitials}
                        </button>

                        {showUserMenu && (
                            <div className="dropdown-menu-premium" style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                minWidth: '200px',
                                padding: '0.85rem',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem' }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontSize: '0.75rem', fontWeight: 600,
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
                    </div>
                </div>
            </header>

            <NotificationPanel
                isOpen={isNotificationPanelOpen}
                onClose={() => setIsNotificationPanelOpen(false)}
                onNotificationClick={handleNotificationClick}
            />
        </>
    );
};

export default Topbar;
