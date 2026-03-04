import React, { useState } from 'react';
import { getAspectRatioStyles } from '../utils/mediaRules';
import { ChevronUp } from 'lucide-react';

const StoryStrip = ({ storyPosts, onOpenNewStory }) => {
    const [isStoriesCollapsed, setIsStoriesCollapsed] = useState(false);

    return (
        <div className="stories-strip">
            <div className="story-header" onClick={() => setIsStoriesCollapsed(!isStoriesCollapsed)}>
                <span
                    style={{
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    Stories
                    {isStoriesCollapsed && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400 }}>

                        </span>
                    )}
                </span>
                <div className={`story-toggle-icon ${isStoriesCollapsed ? 'collapsed' : ''}`}>
                    <ChevronUp size={16} />
                </div>
            </div>
            <div className={`stories-content ${isStoriesCollapsed ? 'collapsed' : ''}`}>
                {/* New Story button */}
                <div
                    onClick={onOpenNewStory}
                    style={{
                        width: 100,
                        minWidth: 100,
                        aspectRatio: '9/16',
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
                                    style={getAspectRatioStyles(post.platform, 'Story')}
                                />
                            ) : (
                                <span>No media</span>
                            )}

                        </div>
                        <div
                            style={{
                                padding: '4px 8px',
                                fontSize: '0.7rem',
                                color: 'var(--text-main)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: 500,
                                textAlign: 'center'
                            }}
                        >
                            {post.platform || 'Story'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoryStrip;
