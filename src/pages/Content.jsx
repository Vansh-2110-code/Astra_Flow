

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import CreatePostModal from '../components/CreatePostModal';

import FilterDropdown from '../components/FilterDropdown';
import DraftsPanel from '../components/DraftsPanel';
import CommentsPanel from '../components/CommentsPanel';
import FeedView from '../components/views/FeedView';
import CalendarView from '../components/views/CalendarView';
import GridView from '../components/views/GridView';
import ListView from '../components/views/ListView';
import { Plus, Image, Share2, PenSquare, Facebook, ChevronDown, Rss, CalendarDays, LayoutGrid, List } from 'lucide-react';
import { Tooltip, Menu, MenuItem, ListItemIcon, ListItemText, useMediaQuery } from '@mui/material';
import { posts as initialPosts } from '../data/mockData';
import { useNotifications } from '../contexts/NotificationContext';
import MediaLibraryModal from '../components/MediaLibraryModal';
import ShareModal from '../components/ShareModal';
import { getFacebookPosts } from '../services/channelService';

const Content = () => {
    const { workspaceId } = useParams();
    const location = useLocation();
    const [currentView, setCurrentView] = useState('feed');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialModalTab, setInitialModalTab] = useState('Post');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [panelContent, setPanelContent] = useState({ title: '', posts: [] });
    const [filters, setFilters] = useState({});
    const [posts, setPosts] = useState(initialPosts);
    const [prefilledDate, setPrefilledDate] = useState('');
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [anchorElView, setAnchorElView] = useState(null);
    const currentUser = 'Admin';
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);

    const {
        checkScheduledPosts,
        notifyPostApproved,
        notifyComment,
        notifyNewPost
    } = useNotifications();

    const isMobile = useMediaQuery('(max-width:1250px)');

    // Close side panels automatically when resizing down to mobile
    useEffect(() => {
        if (isMobile) {
            setIsPanelOpen(false);
            setIsCommentsPanelOpen(false);
            setSelectedPost(null);
        }
    }, [isMobile]);

    // Ensure selectedPost is always perfectly visually synced with the master posts array
    useEffect(() => {
        if (selectedPost) {
            const upToDatePost = posts.find(p => p.id === selectedPost.id);
            if (upToDatePost && upToDatePost !== selectedPost) {
                setSelectedPost(upToDatePost);
            }
        }
    }, [posts]);

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

        if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(post =>
                (post.content && post.content.toLowerCase().includes(q)) ||
                (post.author && post.author.toLowerCase().includes(q)) ||
                (post.platform && post.platform.toLowerCase().includes(q))
            );
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
                String(post.id) === String(postId)
                    ? { ...post, comments: [...(post.comments || []), comment] }
                    : post
            )
        );

        // Ensure the active post in the side panel also updates if it's the same one
        setSelectedPost(prev => {
            if (prev && String(prev.id) === String(postId)) {
                return {
                    ...prev,
                    comments: [...(prev.comments || []), comment]
                };
            }
            return prev;
        });

        // Trigger comment notification
        const targetPost = posts.find(p => String(p.id) === String(postId));
        if (targetPost) {
            const isHighlightComment = comment.selection !== null && comment.selection !== undefined;
            notifyComment(targetPost, comment.author, isHighlightComment);
        }
    };

    const filteredPosts = getFilteredPosts();
    const hasPosts = filteredPosts.length > 0;

    const sectionLabel = 'Content';

    const viewOptions = [
        { id: 'feed', label: 'Feed', icon: Rss },
        { id: 'calendar', label: 'Calendar', icon: CalendarDays },
        { id: 'grid', label: 'Grid', icon: LayoutGrid },
        { id: 'list', label: 'List', icon: List },
    ];
    const currentViewOption = viewOptions.find(v => v.id === currentView) || viewOptions[0];

    const loadFacebookPosts = (channelId) => {
        setIsLoadingPosts(true);
        getFacebookPosts(channelId)
            .then(data => {
                if (data.posts) {
                    const mappedPosts = data.posts.map(p => ({
                        id: `fb_api_${p.id}`,
                        author: 'Facebook Page',
                        date: new Date(p.created_time).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        content: p.message || '',
                        // Mapping media: ensure it's always an array. 
                        // Backend sample uses 'media_url'. Fallback to empty array if missing/empty.
                        media: p.media_url ? [p.media_url] : [],
                        platform: 'Facebook',
                        icon: Facebook,
                        // Mapping media types: IMAGE -> Post, MULTI_IMAGE -> Carousel, VIDEO -> Reel
                        type: p.media_type === 'VIDEO' ? 'Reel' : (p.media_type === 'MULTI_IMAGE' ? 'Carousel' : 'Post'),
                        status: p.status === 'published' ? 'Published' : 'Draft',
                        avatar: null,
                        likes: 0,
                        commentsCount: 0,
                        shares: 0,
                        comments: [],
                        approved: true,
                        approvedBy: [currentUser],
                        facebook_post_id: p.facebook_post_id
                    }));
                    setPosts(mappedPosts);
                }
            })
            .catch(err => {
                console.error("Failed to load Facebook posts:", err);
                setPosts(initialPosts); // fallback
            })
            .finally(() => {
                setIsLoadingPosts(false);
            });
    };

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

        const searchParam = params.get('search');
        if (searchParam) {
            setFilters(prev => ({
                ...prev,
                searchQuery: searchParam
            }));
        } else {
            setFilters(prev => ({ ...prev, searchQuery: '' }));
        }

        if (viewParam && ['feed', 'calendar', 'grid', 'list'].includes(viewParam)) {
            setCurrentView(viewParam);
        }

        const channelIdParam = params.get('channel_id');

        // Fetch dynamic Facebook posts if applicable
        if (platformParam === 'Facebook' && channelIdParam) {
            loadFacebookPosts(channelIdParam);
        } else {
            // Revert to initial posts if not a dynamic channel
            setPosts(initialPosts);
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
                    isPanelOpen={isCommentsPanelOpen}
                    onOpenNewStory={() => {
                        setInitialModalTab('Story');
                        setIsModalOpen(true);
                    }}
                />;
        }
    };

    // Compact header redesign — breadcrumb + view switcher + actions injected into Topbar
    const topbarContent = (
        <>
            <span className="hide-on-tablet" style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-main)' }}>
                {sectionLabel}
            </span>
            <span className="hide-on-tablet" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 4px' }}>/</span>

            {/* View switcher — MUI Menu (renders via portal, never clipped) */}
            <div style={{ flexShrink: 0 }}>
                {(() => {
                    const CurrentViewIcon = currentViewOption.icon; return (
                        <Tooltip title="Change View">
                            <button
                                onClick={(e) => setAnchorElView(e.currentTarget)}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                    fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)',
                                    background: 'none', border: '1px solid var(--input-border)',
                                    borderRadius: 7, cursor: 'pointer',
                                    padding: '4px 9px', transition: 'border-color 0.15s, background 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(99,102,241,0.04)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--input-border)'; e.currentTarget.style.background = 'none'; }}
                            >
                                <CurrentViewIcon size={13} style={{ color: 'var(--color-primary)' }} />
                                <span className="hide-on-mobile">{currentViewOption.label}</span>
                                <ChevronDown size={12} style={{ color: 'var(--text-muted)', transition: 'transform 0.15s', transform: Boolean(anchorElView) ? 'rotate(180deg)' : 'rotate(0)' }} />
                            </button>
                        </Tooltip>
                    );
                })()}
                <Menu
                    anchorEl={anchorElView}
                    open={Boolean(anchorElView)}
                    onClose={() => setAnchorElView(null)}
                    PaperProps={{
                        sx: {
                            borderRadius: '10px',
                            minWidth: 160,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            mt: 0.5,
                            '& .MuiMenuItem-root': {
                                borderRadius: '6px',
                                mx: 0.5,
                                px: 1.5,
                                py: 0.8,
                                fontSize: '0.82rem',
                                gap: 1,
                            }
                        }
                    }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                >
                    {viewOptions.map(v => {
                        const VIcon = v.icon;
                        return (
                            <MenuItem
                                key={v.id}
                                selected={currentView === v.id}
                                onClick={() => { setCurrentView(v.id); setAnchorElView(null); }}
                                sx={{
                                    fontWeight: currentView === v.id ? 600 : 400,
                                    color: currentView === v.id ? 'var(--color-primary)' : 'var(--text-main)',
                                    bgcolor: currentView === v.id ? 'rgba(99,102,241,0.08)' : 'transparent',
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: '28px !important', color: 'inherit' }}>
                                    <VIcon size={15} />
                                </ListItemIcon>
                                <ListItemText primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 'inherit' }}>
                                    {v.label}
                                </ListItemText>
                            </MenuItem>
                        );
                    })}
                </Menu>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Actions — right side of topbar content area */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginRight: '12px' }}>
                <Tooltip title="Filter Posts">
                    <div>
                        <FilterDropdown onFilterChange={handleFilterChange} />
                    </div>
                </Tooltip>

                <Tooltip title="Media Gallery">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setIsMediaOpen(true)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}
                    >
                        <Image size={15} /> <span className="hide-on-tablet">Media</span>
                    </button>
                </Tooltip>

                <Tooltip title="Share Progress">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setIsShareOpen(true)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}
                    >
                        <Share2 size={15} /> <span className="hide-on-tablet">Share</span>
                    </button>
                </Tooltip>

                <div style={{ width: '1px', height: '24px', background: 'var(--input-border)', margin: '0 4px' }} />

                <Tooltip title="Create Post">
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                            padding: '0 8px',
                            minWidth: '32px',
                            height: '32px',
                            justifyContent: 'center',
                            fontSize: '0.75rem'
                        }}
                    >
                        <PenSquare size={13} /> <span className="hide-on-tablet" style={{ marginLeft: '4px' }}>Compose</span>
                    </button>
                </Tooltip>
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
                    setInitialModalTab('Post'); // reset back to default
                }}
                prefilledDate={prefilledDate}
                onPostCreated={handlePostCreated}
                initialTab={initialModalTab}
                onPublishSuccess={() => {
                    const params = new URLSearchParams(location.search);
                    const channelId = params.get('channel_id');
                    if (channelId) loadFacebookPosts(channelId);
                }}
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

            {/* Content area */}
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
