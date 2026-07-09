import React from 'react';
import { Avatar, Typography, Box, Tooltip, IconButton, Fade, Paper, Chip } from '@mui/material';
import { Smile, CheckCircle, Reply, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

const CommentItem = ({
    comment,
    index,
    currentUser,
    deletedComments,
    resolvedComments,
    editedTexts,
    reactions,
    activeEmojiPicker,
    activeCommentMenu,
    setActiveEmojiPicker,
    setActiveCommentMenu,
    setReactions,
    setResolvedComments,
    setDeletedComments,
    setCommentText,
    setEditingComment,
    inputRef
}) => {
    const commentKey = comment.id || index;
    if (deletedComments.has(commentKey)) return null;

    const isResolved = resolvedComments.has(commentKey);
    const textToShow = editedTexts[commentKey] || comment.text;
    const commentReactions = reactions[commentKey] || [];

    return (
        <Fade in timeout={250 + (typeof index === 'number' ? index * 80 : 0)}>
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
                            <IconButton size="small" onClick={() => { setCommentText(`@${comment.author} `); if (inputRef && inputRef.current) inputRef.current.focus(); }} sx={{ p: '3px', color: 'inherit', transition: 'all 0.2s', '&:hover': { color: 'var(--color-primary)', bgcolor: 'rgba(99,102,241,0.08)' } }}>
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

export default CommentItem;
