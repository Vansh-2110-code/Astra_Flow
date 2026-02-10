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
    const [selectionState, setSelectionState] = useState(null); // { start, end, text, rect }
    const [commentText, setCommentText] = useState('');
    const [visibility, setVisibility] = useState('team');
    const [showCommentInput, setShowCommentInput] = useState(false);

    // Close comment input when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showCommentInput && !e.target.closest('.comment-popover')) {
                setShowCommentInput(false);
                setSelectionState(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showCommentInput]);

    const handleApprove = (e) => {
        e.stopPropagation();
        if (canApprove && onApprove) {
            // Toggle approval for current user
            // If hasUserApproved is true, we want to disapprove (pass false)
            // If hasUserApproved is false, we want to approve (pass true)
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

        // Calculate offset relative to the content container
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

    const handleSubmitComment = () => {
        if (!commentText.trim() || !selectionState) return;

        const newComment = {
            id: Date.now(), // Generate a temp ID
            text: commentText,
            author: currentUser,
            timestamp: new Date().toISOString(),
            visibility: visibility,
            selection: {
                start: selectionState.start,
                end: selectionState.end,
                text: selectionState.text
            }
        };

        if (onAddComment) {
            onAddComment(post.id, newComment);
        }

        setShowCommentInput(false);
        setCommentText('');
        setSelectionState(null);
        // Clear selection
        window.getSelection().removeAllRanges();
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
            if (comment.selection.start < lastIndex) return; // Skip overlaps

            // Text before highlight
            if (comment.selection.start > lastIndex) {
                parts.push(
                    <span key={`text-${idx}`}>{post.content.substring(lastIndex, comment.selection.start)}</span>
                );
            }

            // Highlighted text
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
            <div
                onClick={handleApprove}
                onMouseEnter={() => setShowApproverPopup(true)}
                onMouseLeave={() => setShowApproverPopup(false)}
                style={{
                    position: 'absolute',
                    top: '12px',
                    left: '0',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: `2px solid ${hasUserApproved ? 'var(--color-primary)' : '#d1d5db'}`, // Check specific user approval
                    background: hasUserApproved ? 'var(--color-primary)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: canApprove ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    zIndex: 10,
                    boxShadow: hasUserApproved ? '0 2px 8px rgba(99, 102, 241, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.08)',
                    transform: showApproverPopup && canApprove ? 'scale(1.1)' : 'scale(1)'
                }}
            >
                {hasUserApproved && <CheckCircle size={14} color="white" fill="white" />}
            </div>

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

            <Card className="post-card">
                <div className="post-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: 7, background: '#f3f4f6', borderRadius: '50%', color: '#374151' }}>
                            {Icon && <Icon size={16} />}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{post.platform}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{post.date} • by {post.author}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Badge status={post.status} />
                        <button className="btn-ghost">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                </div>

                <div
                    ref={contentRef}
                    onMouseUp={handleTextSelection}
                    style={{ marginBottom: '0.875rem', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.9rem', position: 'relative' }}
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
                                    style={{
                                        border: 'none',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="team">Team only</option>
                                    <option value="all">Visible to all</option>
                                </select>
                                <Button size="sm" onClick={handleSubmitComment} disabled={!commentText.trim()}>
                                    Post
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {post.media && (
                    <div className="post-media">
                        <img src={post.media} alt="Post media" />
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <Button variant="ghost" style={{ fontSize: '0.875rem', gap: '0.5rem', padding: '5px 10px' }}>
                        <Heart size={16} /> Like
                    </Button>
                    <Button
                        variant="ghost"
                        style={{ fontSize: '0.875rem', gap: '0.5rem', padding: '5px 10px' }}
                        onClick={() => onOpenComments && onOpenComments(post)}
                    >
                        <MessageSquare size={16} /> Comment
                        {post.comments?.length > 0 && (
                            <span style={{
                                background: 'var(--color-primary)',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 600
                            }}>
                                {post.comments.length}
                            </span>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default PostCard;
