import React, { useState, useEffect, useRef } from 'react';
import { Star, MoreHorizontal, Settings, Users, Trash2 } from 'lucide-react';
import { getWorkspaceMembers } from '../services/workspaceService';
import WorkspaceSettingsModal from './WorkspaceSettingsModal';
import WorkspaceInviteModal from './WorkspaceInviteModal';

/* ── Inject spinner keyframe once ── */
if (typeof document !== 'undefined' && !document.getElementById('ws-spin-style')) {
    const s = document.createElement('style');
    s.id = 'ws-spin-style';
    s.textContent = '@keyframes ws-spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(s);
}

const stringToGradient = (str = '') => {
    const gradients = [
        'linear-gradient(135deg, #6366f1, #8b5cf6)',
        'linear-gradient(135deg, #ec4899, #8b5cf6)',
        'linear-gradient(135deg, #6366f1, #ec4899)',
        'linear-gradient(135deg, #10b981, #6366f1)',
        'linear-gradient(135deg, #f59e0b, #ec4899)',
        'linear-gradient(135deg, #3b82f6, #6366f1)',
        'linear-gradient(135deg, #14b8a6, #6366f1)',
        'linear-gradient(135deg, #8b5cf6, #ec4899)',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return gradients[Math.abs(hash) % gradients.length];
};

const getMemberName = (m) =>
    [m.first_name, m.last_name].filter(Boolean).join(' ') || m.name || m.user?.first_name || m.email || '?';

const getInitial = (m) => getMemberName(m).charAt(0).toUpperCase();

/* ── Stable mock last-activity — swap for real API field when ready ── */
const MOCK_SHORT = ['Feb 8', 'Feb 11', 'Feb 10', 'Feb 9', 'Feb 7', 'Jan 31'];
const MOCK_FULL = [
    'Feb 8 at 11:00 AM', 'Feb 11 at 03:14 PM', 'Feb 10 at 09:22 AM',
    'Feb 9 at 06:45 PM', 'Feb 7 at 02:30 PM', 'Jan 31 at 08:15 AM',
];
const mockIdx = (str = '') => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % MOCK_SHORT.length;
};

/* ── Member avatar with name / email / last-activity popup ── */
const MemberAvatar = ({ member, index, total }) => {
    const [show, setShow] = useState(false);
    const name = getMemberName(member);
    const email = member.email || member.user?.email || '';
    const gradient = stringToGradient(name);
    // TODO: replace with real member.last_activity when API is ready
    const lastActivity = MOCK_FULL[mockIdx(name)];

    return (
        <div
            style={{ position: 'relative', marginLeft: index === 0 ? 0 : '-8px', zIndex: total - index, flexShrink: 0 }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {/* Bubble */}
            <div style={{
                width: 30, height: 30, borderRadius: '50%', background: gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 600, fontSize: '0.72rem',
                border: '2px solid rgba(255,255,255,0.85)', cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            }}>
                {getInitial(member)}
            </div>

            {/* White popup */}
            {show && (
                <div style={{
                    position: 'absolute', bottom: 'calc(100% + 8px)', left: 0,
                    background: 'white', borderRadius: '10px', padding: '0.7rem 0.9rem',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.14)', border: '1px solid rgba(0,0,0,0.07)',
                    minWidth: 200, whiteSpace: 'nowrap', zIndex: 9999, pointerEvents: 'none',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: gradient,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0,
                        }}>
                            {getInitial(member)}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#111827' }}>{name}</div>
                            {email && <div style={{ fontSize: '0.71rem', color: '#6b7280' }}>{email}</div>}
                        </div>
                    </div>
                    <div style={{ fontSize: '0.71rem', color: '#6b7280' }}>
                        Last activity: {lastActivity}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── WorkspaceCard ── */
const WorkspaceCard = ({ workspace, onClick, onDelete, onFavoriteToggle, isFavorite }) => {
    const [hovered, setHovered] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [dateHovered, setDateHovered] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [members, setMembers] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!workspace?.id) return;
        getWorkspaceMembers(workspace.id)
            .then(data => {
                const list = Array.isArray(data) ? data : (data.members || data.data || []);
                setMembers(list.slice(0, 5));
            })
            .catch(() => setMembers([]));
    }, [workspace.id]);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        if (menuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    const wsName = workspace.name || 'Workspace';
    const gradient = stringToGradient(wsName);
    const idx = mockIdx(wsName);
    // TODO: replace mock with workspace.last_activity from API
    const lastActivityShort = MOCK_SHORT[idx];
    const lastActivityFull = MOCK_FULL[idx];

    return (
        <>
            <div
                style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)',
                    border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)',
                    padding: '1.1rem 1.1rem 1rem', cursor: 'pointer',
                    position: 'relative',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    transform: clicking
                        ? 'scale(1.04)'
                        : hovered ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: clicking
                        ? '0 20px 50px rgba(99,102,241,0.35)'
                        : hovered
                            ? '0 12px 32px rgba(99,102,241,0.18), 0 4px 12px rgba(31,38,135,0.08)'
                            : 'var(--glass-shadow)',
                    height: '180px', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', userSelect: 'none',
                    overflow: 'hidden',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => { setHovered(false); setDateHovered(false); }}
                onClick={() => {
                    if (menuOpen) return;
                    setClicking(true);
                    setTimeout(() => onClick(), 420);
                }}
            >
                {/* ── Click overlay: gradient fill + spinner + name ── */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 50,
                    background: gradient,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    opacity: clicking ? 1 : 0,
                    transition: 'opacity 0.22s ease',
                    pointerEvents: clicking ? 'auto' : 'none',
                    borderRadius: 'var(--radius-lg)',
                }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.35)',
                        borderTopColor: 'white',
                        animation: 'ws-spin 0.7s linear infinite',
                    }} />
                    <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.01em' }}>
                        {wsName}
                    </span>
                </div>

                {/* ── TOP: icon + name + member count + star ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                        {workspace.logo ? (
                            <img src={workspace.logo} alt={wsName} style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0, boxShadow: '0 4px 10px rgba(99,102,241,0.25)' }} />
                        ) : (
                            <div style={{
                                width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: gradient,
                                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 700, fontSize: '0.95rem',
                                boxShadow: '0 4px 10px rgba(99,102,241,0.25)',
                            }}>
                                {wsName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                            <div style={{
                                fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.93rem',
                                color: 'var(--text-main)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                                {wsName}
                            </div>
                            <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                                {members.length} member{members.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>

                    {/* Star — always visible */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onFavoriteToggle && onFavoriteToggle(workspace.id); }}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '3px', borderRadius: 'var(--radius-sm)',
                            color: isFavorite ? '#f59e0b' : 'var(--text-muted)',
                            display: 'flex', alignItems: 'center', flexShrink: 0,
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        <Star size={15} fill={isFavorite ? '#f59e0b' : 'none'} />
                    </button>
                </div>

                {/* ── MIDDLE: member avatars — fade in on card hover ── */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.18s ease',
                    overflow: 'visible',
                }}>
                    {members.map((m, i) => (
                        <MemberAvatar key={m.id || i} member={m} index={i} total={members.length} />
                    ))}
                    {members.length >= 5 && (
                        <div style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: 'rgba(99,102,241,0.1)', marginLeft: '-8px', zIndex: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', color: 'var(--color-primary)', fontWeight: 700,
                            border: '2px solid rgba(255,255,255,0.85)',
                        }}>+</div>
                    )}
                </div>

                {/* ── BOTTOM: date (fades in on hover) + dark tooltip + ··· ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.18s ease',
                }}>
                    {/* Last activity short date with dark tooltip */}
                    <div
                        style={{ position: 'relative', display: 'inline-flex' }}
                        onMouseEnter={(e) => { e.stopPropagation(); setDateHovered(true); }}
                        onMouseLeave={(e) => { e.stopPropagation(); setDateHovered(false); }}
                    >
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, cursor: 'default' }}>
                            {lastActivityShort}
                        </span>
                        {dateHovered && (
                            <div style={{
                                position: 'absolute', bottom: 'calc(100% + 6px)', left: 0,
                                background: 'rgba(17,24,39,0.92)', color: 'white',
                                fontSize: '0.71rem', fontWeight: 500,
                                padding: '5px 10px', borderRadius: '6px',
                                whiteSpace: 'nowrap', zIndex: 9999, pointerEvents: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                            }}>
                                Last activity: {lastActivityFull}
                            </div>
                        )}
                    </div>

                    {/* ··· dropdown menu */}
                    <div ref={menuRef} style={{ position: 'relative' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(prev => !prev); }}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: '3px 6px', borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                            <MoreHorizontal size={15} />
                        </button>

                        {menuOpen && (
                            <div className="dropdown-menu-premium" style={{
                                position: 'absolute', bottom: 'calc(100% + 4px)', right: 0,
                                minWidth: '180px', padding: '0.3rem',
                            }}>
                                {[
                                    { icon: <Users size={14} />, label: 'Manage people', action: () => { setMenuOpen(false); setShowInvite(true); } },
                                    { icon: <Settings size={14} />, label: 'Settings', action: () => { setMenuOpen(false); setShowSettings(true); } },
                                    { icon: <Trash2 size={14} />, label: 'Delete', danger: true, action: () => { setMenuOpen(false); onDelete && onDelete(workspace); } },
                                ].map(item => (
                                    <button
                                        key={item.label}
                                        onClick={(e) => { e.stopPropagation(); item.action(); }}
                                        className="dropdown-item-premium"
                                        style={item.danger ? { color: '#ef4444' } : {}}
                                        onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'rgba(239,68,68,0.06)' : 'var(--bg-hover)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            <WorkspaceSettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                workspace={workspace}
                onSave={() => {
                    // Force re-render by triggering parent refresh
                    setShowSettings(false);
                    // Small delay then force a re-render
                    setTimeout(() => window.location.reload(), 100);
                }}
            />
            <WorkspaceInviteModal
                isOpen={showInvite}
                onClose={() => setShowInvite(false)}
                workspaceId={workspace.id}
            />
        </>
    );
};

export default WorkspaceCard;
