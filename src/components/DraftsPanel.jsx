import React from 'react';
import { X } from 'lucide-react';
import PostCard from './PostCard';

const DraftsPanel = ({ isOpen, onClose, posts, title = "Drafts" }) => {
    return (
        <>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 999,
                        transition: 'opacity 0.3s'
                    }}
                    onClick={onClose}
                />
            )}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '450px',
                    maxWidth: '90vw',
                    height: '100vh',
                    background: 'var(--glass-bg)',
                    backdropFilter: 'var(--glass-blur)',
                    borderLeft: '1px solid var(--glass-border)',
                    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid var(--input-border)'
                    }}
                >
                    <h2 className="text-h2">{title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                            e.currentTarget.style.color = 'var(--text-main)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1.25rem'
                    }}
                >
                    {posts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <p>No {title.toLowerCase()} found</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {posts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DraftsPanel;
