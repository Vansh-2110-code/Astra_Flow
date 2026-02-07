
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { posts } from '../data/mockData';
import { Heart, MessageCircle } from 'lucide-react';

const GridView = () => {
    // Duplicate posts to fill grid
    const gridPosts = [...posts, ...posts, ...posts];

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-h1">Grid View</h1>
                <p className="text-muted">Plan your Instagram aesthetics.</p>
            </div>

            <div className="ig-grid">
                {gridPosts.map((post, index) => (
                    <div key={`${post.id}-${index}`} className="ig-post">
                        <img
                            src={post.media || `https://source.unsplash.com/random/400x400?sig=${index}`}
                            alt="Post"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div className="ig-overlay">
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Heart size={20} fill="white" /> 124
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <MessageCircle size={20} fill="white" /> 18
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default GridView;
