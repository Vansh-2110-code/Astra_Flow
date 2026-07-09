import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAspectRatioStyles } from '../../utils/mediaRules';

const PostMedia = ({ post, isMinimized }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const isCarousel = Array.isArray(post.media) && post.media.length > 1;
    const mediaUrl = isCarousel ? post.media[currentIndex] : (Array.isArray(post.media) ? post.media[0] : post.media);

    const isVideo = post.type === 'Reel' || (typeof mediaUrl === 'string' && (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.mov')));
    console.log("selva", post.media)
    if (!mediaUrl) return null;

    return (
        <div className="post-media" style={{ ...getAspectRatioStyles(post.platform, post.type), position: 'relative', overflow: 'hidden', marginBottom: post.platform === 'Instagram' ? '12px' : 0 }}>
            {isCarousel ? (
                <>
                    <div style={{
                        display: 'flex',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: `translateX(-${(currentIndex * 100) / (post.media.length || 1)}%)`,
                        height: '100%',
                        width: `${post.media.length * 100}%`
                    }}>
                        {post.media.map((m, i) => (
                            <div key={i} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
                                <img src={m} alt={`Post media ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>

                    {currentIndex > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev - 1); }}
                            style={{
                                position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)',
                                background: 'rgba(31, 41, 55, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', zIndex: 10, color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                e.currentTarget.style.background = 'rgba(31, 41, 55, 0.9)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                e.currentTarget.style.background = 'rgba(31, 41, 55, 0.7)';
                            }}
                        >
                            <ChevronLeft size={18} strokeWidth={2.5} />
                        </button>
                    )}

                    {currentIndex < post.media.length - 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev + 1); }}
                            style={{
                                position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)',
                                background: 'rgba(31, 41, 55, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', zIndex: 10, color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                e.currentTarget.style.background = 'rgba(31, 41, 55, 0.9)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                e.currentTarget.style.background = 'rgba(31, 41, 55, 0.7)';
                            }}
                        >
                            <ChevronRight size={18} strokeWidth={2.5} />
                        </button>
                    )}

                    {/* Carousel Dots */}
                    <div style={{ position: 'absolute', bottom: '8px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '4px', zIndex: 10 }}>
                        {post.media.map((_, i) => (
                            <div key={i} style={{ height: '6px', width: currentIndex === i ? '16px' : '6px', borderRadius: '3px', background: currentIndex === i ? 'var(--color-primary)' : 'rgba(255,255,255,0.6)', transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                        ))}
                    </div>
                </>
            ) : (
                isVideo ? (
                    <video src={mediaUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <img src={mediaUrl} alt="Post media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )
            )}

            {isMinimized && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '3px 8px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    zIndex: 20
                }}>
                    {isCarousel ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ opacity: 0.8 }}>Carousel</span>
                            <span style={{ fontSize: '0.6rem', color: '#9ca3af', paddingLeft: '2px' }}>{currentIndex + 1}/{post.media.length}</span>
                        </div>
                    ) : (
                        post.platform === 'TikTok' || post.type === 'Story' || post.type === 'Reel' ? '9:9 Vertical' :
                            post.type === 'Portrait' ? '4:5 Portrait' :
                                post.type === 'Landscape' ? '1.91:1 Landscape' : '1:1 Square'
                    )}
                </div>
            )}
        </div>
    );
};

export default PostMedia;
