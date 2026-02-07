
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import PostCard from '../components/PostCard';
import Button from '../components/ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { posts } from '../data/mockData';

const Approvals = () => {
    // Filter only pending posts for this view
    const pendingPosts = posts.filter(p => p.status === 'Pending Approval');

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-h1">Approvals</h1>
                <p className="text-muted">Review and approve content.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) 1fr', gap: '2rem' }}>
                <div className="feed-container" style={{ margin: 0, maxWidth: 'none' }}>
                    {pendingPosts.length === 0 ? (
                        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h3>All caught up!</h3>
                            <p>No posts waiting for approval.</p>
                        </div>
                    ) : (
                        pendingPosts.map(post => (
                            <div key={post.id} style={{ position: 'relative' }}>
                                <PostCard post={post} />
                                <div className="card" style={{ marginTop: '-1rem', marginBottom: '2rem', borderTopLeftRadius: 0, borderTopRightRadius: 0, background: '#f9fafb', borderTop: 'none', display: 'flex', gap: '1rem', padding: '1rem' }}>
                                    <Button variant="primary" style={{ background: '#10b981', flex: 1 }}>
                                        <CheckCircle size={18} /> Approve
                                    </Button>
                                    <Button variant="danger" style={{ flex: 1 }}>
                                        <XCircle size={18} /> Reject
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: '2rem' }}>
                    <h3 className="text-h3" style={{ marginBottom: '1rem' }}>Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Pending</span>
                            <span style={{ fontWeight: 600 }}>{pendingPosts.length}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Approved this week</span>
                            <span style={{ fontWeight: 600 }}>12</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Rejected</span>
                            <span style={{ fontWeight: 600 }}>2</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Approvals;
