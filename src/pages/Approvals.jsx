
import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import PostCard from '../components/PostCard';
import Button from '../components/ui/Button';
import { CheckCircle, XCircle, ChevronDown, Calendar } from 'lucide-react';
import { posts } from '../data/mockData';

const Approvals = () => {
    const pendingPosts = posts.filter(p => p.status === 'Pending Approval');
    // Plannable-like: separate approve options; which post has approve menu open (visual only).
    const [approveMenuOpen, setApproveMenuOpen] = useState(null);

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
                                <div className="card" style={{ marginTop: '-1rem', marginBottom: '2rem', borderTopLeftRadius: 0, borderTopRightRadius: 0, background: '#f9fafb', borderTop: 'none', padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <Button variant="primary" style={{ background: '#10b981' }}>
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
                                                    <button type="button" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.9rem' }} onClick={() => setApproveMenuOpen(null)}>
                                                        <CheckCircle size={16} /> Approve
                                                    </button>
                                                    <button type="button" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.9rem' }} onClick={() => setApproveMenuOpen(null)}>
                                                        <Calendar size={16} /> Approve & Schedule
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <Button variant="danger">
                                            <XCircle size={18} /> Reject
                                        </Button>
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
