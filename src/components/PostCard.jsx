import React, { useState, useRef, useEffect } from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { MoreHorizontal, MessageSquare, Heart, CheckCircle, Plus, Check, Smile, Reply, Pencil, Trash2, Send, Clock, X, ChevronLeft, ChevronRight, Music } from 'lucide-react';
import { Avatar, Tooltip, IconButton, Paper, Fade, Collapse, Chip, Typography, Box, Divider, Zoom, TextField, Button as MuiButton, Badge as MuiBadge, Popover, Menu, MenuItem } from '@mui/material';
import { getAspectRatioStyles } from '../utils/mediaRules';

const PostMedia = ({ post, isMinimized }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const isCarousel = Array.isArray(post.media) && post.media.length > 1;
    const mediaUrl = isCarousel ? post.media[currentIndex] : (Array.isArray(post.media) ? post.media[0] : post.media);

    const isVideo = post.type === 'Reel' || (typeof mediaUrl === 'string' && (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.mov')));
    console.log("selva", post.media)
    if (!mediaUrl) return null;

    return (
        <div className="post-media" style={{ ...getAspectRatioStyles(post.platform, post.type), position: 'relative', overflow: 'hidden', marginBottom: post.platform === 'Instagram' ? '12px' : 0 }}>
            {isCarousel ? (
                <>
                    <div style={{
                        display: 'flex',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: `translateX(-${(currentIndex * 100) / (post.media.length || 1)}%)`,
                        height: '100%',
                        width: `${post.media.length * 100}%`
                    }}>
                        {post.media.map((m, i) => (
                            <div key={i} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
                                <img src={m} alt={`Post media ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>

                    {currentIndex > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev - 1); }}
                            style={{
                                position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)',
                                background: 'rgba(31, 41, 55, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', zIndex: 10, color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                e.currentTarget.style.background = 'rgba(31, 41, 55, 0.9)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                e.currentTarget.style.background = 'rgba(31, 41, 55, 0.7)';
                            }}
                        >
                            <ChevronLeft size={18} strokeWidth={2.5} />
                        </button>
                    )}

                    {currentIndex < post.media.length - 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev + 1); }}
                            style={{
                                position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)',
                                background: 'rgba(31, 41, 55, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', zIndex: 10, color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                e.currentTarget.style.background = 'rgba(31, 41, 55, 0.9)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                e.currentTarget.style.background = 'rgba(31, 41, 55, 0.7)';
                            }}
                        >
                            <ChevronRight size={18} strokeWidth={2.5} />
                        </button>
                    )}

                    {/* Carousel Dots */}
                    <div style={{ position: 'absolute', bottom: '8px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '4px', zIndex: 10 }}>
                        {post.media.map((_, i) => (
                            <div key={i} style={{ height: '6px', width: currentIndex === i ? '16px' : '6px', borderRadius: '3px', background: currentIndex === i ? 'var(--color-primary)' : 'rgba(255,255,255,0.6)', transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                        ))}
                    </div>
                </>
            ) : (
                isVideo ? (
                    <video src={mediaUrl} poster={post.cover_url || undefined} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <img src={mediaUrl} alt="Post media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )
            )}

            {post.audio_track && (
                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    padding: '5px 10px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    zIndex: 20,
                    maxWidth: '85%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                    <Music size={10} className="spinning-music-icon" style={{ color: '#ec4899' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                        {post.audio_track.artist} • {post.audio_track.name}
                    </span>
                    <style>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        .spinning-music-icon {
                            animation: spin 5s linear infinite;
                        }
                    `}</style>
                </div>
            )}

            {isMinimized && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '3px 8px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    zIndex: 20
                }}>
                    {isCarousel ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ opacity: 0.8 }}>Carousel</span>
                            <span style={{ fontSize: '0.6rem', color: '#9ca3af', paddingLeft: '2px' }}>{currentIndex + 1}/{post.media.length}</span>
                        </div>
                    ) : (
                        post.platform === 'TikTok' || post.type === 'Story' || post.type === 'Reel' ? '9:9 Vertical' :
                            post.type === 'Portrait' ? '4:5 Portrait' :
                                post.type === 'Landscape' ? '1.91:1 Landscape' : '1:1 Square'
                    )}
                </div>
            )}
        </div>
    );
};

const PostCard = ({
    post,
    onApprove,
    onOpenComments,
    onAddComment,
    currentUser = 'Current User',
    currentUserRole = 'admin',
    isMinimized = false,
    isPanelOpen = false,
    onDeletePost
}) => {
    const Icon = post.icon;
    const hasUserApproved = post.approvedBy?.includes(currentUser);
    const approvedBy = post.approvedBy || [];
    const canApprove = ['admin', 'approver'].includes(currentUserRole);
    const [showApproverPopup, setShowApproverPopup] = useState(false);

    // Dynamic clipping detection for sidebar comment box
    const wrapperRef = useRef(null);
    const [isCommentBoxClipped, setIsCommentBoxClipped] = useState(false);

    useEffect(() => {
        const checkClipping = () => {
            if (wrapperRef.current) {
                const rect = wrapperRef.current.getBoundingClientRect();
                // Comment box is 300px wide, offset 315px to the right
                setIsCommentBoxClipped(rect.right + 320 > window.innerWidth);
            }
        };
        checkClipping();
        window.addEventListener('resize', checkClipping);
        const observer = new ResizeObserver(checkClipping);
        if (wrapperRef.current) observer.observe(wrapperRef.current);
        return () => {
            window.removeEventListener('resize', checkClipping);
            observer.disconnect();
        };
    }, []);

    // Text Selection State
    const contentRef = useRef(null);
    const cardRef = useRef(null);
    const [selectionState, setSelectionState] = useState(null);

    const [commentText, setCommentText] = useState('');
    const visibility = 'team';
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [activeCommentMenu, setActiveCommentMenu] = useState(null);
    const [deletedComments, setDeletedComments] = useState(new Set());
    const [resolvedComments, setResolvedComments] = useState(new Set());
    const [reactions, setReactions] = useState({});
    const [editedTexts, setEditedTexts] = useState({});
    const [editingComment, setEditingComment] = useState(null);
    const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);
    const [showPlatformPopup, setShowPlatformPopup] = useState(false);
    const [showPlatformMenu, setShowPlatformMenu] = useState(false);
    const [hoveredMenuBtn, setHoveredMenuBtn] = useState(null);
    const [scheduleAnchorEl, setScheduleAnchorEl] = useState(null);
    const [tempScheduleDate, setTempScheduleDate] = useState(post.date ? new Date(post.date) : new Date());
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishDone, setPublishDone] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenuClick = (e) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };
    const handleMenuClose = (e) => {
        e?.stopPropagation();
        setAnchorEl(null);
    };
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        handleMenuClose();
        if (window.confirm("Are you sure you want to delete this post?")) {
            if (onDeletePost) {
                onDeletePost(post.id);
            }
        }
    };
    const inputRef = useRef(null);

    const platformColors = {
        Instagram: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
        LinkedIn: '#0077b5',
        Twitter: '#1d9bf0',
        Facebook: '#1877f2',
        TikTok: '#010101',
        YouTube: '#ff0000',
        Pinterest: '#e60023'
    };
    const platformColor = platformColors[post.platform] || '#6366f1';

    const handlePublishNow = () => {
        setShowPlatformMenu(false);
        setIsPublishing(true);
        setPublishDone(false);
        setTimeout(() => {
            setIsPublishing(false);
            setPublishDone(true);
            // After tick shows for 1.5s, settle into published state
            setTimeout(() => {
                setPublishDone(false);
                setIsPublished(true);
            }, 1500);
        }, 3000);
    };

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
        if (!contentRef.current) return;
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount || selection.isCollapsed) {
            setSelectionState(null);
            return;
        }

        const range = selection.getRangeAt(0);

        // Ensure the selection is fully within the text content
        if (!contentRef.current.contains(range.commonAncestorContainer)) {
            setSelectionState(null);
            return;
        }

        const text = selection.toString().trim();
        if (!text) {
            setSelectionState(null);
            return;
        }

        try {
            // Create a range covering everything from the start of the content to the start of the user's selection
            const preRange = document.createRange();
            preRange.selectNodeContents(contentRef.current);
            preRange.setEnd(range.startContainer, range.startOffset);

            // The length of this text gives us the exact starting character index in the raw content
            const start = preRange.toString().length;
            const end = start + text.length;

            const rects = range.getClientRects();
            if (!rects || rects.length === 0) return;

            // Target the *last* line of the selection for anchoring underneath
            const exactRect = rects[rects.length - 1];
            if (exactRect.width === 0 && exactRect.height === 0) return;

            const cardDom = cardRef.current;
            if (!cardDom) return;

            const cardRect = cardDom.getBoundingClientRect();

            // Calculate exact localized pixel offsets within the relative Card container
            const top = exactRect.bottom - cardRect.top + 12;
            const btnLeft = exactRect.left - cardRect.left + exactRect.width / 2;

            // Constrain popover horizontal position to prevent clipped edges
            const popoverLeft = Math.max(170, Math.min(cardRect.width - 170, btnLeft));

            setSelectionState({
                start,
                end,
                text,
                top,
                btnLeft,
                popoverLeft
            });
        } catch (err) {
            console.error('Error calculating selection range:', err);
        }
    };

    // Listen globally for mouse up to catch selections
    useEffect(() => {
        const onMouseUp = (e) => {
            if (e && e.target && (e.target.closest('.comment-trigger-btn') || e.target.closest('.comment-popover-box'))) {
                return; // Do not clear selection state if interacting with our popups
            }
            setTimeout(handleTextSelection, 50);
        };

        document.addEventListener('mouseup', onMouseUp);

        return () => {
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [selectionState, showCommentInput]);

    const handleSubmitComment = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!commentText.trim()) return;

        if (editingComment !== null) {
            setEditedTexts(prev => ({ ...prev, [editingComment]: commentText }));
            setEditingComment(null);
            setCommentText('');
            return;
        }

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

        // Reset local states to close popover and clear input
        setShowCommentInput(false);
        setSelectionState(null);
        setCommentText('');

        // Clear browser selection to show our yellow highlight clearly
        setTimeout(() => {
            try {
                const selection = window.getSelection();
                if (selection) selection.removeAllRanges();
            } catch {
                // Ignore selection clear errors
            }
        }, 50);
    };

    const renderContent = () => {
        const currentContent = post.content || '';

        if (!post.comments || !post.comments.some(c => c.selection)) {
            return currentContent;
        }

        const commentsWithSelection = post.comments
            .filter(c => c.selection && typeof c.selection.start === 'number' && typeof c.selection.end === 'number')
            .sort((a, b) => a.selection.start - b.selection.start);

        const parts = [];
        let lastIndex = 0;

        commentsWithSelection.forEach((comment, idx) => {
            const { start, end } = comment.selection;

            // Basic sanity checks to avoid infinite loops or overlaps
            if (start < lastIndex || start >= currentContent.length) return;

            // Push plain text before the highlight
            if (start > lastIndex) {
                parts.push(
                    <span key={`text-${idx}`}>{currentContent.substring(lastIndex, start)}</span>
                );
            }

            // Push the highlight span
            parts.push(
                <span
                    key={`highlight-${idx}`}
                    className="highlight-comment"
                    title={`${comment.author}: ${comment.text}`}
                    style={{
                        backgroundColor: '#fde68a', // Vibrant yellow
                        borderBottom: '2px solid #d97706', // High-contrast orange line
                        cursor: 'pointer',
                        padding: '1px 0',
                        borderRadius: '2px',
                        position: 'relative',
                        fontWeight: 600,
                        transition: 'background-color 0.2s',
                        zIndex: 1 // Ensure highlights are clickable
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenComments) onOpenComments(post);
                    }}
                >
                    {currentContent.substring(start, end)}
                </span>
            );

            lastIndex = end;
        });

        if (lastIndex < currentContent.length) {
            parts.push(<span key="text-end">{currentContent.substring(lastIndex)}</span>);
        }

        return parts;
    };

    const renderCommentItem = (comment, index) => {
        const commentKey = comment.id || index;
        if (deletedComments.has(commentKey)) return null;
        const isResolved = resolvedComments.has(commentKey);
        const textToShow = editedTexts[commentKey] || comment.text;
        const commentReactions = reactions[commentKey] || [];

        return (
            <Fade in key={commentKey} timeout={250 + (typeof index === 'number' ? index * 80 : 0)}>
                <Paper
                    elevation={0}
                    sx={{
                        bgcolor: isResolved ? '#f9fafb' : 'white',
                        opacity: isResolved ? 0.7 : 1,
                        border: '1px solid rgba(0,0,0,0.06)',
                        borderRadius: '10px',
                        p: '10px',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            borderColor: 'rgba(99, 102, 241, 0.15)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            transform: 'translateY(-1px)'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '8px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Avatar
                                sx={{
                                    width: 20, height: 20,
                                    fontSize: '9px', fontWeight: 700,
                                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                                }}
                            >
                                {comment.author.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography component="span" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-main)', textDecoration: isResolved ? 'line-through' : 'none' }}>
                                {comment.author === currentUser || comment.author === 'Admin' ? 'You' : comment.author}
                            </Typography>
                            <Typography component="span" sx={{ color: '#9ca3af', fontSize: '0.7rem' }}>· {new Date(comment.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#9ca3af', position: 'relative' }}>
                            <Box sx={{ position: 'relative' }}>
                                <Tooltip title="Reaction" arrow placement="top">
                                    <IconButton size="small" onClick={() => { setActiveEmojiPicker(activeEmojiPicker === commentKey ? null : commentKey); setActiveCommentMenu(null); }} sx={{ color: 'inherit', p: '3px', transition: 'all 0.2s', '&:hover': { color: '#f59e0b', bgcolor: 'rgba(245,158,11,0.08)' } }}>
                                        <Smile size={13} />
                                    </IconButton>
                                </Tooltip>

                                {activeEmojiPicker === commentKey && (
                                    <Fade in timeout={200}>
                                        <Paper elevation={8} sx={{ position: 'absolute', top: '100%', right: '50%', p: '8px', display: 'flex', flexWrap: 'wrap', width: '160px', gap: '4px', zIndex: 60, mt: '4px', borderRadius: '10px' }}>
                                            {['👍', '❤️', '😂', '😮', '😢', '👏', '🔥', '🎉', '😡', '💯', '🤔', '🙌'].map(emoji => (
                                                <Box component="span" key={emoji} sx={{ cursor: 'pointer', fontSize: '1rem', transition: 'transform 0.15s', p: '3px', borderRadius: '6px', display: 'inline-flex', '&:hover': { transform: 'scale(1.3)', bgcolor: 'rgba(0,0,0,0.04)' } }} onClick={() => {
                                                    setReactions(prev => {
                                                        const list = prev[commentKey] || [];
                                                        if (list.includes(emoji)) {
                                                            return { ...prev, [commentKey]: list.filter(e => e !== emoji) };
                                                        }
                                                        return { ...prev, [commentKey]: [...list, emoji] };
                                                    });
                                                    setActiveEmojiPicker(null);
                                                }}>{emoji}</Box>
                                            ))}
                                        </Paper>
                                    </Fade>
                                )}
                            </Box>
                            <Tooltip title={isResolved ? 'Unresolve' : 'Resolve'} arrow placement="top">
                                <IconButton size="small" onClick={() => setResolvedComments(prev => { const n = new Set(prev); if (n.has(commentKey)) n.delete(commentKey); else n.add(commentKey); return n; })} sx={{ p: '3px', color: isResolved ? '#10b981' : 'inherit', transition: 'all 0.2s', '&:hover': { color: '#10b981', bgcolor: 'rgba(16,185,129,0.08)' } }}>
                                    <CheckCircle size={13} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Reply" arrow placement="top">
                                <IconButton size="small" onClick={() => { setCommentText(`@${comment.author} `); if (inputRef.current) inputRef.current.focus(); }} sx={{ p: '3px', color: 'inherit', transition: 'all 0.2s', '&:hover': { color: 'var(--color-primary)', bgcolor: 'rgba(99,102,241,0.08)' } }}>
                                    <Reply size={13} />
                                </IconButton>
                            </Tooltip>
                            <IconButton size="small" onClick={() => { setActiveCommentMenu(activeCommentMenu === commentKey ? null : commentKey); setActiveEmojiPicker(null); }} sx={{ p: '3px', bgcolor: '#f3f4f6', borderRadius: '5px', color: 'inherit', transition: 'all 0.2s', '&:hover': { bgcolor: '#e5e7eb' } }}>
                                <MoreHorizontal size={13} />
                            </IconButton>

                            {activeCommentMenu === commentKey && (
                                <Fade in timeout={150}>
                                    <Paper elevation={6} sx={{ position: 'absolute', top: '100%', right: 0, p: '4px', minWidth: '110px', zIndex: 50, mt: '4px', borderRadius: '10px' }}>
                                        <Box component="button" onClick={() => { setCommentText(textToShow); setEditingComment(commentKey); setActiveCommentMenu(null); }} sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '7px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-main)', textAlign: 'left', borderRadius: '6px', transition: 'all 0.15s', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                                            <Pencil size={12} /> Edit
                                        </Box>
                                        <Box component="button" onClick={() => { setDeletedComments(prev => new Set(prev).add(commentKey)); setActiveCommentMenu(null); }} sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '7px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#ef4444', textAlign: 'left', borderRadius: '6px', transition: 'all 0.15s', '&:hover': { bgcolor: 'rgba(239,68,68,0.06)' } }}>
                                            <Trash2 size={12} /> Delete
                                        </Box>
                                    </Paper>
                                </Fade>
                            )}
                        </Box>
                    </Box>
                    {comment.selection && (
                        <Box sx={{ borderLeft: '3px solid #fbbf24', pl: '8px', mb: '6px' }}>
                            <Chip
                                label={comment.selection.text}
                                size="small"
                                sx={{
                                    bgcolor: '#fef3c7', color: '#92400e',
                                    fontSize: '0.72rem', fontWeight: 500,
                                    height: '22px', borderRadius: '5px',
                                    '& .MuiChip-label': { px: '6px' }
                                }}
                            />
                        </Box>
                    )}
                    <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-main)', textDecoration: isResolved ? 'line-through' : 'none', lineHeight: 1.5 }}>
                        {textToShow} {editedTexts[commentKey] && <Typography component="span" sx={{ fontSize: '0.65rem', color: '#9ca3af' }}>(edited)</Typography>}
                    </Typography>

                    {commentReactions.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '8px', flexWrap: 'wrap' }}>
                            {commentReactions.map((emoji, i) => (
                                <Chip
                                    key={i}
                                    label={`${emoji} 1`}
                                    size="small"
                                    onClick={() => {
                                        setReactions(prev => {
                                            const list = prev[commentKey] || [];
                                            return { ...prev, [commentKey]: list.filter(e => e !== emoji) };
                                        });
                                    }}
                                    sx={{
                                        bgcolor: '#eff6ff', border: '1px solid #bfdbfe',
                                        fontSize: '0.7rem', color: '#1d4ed8',
                                        cursor: 'pointer', height: '24px',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: '#dbeafe', transform: 'scale(1.05)' },
                                        '& .MuiChip-label': { px: '6px' }
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Paper>
            </Fade>
        );
    };

    return (
        <div
            ref={wrapperRef}
            className={`post-card ${isMinimized ? 'minimized' : ''}`}
            style={{
                position: 'relative',
                paddingLeft: isMinimized ? '0' : '20px',
                zIndex: (selectionState || showCommentInput) ? 50 : 1
            }}
        >
            {/* Approval dot - hidden if panel open or mobile */}
            {isMinimized && onApprove && (!isCommentBoxClipped && !isPanelOpen) && (
                <div
                    onClick={handleApprove}
                    onMouseEnter={() => setShowApproverPopup(true)}
                    onMouseLeave={() => setShowApproverPopup(false)}
                    title={hasUserApproved ? 'Approved' : canApprove ? 'Click to approve' : undefined}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        left: isMinimized ? '-44px' : '0',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: hasUserApproved ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: canApprove ? 'pointer' : 'default',
                        transition: 'transform 0.2s ease, box-shadow 0.2s',
                        zIndex: 10,
                        boxShadow: hasUserApproved
                            ? '0 4px 10px rgba(34, 197, 94, 0.4)'
                            : '0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.04)',
                        transform: showApproverPopup && canApprove && !hasUserApproved ? 'scale(1.06)' : 'scale(1)'
                    }}
                >
                    <Check
                        size={18}
                        color={hasUserApproved ? 'white' : '#9ca3af'}
                        strokeWidth={hasUserApproved ? 3 : 2}
                    />
                </div>
            )}

            {/* Platform icon circle - hidden if panel open or mobile */}
            {isMinimized && (!isCommentBoxClipped && !isPanelOpen) && (
                <div style={{ position: 'absolute', top: '60px', left: isMinimized ? '-44px' : '0', width: '36px', height: '36px', zIndex: showPlatformMenu ? 101 : 10 }}>
                    <style>{`
                        @keyframes spinArc { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                        @keyframes platformPulse {
                            0%, 100% { box-shadow: 0 0 0 0 rgba(200,80,120,0.5); }
                            50% { box-shadow: 0 0 0 8px rgba(200,80,120,0); }
                        }
                        @keyframes publishDone {
                            0% { transform: scale(1); }
                            40% { transform: scale(1.15); }
                            70% { transform: scale(0.95); }
                            100% { transform: scale(1); }
                        }
                    `}</style>

                    {/* Spinning SVG arc */}
                    {isPublishing && (
                        <svg width="44" height="44" style={{ position: 'absolute', top: '-4px', left: '-4px', animation: 'spinArc 1s linear infinite', zIndex: 12, pointerEvents: 'none' }}>
                            <circle cx="22" cy="22" r="20" fill="none" stroke={post.platform === 'Instagram' ? '#e6683c' : platformColor} strokeWidth="2.5" strokeLinecap="round"
                                strokeDasharray="90 36" />
                        </svg>
                    )}

                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: isPublishing || publishDone || isPublished ? platformColor : showPlatformMenu ? '#f3f4f6' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isPublishing ? `0 4px 16px rgba(0,0,0,0.2)` : isPublished ? `0 4px 12px rgba(0,0,0,0.15)` : '0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.04)',
                            color: isPublishing || publishDone || isPublished ? 'white' : '#374151',
                            cursor: isPublishing ? 'default' : 'pointer',
                            transition: 'background 0.4s ease, box-shadow 0.3s ease, color 0.3s ease',
                            animation: isPublishing ? 'platformPulse 1.5s ease-in-out infinite' : publishDone ? 'publishDone 0.5s ease' : 'none',
                            position: 'relative',
                            zIndex: 11
                        }}
                        onMouseEnter={() => !showPlatformMenu && !isPublishing && setShowPlatformPopup(true)}
                        onMouseLeave={() => setShowPlatformPopup(false)}
                        onClick={() => { if (!isPublishing) { setShowPlatformMenu(!showPlatformMenu); setShowPlatformPopup(false); } }}
                    >
                        {publishDone ? <Check size={16} strokeWidth={3} /> : Icon && <Icon size={16} />}
                    </div>
                </div>
            )}

            {/* Animated platform action menu */}
            {showPlatformMenu && (
                <div
                    style={{
                        position: 'absolute',
                        top: '60px',
                        left: isMinimized ? '-44px' : '0',
                        width: '36px',
                        background: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        overflow: 'visible',
                        animation: 'platformMenuExpand 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                        transformOrigin: 'top center',
                        padding: '4px 0'
                    }}
                >
                    <style>{`
                        @keyframes platformMenuExpand {
                            0% { transform: scaleY(0); opacity: 0; }
                            100% { transform: scaleY(1); opacity: 1; }
                        }
                    `}</style>

                    {/* Close */}
                    <button
                        onClick={() => setShowPlatformMenu(false)}
                        title="Close"
                        style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '50%', flexShrink: 0 }}
                    >
                        <X size={14} />
                    </button>

                    <div style={{ width: '20px', height: '1px', background: '#f3f4f6', margin: '2px 0' }} />

                    {/* Post Now */}
                    <div style={{ position: 'relative', width: '36px' }}>
                        {hoveredMenuBtn === 'post' && (
                            <div style={{ position: 'absolute', top: '50%', right: '44px', transform: 'translateY(-50%)', background: '#1f2937', color: 'white', borderRadius: '6px', padding: '5px 10px', fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', pointerEvents: 'none', zIndex: 200 }}>
                                Publish now
                                <div style={{ position: 'absolute', top: '50%', right: '-4px', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '4px solid #1f2937' }} />
                            </div>
                        )}
                        <button
                            onClick={handlePublishNow}
                            onMouseEnter={() => { setHoveredMenuBtn('post'); }}
                            onMouseLeave={() => setHoveredMenuBtn(null)}
                            style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: hoveredMenuBtn === 'post' ? '#f3f4f6' : 'none', border: 'none', cursor: 'pointer', color: '#374151', borderRadius: '50%', flexShrink: 0, transition: 'background 0.15s' }}
                        >
                            <Send size={14} />
                        </button>
                    </div>

                    {/* Schedule */}
                    <div style={{ position: 'relative', width: '36px' }}>
                        {hoveredMenuBtn === 'schedule' && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                right: '44px',
                                transform: 'translateY(-50%)',
                                background: '#1f2937',
                                color: 'white',
                                borderRadius: '6px',
                                padding: '5px 10px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                pointerEvents: 'none',
                                zIndex: 200,
                            }}>
                                Schedule
                                <div style={{ position: 'absolute', top: '50%', right: '-4px', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '4px solid #1f2937' }} />
                            </div>
                        )}
                        <button
                            onClick={() => { setShowPlatformMenu(false); }}
                            onMouseEnter={() => setHoveredMenuBtn('schedule')}
                            onMouseLeave={() => setHoveredMenuBtn(null)}
                            style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: hoveredMenuBtn === 'schedule' ? '#f3f4f6' : 'none', border: 'none', cursor: 'pointer', color: '#374151', borderRadius: '50%', flexShrink: 0, transition: 'background 0.15s' }}
                        >
                            <Clock size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Platform status popup */}
            {showPlatformPopup && (
                <div
                    style={{
                        position: 'absolute',
                        top: '54px',
                        left: '-300px',
                        background: 'white',
                        border: '1px solid #f3f4f6',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                        zIndex: 100,
                        minWidth: '220px',
                        animation: 'fadeIn 0.2s ease'
                    }}
                    onMouseEnter={() => setShowPlatformPopup(true)}
                    onMouseLeave={() => setShowPlatformPopup(false)}
                >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{ flexShrink: 0, marginTop: '1px' }}>
                            <CheckCircle size={16} color="#3b82f6" strokeWidth={2} fill="#eff6ff" />
                        </div>
                        <div style={{ fontSize: '0.83rem', color: '#1f2937', lineHeight: 1.5 }}>
                            Post is ready to be published
                        </div>
                    </div>
                </div>
            )}

            {/* Approver popup */}
            {showApproverPopup && (
                <div
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: isMinimized ? '0px' : '44px',
                        background: 'white',
                        border: '1px solid #f3f4f6',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                        zIndex: 100,
                        minWidth: '200px',
                        animation: 'fadeIn 0.2s ease'
                    }}
                    onMouseEnter={() => setShowApproverPopup(true)}
                    onMouseLeave={() => setShowApproverPopup(false)}
                >
                    {hasUserApproved ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#1f2937' }}>
                                <strong>You</strong> approved this post
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                just now
                            </div>
                            {approvedBy.length > 1 && (
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                                    Also approved by: {approvedBy.filter(name => name !== currentUser).join(', ')}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#1f2937' }}>
                                {canApprove ? 'Click to approve' : 'Not approved yet'}
                            </div>
                            {approvedBy.length > 0 && (
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                                    Approved by: {approvedBy.join(', ')}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Post Card */}
            <Card
                ref={cardRef}
                className="post-card"
                style={{
                    borderRadius: 10,
                    padding: '12px 16px',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                    position: 'relative'
                }}
            >
                {/* Post header: platform • date | "Say something..." | ⋯ */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', minHeight: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 28, height: 28, background: '#f3f4f6', borderRadius: '50%', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {Icon && <Icon size={15} />}
                        </div>
                        <div>
                            <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{post.platform}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0 4px' }}>•</span>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{post.date}</span>
                            {post.status === 'Scheduled' && post.scheduledTime && (
                                <>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0 4px' }}>•</span>
                                    <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600 }}>
                                        Scheduled for {new Date(post.scheduledTime).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                            className="btn-ghost" 
                            onClick={handleMenuClick}
                            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: '50%' }}
                        >
                            <MoreHorizontal size={16} />
                        </button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                sx: {
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    borderRadius: '8px',
                                    minWidth: '120px'
                                }
                            }}
                        >
                            <MenuItem onClick={handleDeleteClick} style={{ color: '#ef4444', fontSize: '0.82rem', gap: '8px' }}>
                                <Trash2 size={14} /> Delete Post
                            </MenuItem>
                        </Menu>
                    </div>
                </div>

                {/* Post media */}
                {post.platform === 'Instagram' && post.media && (
                    <PostMedia post={post} isMinimized={isMinimized} />
                )}

                {/* Post content with text selection */}
                <div
                    ref={contentRef}
                    data-post-content
                    style={{
                        marginBottom: '12px',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                        fontSize: '0.88rem',
                        position: 'relative',
                        // Disable clamping if comments exist to show highlights properly
                        display: isMinimized && (!post.comments || post.comments.length === 0) ? '-webkit-box' : 'block',
                        WebkitLineClamp: isMinimized && (!post.comments || post.comments.length === 0) ? 2 : 'none',
                        WebkitBoxOrient: 'vertical',
                        overflow: isMinimized && (!post.comments || post.comments.length === 0) ? 'hidden' : 'visible'
                    }}
                >
                    {renderContent()}
                </div>

                {/* Post media */}
                {post.platform !== 'Instagram' && post.media && (
                    <PostMedia post={post} isMinimized={isMinimized} />
                )}

                {/* New Responsive Action Bar (shows on smaller screens or when side panel is open) */}
                {(isCommentBoxClipped || isPanelOpen) && (
                    <Fade in timeout={300}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            py: '8px',
                            my: '8px',
                            borderTop: '1px solid var(--input-border)',
                            borderBottom: '1px solid var(--input-border)',
                            background: 'transparent'
                        }}>
                            {/* Approval Action */}
                            <Tooltip
                                title={hasUserApproved || approvedBy.length > 0 ? `Approved by: ${approvedBy.join(', ') || currentUser}` : canApprove ? 'Click to approve' : 'Approval'}
                                arrow
                                placement="top"
                            >
                                <IconButton
                                    onClick={handleApprove}
                                    size="small"
                                    disabled={!canApprove}
                                    sx={{
                                        color: hasUserApproved ? '#22c55e' : 'var(--text-main)',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        borderRadius: '8px',
                                        px: 1.5,
                                        '&:hover': {
                                            bgcolor: hasUserApproved ? 'rgba(34,197,94,0.08)' : 'rgba(0,0,0,0.04)',
                                            transform: 'scale(1.08)'
                                        }
                                    }}
                                >
                                    <Check size={18} strokeWidth={hasUserApproved ? 3 : 2} />
                                </IconButton>
                            </Tooltip>

                            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'rgba(0,0,0,0.06)' }} />

                            {/* Comment Count Action */}
                            <Tooltip title="Open comments" arrow placement="top">
                                <IconButton
                                    onClick={(e) => { e.stopPropagation(); if (onOpenComments) onOpenComments(post); }}
                                    size="small"
                                    sx={{
                                        color: 'var(--text-main)',
                                        borderRadius: '8px',
                                        px: 1.5,
                                        gap: '6px',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            bgcolor: 'rgba(99,102,241,0.06)',
                                            color: 'var(--color-primary)',
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                >
                                    <MuiBadge badgeContent={post.comments?.length || 0} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: '16px', minWidth: '16px' } }}>
                                        <MessageSquare size={18} />
                                    </MuiBadge>
                                    <Typography component="span" sx={{ fontSize: '0.82rem', ml: 0.5 }}>Comment</Typography>
                                </IconButton>
                            </Tooltip>

                            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'rgba(0,0,0,0.06)' }} />

                            {/* Status Action */}
                            <Tooltip title={post.status === 'Draft' || post.status === 'Scheduled' ? 'Click to schedule' : ''} arrow placement="top">
                                <Chip
                                    icon={post.status === 'Published' ? <Send size={13} /> : <Clock size={13} />}
                                    label={post.status}
                                    size="small"
                                    variant="outlined"
                                    onClick={(e) => {
                                        if (post.status === 'Draft' || post.status === 'Scheduled') {
                                            setScheduleAnchorEl(e.currentTarget);
                                            setTempScheduleDate(post.date ? new Date(post.date) : new Date());
                                        }
                                    }}
                                    sx={{
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        height: '28px',
                                        borderRadius: '8px',
                                        color: post.status === 'Published' ? '#3b82f6' : 'var(--text-main)',
                                        borderColor: post.status === 'Published' ? 'rgba(59,130,246,0.3)' : 'rgba(0,0,0,0.1)',
                                        bgcolor: post.status === 'Published' ? 'rgba(59,130,246,0.05)' : 'transparent',
                                        transition: 'all 0.2s',
                                        cursor: (post.status === 'Draft' || post.status === 'Scheduled') ? 'pointer' : 'default',
                                        '& .MuiChip-icon': { color: 'inherit' },
                                        '&:hover': (post.status === 'Draft' || post.status === 'Scheduled') ? {
                                            bgcolor: 'rgba(0,0,0,0.04)',
                                            borderColor: 'rgba(0,0,0,0.2)'
                                        } : {}
                                    }}
                                />
                            </Tooltip>
                        </Box>
                    </Fade>
                )}

                {/* Schedule Calendar Popover */}
                <Popover
                    open={Boolean(scheduleAnchorEl)}
                    anchorEl={scheduleAnchorEl}
                    onClose={() => setScheduleAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    PaperProps={{
                        sx: {
                            mt: 1, p: 2, width: 320, borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <ChevronLeft
                                    size={16}
                                    color="#9ca3af"
                                    cursor="pointer"
                                    onClick={() => {
                                        const newDate = new Date(tempScheduleDate);
                                        newDate.setMonth(newDate.getMonth() - 1);
                                        setTempScheduleDate(newDate);
                                    }}
                                />
                                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                                    {tempScheduleDate.toLocaleString('default', { month: 'long' })} {tempScheduleDate.getFullYear()}
                                </Typography>
                                <ChevronRight
                                    size={16}
                                    color="#9ca3af"
                                    cursor="pointer"
                                    onClick={() => {
                                        const newDate = new Date(tempScheduleDate);
                                        newDate.setMonth(newDate.getMonth() + 1);
                                        setTempScheduleDate(newDate);
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280', mb: 1 }}>
                            <Box>Mo</Box><Box>Tu</Box><Box>We</Box><Box>Th</Box><Box>Fr</Box><Box>Sa</Box><Box>Su</Box>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                            {(() => {
                                const currYear = tempScheduleDate.getFullYear();
                                const currMonth = tempScheduleDate.getMonth();
                                const daysInMonth = new Date(currYear, currMonth + 1, 0).getDate();
                                const firstDayIndex = new Date(currYear, currMonth, 1).getDay();
                                const prevDays = new Date(currYear, currMonth, 0).getDate();

                                const cells = [];
                                for (let x = firstDayIndex === 0 ? 6 : firstDayIndex - 1; x > 0; x--) {
                                    cells.push({ day: prevDays - x + 1, current: false, date: new Date(currYear, currMonth - 1, prevDays - x + 1) });
                                }
                                for (let i = 1; i <= daysInMonth; i++) {
                                    cells.push({ day: i, current: true, date: new Date(currYear, currMonth, i) });
                                }
                                const nextDays = 42 - cells.length;
                                for (let j = 1; j <= nextDays; j++) {
                                    cells.push({ day: j, current: false, date: new Date(currYear, currMonth + 1, j) });
                                }

                                return cells.map((cell, idx) => {
                                    const isSelected = cell.current && cell.date.toDateString() === tempScheduleDate.toDateString();
                                    return (
                                        <Box
                                            key={idx}
                                            onClick={() => {
                                                const newDate = new Date(cell.date);
                                                newDate.setHours(tempScheduleDate.getHours());
                                                newDate.setMinutes(tempScheduleDate.getMinutes());
                                                setTempScheduleDate(newDate);
                                            }}
                                            sx={{
                                                py: 0.75, fontSize: '13px', borderRadius: '6px', cursor: 'pointer',
                                                bgcolor: isSelected ? '#3b82f6' : 'transparent',
                                                color: isSelected ? 'white' : (cell.current ? '#111827' : '#d1d5db'),
                                                fontWeight: isSelected ? 700 : 500,
                                                '&:hover': { bgcolor: isSelected ? '#2563eb' : 'rgba(0,0,0,0.04)' }
                                            }}
                                        >
                                            {cell.day}
                                        </Box>
                                    );
                                });
                            })()}
                        </Box>

                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>Select Time</Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                            <Box sx={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '6px', p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                                    {((tempScheduleDate.getHours() % 12) || 12).toString().padStart(2, '0')}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <ChevronLeft size={10} style={{ transform: 'rotate(90deg)', cursor: 'pointer' }} onClick={() => { const d = new Date(tempScheduleDate); d.setHours(d.getHours() + 1); setTempScheduleDate(d); }} />
                                    <ChevronLeft size={10} style={{ transform: 'rotate(-90deg)', cursor: 'pointer' }} onClick={() => { const d = new Date(tempScheduleDate); d.setHours(d.getHours() - 1); setTempScheduleDate(d); }} />
                                </Box>
                            </Box>
                            <Typography sx={{ fontWeight: 'bold' }}>:</Typography>
                            <Box sx={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '6px', p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                                    {tempScheduleDate.getMinutes().toString().padStart(2, '0')}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <ChevronLeft size={10} style={{ transform: 'rotate(90deg)', cursor: 'pointer' }} onClick={() => { const d = new Date(tempScheduleDate); d.setMinutes(d.getMinutes() + 1); setTempScheduleDate(d); }} />
                                    <ChevronLeft size={10} style={{ transform: 'rotate(-90deg)', cursor: 'pointer' }} onClick={() => { const d = new Date(tempScheduleDate); d.setMinutes(d.getMinutes() - 1); setTempScheduleDate(d); }} />
                                </Box>
                            </Box>
                            <Box
                                sx={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '6px', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', bgcolor: 'rgba(0,0,0,0.02)', '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}
                                onClick={() => { const d = new Date(tempScheduleDate); d.setHours((d.getHours() + 12) % 24); setTempScheduleDate(d); }}
                            >
                                <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                                    {tempScheduleDate.getHours() >= 12 ? 'PM' : 'AM'}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <MuiButton size="small" sx={{ textTransform: 'none', color: '#6b7280', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }} onClick={() => setScheduleAnchorEl(null)}>
                                Cancel
                            </MuiButton>
                            <MuiButton size="small" variant="contained" sx={{ textTransform: 'none', bgcolor: '#3b82f6', boxShadow: 'none', '&:hover': { bgcolor: '#2563eb', boxShadow: '0 2px 8px rgba(59,130,246,0.25)' } }} onClick={() => setScheduleAnchorEl(null)}>
                                Save
                            </MuiButton>
                        </Box>
                    </Box>
                </Popover>

                {/* Universal popover rendering safely attached to Card limits */}
                {selectionState && !showCommentInput && (
                    <Zoom in timeout={250}>
                        <MuiButton
                            variant="contained"
                            size="small"
                            startIcon={<MessageSquare size={14} />}
                            className="comment-trigger-btn"
                            onPointerDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCommentInput(true);
                            }}
                            sx={{
                                position: 'absolute',
                                top: selectionState.top,
                                left: selectionState.btnLeft,
                                transform: 'translateX(-50%)',
                                bgcolor: '#1f2937',
                                color: 'white',
                                borderRadius: '8px',
                                px: 2,
                                py: 0.75,
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
                                zIndex: 100,
                                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                '&:hover': {
                                    bgcolor: '#111827',
                                    transform: 'translateX(-50%) scale(1.05)',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
                                }
                            }}
                        >
                            Add Comment
                        </MuiButton>
                    </Zoom>
                )}

                {showCommentInput && selectionState && (
                    <Zoom in timeout={300} style={{ transformOrigin: 'top center' }}>
                        <Paper
                            elevation={16}
                            className="comment-popover"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                                position: 'absolute',
                                top: selectionState.top,
                                left: selectionState.popoverLeft,
                                transform: 'translateX(-50%)',
                                bgcolor: 'rgba(255, 255, 255, 0.98)',
                                backdropFilter: 'blur(16px)',
                                borderRadius: '14px',
                                p: 2,
                                zIndex: 110,
                                width: '320px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px',
                                border: '1px solid rgba(0, 0, 0, 0.06)'
                            }}
                        >
                            {/* Reference block for selected text */}
                            <Paper
                                elevation={0}
                                sx={{
                                    bgcolor: '#f9fafb',
                                    borderLeft: '3px solid var(--color-primary)',
                                    p: 1,
                                    borderRadius: '0 8px 8px 0',
                                    fontSize: '0.8rem',
                                    color: '#4b5563',
                                    fontStyle: 'italic',
                                    maxHeight: '60px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                "{selectionState.text}"
                            </Paper>

                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                <Avatar
                                    sx={{
                                        width: 28, height: 28,
                                        fontSize: '12px', fontWeight: 700,
                                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                        flexShrink: 0
                                    }}
                                >
                                    {(currentUser || 'U').charAt(0).toUpperCase()}
                                </Avatar>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    maxRows={4}
                                    size="small"
                                    variant="standard"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add your comment..."
                                    autoFocus
                                    slotProps={{
                                        input: {
                                            disableUnderline: true,
                                            sx: {
                                                fontSize: '0.85rem',
                                                color: 'var(--text-main)',
                                                fontFamily: 'inherit',
                                                pt: '4px'
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            <Divider sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                                <MuiButton
                                    size="small"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowCommentInput(false);
                                        setSelectionState(null);
                                        window.getSelection().removeAllRanges();
                                    }}
                                    sx={{
                                        color: '#6b7280',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 1.5,
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                                    }}
                                >
                                    Cancel
                                </MuiButton>
                                <MuiButton
                                    size="small"
                                    variant="contained"
                                    disabled={!commentText.trim()}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleSubmitComment(e);
                                    }}
                                    sx={{
                                        bgcolor: 'var(--color-primary)',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 2,
                                        boxShadow: 'none',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: '#4f46e5',
                                            boxShadow: '0 2px 8px rgba(99,102,241,0.3)'
                                        },
                                        '&.Mui-disabled': {
                                            bgcolor: '#e5e7eb',
                                            color: '#9ca3af'
                                        }
                                    }}
                                >
                                    Post
                                </MuiButton>
                            </Box>
                        </Paper>
                    </Zoom>
                )}
            </Card>

            {/* Inline floating comments box on the right side */}
            {post.comments !== undefined && onAddComment && !isCommentBoxClipped && !isPanelOpen && (
                <Fade in timeout={350}>
                    <Paper
                        elevation={12}
                        sx={{
                            position: 'absolute',
                            top: '0',
                            right: '-315px',
                            width: '300px',
                            bgcolor: 'rgba(255, 255, 255, 0.98)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(0, 0, 0, 0.04)',
                            p: '16px',
                            zIndex: 200,
                            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 14px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(99,102,241,0.08)'
                            }
                        }}
                    >
                        {/* Input Row */}
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            bgcolor: '#f9fafb', border: '1px solid #e5e7eb',
                            p: '6px 12px', borderRadius: '10px', mb: '12px',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                            '&:focus-within': {
                                borderColor: 'var(--color-primary)',
                                boxShadow: '0 0 0 3px rgba(99,102,241,0.08)'
                            }
                        }}>
                            <Avatar
                                sx={{
                                    width: 22, height: 22,
                                    fontSize: '10px', fontWeight: 700,
                                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                    flexShrink: 0
                                }}
                            >
                                {(currentUser || 'U').charAt(0).toUpperCase()}
                            </Avatar>
                            <input
                                ref={inputRef}
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSubmitComment(e);
                                    }
                                }}
                                placeholder={editingComment !== null ? "Edit comment..." : "Say something..."}
                                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.75rem', color: 'var(--text-main)', minWidth: 0 }}
                            />
                            <Tooltip title="Send" arrow placement="top">
                                <span>
                                    <IconButton
                                        size="small"
                                        onClick={handleSubmitComment}
                                        disabled={!commentText.trim()}
                                        sx={{
                                            color: commentText.trim() ? 'var(--color-primary)' : '#9ca3af',
                                            p: '4px',
                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                color: '#4f46e5',
                                                bgcolor: 'rgba(99,102,241,0.08)',
                                                transform: 'scale(1.15)'
                                            }
                                        }}
                                    >
                                        <Send size={14} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>

                        {/* Comments List */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {post.comments.map(renderCommentItem)}
                        </Box>
                    </Paper>
                </Fade>
            )}

        </div>
    );
};

export default PostCard;
