

import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import CreatePostModal from '../components/CreatePostModal';
import ViewSwitcher from '../components/ViewSwitcher';
import FilterDropdown from '../components/FilterDropdown';
import DraftsPanel from '../components/DraftsPanel';
import FeedView from '../components/views/FeedView';
import CalendarView from '../components/views/CalendarView';
import GridView from '../components/views/GridView';
import ListView from '../components/views/ListView';
import { Plus } from 'lucide-react';
import { posts } from '../data/mockData';

const Content = () => {
    const [currentView, setCurrentView] = useState('feed');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [panelContent, setPanelContent] = useState({ title: '', posts: [] });
    const [filters, setFilters] = useState({});

    const handleFilterClick = (status) => {
        const filteredPosts = posts.filter(post => 
            post.status.toLowerCase() === status.toLowerCase()
        );
        setPanelContent({ title: status, posts: filteredPosts });
        setIsPanelOpen(true);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const renderView = () => {
        switch (currentView) {
            case 'calendar':
                return <CalendarView posts={posts} />;
            case 'grid':
                return <GridView posts={posts} />;
            case 'list':
                return <ListView posts={posts} />;
            case 'feed':
            default:
                return <FeedView posts={posts} />;
        }
    };

    return (
        <DashboardLayout>
            <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <DraftsPanel 
                isOpen={isPanelOpen} 
                onClose={() => setIsPanelOpen(false)} 
                posts={panelContent.posts}
                title={panelContent.title}
            />
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-h1">Content</h1>
                    <p className="text-muted">Manage your social media posts.</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Create Post
                </Button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
                                padding: '6px 16px', 
                                fontSize: '0.9rem',
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
