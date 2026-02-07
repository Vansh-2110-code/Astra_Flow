import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const CalendarView = ({ posts }) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dates = Array.from({ length: 35 }, (_, i) => i + 1);
    const [draggedPost, setDraggedPost] = useState(null);

    const getPostsForDate = (date) => {
        return posts.filter(post => {
            const postDate = new Date(post.date).getDate();
            return postDate === date && date <= 31;
        });
    };

    const handleDragStart = (e, post) => {
        if (post.status === 'Scheduled') {
            setDraggedPost(post);
            e.dataTransfer.effectAllowed = 'move';
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, date) => {
        e.preventDefault();
        if (draggedPost && date <= 31) {
            console.log(`Move post ${draggedPost.id} to date ${date}`);
            setDraggedPost(null);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Button variant="outline" style={{ padding: '8px' }}><ChevronLeft size={18} /></Button>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>March 2024</span>
                <Button variant="outline" style={{ padding: '8px' }}><ChevronRight size={18} /></Button>
            </div>

            <div className="calendar-grid">
                {days.map(day => (
                    <div key={day} className="calendar-header">{day}</div>
                ))}

                {dates.map((date, index) => {
                    const datePosts = getPostsForDate(date);
                    return (
                        <div
                            key={index}
                            className="calendar-day"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, date)}
                        >
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                {date <= 31 ? date : index - 30}
                            </span>
                            {datePosts.map(post => {
                                const Icon = post.icon;
                                return (
                                    <div
                                        key={post.id}
                                        draggable={post.status === 'Scheduled'}
                                        onDragStart={(e) => handleDragStart(e, post)}
                                        style={{
                                            background: 'white',
                                            border: '1px solid var(--input-border)',
                                            borderRadius: 'var(--radius-sm)',
                                            cursor: post.status === 'Scheduled' ? 'grab' : 'pointer',
                                            transition: 'all 0.2s',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        {post.media && (
                                            <img 
                                                src={post.media} 
                                                alt=""
                                                style={{
                                                    width: '100%',
                                                    height: '60px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        )}
                                        <div style={{ padding: '4px 6px' }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '4px',
                                                marginBottom: '2px'
                                            }}>
                                                {Icon && <Icon size={10} color={post.status === 'Scheduled' ? '#2563eb' : '#6b7280'} />}
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    fontWeight: 600,
                                                    color: 'var(--text-muted)'
                                                }}>
                                                    {post.platform}
                                                </span>
                                            </div>
                                            <div style={{ 
                                                fontSize: '0.7rem',
                                                color: 'var(--text-main)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                lineHeight: 1.3
                                            }}>
                                                {post.content.substring(0, 35)}...
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
