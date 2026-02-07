import React from 'react';
import { Edit2, CheckCircle, Trash2 } from 'lucide-react';

const GridView = ({ posts }) => {
    return (
        <div className="ig-grid">
            {posts.map((post, index) => {
                const Icon = post.icon;
                return (
                    <div key={post.id} className="ig-post">
                        <img
                            src={post.media || `https://source.unsplash.com/random/400x400?sig=${index}`}
                            alt="Post"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div className="ig-overlay">
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '0.75rem',
                                alignItems: 'center'
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.5rem',
                                    color: 'white'
                                }}>
                                    {Icon && <Icon size={16} />}
                                    <span style={{ fontSize: '0.85rem' }}>{post.platform}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        style={{
                                            padding: '8px',
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                        }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        style={{
                                            padding: '8px',
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                        }}
                                    >
                                        <CheckCircle size={16} />
                                    </button>
                                    <button
                                        style={{
                                            padding: '8px',
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GridView;
