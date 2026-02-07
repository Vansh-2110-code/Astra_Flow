
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { teamMembers } from '../data/mockData';
import { Mail, MoreVertical, Plus } from 'lucide-react';

const Team = () => {
    return (
        <DashboardLayout>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-h1">Team Members</h1>
                    <p className="text-muted">Manage your collaborative team.</p>
                </div>
                <Button variant="primary">
                    <Plus size={18} /> Invite Member
                </Button>
            </div>

            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                <table className="team-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.map(member => (
                            <tr key={member.id} className="team-row">
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div className="avatar" style={{ background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{member.name}</div>
                                            <div className="text-muted" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Mail size={12} /> {member.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span style={{ padding: '4px 12px', background: '#f3f4f6', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 500 }}>
                                        {member.role}
                                    </span>
                                </td>
                                <td>
                                    <Badge status={member.status} />
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="btn-ghost">
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
