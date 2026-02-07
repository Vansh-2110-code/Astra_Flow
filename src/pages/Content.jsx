

import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import PostCard from '../components/PostCard';
import Button from '../components/ui/Button';
import CreatePostModal from '../components/CreatePostModal';
import { Filter, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { posts } from '../data/mockData';

const Content = () => {
    const [filter, setFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <DashboardLayout>
            <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-h1">Content</h1>
                    <p className="text-muted">Manage your social media posts.</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Create Post
                </Button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <Button variant="outline" style={{ gap: '0.5rem' }}>
                    <Filter size={16} /> Filter by Platform
                </Button>
                <Button variant="outline" style={{ gap: '0.5rem' }}>
                    <CalendarIcon size={16} /> Date Range
                </Button>
                <div style={{ flex: 1 }}></div>
                <div className="chips-grid" style={{ display: 'flex', gap: '0.5rem', gridTemplateColumns: 'none' }}>
                    {['All', 'Drafts', 'Scheduled', 'Published'].map(status => (
                        <button
                            key={status}
                            className={`btn ${filter === status ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setFilter(status)}
                            style={{ borderRadius: '20px', padding: '6px 16px', fontSize: '0.9rem' }}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="feed-container">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </DashboardLayout>
    );
};

export default Content;
