import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const CommentsPanel = ({ isOpen, onClose, post, onAddComment }) => {
    const [newComment, setNewComment] = useState('');
    const [visibility, setVisibility] = useState('team');
    const [showToast, setShowToast] = useState(false);

    if (!isOpen || !post) return null;

    const handleSubmit = (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (!newComment.trim()) return;
        onAddComment(post.id, {
            text: newComment,
            visibility: visibility,
            author: 'Current User',
            timestamp: new Date().toISOString()
        });
        setNewComment('');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(e);
        return false;
    };

    const comments = post.comments || [];

    return (
        <>
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
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '450px',
                    maxWidth: '90vw',
                    height: '100vh',
                    background: 'white',
                    borderLeft: '1px solid var(--input-border)',
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
                    <h2 className="text-h2">Comments</h2>
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
                        padding: '1.5rem',
                        overflowX: 'hidden'
                    }}
                >
                    {comments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <p>No comments yet. Be the first to comment!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {comments.map((comment, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '1rem',
                                        background: 'rgba(0, 0, 0, 0.02)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--input-border)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{comment.author}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(comment.timestamp).toLocaleString()}
                                        </span>
                                    </div>

                                    {comment.selection && (
                                        <div style={{
                                            padding: '0.75rem',
                                            background: '#f9fafb',
                                            borderLeft: '3px solid var(--color-primary)',
                                            borderRadius: 'var(--radius-sm)',
                                            marginBottom: '0.75rem',
                                            fontSize: '0.85rem',
                                            color: 'var(--text-muted)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                                                <span>Replying to:</span>
                                            </div>
                                            <div style={{ lineHeight: 1.4 }}>
                                                {(() => {
                                                    if (!post.content) return `"${comment.selection.text}"`;
                                                    const start = comment.selection.start || 0;
                                                    const end = comment.selection.end || 0;
                                                    const content = post.content;

                                                    // Show simple snippet if indices are missing or invalid
                                                    if (start === undefined || end === undefined) return `"${comment.selection.text}"`;

                                                    const prefix = content.substring(Math.max(0, start - 30), start);
                                                    const suffix = content.substring(end, Math.min(content.length, end + 30));

                                                    return (
                                                        <>
                                                            {start > 30 && "..."}{prefix}
                                                            <span style={{ background: '#fef3c7', color: '#92400e', padding: '0 2px', borderRadius: '2px', fontWeight: 500 }}>
                                                                {comment.selection.text}
                                                            </span>
                                                            {suffix}{end + 30 < content.length && "..."}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                                        {comment.text}
                                    </p>
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            fontSize: '0.7rem',
                                            padding: '0.25rem 0.5rem',
                                            background: comment.visibility === 'team' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: comment.visibility === 'team' ? 'var(--color-primary)' : '#059669',
                                            borderRadius: '12px',
                                            fontWeight: 600
                                        }}
                                    >
                                        {comment.visibility === 'team' ? 'Team Only' : 'Visible to All'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <form
                    onSubmit={handleFormSubmit}
                    style={{
                        padding: '1.5rem',
                        borderTop: '1px solid var(--input-border)',
                        background: 'white'
                    }}
                >
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'block' }}>
                            Visibility
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => setVisibility('team')}
                                style={{
                                    flex: 1,
                                    padding: '0.625rem',
                                    border: `2px solid ${visibility === 'team' ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                    borderRadius: 'var(--radius-md)',
                                    background: visibility === 'team' ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                    color: visibility === 'team' ? 'var(--color-primary)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}
                            >
                                Team Only
                            </button>
                            <button
                                type="button"
                                onClick={() => setVisibility('all')}
                                style={{
                                    flex: 1,
                                    padding: '0.625rem',
                                    border: `2px solid ${visibility === 'all' ? '#059669' : 'var(--input-border)'}`,
                                    borderRadius: 'var(--radius-md)',
                                    background: visibility === 'all' ? 'rgba(16, 185, 129, 0.05)' : 'white',
                                    color: visibility === 'all' ? '#059669' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}
                            >
                                Visible to All
                            </button>
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            rows={3}
                            className="input"
                            style={{
                                width: '100%',
                                resize: 'none',
                                fontSize: '0.9rem',
                                paddingRight: '3.5rem'
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    handleSubmit(e);
                                }
                            }}
                        />
                        <button
                            type="button"
                            disabled={!newComment.trim()}
                            onClick={(e) => { e.preventDefault(); handleSubmit(e); }}
                            style={{
                                position: 'absolute',
                                right: '0.75rem',
                                bottom: '0.75rem',
                                padding: '0.5rem',
                                background: newComment.trim() ? 'var(--color-primary)' : '#e5e7eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (newComment.trim()) {
                                    e.currentTarget.style.background = '#5558e3';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (newComment.trim()) {
                                    e.currentTarget.style.background = 'var(--color-primary)';
                                }
                            }}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Press Ctrl+Enter to send
                    </div>
                </form>

                {showToast && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '6rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '0.5rem 1rem',
                            background: '#10b981',
                            color: 'white',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 1001
                        }}
                    >
                        Comment added
                    </div>
                )}
            </div>
        </>
    );
};

export default CommentsPanel;
