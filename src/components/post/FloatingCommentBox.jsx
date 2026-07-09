import React from 'react';
import { Paper, Fade, Box, Avatar, Tooltip, IconButton } from '@mui/material';
import { Send } from 'lucide-react';
import CommentItem from './CommentItem';

const FloatingCommentBox = ({
    post,
    isCommentBoxClipped,
    isPanelOpen,
    currentUser,
    commentText,
    setCommentText,
    editingComment,
    handleSubmitComment,
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
    setEditingComment,
    inputRef
}) => {
    if (post.comments === undefined || isCommentBoxClipped || isPanelOpen) return null;

    return (
        <Fade in timeout={350}>
            <Paper
                elevation={12}
                className="floating-comment-box"
                sx={{
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
                    {post.comments.map((comment, index) => (
                        <CommentItem
                            key={comment.id || index}
                            comment={comment}
                            index={index}
                            currentUser={currentUser}
                            deletedComments={deletedComments}
                            resolvedComments={resolvedComments}
                            editedTexts={editedTexts}
                            reactions={reactions}
                            activeEmojiPicker={activeEmojiPicker}
                            activeCommentMenu={activeCommentMenu}
                            setActiveEmojiPicker={setActiveEmojiPicker}
                            setActiveCommentMenu={setActiveCommentMenu}
                            setReactions={setReactions}
                            setResolvedComments={setResolvedComments}
                            setDeletedComments={setDeletedComments}
                            setCommentText={setCommentText}
                            setEditingComment={setEditingComment}
                            inputRef={inputRef}
                        />
                    ))}
                </Box>
            </Paper>
        </Fade>
    );
};

export default FloatingCommentBox;
