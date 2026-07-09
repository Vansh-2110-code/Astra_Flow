
import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    MapPin,
    Youtube,
    Video,
    Hash,
    Check,
    Plus
} from 'lucide-react';

const SocialPlatformCard = ({ platform, onConnect, isConnected }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
            className={`social-card ${isConnected ? 'connected' : ''}`}
            style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                cursor: isConnected ? 'default' : 'pointer',
                border: isConnected ? '2px solid var(--input-success)' : '1px solid var(--input-border)',
                background: isConnected ? 'rgba(16, 185, 129, 0.05)' : 'white',
                position: 'relative',
                transition: 'all 0.2s',
                minHeight: '160px',
                justifyContent: 'center',
                transform: isHovered && !isConnected ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered && !isConnected ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isConnected && (
                <div style={{ 
                    position: 'absolute', 
                    top: '0.75rem', 
                    right: '0.75rem', 
                    background: 'var(--input-success)', 
                    borderRadius: '50%', 
                    padding: '0.25rem', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                }}>
                    <Check size={14} />
                </div>
            )}

            <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: platform.color + '20',
                color: platform.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.5rem',
                transition: 'all 0.2s',
                transform: isHovered && !isConnected ? 'scale(1.1)' : 'scale(1)'
            }}>
                <platform.icon size={24} />
            </div>

            <div style={{ textAlign: 'center', width: '100%' }}>
                <h4 style={{ 
                    fontWeight: 600, 
                    fontSize: '0.95rem',
                    marginBottom: '0.25rem',
                    color: 'var(--text-main)'
                }}>
                    {platform.name}
                </h4>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {isConnected ? 'Connected' : 'Not connected'}
                </p>
            </div>

            {isHovered && !isConnected && (
                <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'rgba(255,255,255,0.95)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    borderRadius: 'inherit', 
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.2s'
                }}>
                    <Button 
                        variant="primary" 
                        onClick={(e) => {
                            e.stopPropagation();
                            onConnect(platform);
                        }} 
                        style={{ 
                            fontSize: '0.85rem',
                            padding: '0.5rem 1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Plus size={16} />
                        Connect
                    </Button>
                </div>
            )}

            {isConnected && isHovered && (
                <div style={{ 
                    position: 'absolute', 
                    bottom: '0.75rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'calc(100% - 1.5rem)'
                }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onConnect(platform);
                        }}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid var(--input-error)',
                            borderRadius: '6px',
                            background: 'white',
                            color: 'var(--input-error)',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--input-error)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = 'var(--input-error)';
                        }}
                    >
                        Disconnect
                    </button>
                </div>
            )}
        </Card>
    );
};

const _platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E1306C' },
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: '#1DA1F2' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
    { id: 'gmb', name: 'Google Business', icon: MapPin, color: '#4285F4' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
    { id: 'tiktok', name: 'TikTok', icon: Video, color: '#000000' },
    { id: 'threads', name: 'Threads', icon: Hash, color: '#000000' },
];

export default SocialPlatformCard;
