import React, { useState, useRef, useEffect } from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { MoreHorizontal, MessageSquare, Heart, CheckCircle, Plus, Check, Smile, Reply, Pencil, Trash2, Send, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery, useTheme } from '@mui/material';
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
                    <video src={mediaUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <img src={mediaUrl} alt="Post media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )
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
    isMinimized = false
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:1024px)');
    const Icon = post.icon;
    const isApproved = post.approved || (post.approvedBy && post.approvedBy.length > 0);
    const hasUserApproved = post.approvedBy?.includes(currentUser);
    const approvedBy = post.approvedBy || [];
    const canApprove = ['admin', 'approver'].includes(currentUserRole);
    const [showApproverPopup, setShowApproverPopup] = useState(false);

    // Text Selection State
    const contentRef = useRef(null);
    const cardRef = useRef(null);
    const [selectionState, setSelectionState] = useState(null);

    const [commentText, setCommentText] = useState('');
    const [visibility, setVisibility] = useState('team');
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
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishDone, setPublishDone] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
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
            } catch (err) { }
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

    return (
        <div
            className={`post-card ${isMinimized ? 'minimized' : ''}`}
            style={{
                position: 'relative',
                paddingLeft: isMinimized ? '0' : '20px',
                zIndex: (selectionState || showCommentInput) ? 50 : 1
            }}
        >
            {/* Approval dot - hidden on mobile if bar is shown */}
            {!isMobile && (
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

            {/* Platform icon circle - hidden on mobile if bar is shown */}
            {!isMobile && (
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
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button className="btn-ghost" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: '50%' }}>
                            <MoreHorizontal size={16} />
                        </button>
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

                {/* New Responsive Action Bar (only on smaller screens) */}
                {isMobile && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        padding: '10px 0',
                        margin: '8px 0',
                        borderTop: '1px solid var(--input-border)',
                        borderBottom: '1px solid var(--input-border)',
                        background: 'transparent'
                    }}>
                        {/* Approval Action */}
                        <div
                            onClick={handleApprove}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: canApprove ? 'pointer' : 'default',
                                color: hasUserApproved ? '#22c55e' : 'var(--text-main)',
                                transition: 'all 0.2s',
                                fontSize: '0.85rem'
                            }}
                        >
                            <Check size={18} strokeWidth={hasUserApproved ? 3 : 2} />
                        </div>

                        <div style={{ width: '1px', height: '20px', background: 'rgba(0,0,0,0.06)' }} />

                        {/* Comment Count Action */}
                        <div
                            onClick={(e) => { e.stopPropagation(); if (onOpenComments) onOpenComments(post); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                color: 'var(--text-main)',
                                fontSize: '0.85rem'
                            }}
                        >
                            <MessageSquare size={18} />
                            <span>Comment {post.comments?.length || 0}</span>
                        </div>

                        <div style={{ width: '1px', height: '20px', background: 'rgba(0,0,0,0.06)' }} />

                        {/* Status Action */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: post.status === 'Published' ? '#3b82f6' : 'var(--text-main)',
                            fontSize: '0.85rem'
                        }}>
                            {post.status === 'Published' ? <Send size={16} /> : <Clock size={16} />}
                            <span>{post.status}</span>
                        </div>
                    </div>
                )}

                {/* Universal popover rendering safely attached to Card limits */}
                {selectionState && !showCommentInput && (
                    <div
                        className="comment-trigger-btn"
                        style={{
                            position: 'absolute',
                            top: selectionState.top,
                            left: selectionState.btnLeft,
                            transform: 'translateX(-50%)',
                            background: '#1f2937',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1)',
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s',
                            userSelect: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
                            e.currentTarget.style.background = '#111827';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
                            e.currentTarget.style.background = '#1f2937';
                        }}
                        onPointerDown={(e) => {
                            e.preventDefault(); // Prevent selection loss before click
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowCommentInput(true);
                        }}
                    >
                        <MessageSquare size={14} /> Add Comment
                    </div>
                )}

                {showCommentInput && selectionState && (
                    <div
                        className="comment-popover-box"
                        style={{
                            position: 'absolute',
                            top: selectionState.top,
                            left: selectionState.popoverLeft,
                            transform: 'translateX(-50%)',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            borderRadius: '12px',
                            padding: '16px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                            zIndex: 110,
                            width: '320px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px',
                            animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Reference block for selected text */}
                        <div style={{
                            background: '#f9fafb',
                            borderLeft: '3px solid #6366f1',
                            padding: '8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            color: '#4b5563',
                            fontStyle: 'italic',
                            maxHeight: '60px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            "{selectionState.text}"
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: 'var(--color-primary)', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '12px', fontWeight: 600, flexShrink: 0
                            }}>
                                {(currentUser || 'U').charAt(0).toUpperCase()}
                            </div>
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add your comment..."
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '0.85rem',
                                    resize: 'none',
                                    minHeight: '40px',
                                    fontFamily: 'inherit',
                                    paddingTop: '4px',
                                    color: 'var(--text-main)'
                                }}
                                autoFocus
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowCommentInput(false);
                                        setSelectionState(null);
                                        window.getSelection().removeAllRanges();
                                    }}
                                    style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmitComment}
                                    disabled={!commentText.trim()}
                                    style={{
                                        background: 'none', border: 'none',
                                        color: commentText.trim() ? '#6366f1' : '#9ca3af',
                                        fontSize: '0.8rem', cursor: commentText.trim() ? 'pointer' : 'default',
                                        fontWeight: 600
                                    }}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Inline floating comments box on the right side */}
            {post.comments !== undefined && (
                <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '-315px',
                    width: '300px',
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    padding: '16px',
                    zIndex: 200,
                    transition: 'all 0.3s ease'
                }}>
                    {/* Real Input */}
                    <div
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f9fafb', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: '8px', marginBottom: '12px' }}
                    >
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: 600, flexShrink: 0 }}>
                            {(currentUser || 'U').charAt(0).toUpperCase()}
                        </div>
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
                        <button
                            onClick={handleSubmitComment}
                            disabled={!commentText.trim()}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: commentText.trim() ? 'var(--color-primary)' : '#9ca3af',
                                cursor: commentText.trim() ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                transition: 'color 0.2s'
                            }}
                        >
                            <Send size={14} />
                        </button>
                    </div>

                    {/* Comments List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {post.comments.map((comment, index) => {
                            if (deletedComments.has(index)) return null;
                            const isResolved = resolvedComments.has(index);
                            const textToShow = editedTexts[index] || comment.text;
                            const commentReactions = reactions[index] || [];

                            return (
                                <div key={index} style={{ background: isResolved ? '#f9fafb' : 'white', opacity: isResolved ? 0.7 : 1, border: '1px solid #f3f4f6', borderRadius: '8px', padding: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '9px', fontWeight: 600 }}>
                                                {comment.author.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-main)', textDecoration: isResolved ? 'line-through' : 'none' }}>
                                                {comment.author === currentUser || comment.author === 'Admin' ? 'You' : comment.author}
                                            </span>
                                            <span style={{ color: '#9ca3af', fontSize: '0.7rem' }}>· {new Date(comment.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9ca3af', position: 'relative' }}>
                                            <div style={{ position: 'relative' }}>
                                                <button onClick={() => { setActiveEmojiPicker(activeEmojiPicker === index ? null : index); setActiveCommentMenu(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', color: 'inherit' }} title="Reaction"><Smile size={14} /></button>

                                                {activeEmojiPicker === index && (
                                                    <div style={{ position: 'absolute', top: '100%', right: '50%', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px', display: 'flex', flexWrap: 'wrap', width: '150px', gap: '6px', zIndex: 60, marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                                        {['👍', '❤️', '😂', '😮', '😢', '👏', '🔥', '🎉', '😡', '💯', '🤔', '🙌'].map(emoji => (
                                                            <span key={emoji} style={{ cursor: 'pointer', fontSize: '1rem', transition: 'transform 0.1s', padding: '2px' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} onClick={() => {
                                                                setReactions(prev => {
                                                                    const list = prev[index] || [];
                                                                    if (list.includes(emoji)) {
                                                                        return { ...prev, [index]: list.filter(e => e !== emoji) };
                                                                    }
                                                                    return { ...prev, [index]: [...list, emoji] };
                                                                });
                                                                setActiveEmojiPicker(null);
                                                            }}>{emoji}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={() => setResolvedComments(prev => { const n = new Set(prev); if (n.has(index)) n.delete(index); else n.add(index); return n; })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', color: isResolved ? '#10b981' : 'inherit' }} title="Resolve"><CheckCircle size={14} /></button>
                                            <button onClick={() => { setCommentText(`@${comment.author} `); if (inputRef.current) inputRef.current.focus(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', color: 'inherit' }} title="Reply"><Reply size={14} /></button>
                                            <button onClick={() => { setActiveCommentMenu(activeCommentMenu === index ? null : index); setActiveEmojiPicker(null); }} style={{ background: '#f3f4f6', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', display: 'flex', color: 'inherit' }}><MoreHorizontal size={14} /></button>

                                            {activeCommentMenu === index && (
                                                <div style={{ position: 'absolute', top: '100%', right: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '4px 0', minWidth: '100px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50, marginTop: '4px' }}>
                                                    <button onClick={() => { setCommentText(textToShow); setEditingComment(index); setActiveCommentMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-main)', textAlign: 'left' }}>
                                                        <Pencil size={12} /> Edit
                                                    </button>
                                                    <button onClick={() => { setDeletedComments(prev => new Set(prev).add(index)); setActiveCommentMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#ef4444', textAlign: 'left' }}>
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {
                                        comment.selection && (
                                            <div style={{ borderLeft: '3px solid #fbbf24', paddingLeft: '8px', marginBottom: '6px' }}>
                                                <div style={{ background: '#fef3c7', padding: '2px 6px', fontSize: '0.75rem', display: 'inline-block', color: '#92400e', borderRadius: '4px', fontWeight: 500 }}>
                                                    {comment.selection.text}
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', textDecoration: isResolved ? 'line-through' : 'none' }}>
                                        {textToShow} {editedTexts[index] && <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>(edited)</span>}
                                    </div>

                                    {commentReactions.length > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                                            {commentReactions.map((emoji, i) => (
                                                <div key={i} onClick={() => {
                                                    setReactions(prev => {
                                                        const list = prev[index] || [];
                                                        return { ...prev, [index]: list.filter(e => e !== emoji) };
                                                    });
                                                }} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#1d4ed8', cursor: 'pointer', transition: 'background 0.2s' }}>
                                                    {emoji} 1
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default PostCard;
