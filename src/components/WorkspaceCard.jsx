
import React from 'react';
import Card from './ui/Card';
import { Globe, Shield } from 'lucide-react';

const roleBadgeColors = {
    admin: { bg: 'rgba(99,102,241,0.08)', color: '#6366f1' },
    editor: { bg: 'rgba(16,185,129,0.08)', color: '#10b981' },
    viewer: { bg: 'rgba(107,114,128,0.08)', color: '#6b7280' },
};

const WorkspaceCard = ({ workspace, onClick }) => {
    const roleKey = (workspace.role || '').toLowerCase();
    const badge = roleBadgeColors[roleKey] || roleBadgeColors.viewer;

    return (
        <Card className="workspace-card" hover={true} onClick={onClick}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        {workspace.name.charAt(0)}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{workspace.name}</h3>
                </div>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Shield size={14} />
                    <span style={{
                        padding: '2px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        background: badge.bg,
                        color: badge.color,
                        textTransform: 'capitalize',
                    }}>
                        {workspace.role || 'Member'}
                    </span>
                </div>
                {workspace.timezone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Globe size={14} />
                        <span>{workspace.timezone}</span>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default WorkspaceCard;
