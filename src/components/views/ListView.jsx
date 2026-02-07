import React from 'react';
import Badge from '../ui/Badge';
import { MoreHorizontal } from 'lucide-react';

const ListView = ({ posts }) => {
    return (
        <div style={{ 
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-blur)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid var(--input-border)' }}>
                        <th style={{ 
                            padding: '1rem', 
                            textAlign: 'left', 
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Platform
                        </th>
                        <th style={{ 
                            padding: '1rem', 
                            textAlign: 'left', 
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Caption
                        </th>
                        <th style={{ 
                            padding: '1rem', 
                            textAlign: 'left', 
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Status
                        </th>
                        <th style={{ 
                            padding: '1rem', 
                            textAlign: 'left', 
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Scheduled
                        </th>
                        <th style={{ 
                            padding: '1rem', 
                            textAlign: 'center', 
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            width: '80px'
                        }}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post, index) => {
                        const Icon = post.icon;
                        return (
                            <tr 
                                key={post.id}
                                style={{ 
                                    borderBottom: index < posts.length - 1 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ 
                                            padding: 6, 
                                            background: '#f3f4f6', 
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {Icon && <Icon size={14} />}
                                        </div>
                                        <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                                            {post.platform}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', maxWidth: '300px' }}>
                                    <div style={{ 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis', 
                                        whiteSpace: 'nowrap',
                                        color: 'var(--text-main)',
                                        fontSize: '0.9rem'
                                    }}>
                                        {post.content}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <Badge status={post.status} />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        {post.date}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <button
                                        className="btn-ghost"
                                        style={{ padding: '6px' }}
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ListView;
