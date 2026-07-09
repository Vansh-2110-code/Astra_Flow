import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Video, Image as ImageIcon, FileText } from 'lucide-react';
import Button from '../ui/Button';

const CalendarView = ({ posts, onUpdatePostDate, onCreatePost }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const [draggedPost, setDraggedPost] = useState(null);
    const [dragOverDate, setDragOverDate] = useState(null);
    const [hoveredDate, setHoveredDate] = useState(null);
    const [localPosts, setLocalPosts] = useState(posts);
    const [overflowPopup, setOverflowPopup] = useState(null); // { date: number }

    React.useEffect(() => {
        setLocalPosts(posts);
    }, [posts]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayIndex = firstDay === 0 ? 6 : firstDay - 1;

    const calendarDates = [];
    for (let i = 0; i < startingDayIndex; i++) {
        calendarDates.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDates.push(i);
    }
    while (calendarDates.length < 35) {
        calendarDates.push(null);
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const getPostsForDate = (date) => {
        if (!date) return [];
        return localPosts.filter(post => {
            // Check for scheduled or published posts
            if (post.status === 'Drafts') return false;

            const postDate = new Date(post.date);
            return postDate.getDate() === date &&
                postDate.getMonth() === month &&
                postDate.getFullYear() === year;
        });
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleMonthYearClick = () => {
        setShowDatePicker(true);
        setSelectedYear(null);
    };

    const handleYearSelect = (selectedYear) => {
        setSelectedYear(selectedYear);
    };

    const handleMonthSelect = (selectedMonth) => {
        setCurrentDate(new Date(selectedYear, selectedMonth, 1));
        setShowDatePicker(false);
        setSelectedYear(null);
    };

    const handleDragStart = (e, post) => {
        if (post.status === 'Scheduled') {
            setDraggedPost(post);
            e.dataTransfer.effectAllowed = 'move';
            e.currentTarget.style.opacity = '0.4';
            e.currentTarget.style.cursor = 'grabbing';
            // Set drag image or data if needed
        }
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.cursor = 'grab';
        setDraggedPost(null);
        setDragOverDate(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e, date) => {
        if (draggedPost && date) {
            setDragOverDate(date);
        }
    };

    const handleDrop = (e, date) => {
        e.preventDefault();
        if (draggedPost && date) {
            // Format date properly to avoid timezone issues
            const yearStr = year.toString();
            const monthStr = (month + 1).toString().padStart(2, '0');
            const dateStr = date.toString().padStart(2, '0');
            const newDateStr = `${yearStr}-${monthStr}-${dateStr}`;

            const updatedPosts = localPosts.map(post =>
                post.id === draggedPost.id
                    ? { ...post, date: newDateStr }
                    : post
            );

            setLocalPosts(updatedPosts);
            if (onUpdatePostDate) {
                onUpdatePostDate(draggedPost.id, newDateStr);
            }

            setDraggedPost(null);
            setDragOverDate(null);
        }
    };

    const handleNewPostClick = (date) => {
        // Format date properly to avoid timezone issues
        const yearStr = year.toString();
        const monthStr = (month + 1).toString().padStart(2, '0');
        const dateStr = date.toString().padStart(2, '0');
        const newDateStr = `${yearStr}-${monthStr}-${dateStr}`;

        if (onCreatePost) {
            onCreatePost(newDateStr);
        }
    };

    const currentYears = [];
    for (let y = year - 10; y <= year + 10; y++) {
        currentYears.push(y);
    }

    const isToday = (date) => {
        const today = new Date();
        return date === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Button variant="outline" style={{ padding: '8px' }} onClick={handlePrevMonth}>
                    <ChevronLeft size={18} />
                </Button>
                <button
                    onClick={handleMonthYearClick}
                    style={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        transition: 'all 0.2s',
                        color: 'var(--text-main)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                    }}
                >
                    {monthNames[month]} {year}
                </button>
                <Button variant="outline" style={{ padding: '8px' }} onClick={handleNextMonth}>
                    <ChevronRight size={18} />
                </Button>
            </div>

            {showDatePicker && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.3)',
                            zIndex: 999
                        }}
                        onClick={() => {
                            setShowDatePicker(false);
                            setSelectedYear(null);
                        }}
                    />
                    <div
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            padding: '2rem',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                            zIndex: 1000,
                            maxWidth: '400px',
                            width: '90%'
                        }}
                    >
                        <h3 className="text-h3" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                            {selectedYear ? 'Select Month' : 'Select Year'}
                        </h3>

                        {!selectedYear ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '0.75rem',
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}>
                                {currentYears.map(y => (
                                    <button
                                        key={y}
                                        onClick={() => handleYearSelect(y)}
                                        style={{
                                            padding: '1rem',
                                            border: `2px solid ${y === year ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                            borderRadius: 'var(--radius-md)',
                                            background: y === year ? 'rgba(99, 102, 241, 0.1)' : 'white',
                                            color: y === year ? 'var(--color-primary)' : 'var(--text-main)',
                                            fontSize: '0.95rem',
                                            fontWeight: y === year ? 600 : 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (y !== year) {
                                                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (y !== year) {
                                                e.currentTarget.style.background = 'white';
                                            }
                                        }}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '0.75rem'
                            }}>
                                {monthNames.map((monthName, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleMonthSelect(idx)}
                                        style={{
                                            padding: '1rem',
                                            border: `2px solid ${idx === month && selectedYear === year ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                            borderRadius: 'var(--radius-md)',
                                            background: idx === month && selectedYear === year ? 'rgba(99, 102, 241, 0.1)' : 'white',
                                            color: idx === month && selectedYear === year ? 'var(--color-primary)' : 'var(--text-main)',
                                            fontSize: '0.85rem',
                                            fontWeight: idx === month && selectedYear === year ? 600 : 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!(idx === month && selectedYear === year)) {
                                                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!(idx === month && selectedYear === year)) {
                                                e.currentTarget.style.background = 'white';
                                            }
                                        }}
                                    >
                                        {monthName}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className="calendar-grid">
                {days.map(day => (
                    <div key={day} className="calendar-header">{day}</div>
                ))}

                {calendarDates.map((date, index) => {
                    const datePosts = getPostsForDate(date);
                    const isDragOver = dragOverDate === date;
                    const isHovered = hoveredDate === date;
                    const isTodayDate = isToday(date);

                    const MAX_VISIBLE_POSTS = 2;
                    const visiblePosts = datePosts.slice(0, MAX_VISIBLE_POSTS);
                    const remainingPosts = datePosts.length - MAX_VISIBLE_POSTS;

                    return (
                        <div
                            key={index}
                            className="calendar-day"
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, date)}
                            onDrop={(e) => handleDrop(e, date)}
                            onMouseEnter={() => setHoveredDate(date)}
                            onMouseLeave={() => setHoveredDate(null)}
                            style={{
                                background: isDragOver ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                                border: isDragOver ? '2px dashed var(--color-primary)' : isTodayDate ? '2px solid var(--color-primary)' : 'none',
                                position: 'relative',
                                opacity: date ? 1 : 0.3,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '110px' // Ensure uniform height for stacking
                            }}
                        >
                            {date && (
                                <>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            color: isTodayDate ? 'var(--color-primary)' : 'var(--text-muted)',
                                            fontWeight: isTodayDate ? 700 : 600
                                        }}>
                                            {date}
                                        </span>

                                        {isHovered && (
                                            <button
                                                onClick={() => handleNewPostClick(date)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.15rem',
                                                    padding: '0.1rem 0.3rem',
                                                    background: 'var(--color-primary)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '0.55rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <Plus size={8} />
                                                New
                                            </button>
                                        )}
                                    </div>

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {visiblePosts.map(post => {
                                            const Icon = post.icon;
                                            // Determine media icon if no image
                                            const MediaTypeIcon = post.type === 'Reel' || post.type === 'Video' ? Video : ImageIcon;

                                            return (
                                                <div
                                                    key={post.id}
                                                    draggable={post.status === 'Scheduled'}
                                                    onDragStart={(e) => handleDragStart(e, post)}
                                                    onDragEnd={handleDragEnd}
                                                    style={{
                                                        background: 'white',
                                                        border: '1px solid var(--input-border)',
                                                        borderRadius: 'var(--radius-sm)',
                                                        cursor: post.status === 'Scheduled' ? 'grab' : 'pointer',
                                                        transition: 'all 0.2s',
                                                        overflow: 'hidden',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        height: '36px', // Reduced height
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (post.status === 'Scheduled') {
                                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                    }}
                                                >
                                                    {/* Thumbnail Section */}
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        flexShrink: 0,
                                                        background: '#f3f4f6',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRight: '1px solid var(--input-border)'
                                                    }}>
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
                                                            <MediaTypeIcon size={12} className="text-muted" />
                                                        )}
                                                    </div>

                                                    {/* Content Snippet */}
                                                    <div style={{
                                                        padding: '0 4px',
                                                        flex: 1,
                                                        minWidth: 0,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '2px',
                                                            marginBottom: '1px'
                                                        }}>
                                                            {Icon && <Icon size={7} color={post.status === 'Scheduled' ? '#2563eb' : '#6b7280'} />}
                                                            <span style={{
                                                                fontSize: '0.55rem',
                                                                fontWeight: 600,
                                                                color: 'var(--text-muted)'
                                                            }}>
                                                                {post.platform}
                                                            </span>
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.6rem',
                                                            color: 'var(--text-main)',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {post.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {remainingPosts > 0 && (
                                            <button
                                                onClick={() => {
                                                    setOverflowPopup({
                                                        date
                                                    });
                                                }}
                                                style={{
                                                    fontSize: '0.65rem',
                                                    color: 'var(--color-primary)',
                                                    padding: '3px 6px',
                                                    background: 'rgba(99, 102, 241, 0.1)',
                                                    borderRadius: '3px',
                                                    textAlign: 'center',
                                                    marginTop: 'auto',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    transition: 'all 0.2s',
                                                    width: '100%'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                                }}
                                            >
                                                +{remainingPosts} more
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Overflow Popup for "+more" posts */}
            {overflowPopup && (
                (() => {
                    const popupDatePosts = getPostsForDate(overflowPopup.date);
                    return (
                        <>
                            <div
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    zIndex: 999,
                                    pointerEvents: draggedPost ? 'none' : 'auto'
                                }}
                                onClick={() => setOverflowPopup(null)}
                            />
                            <div
                                style={{
                                    position: 'fixed',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '1.5rem',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                                    zIndex: 1000,
                                    maxWidth: '500px',
                                    width: '90%',
                                    maxHeight: '70vh',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    pointerEvents: draggedPost ? 'none' : 'auto'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem',
                                    paddingBottom: '1rem',
                                    borderBottom: '1px solid var(--input-border)'
                                }}>
                                    <h3 className="text-h3">
                                        Posts for {monthNames[month]} {overflowPopup.date}, {year}
                                    </h3>
                                    <button
                                        onClick={() => setOverflowPopup(null)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)',
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '1.25rem',
                                            lineHeight: 1
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div
                                    style={{
                                        flex: 1,
                                        overflowY: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.75rem'
                                    }}
                                    onDragOver={handleDragOver}
                                >
                                    {popupDatePosts.map(post => {
                                        const Icon = post.icon;
                                        const MediaTypeIcon = post.type === 'Reel' || post.type === 'Video' ? Video : ImageIcon;

                                        return (
                                            <div
                                                key={post.id}
                                                draggable={post.status === 'Scheduled'}
                                                onDragStart={(e) => handleDragStart(e, post)}
                                                onDragEnd={handleDragEnd}
                                                style={{
                                                    background: 'white',
                                                    border: '1px solid var(--input-border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    cursor: post.status === 'Scheduled' ? 'grab' : 'pointer',
                                                    transition: 'all 0.2s',
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    height: '70px',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                                    pointerEvents: 'auto'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (post.status === 'Scheduled') {
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                {/* Thumbnail */}
                                                <div style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    flexShrink: 0,
                                                    background: '#f3f4f6',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRight: '1px solid var(--input-border)'
                                                }}>
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
                                                        <MediaTypeIcon size={24} className="text-muted" />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div style={{
                                                    padding: '0.75rem',
                                                    flex: 1,
                                                    minWidth: 0,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.25rem'
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}>
                                                        {Icon && <Icon size={14} color={post.status === 'Scheduled' ? '#2563eb' : '#6b7280'} />}
                                                        <span style={{
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                            color: 'var(--text-main)'
                                                        }}>
                                                            {post.platform}
                                                        </span>
                                                        <span style={{
                                                            fontSize: '0.7rem',
                                                            padding: '2px 6px',
                                                            background: post.status === 'Scheduled' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                            color: post.status === 'Scheduled' ? '#2563eb' : '#10b981',
                                                            borderRadius: '4px',
                                                            fontWeight: 600
                                                        }}>
                                                            {post.status}
                                                        </span>
                                                    </div>
                                                    <div style={{
                                                        fontSize: '0.85rem',
                                                        color: 'var(--text-main)',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        lineHeight: 1.4
                                                    }}>
                                                        {post.content}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div style={{
                                    marginTop: '1rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid var(--input-border)',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-muted)',
                                    textAlign: 'center'
                                }}>
                                    {popupDatePosts.filter(p => p.status === 'Scheduled').length > 0
                                        ? 'Drag scheduled posts to another date to reschedule'
                                        : 'No scheduled posts to drag'}
                                </div>
                            </div >
                        </>
                    );
                })()
            )}
        </div >
    );
};

export default CalendarView;