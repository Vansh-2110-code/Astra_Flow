import React, { useState, useEffect, useRef } from 'react';
import PostCard from '../PostCard';
import StoryStrip from '../StoryStrip';

const FeedView = ({ posts, onApprove, onOpenComments, onAddComment, currentUser, showStoriesStrip = false, onOpenNewStory, isPanelOpen }) => {
    const storyPosts = showStoriesStrip ? posts.slice(0, 5) : [];

    // We recreate the PostCard clipping logic here to know when the sidebar comment section is hidden
    const [isCommentBoxClipped, setIsCommentBoxClipped] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const checkClipping = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                // Match PostCard logic: if the comment box (320px including gap) overflows the window
                setIsCommentBoxClipped(rect.right + 320 > window.innerWidth);
            }
        };
        checkClipping();
        window.addEventListener('resize', checkClipping);
        return () => window.removeEventListener('resize', checkClipping);
    }, []);

    const isSidebarCollapsed = isCommentBoxClipped;

    return (
        <div ref={containerRef} className="feed-container" style={{
            padding: '4px 0 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: isSidebarCollapsed ? 'center' : undefined
        }}>

            {showStoriesStrip && (
                <div style={{
                    marginLeft: isSidebarCollapsed ? 'auto' : undefined,
                    marginRight: isSidebarCollapsed ? 'auto' : ((!isCommentBoxClipped && !isPanelOpen) ? '-320px' : '0px'),
                    transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    <StoryStrip storyPosts={storyPosts} onOpenNewStory={onOpenNewStory} />
                </div>
            )}

            {posts.map(post => (
                <div key={post.id} style={{
                    marginLeft: isSidebarCollapsed ? 'auto' : '48px',
                    marginRight: isSidebarCollapsed ? 'auto' : undefined,
                    transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    <PostCard
                        post={post}
                        currentUser={currentUser}
                        onApprove={onApprove}
                        onOpenComments={onOpenComments}
                        onAddComment={onAddComment}
                        isMinimized={true}
                        isPanelOpen={isPanelOpen}
                    />
                </div>
            ))}
        </div>
    );
};

export default FeedView;
