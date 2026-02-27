import React from 'react';
import PostCard from '../PostCard';

const FeedView = ({ posts, onApprove, onOpenComments, onAddComment, currentUser, showStoriesStrip = false }) => {
    const storyPosts = showStoriesStrip ? posts.slice(0, 5) : [];

    return (
        <div className="feed-container" style={{ padding: '0.125rem 0 0.35rem' }}>
            {showStoriesStrip && (
                <div
                    style={{
                        marginBottom: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: '#ffffff',
                        border: '1px solid var(--input-border)',
                        overflowX: 'auto'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                        }}
                    >
                        <span
                            style={{
                                fontSize: '0.88rem',
                                fontWeight: 600,
                                color: 'var(--text-main)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                            }}
                        >
                            Stories
                            <span style={{ fontSize: '0.7rem', cursor: 'pointer', color: 'var(--text-muted)' }}>▲</span>
                        </span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            gap: '0.65rem',
                            minHeight: 120
                        }}
                    >
                        {/* New Story button */}
                        <div
                            style={{
                                width: 100,
                                minWidth: 100,
                                height: 120,
                                borderRadius: 'var(--radius-md)',
                                border: '1px dashed var(--input-border)',
                                background: 'rgba(249,250,251,0.9)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: 'border-color 0.15s, background 0.15s',
                                gap: '0.35rem'
                            }}
                        >
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    border: '2px solid var(--color-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1rem',
                                    color: 'var(--color-primary)'
                                }}
                            >
                                +
                            </div>
                            <span>New story</span>
                        </div>

                        {/* Story cards */}
                        {storyPosts.map((post) => (
                            <div
                                key={post.id}
                                style={{
                                    width: 100,
                                    minWidth: 100,
                                    height: 120,
                                    borderRadius: 'var(--radius-md)',
                                    background: '#f9fafb',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    border: '1px solid var(--input-border)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.15s, box-shadow 0.15s'
                                }}
                            >
                                <div
                                    style={{
                                        flex: 1,
                                        background: '#e5e7eb',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.55rem',
                                        color: 'var(--text-muted)',
                                        position: 'relative'
                                    }}
                                >
                                    {post.media ? (
                                        <img
                                            src={post.media}
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <span>No media</span>
                                    )}
                                    {/* Date overlay like Plannable */}
                                    {post.date && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 4,
                                            left: 4,
                                            background: 'rgba(239, 68, 68, 0.9)',
                                            color: 'white',
                                            fontSize: '0.6rem',
                                            fontWeight: 600,
                                            padding: '2px 6px',
                                            borderRadius: 4
                                        }}>
                                            {post.date.split(',')[0] || 'No date'}
                                        </div>
                                    )}
                                </div>
                                <div
                                    style={{
                                        padding: '5px 7px',
                                        fontSize: '0.7rem',
                                        color: 'var(--text-main)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontWeight: 500
                                    }}
                                >
                                    {post.platform || 'Story'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
