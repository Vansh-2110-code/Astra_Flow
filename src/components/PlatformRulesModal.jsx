import React from 'react';
import { X, Info } from 'lucide-react';

const PlatformRulesModal = ({ isOpen, onClose, platform }) => {
    if (!isOpen) return null;

    const rules = {
        Instagram: {
            imageSize: '1080 x 1080px (1:1), 1080 x 1350px (4:5)',
            captionLimit: '2,200 characters',
            formats: 'JPG, PNG, MP4, MOV',
            postTypes: 'Post, Story, Reel'
        },
        Facebook: {
            imageSize: '1200 x 630px recommended',
            captionLimit: '63,206 characters',
            formats: 'JPG, PNG, GIF, MP4',
            postTypes: 'Post, Story'
        },
        LinkedIn: {
            imageSize: '1200 x 627px recommended',
            captionLimit: '3,000 characters',
            formats: 'JPG, PNG, GIF, PDF, MP4',
            postTypes: 'Post'
        },
        Twitter: {
            imageSize: '1200 x 675px recommended',
            captionLimit: '280 characters',
            formats: 'JPG, PNG, GIF, MP4',
            postTypes: 'Post'
        }
    };

    const platformRules = rules[platform] || rules.Instagram;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                backdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    maxWidth: '500px',
                    width: '100%',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            padding: '0.5rem',
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: 'var(--radius-sm)'
                        }}>
                            <Info size={20} color="var(--color-primary)" />
                        </div>
                        <h2 className="text-h3">{platform} Guidelines</h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                            e.currentTarget.style.color = 'var(--text-main)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem'
                        }}>
                            Image Size
                        </div>
                        <div style={{
                            fontSize: '0.95rem',
                            color: 'var(--text-main)',
                            fontWeight: 500
                        }}>
                            {platformRules.imageSize}
                        </div>
                    </div>

                    <div>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem'
                        }}>
                            Caption Limit
                        </div>
                        <div style={{
                            fontSize: '0.95rem',
                            color: 'var(--text-main)',
                            fontWeight: 500
                        }}>
                            {platformRules.captionLimit}
                        </div>
                    </div>

                    <div>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem'
                        }}>
                            Supported Formats
                        </div>
                        <div style={{
                            fontSize: '0.95rem',
                            color: 'var(--text-main)',
                            fontWeight: 500
                        }}>
                            {platformRules.formats}
                        </div>
                    </div>

                    <div>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem'
                        }}>
                            Post Types
                        </div>
                        <div style={{
                            fontSize: '0.95rem',
                            color: 'var(--text-main)',
                            fontWeight: 500
                        }}>
                            {platformRules.postTypes}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformRulesModal;
