
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import { Upload, Image as ImageIcon, Film, File } from 'lucide-react';

const Media = () => {
    // Mock media items
    const mediaItems = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        type: i % 3 === 0 ? 'video' : 'image',
        url: `https://source.unsplash.com/random/300x300?sig=${i}`
    }));

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-h1">Media Library</h1>
                    <p className="text-muted">Manage your assets.</p>
                </div>
                <Button variant="primary">
                    <Upload size={18} /> Upload Media
                </Button>
            </div>

            <div className="tabs" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--input-border)', marginBottom: '2rem' }}>
                <button className="btn-ghost active" style={{ borderBottom: '2px solid var(--color-primary)', borderRadius: 0 }}>All Media</button>
                <button className="btn-ghost" style={{ borderRadius: 0 }}>Images</button>
                <button className="btn-ghost" style={{ borderRadius: 0 }}>Videos</button>
                <button className="btn-ghost" style={{ borderRadius: 0 }}>Documents</button>
            </div>

            <div className="media-grid">
                {mediaItems.map(item => (
                    <div key={item.id} className="media-item">
                        <img
                            src={item.url}
                            alt="Media Asset"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            loading="lazy"
                        />
                        <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: 4, color: 'white' }}>
                            {item.type === 'video' ? <Film size={14} /> : <ImageIcon size={14} />}
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default Media;
