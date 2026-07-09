import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const PostHeader = ({ post }) => {
    const Icon = post.icon;

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', minHeight: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 28, height: 28, background: '#f3f4f6', borderRadius: '50%', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {Icon && <Icon size={15} />}
                </div>
                <div>
                    <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{post.platform}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0 4px' }}>•</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{post.date}</span>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="btn-ghost" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: '50%' }}>
                    <MoreHorizontal size={16} />
                </button>
            </div>
        </div>
    );
};

export default PostHeader;
