

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import CreatePostModal from '../components/CreatePostModal';
import ViewSwitcher from '../components/ViewSwitcher';
import FilterDropdown from '../components/FilterDropdown';
import DraftsPanel from '../components/DraftsPanel';
import CommentsPanel from '../components/CommentsPanel';
import FeedView from '../components/views/FeedView';
import CalendarView from '../components/views/CalendarView';
import GridView from '../components/views/GridView';
import ListView from '../components/views/ListView';
import { Plus, SlidersHorizontal, Image, Share2, PenSquare, ChevronDown, LayoutGrid, List, CalendarDays, Rss } from 'lucide-react';
import { posts as initialPosts } from '../data/mockData';
import { useNotifications } from '../contexts/NotificationContext';
import MediaLibraryModal from '../components/MediaLibraryModal';
import ShareModal from '../components/ShareModal';

const Content = () => {
    const { workspaceId } = useParams();
    const location = useLocation();
    const [currentView, setCurrentView] = useState('feed');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [panelContent, setPanelContent] = useState({ title: '', posts: [] });
    const [filters, setFilters] = useState({});
    const [posts, setPosts] = useState(initialPosts);
    const [prefilledDate, setPrefilledDate] = useState('');
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [showViewDropdown, setShowViewDropdown] = useState(false);
    const viewDropdownRef = useRef(null);
    const currentUser = 'Admin';

    const {
        checkScheduledPosts,
        notifyPostApproved,
        notifyComment,
        notifyNewPost
    } = useNotifications();


    // Close view dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (viewDropdownRef.current && !viewDropdownRef.current.contains(e.target)) {
                setShowViewDropdown(false);
            }
        };
        if (showViewDropdown) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showViewDropdown]);

    // Check for scheduled posts needing approval on mount and periodically
    useEffect(() => {
        checkScheduledPosts(posts);

        // Check every 5 minutes
        const interval = setInterval(() => {
            checkScheduledPosts(posts);
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [posts, checkScheduledPosts]);

    const handleFilterClick = (status) => {
        const filteredPosts = getFilteredPosts().filter(post =>
            post.status.toLowerCase() === status.toLowerCase()
        );
        setPanelContent({ title: status, posts: filteredPosts });
        setIsPanelOpen(true);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const getFilteredPosts = () => {
        let filtered = [...posts];

        if (filters.postType) {
            filtered = filtered.filter(post => post.type === filters.postType);
        }

        if (filters.platform) {
            filtered = filtered.filter(post => post.platform === filters.platform);
        }

        if (filters.dateFrom) {
            filtered = filtered.filter(post => new Date(post.date) >= new Date(filters.dateFrom));
        }

        if (filters.dateTo) {
            filtered = filtered.filter(post => new Date(post.date) <= new Date(filters.dateTo));
        }

        return filtered;
    };

    const handleUpdatePostDate = (postId, newDate) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, date: newDate } : post
            )
        );
    };

    const handleCreatePost = (date) => {
        setPrefilledDate(date);
        setIsModalOpen(true);
    };

    const handlePostCreated = (newPost) => {
        setPosts(prevPosts => [...prevPosts, newPost]);
        setIsModalOpen(false);

        // Trigger notification for new post
        notifyNewPost(newPost, newPost.author || currentUser);
    };

    const handleApprovePost = (postId, newApprovedState) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    let updatedApprovedBy = [...(post.approvedBy || [])];

                    if (newApprovedState) {
                        if (!updatedApprovedBy.includes(currentUser)) {
                            updatedApprovedBy.push(currentUser);

                            // Trigger approval notification
                            if (post.status !== 'Published') {
                                notifyPostApproved(post, currentUser, post.author);
                            }
                        }
                    } else {
                        updatedApprovedBy = updatedApprovedBy.filter(u => u !== currentUser);
                    }

                    return {
                        ...post,
                        approved: updatedApprovedBy.length > 0,
                        approvedBy: updatedApprovedBy
                    };
                }
                return post;
            })
        );
    };

    const handleOpenComments = (post) => {
        setSelectedPost(post);
        setIsCommentsPanelOpen(true);
    };

    const handleAddComment = (postId, comment) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, comments: [...(post.comments || []), comment] }
                    : post
            )
        );
        setSelectedPost(prev => {
            if (!prev) return null;
            return {
                ...prev,
                comments: [...(prev.comments || []), comment]
            };
        });

        // Trigger comment notification
        const post = posts.find(p => p.id === postId);
        if (post) {
            const isHighlightComment = comment.selection !== null && comment.selection !== undefined;
            notifyComment(post, comment.author, isHighlightComment);
        }
    };

    const filteredPosts = getFilteredPosts();
    const hasPosts = filteredPosts.length > 0;

    const sectionLabel = 'Content';
    const currentViewLabelMap = {
        feed: 'Feed',
        calendar: 'Calendar',
        grid: 'Grid',
        list: 'List'
    };
    const currentViewLabel = currentViewLabelMap[currentView] || 'Feed';

    // UI redesign inspired by Plannable
    // Layout restructuring (non-breaking)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const platformParam = params.get('platform');
        const viewParam = params.get('view');

        if (platformParam) {
            setFilters(prev => ({
                ...prev,
                platform: platformParam
            }));
        }

        if (viewParam && ['feed', 'calendar', 'grid', 'list'].includes(viewParam)) {
            setCurrentView(viewParam);
        }
    }, [location.search]);

    const renderView = () => {
        switch (currentView) {
            case 'calendar':
                return <CalendarView
                    posts={filteredPosts}
                    onUpdatePostDate={handleUpdatePostDate}
                    onCreatePost={handleCreatePost}
                />;
            case 'grid':
                return <GridView posts={filteredPosts} />;
            case 'list':
                return <ListView posts={filteredPosts} />;
            case 'feed':
            default:
                return <FeedView
                    posts={filteredPosts}
                    currentUser={currentUser}
                    onApprove={handleApprovePost}
                    onOpenComments={handleOpenComments}
                    onAddComment={handleAddComment}
                    showStoriesStrip={true}
                />;
        }
    };

    // Compact header redesign — breadcrumb + view switcher + actions injected into Topbar
    const topbarContent = (
        <>
            <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-main)' }}>
                {sectionLabel}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 0.1rem' }}>/</span>
            {/* View dropdown — Plannable-style */}
            <div ref={viewDropdownRef} style={{ position: 'relative' }}>
                <button
                    onClick={() => setShowViewDropdown(!showViewDropdown)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                        fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '2px 4px', borderRadius: 4,
                        transition: 'background 0.15s'
                    }}
                >
                    {currentViewLabel}
                    <ChevronDown size={13} style={{
                        color: 'var(--text-muted)',
                        transition: 'transform 0.15s',
                        transform: showViewDropdown ? 'rotate(180deg)' : 'rotate(0)'
                    }} />
                </button>
                {showViewDropdown && (
                    <div style={{
                        position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                        background: 'white', border: '1px solid var(--input-border)',
                        borderRadius: 8, padding: '0.35rem', minWidth: 160,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100
                    }}>
                        {[
                            { id: 'feed', label: 'Feed', icon: Rss },
                            { id: 'calendar', label: 'Calendar', icon: CalendarDays },
                            { id: 'grid', label: 'Grid', icon: LayoutGrid },
                            { id: 'list', label: 'List', icon: List },
                        ].map(v => (
                            <button
                                key={v.id}
                                onClick={() => { setCurrentView(v.id); setShowViewDropdown(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                                    padding: '7px 10px', borderRadius: 6,
                                    border: 'none', cursor: 'pointer',
                                    background: currentView === v.id ? 'rgba(99,102,241,0.08)' : 'transparent',
                                    color: currentView === v.id ? 'var(--color-primary)' : 'var(--text-main)',
                                    fontWeight: currentView === v.id ? 600 : 400,
                                    fontSize: '0.8rem', transition: 'background 0.12s'
                                }}
                            >
                                <v.icon size={15} />
                                {v.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Actions — right side of topbar content area */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                <FilterDropdown onFilterChange={handleFilterChange} />
                <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsMediaOpen(true)}
                    style={{ padding: '5px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}
                >
                    <Image size={14} /> Media
                </button>
                <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsShareOpen(true)}
                    style={{ padding: '5px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}
                >
                    <Share2 size={14} /> Share
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                    style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', borderRadius: 'var(--radius-sm)' }}
                >
                    <PenSquare size={14} /> Compose
                </button>
            </div>
        </>
    );

    return (
        <DashboardLayout topbarContent={topbarContent}>
            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setPrefilledDate('');
                }}
                prefilledDate={prefilledDate}
                onPostCreated={handlePostCreated}
            />
            <DraftsPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                posts={panelContent.posts}
                title={panelContent.title}
            />
            <CommentsPanel
                isOpen={isCommentsPanelOpen}
                onClose={() => {
                    setIsCommentsPanelOpen(false);
                    setSelectedPost(null);
                }}
                post={selectedPost}
                onAddComment={handleAddComment}
            />

            <MediaLibraryModal isOpen={isMediaOpen} onClose={() => setIsMediaOpen(false)} />
            <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />

            {/* Post container width adjustment — content goes straight to stories/posts, no in-page header */}
            {hasPosts ? (
                <div style={{ padding: '0' }}>
                    {renderView()}
                </div>
            ) : (
                <div
                    style={{
                        minHeight: '360px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        className="card"
                        style={{
                            maxWidth: '420px',
                            width: '100%',
                            textAlign: 'center',
                            padding: '2rem 2.25rem'
                        }}
                    >
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                margin: '0 auto 1rem',
                                background: 'rgba(99, 102, 241, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem'
                            }}
                        >
                            📅
                        </div>
                        <h2
                            className="text-h3"
                            style={{
                                marginBottom: '0.5rem'
                            }}
                        >
                            Start planning your content
                        </h2>
                        <p
                            className="text-muted"
                            style={{
                                marginBottom: '1.25rem',
                                fontSize: '0.85rem'
                            }}
                        >
                            Create your first post to see it appear across calendar, list and grid views for this workspace.
                        </p>
                        <Button
                            variant="primary"
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus size={16} /> Create post
                        </Button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Content;
