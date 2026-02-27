import React, { useState, useRef, useEffect } from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { MoreHorizontal, MessageSquare, Heart, CheckCircle, Plus } from 'lucide-react';

const PostCard = ({ post, onApprove, onOpenComments, onAddComment, currentUser = 'Current User', currentUserRole = 'admin' }) => {
    const Icon = post.icon;
    const isApproved = post.approved || (post.approvedBy && post.approvedBy.length > 0);
    const hasUserApproved = post.approvedBy?.includes(currentUser);
    const approvedBy = post.approvedBy || [];
    const canApprove = ['admin', 'approver'].includes(currentUserRole);
    const [showApproverPopup, setShowApproverPopup] = useState(false);

    // Text Selection State
    const contentRef = useRef(null);
    const [selectionState, setSelectionState] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [visibility, setVisibility] = useState('team');
    const [showCommentInput, setShowCommentInput] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const isClickingOutside = !e.target.closest('.comment-popover') &&
                !e.target.closest('.comment-trigger') &&
                !e.target.closest('[data-post-content]');

            if ((showCommentInput || selectionState) && isClickingOutside) {
                setShowCommentInput(false);
                setSelectionState(null);
                setCommentText('');
                window.getSelection().removeAllRanges();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showCommentInput, selectionState]);

    const handleApprove = (e) => {
        e.stopPropagation();
        if (canApprove && onApprove) {
            onApprove(post.id, !hasUserApproved);
        }
    };

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (!selection.rangeCount || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        if (!contentRef.current.contains(range.commonAncestorContainer)) return;

        const text = selection.toString();
        if (!text.trim()) return;

        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(contentRef.current);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const start = preSelectionRange.toString().length;
        const end = start + text.length;

        const rect = range.getBoundingClientRect();
        const cardRect = contentRef.current.getBoundingClientRect();

        setSelectionState({
            start,
            end,
            text,
            top: rect.bottom - cardRect.top,
            left: rect.left - cardRect.left + (rect.width / 2)
        });
    };

    const handleSubmitComment = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!commentText.trim()) return;

        const newComment = {
            id: Date.now(),
            text: commentText,
            author: currentUser || 'Current User',
            timestamp: new Date().toISOString(),
            visibility: visibility,
            selection: selectionState ? {
                start: selectionState.start,
                end: selectionState.end,
                text: selectionState.text
            } : null
        };

        if (onAddComment) {
            onAddComment(post.id, newComment);
        }

        setShowCommentInput(false);
        setCommentText('');

        setTimeout(() => {
            window.getSelection().removeAllRanges();
        }, 100);
    };

    const renderContent = () => {
        if (!post.comments || !post.comments.some(c => c.selection)) {
            return post.content;
        }

        const commentsWithSelection = post.comments.filter(c => c.selection)
            .sort((a, b) => a.selection.start - b.selection.start);

        const parts = [];
        let lastIndex = 0;

        commentsWithSelection.forEach((comment, idx) => {
            if (comment.selection.start < lastIndex) return;

            if (comment.selection.start > lastIndex) {
                parts.push(
                    <span key={`text-${idx}`}>{post.content.substring(lastIndex, comment.selection.start)}</span>
                );
            }

            parts.push(
                <span
                    key={`highlight-${idx}`}
                    className="highlight-comment"
                    title={`${comment.author}: ${comment.text}`}
                    style={{
                        backgroundColor: '#fef3c7',
                        borderBottom: '2px solid #f59e0b',
                        cursor: 'pointer',
                        position: 'relative'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenComments) onOpenComments(post);
                    }}
                >
                    {post.content.substring(comment.selection.start, comment.selection.end)}
                </span>
            );

            lastIndex = comment.selection.end;
        });

        if (lastIndex < post.content.length) {
            parts.push(<span key="text-end">{post.content.substring(lastIndex)}</span>);
        }

        return parts;
    };

    return (
        <div style={{ position: 'relative', paddingLeft: '20px' }}>
            {/* Approval dot */}
            <div
                onClick={handleApprove}
                onMouseEnter={() => setShowApproverPopup(true)}
                onMouseLeave={() => setShowApproverPopup(false)}
                title={hasUserApproved ? 'Approved' : undefined}
                style={{
                    position: 'absolute',
                    top: '12px',
                    left: '0',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: `2px solid ${hasUserApproved ? '#10b981' : '#d1d5db'}`,
                    background: hasUserApproved ? '#10b981' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: canApprove ? 'pointer' : 'default',
                    transition: 'transform 0.2s ease, box-shadow 0.2s',
                    zIndex: 10,
                    boxShadow: hasUserApproved ? '0 2px 8px rgba(16, 185, 129, 0.35)' : '0 2px 6px rgba(0, 0, 0, 0.08)',
                    transform: hasUserApproved ? 'scale(1.08)' : (showApproverPopup && canApprove ? 'scale(1.1)' : 'scale(1)')
                }}
            >
                {hasUserApproved && <CheckCircle size={14} color="white" fill="white" />}
            </div>

            {/* Approver popup */}
            {showApproverPopup && (
                <div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        left: '0',
                        background: 'white',
                        border: '1px solid var(--input-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 100,
                        minWidth: '160px',
                        animation: 'fadeIn 0.2s ease'
                    }}
                    onMouseEnter={() => setShowApproverPopup(true)}
                    onMouseLeave={() => setShowApproverPopup(false)}
                >
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: approvedBy.length > 0 ? '0.5rem' : 0 }}>
                        {hasUserApproved ? 'Approved by you' : canApprove ? 'Click to approve' : 'Not approved yet'}
                    </div>
                    {approvedBy.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {approvedBy.map((name, index) => (
                                <div key={index} style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                                    • {name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Post Card */}
            <Card
                className="post-card"
                style={{
                    borderRadius: 10,
                    padding: '0.875rem 1rem',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
                }}
            >
                {/* Post header: platform • date | "Say something..." | ⋯ */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 28, height: 28, background: '#f3f4f6', borderRadius: '50%', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {Icon && <Icon size={15} />}
                        </div>
                        <div>
                            <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{post.platform}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0 0.3rem' }}>•</span>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{post.date}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* Plannable-style inline comment — "Say something..." */}
                        <div
                            onClick={() => onOpenComments && onOpenComments(post)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                border: '1px solid var(--input-border)',
                                background: '#fafafa',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                transition: 'border-color 0.15s',
                                minWidth: 120
                            }}
                        >
                            <div style={{
                                width: 18, height: 18, borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '0.5rem', fontWeight: 600, flexShrink: 0
                            }}>
                                {(post.author || 'U').charAt(0).toUpperCase()}
                            </div>
                            Say something...
                        </div>
                        <button className="btn-ghost" style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                </div>

                {/* Platform icon badge */}
                <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{
                        width: 24, height: 24, borderRadius: '50%', background: '#f3f4f6',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        color: '#374151'
                    }}>
                        {Icon && <Icon size={13} />}
                    </div>
                </div>

                {/* Post content with text selection */}
                <div
                    ref={contentRef}
                    data-post-content
                    onMouseUp={handleTextSelection}
                    style={{ marginBottom: '0.75rem', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.88rem', position: 'relative' }}
                >
                    {renderContent()}

                    {selectionState && !showCommentInput && (
                        <button
                            className="comment-trigger"
                            style={{
                                position: 'absolute',
                                top: selectionState.top + 10,
                                left: selectionState.left,
                                transform: 'translateX(-50%)',
                                background: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '4px 12px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                zIndex: 50,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            onClick={() => setShowCommentInput(true)}
                        >
                            <MessageSquare size={12} /> Add Comment
                        </button>
                    )}

                    {showCommentInput && (
                        <div
                            className="comment-popover"
                            style={{
                                position: 'absolute',
                                top: selectionState.top + 10,
                                left: selectionState.left,
                                transform: 'translateX(-50%)',
                                background: 'white',
                                border: '1px solid var(--input-border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '0.75rem',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                                zIndex: 60,
                                width: '220px'
                            }}
                        >
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                style={{
                                    width: '100%',
                                    border: '1px solid var(--input-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '0.5rem',
                                    fontSize: '0.85rem',
                                    marginBottom: '0.5rem',
                                    resize: 'none',
                                    minHeight: '60px',
                                    fontFamily: 'inherit'
                                }}
                                autoFocus
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <select
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value)}
                                    className="themed-select"
                                    style={{ width: 'auto', fontSize: '0.75rem', padding: '0.3rem 1.75rem 0.3rem 0.5rem' }}
                                >
                                    <option value="team">Team only</option>
                                    <option value="all">Visible to all</option>
                                </select>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleSubmitComment}
                                    disabled={!commentText.trim()}
                                >
                                    Post
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Post media */}
                {post.media && (
                    <div className="post-media">
                        <img src={post.media} alt="Post media" />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default PostCard;
