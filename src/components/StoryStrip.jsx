import React, { useState } from 'react';
import { ChevronUp, Plus } from 'lucide-react';
import { Box, Paper, Typography, IconButton, Tooltip, Collapse } from '@mui/material';

const StoryStrip = ({ storyPosts, onOpenNewStory }) => {
    const [isStoriesCollapsed, setIsStoriesCollapsed] = useState(false);

    return (
        <Paper
            elevation={0}
            className="stories-strip"
            sx={{
                mb: 1.5,
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--radius-md)',
                bgcolor: '#ffffff',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
            }}
        >
            <Box
                onClick={() => setIsStoriesCollapsed(!isStoriesCollapsed)}
                sx={{
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                }}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 1 }}>
                    Stories
                </Typography>
                <IconButton size="small" sx={{ transition: 'transform 0.3s', transform: isStoriesCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <ChevronUp size={18} />
                </IconButton>
            </Box>

            <Collapse in={!isStoriesCollapsed}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2,
                        pt: 0,
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': { height: '6px' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
                    }}
                >
                    {/* New Story button */}
                    <Tooltip title="Create a new story" arrow placement="top">
                        <Paper
                            onClick={onOpenNewStory}
                            elevation={0}
                            sx={{
                                width: 100,
                                minWidth: 100,
                                height: 160,
                                borderRadius: '12px',
                                border: '2px dashed var(--input-border)',
                                bgcolor: 'rgba(249,250,251,0.9)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                gap: 1.5,
                                '&:hover': {
                                    borderColor: 'var(--color-primary)',
                                    bgcolor: 'rgba(99,102,241,0.04)',
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 16px rgba(99,102,241,0.1)'
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(99,102,241,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-primary)',
                                    transition: 'all 0.2s',
                                    '.MuiPaper-root:hover &': {
                                        bgcolor: 'var(--color-primary)',
                                        color: 'white',
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <Plus size={20} />
                            </Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                New story
                            </Typography>
                        </Paper>
                    </Tooltip>

                    {/* Story cards */}
                    {storyPosts.map((post) => (
                        <Tooltip key={post.id} title={`View ${post.platform || 'Story'}`} arrow placement="top">
                            <Paper
                                elevation={1}
                                sx={{
                                    width: 100,
                                    minWidth: 100,
                                    height: 160,
                                    borderRadius: '12px',
                                    bgcolor: '#f9fafb',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: '1px solid var(--input-border)',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                                        borderColor: 'transparent'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        flex: 1,
                                        bgcolor: '#e5e7eb',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {post.media ? (
                                        <Box
                                            component="img"
                                            src={post.media}
                                            alt=""
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '.MuiPaper-root:hover &': { transform: 'scale(1.1)' }
                                            }}
                                        />
                                    ) : (
                                        <Typography sx={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>No media</Typography>
                                    )}
                                </Box>
                                <Box
                                    sx={{
                                        py: 1.25,
                                        px: 1,
                                        bgcolor: 'white',
                                        borderTop: '1px solid rgba(0,0,0,0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: 'var(--text-main)',
                                            width: '100%',
                                            textAlign: 'center',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {post.platform || 'Story'}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Tooltip>
                    ))}
                </Box>
            </Collapse>
        </Paper>
    );
};

export default StoryStrip;
