
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Settings = () => {
    return (
        <DashboardLayout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-h1">Settings</h1>
                <p className="text-muted">Manage workspace configuration.</p>
            </div>

            <div className="tabs" style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--input-border)', marginBottom: '2rem' }}>
                <button className="btn-ghost active" style={{ borderBottom: '2px solid var(--color-primary)', borderRadius: 0, paddingBottom: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>General</button>
                <button className="btn-ghost" style={{ borderRadius: 0, paddingBottom: '1rem' }}>Notifications</button>
                <button className="btn-ghost" style={{ borderRadius: 0, paddingBottom: '1rem' }}>Billing</button>
                <button className="btn-ghost" style={{ borderRadius: 0, paddingBottom: '1rem' }}>Integrations</button>
            </div>

            <div style={{ maxWidth: '600px' }}>
                <Card>
                    <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>Workspace Details</h3>

                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', paddingLeft: 4, fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-main)' }}>Workspace Name</label>
                        <input className="input" type="text" defaultValue="Marketing Campaign 2024" style={{ width: '100%' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', paddingLeft: 4, fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-main)' }}>Workspace URL</label>
                        <input className="input" type="text" defaultValue="lintcollab.io/marketing-2024" style={{ width: '100%' }} />
                    </div>

                    <div className="form-group mb-4">
                        <label className="input-label-static" style={{ display: 'block', marginBottom: '0.5rem', paddingLeft: 4, fontWeight: 500, fontSize: '0.9rem' }}>Logo</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="avatar avatar-lg" style={{ background: '#e0e7ff' }}></div>
                            <Button variant="outline" style={{ fontSize: '0.9rem' }}>Change Logo</Button>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--input-border)', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="primary">Save Changes</Button>
                    </div>
                </Card>

                <Card className="mt-4" style={{ marginTop: '1.5rem', borderColor: '#fee2e2' }}>
                    <h3 className="text-h3" style={{ marginBottom: '0.5rem', color: '#dc2626' }}>Danger Zone</h3>
                    <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Irreversible actions for this workspace.</p>
                    <Button variant="danger">Delete Workspace</Button>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
