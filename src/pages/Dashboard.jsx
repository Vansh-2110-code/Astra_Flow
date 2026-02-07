
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import { Plus, Clock, FileText } from 'lucide-react';
import { workspaces } from '../data/mockData';

const Dashboard = () => {
    return (
        <DashboardLayout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-h1">Dashboard</h1>
                <p className="text-muted">Welcome back! manage your workspaces.</p>
            </div>

            <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Your Workspaces</h3>

            <div className="workspace-grid">
                <div className="card create-workspace-card">
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                        <Plus size={24} />
                    </div>
                    <span style={{ fontWeight: 600 }}>Create New Workspace</span>
                </div>

                {workspaces.map(ws => (
                    <Card key={ws.id} className="workspace-card" hover={true}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                    {ws.name.charAt(0)}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{ws.name}</h3>
                            </div>
                        </div>

                        <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <FileText size={14} />
                                <span>{ws.posts} posts</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Clock size={14} />
                                <span>{ws.activity}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
