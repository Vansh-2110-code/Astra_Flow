

import React, { useState, useEffect } from 'react';
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
import { Plus } from 'lucide-react';
import { posts as initialPosts } from '../data/mockData';
import { useNotifications } from '../contexts/NotificationContext';

const Content = () => {
    const [currentView, setCurrentView] = useState('feed');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [panelContent, setPanelContent] = useState({ title: '', posts: [] });
    const [filters, setFilters] = useState({});
    const [posts, setPosts] = useState(initialPosts);
    const [prefilledDate, setPrefilledDate] = useState('');
    const currentUser = 'Admin';
    
    const { 
        checkScheduledPosts, 
        notifyPostApproved, 
        notifyComment,
        notifyNewPost 
    } = useNotifications();

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
                />;
        }
    };

    return (
        <DashboardLayout>
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h1 className="text-h1">Content</h1>
                    <p className="text-muted">Manage your social media posts.</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} /> Create Post
                </Button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <FilterDropdown onFilterChange={handleFilterChange} />

                <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />

                <div style={{ flex: 1 }}></div>

                <div className="chips-grid" style={{ display: 'flex', gap: '0.5rem', gridTemplateColumns: 'none' }}>
                    {['Drafts', 'Scheduled', 'Published'].map(status => (
                        <button
                            key={status}
                            className="btn btn-ghost"
                            onClick={() => handleFilterClick(status)}
                            style={{
                                borderRadius: '20px',
                                padding: '6px 14px',
                                fontSize: '0.875rem',
                                border: '1px solid var(--input-border)'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {renderView()}
        </DashboardLayout>
    );
};

export default Content;
