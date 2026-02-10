import React from 'react';
import PostCard from '../PostCard';

const FeedView = ({ posts, onApprove, onOpenComments, onAddComment, currentUser }) => {
    return (
        <div className="feed-container">
            {posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onApprove={onApprove}
                    onOpenComments={onOpenComments}
                    onAddComment={onAddComment}
                />
            ))}
        </div>
    );
};

export default FeedView;
