
import React from 'react';
import Card from './ui/Card';
import { FileText, Clock } from 'lucide-react';

const WorkspaceCard = ({ workspace, onClick }) => {
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
                    <FileText size={14} />
                    <span>{workspace.posts} posts</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} />
                    <span>{workspace.activity}</span>
                </div>
            </div>
        </Card>
    );
};

export default WorkspaceCard;
