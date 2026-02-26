// Team members page — fetches real workspace members via API.
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import InviteMemberModal from '../components/InviteMemberModal';
import Toast from '../components/ui/Toast';
import { getWorkspaceMembers, removeMember, updateMemberRole } from '../services/workspaceService';
import { Mail, MoreVertical, Plus, Loader2, UserMinus, Trash2, UserCog, Shield, Edit, Eye } from 'lucide-react';

const ROLE_DESCRIPTIONS = {
    Admin: 'Full access — create, edit, approve, delete posts, manage members & settings',
    Editor: 'Can create, edit & schedule posts',
    Viewer: 'Read-only — can view posts',
};

const Team = () => {
    const { workspaceId } = useParams();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [inviteOpen, setInviteOpen] = useState(false);
    const [hoveredRole, setHoveredRole] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [toast, setToast] = useState(null);

    // Fetch members from API on mount
    useEffect(() => {
        if (!workspaceId) return;

        const fetchMembers = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getWorkspaceMembers(workspaceId);
                // API may return { members: [...] } or an array directly
                const list = Array.isArray(data) ? data : (data.members || data.data || []);
                setMembers(list);
            } catch (err) {
                console.error('Failed to fetch team members:', err);
                setError(err.message || 'Failed to load team members');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [workspaceId]);

    const handleInvite = (member) => {
        setMembers((prev) => [...prev, member]);
    };

    const handleRemoveMember = async (member) => {
        const memberId = member.id;
        const email = getMemberEmail(member);

        if (!window.confirm(`Are you sure you want to remove ${getMemberName(member)} (${email}) from this workspace?`)) {
            return;
        }

        try {
            await removeMember(workspaceId, memberId);
            setMembers((prev) => prev.filter((m) => m.id !== memberId));
            setToast({ type: 'success', message: `Member ${email} removed from workspace.` });
        } catch (err) {
            // Error is already mapped to a friendly message by the api interceptor
            setToast({ type: 'error', message: err.message });
        } finally {
            setOpenMenuId(null);
        }
    };

    const handleChangeRole = async (member, newRole) => {
        const memberId = member.id;
        const email = getMemberEmail(member);

        try {
            await updateMemberRole(workspaceId, memberId, newRole.toLowerCase());
            setMembers((prev) => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
            setToast({ type: 'success', message: `Role for ${email} updated to ${newRole}.` });
        } catch (err) {
            setToast({ type: 'error', message: err.message });
        } finally {
            setOpenMenuId(null);
        }
    };

    // Derive display-friendly name from API member object
    const getMemberName = (member) => {
        if (member.name) return member.name;
        if (member.first_name || member.last_name) {
            return `${member.first_name || ''} ${member.last_name || ''}`.trim();
        }
        if (member.user?.first_name || member.user?.last_name) {
            return `${member.user.first_name || ''} ${member.user.last_name || ''}`.trim();
        }
        return member.email || member.user?.email || 'Unknown';
    };

    const getMemberEmail = (member) => {
        return member.email || member.user?.email || '';
    };

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-h1">Team Members</h1>
                    <p className="text-muted">Manage your collaborative team.</p>
                </div>
                <Button variant="primary" onClick={() => setInviteOpen(true)}>
                    <Plus size={18} /> Invite Member
                </Button>
            </div>

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <InviteMemberModal
                isOpen={inviteOpen}
                onClose={() => setInviteOpen(false)}
                onInvite={handleInvite}
            />

            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '0.75rem', padding: '3rem', color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                    }}>
                        <Loader2 size={20} className="spin-icon" />
                        Loading team members...
                    </div>
                ) : error ? (
                    <div style={{
                        padding: '3rem', textAlign: 'center',
                        color: 'var(--input-error)', fontSize: '0.9rem',
                    }}>
                        {error}
                    </div>
                ) : members.length === 0 ? (
                    <div style={{
                        padding: '3rem', textAlign: 'center',
                        color: 'var(--text-muted)', fontSize: '0.9rem',
                    }}>
                        No team members yet. Click <strong>Invite Member</strong> to add someone.
                    </div>
                ) : (
                    <table className="team-table" style={{ overflow: 'visible' }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody style={{ overflow: 'visible' }}>
                            {members.map((member, idx) => {
                                const name = getMemberName(member);
                                const email = getMemberEmail(member);
                                const memberKey = member.id || `idx-${idx}`;
                                return (
                                    <tr key={memberKey} className="team-row" style={{ overflow: 'visible' }}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div className="avatar" style={{ background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                                    {(name || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm" style={{ fontWeight: 600 }}>{name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Mail size={12} /> {email}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="role-tooltip-wrapper"
                                                onMouseEnter={() => setHoveredRole(memberKey)}
                                                onMouseLeave={() => setHoveredRole(null)}
                                                style={{ display: 'inline-flex' }}
                                            >
                                                {hoveredRole === memberKey && ROLE_DESCRIPTIONS[member.role] && (
                                                    <div className="role-tooltip">
                                                        <strong>{member.role}:</strong> {ROLE_DESCRIPTIONS[member.role]}
                                                    </div>
                                                )}
                                                <span style={{ padding: '4px 12px', background: 'rgba(0,0,0,0.04)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500, cursor: 'default' }}>
                                                    {member.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <Badge status={member.status || 'Active'} />
                                        </td>
                                        <td style={{ textAlign: 'right', position: 'relative', overflow: 'visible' }}>
                                            <button
                                                type="button"
                                                className="btn btn-ghost"
                                                onClick={() => setOpenMenuId(openMenuId === memberKey ? null : memberKey)}
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {openMenuId === memberKey && (
                                                <>
                                                    <div
                                                        style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                                                        onClick={() => setOpenMenuId(null)}
                                                    />
                                                    <div className="dropdown-menu-premium" style={{
                                                        position: 'absolute',
                                                        top: 'calc(100% + 4px)',
                                                        right: 0,
                                                        minWidth: '160px',
                                                        padding: '0.4rem',
                                                        zIndex: 1000,
                                                    }}>
                                                        <div style={{ padding: '0.4rem', borderBottom: '1px solid var(--input-border)', marginBottom: '0.2rem' }}>
                                                            <div className="text-muted" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', fontWeight: 600, textTransform: 'uppercase' }}>Change Role</div>
                                                            <button onClick={() => handleChangeRole(member, 'Admin')} className="dropdown-item-premium" style={{ opacity: member.role === 'Admin' ? 0.5 : 1 }}>
                                                                <Shield size={14} /> Admin
                                                            </button>
                                                            <button onClick={() => handleChangeRole(member, 'Editor')} className="dropdown-item-premium" style={{ opacity: member.role === 'Editor' ? 0.5 : 1 }}>
                                                                <Edit size={14} /> Editor
                                                            </button>
                                                            <button onClick={() => handleChangeRole(member, 'Viewer')} className="dropdown-item-premium" style={{ opacity: member.role === 'Viewer' ? 0.5 : 1 }}>
                                                                <Eye size={14} /> Viewer
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveMember(member)}
                                                            className="dropdown-item-premium"
                                                            style={{ color: '#ef4444' }}
                                                        >
                                                            <UserMinus size={15} />
                                                            Remove Member
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Team;
