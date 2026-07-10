

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
import { Plus, Image, Share2, PenSquare, Facebook, Instagram, Linkedin, Twitter, ChevronDown, Rss, CalendarDays, LayoutGrid, List } from 'lucide-react';
import { Tooltip, Menu, MenuItem, ListItemIcon, ListItemText, useMediaQuery } from '@mui/material';
import { posts as initialPosts } from '../data/mockData';
import { useNotifications } from '../contexts/NotificationContext';
import MediaLibraryModal from '../components/MediaLibraryModal';
import ShareModal from '../components/ShareModal';
import { getFacebookPosts, approveFacebookPost, getChannelDetails, getConnectedChannels, deletePost } from '../services/channelService';

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
            setTimeout(() => {
                setIsPanelOpen(false);
                setIsCommentsPanelOpen(false);
                setSelectedPost(null);
            }, 0);
        }
    }, [isMobile]);

    // Ensure selectedPost is always perfectly visually synced with the master posts array
    useEffect(() => {
        if (selectedPost) {
            const upToDatePost = posts.find(p => p.id === selectedPost.id);
            if (upToDatePost && upToDatePost !== selectedPost) {
                setTimeout(() => {
                    setSelectedPost(upToDatePost);
                }, 0);
            }
        }
    }, [posts, selectedPost]);

    // Check for scheduled posts needing approval on mount and periodically
    useEffect(() => {
        checkScheduledPosts(posts);

        // Check every 5 minutes
        const interval = setInterval(() => {
            checkScheduledPosts(posts);
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [posts, checkScheduledPosts]);

    const _handleFilterClick = (status) => {
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
            filtered = filtered.filter(post => {
                const dateStr = post.created_at || post.date;
                if (!dateStr) return false;
                const postDate = new Date(dateStr);
                const filterDate = new Date(filters.dateFrom);
                postDate.setHours(0,0,0,0);
                filterDate.setHours(0,0,0,0);
                return postDate >= filterDate;
            });
        }

        if (filters.dateTo) {
            filtered = filtered.filter(post => {
                const dateStr = post.created_at || post.date;
                if (!dateStr) return false;
                const postDate = new Date(dateStr);
                const filterDate = new Date(filters.dateTo);
                postDate.setHours(0,0,0,0);
                filterDate.setHours(0,0,0,0);
                return postDate <= filterDate;
            });
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

    const handleApprovePost = async (postId, newApprovedState) => {
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

        // Find the post to get its channelId
        const targetPost = posts.find(p => p.id === postId);
        const channelId = targetPost?.channelId || new URLSearchParams(location.search).get('channel_id');

        if (channelId && typeof postId === 'string' && postId.startsWith('fb_api_')) {
            const backendPostId = postId.replace('fb_api_', '');
            try {
                await approveFacebookPost(channelId, backendPostId, newApprovedState);
            } catch (error) {
                console.error("Failed to sync post approval to backend:", error);
            }
        }
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

    const handleDeletePost = async (postId) => {
        const params = new URLSearchParams(location.search);
        const channelIdParam = params.get('channel_id');
        
        let channelId = channelIdParam;
        let backendPostId = postId;
        
        if (typeof postId === 'string' && postId.startsWith('fb_api_')) {
            backendPostId = postId.replace('fb_api_', '');
        }

        if (!channelId) {
            const targetPost = posts.find(p => p.id === postId);
            channelId = targetPost?.channelId;
        }

        if (!channelId) return;

        try {
            await deletePost(channelId, backendPostId);
            if (channelIdParam) {
                loadFacebookPosts(channelIdParam);
            } else {
                loadWorkspacePosts();
            }
        } catch (err) {
            console.error("Failed to delete post:", err);
            alert(`Delete failed: ${err.message}`);
        }
    };

    const loadFacebookPosts = useCallback((channelId) => {
        setIsLoadingPosts(true);
        Promise.all([
            getChannelDetails(channelId).catch(() => null),
            getFacebookPosts(channelId)
        ])
        .then(([channel, rawPosts]) => {
            const postsList = Array.isArray(rawPosts) ? rawPosts : (rawPosts.posts || []);
            
            const mappedPosts = postsList.map(p => {
                let platformName = 'Facebook';
                let PlatformIcon = Facebook;
                let authorPlaceholder = 'Facebook Page';
                
                if (channel?.platform === 'instagram') {
                    platformName = 'Instagram';
                    PlatformIcon = Instagram;
                    authorPlaceholder = 'Instagram Account';
                } else if (channel?.platform === 'linkedin') {
                    platformName = 'LinkedIn';
                    PlatformIcon = Linkedin;
                    authorPlaceholder = 'LinkedIn Profile';
                } else if (channel?.platform === 'twitter') {
                    platformName = 'Twitter';
                    PlatformIcon = Twitter;
                    authorPlaceholder = 'X/Twitter Profile';
                }

                return {
                    id: `fb_api_${p.id}`,
                    author: channel?.name || authorPlaceholder,
                    date: p.created_at ? new Date(p.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : new Date().toLocaleString(),
                    content: p.message || '',
                    media: p.media || [],
                    platform: platformName,
                    icon: PlatformIcon,
                    type: p.type || (p.media?.length > 1 ? 'Carousel' : (p.media?.some(m => m.endsWith('.mp4') || m.endsWith('.mov')) ? 'Reel' : 'Post')),
                    status: p.status === 'published' ? 'Published' : (p.status === 'scheduled' ? 'Scheduled' : 'Draft'),
                    avatar: channel?.profile_picture || null,
                    likes: 0,
                    commentsCount: p.comments?.length || 0,
                    shares: 0,
                    comments: p.comments || [],
                    approved: p.approved || false,
                    approvedBy: p.approvedBy || [],
                    facebook_post_id: p.facebook_post_id || null,
                    channelId: channelId,
                    scheduledTime: p.scheduled_time || null
                };
            });
            setPosts(mappedPosts);
        })
        .catch(err => {
            console.error("Failed to load channel posts:", err);
            setPosts(initialPosts); // fallback
        })
        .finally(() => {
            setIsLoadingPosts(false);
        });
    }, [currentUser]);

    const loadWorkspacePosts = useCallback(() => {
        if (!workspaceId) return;
        setIsLoadingPosts(true);
        getConnectedChannels(workspaceId)
            .then(async (channels) => {
                if (channels && channels.length > 0) {
                    const allPostsPromises = channels.map(ch => getFacebookPosts(ch.id).catch(() => ({ posts: [] })));
                    const results = await Promise.all(allPostsPromises);
                    
                    const combined = [];
                    results.forEach((res, index) => {
                        const ch = channels[index];
                        const postsList = Array.isArray(res) ? res : (res.posts || []);
                        postsList.forEach(p => {
                            let platformName = 'Facebook';
                            let PlatformIcon = Facebook;
                            let authorPlaceholder = 'Facebook Page';
                            
                            if (ch.platform === 'instagram') {
                                platformName = 'Instagram';
                                PlatformIcon = Instagram;
                                authorPlaceholder = 'Instagram Account';
                            } else if (ch.platform === 'linkedin') {
                                platformName = 'LinkedIn';
                                PlatformIcon = Linkedin;
                                authorPlaceholder = 'LinkedIn Profile';
                            } else if (ch.platform === 'twitter') {
                                platformName = 'Twitter';
                                PlatformIcon = Twitter;
                                authorPlaceholder = 'X/Twitter Profile';
                            }

                            combined.push({
                                id: `fb_api_${p.id}`,
                                author: ch.name || authorPlaceholder,
                                date: p.created_at ? new Date(p.created_at).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : new Date().toLocaleString(),
                                content: p.message || '',
                                media: p.media || [],
                                platform: platformName,
                                icon: PlatformIcon,
                                type: p.type || (p.media?.length > 1 ? 'Carousel' : (p.media?.some(m => m.endsWith('.mp4') || m.endsWith('.mov')) ? 'Reel' : 'Post')),
                                status: p.status === 'published' ? 'Published' : (p.status === 'scheduled' ? 'Scheduled' : 'Draft'),
                                avatar: ch.profile_picture || null,
                                likes: 0,
                                commentsCount: p.comments?.length || 0,
                                shares: 0,
                                comments: p.comments || [],
                                approved: p.approved || false,
                                approvedBy: p.approvedBy || [],
                                facebook_post_id: p.facebook_post_id || null,
                                channelId: ch.id,
                                scheduledTime: p.scheduled_time || null
                            });
                        });
                    });
                    
                    setPosts(combined);
                } else {
                    setPosts([]);
                }
            })
            .catch(err => {
                console.error("Failed to load workspace posts:", err);
                setPosts([]);
            })
            .finally(() => {
                setIsLoadingPosts(false);
            });
    }, [workspaceId]);

    // UI redesign inspired by Plannable
    // Layout restructuring (non-breaking)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const platformParam = params.get('platform');
        const viewParam = params.get('view');
        const searchParam = params.get('search');
        const channelIdParam = params.get('channel_id');

        setTimeout(() => {
            if (platformParam) {
                setFilters(prev => ({
                    ...prev,
                    platform: platformParam
                }));
            }

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

            // Fetch dynamic posts if a channel is selected
            if (channelIdParam) {
                loadFacebookPosts(channelIdParam);
            } else {
                // Load all posts for this workspace
                loadWorkspacePosts();
            }
        }, 0);
    }, [location.search, loadFacebookPosts, loadWorkspacePosts]);

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
                    onDeletePost={handleDeletePost}
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
                                <ChevronDown size={12} style={{ color: 'var(--text-muted)', transition: 'transform 0.15s', transform: anchorElView ? 'rotate(180deg)' : 'rotate(0)' }} />
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
                    if (channelId) {
                        loadFacebookPosts(channelId);
                    } else {
                        loadWorkspacePosts();
                    }
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

            <MediaLibraryModal isOpen={isMediaOpen} onClose={() => setIsMediaOpen(false)} workspaceId={workspaceId} />
            <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />

            {/* Content area */}
            {isLoadingPosts ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '360px', gap: '12px' }}>
                    <div className="spinner" style={{ borderTopColor: 'var(--color-primary)' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading posts...</p>
                </div>
            ) : hasPosts ? (
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
