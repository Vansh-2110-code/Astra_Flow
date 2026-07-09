import React, { useState, useEffect, useRef } from 'react';
import PostCard from '../PostCard';
import StoryStrip from '../StoryStrip';

const FeedView = ({ posts, onApprove, onOpenComments, onAddComment, currentUser, showStoriesStrip = false, onOpenNewStory, isPanelOpen, onDeletePost }) => {
    const storyPosts = showStoriesStrip ? posts.slice(0, 5) : [];

    // We recreate the PostCard clipping logic here to know when the sidebar comment section is hidden
    const [isCommentBoxClipped, setIsCommentBoxClipped] = useState(false);
    const layoutRef = useRef(null);

    useEffect(() => {
        const checkClipping = () => {
            if (layoutRef.current) {
                const rect = layoutRef.current.getBoundingClientRect();
                // Match PostCard logic: if the comment box (320px including gap) overflows the window
                setIsCommentBoxClipped(rect.right + 320 > window.innerWidth);
            }
        };
        checkClipping();
        window.addEventListener('resize', checkClipping);
        return () => window.removeEventListener('resize', checkClipping);
    }, []);

    const hasCommentSidebarSpace = !isCommentBoxClipped && !isPanelOpen;

    return (
        <div
            ref={layoutRef}
            className="feed-container"
            style={{
                padding: '4px 0 8px',
                display: 'grid',
                gridTemplateColumns: hasCommentSidebarSpace
                    ? '48px minmax(0, 1fr) 320px' // left tick gutter, main feed, comment sidebar space
                    : '48px minmax(0, 1fr)',      // collapse comment column on smaller screens / when panel open
                justifyContent: hasCommentSidebarSpace ? 'flex-start' : 'center',
                columnGap: 0,
                rowGap: '24px',
            }}
        >
            {showStoriesStrip && (
                <div
                    style={{
                        gridColumn: hasCommentSidebarSpace ? '2 / 4' : '2 / 3',
                        // Extend the Stories box 44px to the left so its
                        // left border aligns with the PostCard tick circle,
                        // while keeping the right edge exactly the same.
                        width: 'calc(100% + 44px)',
                        marginLeft: '-44px',
                        paddingLeft: '44px',
                    }}
                >
                    <StoryStrip storyPosts={storyPosts} onOpenNewStory={onOpenNewStory} />
                </div>
            )}

            {posts.map(post => (
                <div
                    key={post.id}
                    style={{
                        gridColumn: 2,
                        display: 'flex',
                        justifyContent: hasCommentSidebarSpace ? 'flex-start' : 'center',
                        transform: hasCommentSidebarSpace ? 'none' : 'translateX(-22px)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <PostCard
                        post={post}
                        currentUser={currentUser}
                        onApprove={onApprove}
                        onOpenComments={onOpenComments}
                        onAddComment={onAddComment}
                        isMinimized={true}
                        isPanelOpen={isPanelOpen}
                        onDeletePost={onDeletePost}
                    />
                </div>
            ))}
        </div>
    );
};

export default FeedView;
