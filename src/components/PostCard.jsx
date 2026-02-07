
import React from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { MoreHorizontal, MessageSquare, Heart } from 'lucide-react';

const PostCard = ({ post }) => {
    const Icon = post.icon;

    return (
        <Card className="post-card">
            <div className="post-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: 8, background: '#f3f4f6', borderRadius: '50%', color: '#374151' }}>
                        {Icon && <Icon size={18} />}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{post.platform}</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{post.date} • by {post.author}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Badge status={post.status} />
                    <button className="btn-ghost">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '1rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {post.content}
            </div>

            {post.media && (
                <div className="post-media">
                    <img src={post.media} alt="Post media" />
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <Button variant="ghost" style={{ fontSize: '0.9rem', gap: '0.5rem', padding: '6px 12px' }}>
                    <Heart size={18} /> Like
                </Button>
                <Button variant="ghost" style={{ fontSize: '0.9rem', gap: '0.5rem', padding: '6px 12px' }}>
                    <MessageSquare size={18} /> Comment
                </Button>
            </div>
        </Card>
    );
};

export default PostCard;
