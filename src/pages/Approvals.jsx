
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import PostCard from '../components/PostCard';
import Button from '../components/ui/Button';
import { CheckCircle, XCircle, ChevronDown, Calendar, Loader, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { getConnectedChannels, getFacebookPosts, approveFacebookPost, deletePost } from '../services/channelService';

const Approvals = () => {
    const { workspaceId } = useParams();
    const [pendingPosts, setPendingPosts] = useState([]);
    const [approvedCount, setApprovedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [approveMenuOpen, setApproveMenuOpen] = useState(null);

    const loadApprovals = () => {
        if (!workspaceId) return;
        setIsLoading(true);
        getConnectedChannels(workspaceId)
            .then(async (channels) => {
                if (channels && channels.length > 0) {
                    const allPostsPromises = channels.map(ch => getFacebookPosts(ch.id).catch(() => ({ posts: [] })));
                    const results = await Promise.all(allPostsPromises);
                    
                    const pending = [];
                    let approved = 0;
                    
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

                            const mappedPost = {
                                id: p.id,
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
                            };
                            
                            // Pending Approval = scheduled posts that are NOT approved yet
                            if (p.status === 'scheduled' && !p.approved) {
                                pending.push(mappedPost);
                            } else if (p.approved) {
                                approved++;
                            }
                        });
                    });
                    
                    setPendingPosts(pending);
                    setApprovedCount(approved);
                } else {
                    setPendingPosts([]);
                    setApprovedCount(0);
                }
            })
            .catch(err => {
                console.error("Failed to load approvals:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadApprovals();
    }, [workspaceId]);

    const handleApprove = async (channelId, postId) => {
        try {
            await approveFacebookPost(channelId, postId, true);
            // Refresh list
            loadApprovals();
        } catch (err) {
            console.error("Failed to approve post:", err);
            alert(`Approval failed: ${err.message}`);
        }
    };

    const handleDeletePost = async (postId) => {
        const targetPost = pendingPosts.find(p => p.id === postId);
        const channelId = targetPost?.channelId;
        if (!channelId) return;

        try {
            await deletePost(channelId, postId);
            loadApprovals();
        } catch (err) {
            console.error("Failed to delete post:", err);
            alert(`Delete failed: ${err.message}`);
        }
    };

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-h1">Approvals</h1>
                <p className="text-muted">Review and approve scheduled workspace content.</p>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader className="animate-spin" size={32} style={{ color: 'var(--color-primary)' }} />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) 1fr', gap: '2rem' }}>
                    <div className="feed-container" style={{ margin: 0, maxWidth: 'none' }}>
                        {pendingPosts.length === 0 ? (
                            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5, color: '#10b981' }} />
                                <h3>All caught up!</h3>
                                <p>No posts waiting for approval in this workspace.</p>
                            </div>
                        ) : (
                            pendingPosts.map(post => (
                                <div key={post.id} style={{ position: 'relative' }}>
                                    <PostCard post={post} onDeletePost={handleDeletePost} />
                                    <div className="card" style={{ marginTop: '-1rem', marginBottom: '2rem', borderTopLeftRadius: 0, borderTopRightRadius: 0, background: '#f9fafb', borderTop: 'none', padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <Button 
                                                variant="primary" 
                                                style={{ background: '#10b981' }}
                                                onClick={() => handleApprove(post.channelId, post.id)}
                                            >
                                                <CheckCircle size={18} /> Approve
                                            </Button>
                                            <div style={{ position: 'relative' }}>
                                                <Button
                                                    variant="outline"
                                                    style={{ minWidth: '140px' }}
                                                    onClick={() => setApproveMenuOpen(approveMenuOpen === post.id ? null : post.id)}
                                                >
                                                    Approve options <ChevronDown size={14} />
                                                </Button>
                                                {approveMenuOpen === post.id && (
                                                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', background: 'white', border: '1px solid var(--input-border)', borderRadius: 'var(--radius-sm)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, minWidth: '180px' }}>
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-ghost" 
                                                            style={{ width: '100%', justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.9rem' }} 
                                                            onClick={() => { handleApprove(post.channelId, post.id); setApproveMenuOpen(null); }}
                                                        >
                                                            <CheckCircle size={16} /> Approve immediately
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: '2rem' }}>
                        <h3 className="text-h3" style={{ marginBottom: '1rem' }}>Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-muted">Pending Approval</span>
                                <span style={{ fontWeight: 600 }}>{pendingPosts.length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-muted">Approved Posts</span>
                                <span style={{ fontWeight: 600 }}>{approvedCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Approvals;
