import React from 'react';
import PostCard from '../PostCard';
import StoryStrip from '../StoryStrip';

const FeedView = ({ posts, onApprove, onOpenComments, onAddComment, currentUser, showStoriesStrip = false, onOpenNewStory, isPanelOpen }) => {
    const storyPosts = showStoriesStrip ? posts.slice(0, 5) : [];

    return (
        <div className="feed-container" style={{ padding: '4px 0 8px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {showStoriesStrip && (
                <StoryStrip storyPosts={storyPosts} onOpenNewStory={onOpenNewStory} />
            )}

            {posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onApprove={onApprove}
                    onOpenComments={onOpenComments}
                    onAddComment={onAddComment}
                    isMinimized={true}
                    isPanelOpen={isPanelOpen}
                />
            ))}
        </div>
    );
};

export default FeedView;
