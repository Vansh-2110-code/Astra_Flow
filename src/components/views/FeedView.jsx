import React from 'react';
import PostCard from '../PostCard';

const FeedView = ({ posts }) => {
    return (
        <div className="feed-container">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default FeedView;
