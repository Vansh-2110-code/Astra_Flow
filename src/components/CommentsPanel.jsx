import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Avatar,
    Chip,
    TextField,
    InputAdornment,
    Fade,
    Slide,
    Divider,
    ToggleButton,
    ToggleButtonGroup,
    Snackbar,
    Alert,
    Paper
} from '@mui/material';

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
            {/* Backdrop */}
            <Fade in={isOpen}>
                <Box
                    onClick={onClose}
                    sx={{
                        position: 'fixed',
                        inset: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 999
                    }}
                />
            </Fade>

            {/* Panel */}
            <Slide direction="left" in={isOpen} mountOnEnter unmountOnExit>
                <Paper
                    elevation={16}
                    sx={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        width: '450px',
                        maxWidth: '90vw',
                        height: '100vh',
                        borderLeft: '1px solid var(--input-border)',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 0,
                        overflow: 'hidden'
                    }}
                >
                    {/* Header */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 3,
                        py: 2,
                        borderBottom: '1px solid var(--input-border)',
                        background: 'linear-gradient(180deg, #fafbff 0%, #ffffff 100%)'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                            Comments
                        </Typography>
                        <IconButton
                            onClick={onClose}
                            size="small"
                            sx={{
                                color: 'var(--text-muted)',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: 'rgba(99, 102, 241, 0.08)',
                                    color: 'var(--color-primary)',
                                    transform: 'rotate(90deg)'
                                }
                            }}
                        >
                            <X size={20} />
                        </IconButton>
                    </Box>

                    {/* Comments List */}
                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        p: 2.5,
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.15)', borderRadius: '4px' }
                    }}>
                        {comments.length === 0 ? (
                            <Fade in timeout={600}>
                                <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
                                    <Box sx={{
                                        width: 56, height: 56, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        mx: 'auto', mb: 2, fontSize: '1.5rem'
                                    }}>
                                        💬
                                    </Box>
                                    <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        No comments yet. Be the first to comment!
                                    </Typography>
                                </Box>
                            </Fade>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {comments.map((comment, index) => (
                                    <Fade in key={index} timeout={300 + index * 100}>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                border: '1px solid rgba(0,0,0,0.06)',
                                                bgcolor: 'rgba(249, 250, 251, 0.6)',
                                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(249, 250, 251, 0.95)',
                                                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                                    transform: 'translateY(-1px)',
                                                    borderColor: 'rgba(99, 102, 241, 0.15)'
                                                }
                                            }}
                                        >
                                            {/* Comment Header */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 28, height: 28,
                                                            fontSize: '0.75rem', fontWeight: 700,
                                                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                                                        }}
                                                    >
                                                        {comment.author.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                                                        {comment.author}
                                                    </Typography>
                                                </Box>
                                                <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                                    {new Date(comment.timestamp).toLocaleString()}
                                                </Typography>
                                            </Box>

                                            {/* Selection Quote */}
                                            {comment.selection && (
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 1.5,
                                                        bgcolor: '#f9fafb',
                                                        borderLeft: '3px solid var(--color-primary)',
                                                        borderRadius: '0 8px 8px 0',
                                                        mb: 1.5,
                                                        fontSize: '0.83rem',
                                                        color: 'var(--text-muted)',
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <Typography sx={{
                                                        display: 'flex', alignItems: 'center', gap: 0.5,
                                                        mb: 0.5, fontSize: '0.72rem', fontWeight: 600,
                                                        color: 'var(--color-primary)'
                                                    }}>
                                                        Replying to:
                                                    </Typography>
                                                    <Box sx={{ lineHeight: 1.4, fontSize: '0.83rem' }}>
                                                        {(() => {
                                                            if (!post.content) return `"${comment.selection.text}"`;
                                                            const start = comment.selection.start || 0;
                                                            const end = comment.selection.end || 0;
                                                            const content = post.content;
                                                            if (start === undefined || end === undefined) return `"${comment.selection.text}"`;
                                                            const prefix = content.substring(Math.max(0, start - 30), start);
                                                            const suffix = content.substring(end, Math.min(content.length, end + 30));
                                                            return (
                                                                <>
                                                                    {start > 30 && "..."}{prefix}
                                                                    <Box component="span" sx={{ bgcolor: '#fef3c7', color: '#92400e', px: 0.5, borderRadius: '2px', fontWeight: 500 }}>
                                                                        {comment.selection.text}
                                                                    </Box>
                                                                    {suffix}{end + 30 < content.length && "..."}
                                                                </>
                                                            );
                                                        })()}
                                                    </Box>
                                                </Paper>
                                            )}

                                            {/* Comment Text */}
                                            <Typography sx={{ fontSize: '0.88rem', color: 'var(--text-main)', mb: 1, lineHeight: 1.6 }}>
                                                {comment.text}
                                            </Typography>

                                            {/* Visibility Chip */}
                                            <Chip
                                                label={comment.visibility === 'team' ? 'Team Only' : 'Visible to All'}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.68rem',
                                                    fontWeight: 600,
                                                    height: '22px',
                                                    bgcolor: comment.visibility === 'team' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                    color: comment.visibility === 'team' ? 'var(--color-primary)' : '#059669',
                                                    border: 'none',
                                                    transition: 'all 0.2s'
                                                }}
                                            />
                                        </Paper>
                                    </Fade>
                                ))}
                            </Box>
                        )}
                    </Box>

                    <Divider />

                    {/* Comment Form */}
                    <Box
                        component="form"
                        onSubmit={handleFormSubmit}
                        sx={{
                            p: 2.5,
                            background: 'linear-gradient(0deg, #fafbff 0%, #ffffff 100%)'
                        }}
                    >
                        {/* Visibility Toggle */}
                        <Box sx={{ mb: 1.5 }}>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', mb: 1 }}>
                                Visibility
                            </Typography>
                            <ToggleButtonGroup
                                value={visibility}
                                exclusive
                                onChange={(e, val) => { if (val !== null) setVisibility(val); }}
                                fullWidth
                                size="small"
                                sx={{
                                    '& .MuiToggleButton-root': {
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        py: 0.8,
                                        borderRadius: '8px !important',
                                        border: '1.5px solid var(--input-border) !important',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&.Mui-selected': {
                                            borderColor: 'var(--color-primary) !important'
                                        }
                                    }
                                }}
                            >
                                <ToggleButton
                                    value="team"
                                    sx={{
                                        mr: 0.5,
                                        color: visibility === 'team' ? 'var(--color-primary) !important' : 'var(--text-muted)',
                                        bgcolor: visibility === 'team' ? 'rgba(99, 102, 241, 0.06) !important' : 'transparent'
                                    }}
                                >
                                    Team Only
                                </ToggleButton>
                                <ToggleButton
                                    value="all"
                                    sx={{
                                        ml: 0.5,
                                        color: visibility === 'all' ? '#059669 !important' : 'var(--text-muted)',
                                        bgcolor: visibility === 'all' ? 'rgba(16, 185, 129, 0.06) !important' : 'transparent',
                                        '&.Mui-selected': {
                                            borderColor: '#059669 !important'
                                        }
                                    }}
                                >
                                    Visible to All
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {/* Input Field */}
                        <TextField
                            fullWidth
                            size="small"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                disabled={!newComment.trim()}
                                                onClick={(e) => { e.preventDefault(); handleSubmit(e); }}
                                                sx={{
                                                    bgcolor: newComment.trim() ? 'var(--color-primary)' : '#e5e7eb',
                                                    color: 'white',
                                                    width: 32, height: 32,
                                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': {
                                                        bgcolor: newComment.trim() ? '#5558e3' : '#e5e7eb',
                                                        transform: newComment.trim() ? 'scale(1.08)' : 'none'
                                                    },
                                                    '&.Mui-disabled': {
                                                        color: 'white',
                                                        bgcolor: '#e5e7eb'
                                                    }
                                                }}
                                            >
                                                <Send size={14} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    fontSize: '0.88rem',
                                    transition: 'all 0.2s',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-primary)'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-primary)',
                                        borderWidth: '1.5px'
                                    }
                                }
                            }}
                        />
                        <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)', mt: 0.75 }}>
                            Press Enter to send
                        </Typography>
                    </Box>

                    {/* Toast */}
                    <Snackbar
                        open={showToast}
                        autoHideDuration={2500}
                        onClose={() => setShowToast(false)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        sx={{ position: 'absolute' }}
                    >
                        <Alert
                            severity="success"
                            variant="filled"
                            sx={{
                                borderRadius: '10px',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            Comment added
                        </Alert>
                    </Snackbar>
                </Paper>
            </Slide>
        </>
    );
};

export default CommentsPanel;
