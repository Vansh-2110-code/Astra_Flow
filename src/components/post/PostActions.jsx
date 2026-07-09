import React from 'react';
import { Box, Tooltip, IconButton, Divider, Typography, Chip, Popover, Badge as MuiBadge } from '@mui/material';
import { Check, MessageSquare, Send, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const PostActions = ({
    post,
    hasUserApproved,
    approvedBy,
    currentUser,
    canApprove,
    handleApprove,
    onOpenComments,
    setScheduleAnchorEl,
    setTempScheduleDate
}) => {
    return (
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
    );
};

export default PostActions;
