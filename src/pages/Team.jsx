// Added: Team members UI (mock, non-breaking). Invite flow and list – Plannable-style; local state only.
import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import InviteMemberModal from '../components/InviteMemberModal';
import { teamMembers } from '../data/mockData';
import { Mail, MoreVertical, Plus } from 'lucide-react';

const Team = () => {
    const [members, setMembers] = useState(() =>
        teamMembers.map((m) => ({ ...m, status: m.status === 'Pending' ? 'Invited' : m.status }))
    );
    const [inviteOpen, setInviteOpen] = useState(false);

    const handleInvite = (member) => {
        setMembers((prev) => [...prev, member]);
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

            <InviteMemberModal
                isOpen={inviteOpen}
                onClose={() => setInviteOpen(false)}
                onInvite={handleInvite}
            />

            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                <table className="team-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id} className="team-row">
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div className="avatar" style={{ background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                            {(member.name || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm" style={{ fontWeight: 600 }}>{member.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Mail size={12} /> {member.email}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ padding: '4px 12px', background: 'rgba(0,0,0,0.04)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500 }}>
                                        {member.role}
                                    </span>
                                </td>
                                <td>
                                    <Badge status={member.status} />
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button type="button" className="btn btn-ghost">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default Team;
