import React, { useState, useRef, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import PlatformRulesModal from './PlatformRulesModal';
import { X, Upload, Image as ImageIcon, Calendar, Clock, Facebook, Instagram, Twitter, Linkedin, Info, FileText } from 'lucide-react';

// Added: Compact font size to match Plannable UX. Max caption length for character count (visual only).
const CAPTION_MAX_LENGTH = 2200;
// Added: Selected accounts preview – mocked from Connected Apps; visual only.
const MOCK_SELECTED_ACCOUNTS = ['@main_account', '@page1'];

const CreatePostModal = ({ isOpen, onClose }) => {
    const [selectedPlatforms, setSelectedPlatforms] = useState(['Instagram']);
    const [postTypes, setPostTypes] = useState({ Instagram: 'Post' });
    const [previewPlatform, setPreviewPlatform] = useState('Instagram');
    const [showRules, setShowRules] = useState(false);
    const [caption, setCaption] = useState('');
    const [media, setMedia] = useState(null);
    // Added UX enhancement – non-breaking: loading and draft/error mock UI only
    const [isPosting, setIsPosting] = useState(false);
    const [showDraftSaved, setShowDraftSaved] = useState(false);
    const captionRef = useRef(null);

    // Added UX enhancement – non-breaking: auto-focus caption when modal opens
    useEffect(() => {
        if (isOpen && captionRef.current) {
            const t = setTimeout(() => captionRef.current?.focus(), 100);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    // Added UX enhancement – non-breaking: keyboard shortcut hint (Ctrl/Cmd+Enter) – visual hint only; optional trigger
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (caption.trim()) {
                    setIsPosting(true);
                    setTimeout(() => setIsPosting(false), 1500);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, caption]);

    if (!isOpen) return null;

    const connectedPlatforms = [
        { name: 'Instagram', icon: Instagram, color: '#E1306C', types: ['Post', 'Story', 'Reel'] },
        { name: 'Facebook', icon: Facebook, color: '#4267B2', types: ['Post', 'Story'] },
        { name: 'LinkedIn', icon: Linkedin, color: '#0077b5', types: ['Post'] }
    ];

    const togglePlatform = (platformName) => {
        if (selectedPlatforms.includes(platformName)) {
            setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformName));
            const newPostTypes = { ...postTypes };
            delete newPostTypes[platformName];
            setPostTypes(newPostTypes);
        } else {
            setSelectedPlatforms([...selectedPlatforms, platformName]);
            setPostTypes({ ...postTypes, [platformName]: 'Post' });
        }
    };

    const handlePostTypeChange = (platform, type) => {
        setPostTypes({ ...postTypes, [platform]: type });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(URL.createObjectURL(file));
        }
    };

    const renderPreview = () => {
        const platform = connectedPlatforms.find(p => p.name === previewPlatform);
        if (!platform) return null;

        if (previewPlatform === 'Instagram') {
            return (
                <div style={{
                    border: '1px solid var(--input-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'white'
                }}>
                    {media && (
                        <img 
                            src={media} 
                            alt="Preview" 
                            style={{ 
                                width: '100%', 
                                aspectRatio: '1', 
                                objectFit: 'cover' 
                            }} 
                        />
                    )}
                    <div style={{ padding: '1rem' }}>
                        <div style={{ 
                            fontSize: '0.9rem', 
                            color: 'var(--text-main)',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap'
                        }}>
                            {caption || 'Your caption will appear here...'}
                        </div>
                    </div>
                </div>
            );
        } else if (previewPlatform === 'Facebook') {
            return (
                <div style={{
                    border: '1px solid var(--input-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'white',
                    padding: '1rem'
                }}>
                    <div style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--text-main)',
                        lineHeight: 1.5,
                        marginBottom: '1rem',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {caption || 'Your caption will appear here...'}
                    </div>
                    {media && (
                        <img 
                            src={media} 
                            alt="Preview" 
                            style={{ 
                                width: '100%', 
                                borderRadius: 'var(--radius-sm)',
                                objectFit: 'cover' 
                            }} 
                        />
                    )}
                </div>
            );
        } else if (previewPlatform === 'LinkedIn') {
            return (
                <div style={{
                    border: '1px solid var(--input-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'white',
                    padding: '1rem'
                }}>
                    <div style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--text-main)',
                        lineHeight: 1.6,
                        marginBottom: '1rem',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'var(--font-body)'
                    }}>
                        {caption || 'Your professional update will appear here...'}
                    </div>
                    {media && (
                        <img 
                            src={media} 
                            alt="Preview" 
                            style={{ 
                                width: '100%', 
                                borderRadius: 'var(--radius-sm)',
                                objectFit: 'cover',
                                maxHeight: '400px'
                            }} 
                        />
                    )}
                </div>
            );
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(4px)'
        }}>
            <PlatformRulesModal 
                isOpen={showRules} 
                onClose={() => setShowRules(false)} 
                platform={previewPlatform}
            />
            
            <Card className="modal-content" style={{ 
                width: '100%', 
                maxWidth: '720px', 
                background: 'white', 
                maxHeight: '88vh', 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.25rem'
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginBottom: '1rem', 
                    borderBottom: '1px solid var(--input-border)', 
                    paddingBottom: '0.75rem' 
                }}>
                    <h2 className="text-h3" style={{ fontSize: '1.1rem' }}>Create New Post</h2>
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
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', flex: 1 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem' 
                            }}>
                                <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                    Select Platforms
                                </label>
                                <button
                                    onClick={() => setShowRules(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--color-primary)',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'none';
                                    }}
                                >
                                    <Info size={14} />
                                    View Rules
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {connectedPlatforms.map((p) => {
                                    const Icon = p.icon;
                                    const isSelected = selectedPlatforms.includes(p.name);
                                    return (
                                        <button
                                            key={p.name}
                                            onClick={() => togglePlatform(p.name)}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 0.75rem',
                                                border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                                borderRadius: 'var(--radius-md)',
                                                background: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                                cursor: 'pointer',
                                                flex: '1 1 auto',
                                                minWidth: '80px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Icon size={18} color={isSelected ? p.color : 'var(--text-muted)'} />
                                            <span style={{ 
                                                fontSize: '0.75rem', 
                                                fontWeight: 500, 
                                                color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' 
                                            }}>
                                                {p.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Added: Selected accounts preview from Connected Apps – mocked; visual only. */}
                            <div className="text-sm text-muted" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                                Posting to: {MOCK_SELECTED_ACCOUNTS.join(', ')}
                            </div>
                        </div>

                        {selectedPlatforms.length > 0 && (
                            <div>
                                <label style={{ 
                                    fontWeight: 600, 
                                    fontSize: '0.85rem', 
                                    display: 'block',
                                    marginBottom: '0.5rem' 
                                }}>
                                    Post Type per Platform
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {selectedPlatforms.map(platformName => {
                                        const platform = connectedPlatforms.find(p => p.name === platformName);
                                        return (
                                            <div key={platformName} style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '0.75rem',
                                                padding: '0.5rem',
                                                background: 'rgba(0, 0, 0, 0.02)',
                                                borderRadius: 'var(--radius-sm)'
                                            }}>
                                                <span style={{ 
                                                    fontSize: '0.8rem', 
                                                    fontWeight: 500,
                                                    minWidth: '72px'
                                                }}>
                                                    {platformName}
                                                </span>
                                                <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                                                    {platform.types.map(type => (
                                                        <button
                                                            key={type}
                                                            onClick={() => handlePostTypeChange(platformName, type)}
                                                            style={{
                                                                padding: '0.4rem 0.75rem',
                                                                border: `1px solid ${postTypes[platformName] === type ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                                                borderRadius: '20px',
                                                                background: postTypes[platformName] === type ? 'rgba(99, 102, 241, 0.1)' : 'white',
                                                                color: postTypes[platformName] === type ? 'var(--color-primary)' : 'var(--text-muted)',
                                                                cursor: 'pointer',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 500,
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div>
                            <label style={{ 
                                fontWeight: 600, 
                                fontSize: '0.85rem', 
                                display: 'block',
                                marginBottom: '0.5rem' 
                            }}>
                                Caption
                            </label>
                            <textarea
                                ref={captionRef}
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="input"
                                placeholder="Write your caption here..."
                                rows={4}
                                style={{ resize: 'none', fontFamily: 'inherit', padding: '0.6rem 0.75rem', fontSize: '0.85rem' }}
                            />
                            {/* Added: Compact font size to match Plannable UX. Character count (visual only). */}
                            <div className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>
                                {caption.length} / {CAPTION_MAX_LENGTH}
                            </div>
                        </div>

                        <div>
                            <label style={{ 
                                fontWeight: 600, 
                                fontSize: '0.85rem', 
                                display: 'block',
                                marginBottom: '0.5rem' 
                            }}>
                                Media
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <label style={{ flex: 1 }}>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <div className="btn btn-outline" style={{ 
                                        width: '100%', 
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer'
                                    }}>
                                        <Upload size={16} />
                                        Local Upload
                                    </div>
                                </label>
                                <button className="btn btn-outline" style={{ flex: 1, gap: '0.5rem' }}>
                                    <ImageIcon size={16} />
                                    Media Library
                                </button>
                                <button className="btn btn-outline" style={{ flex: 1, gap: '0.5rem' }}>
                                    <FileText size={16} />
                                    Canva
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ 
                                    fontWeight: 600, 
                                    fontSize: '0.85rem', 
                                    display: 'block',
                                    marginBottom: '0.5rem' 
                                }}>
                                    Schedule Date
                                </label>
                                <input 
                                    type="date" 
                                    className="input"
                                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ 
                                    fontWeight: 600, 
                                    fontSize: '0.85rem', 
                                    display: 'block',
                                    marginBottom: '0.5rem' 
                                }}>
                                    Time
                                </label>
                                <input 
                                    type="time" 
                                    className="input"
                                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ 
                        width: '280px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        <div>
                            <label style={{ 
                                fontWeight: 600, 
                                fontSize: '0.85rem', 
                                display: 'block',
                                marginBottom: '0.5rem' 
                            }}>
                                Preview
                            </label>
                            <div style={{ 
                                display: 'flex', 
                                gap: '0.5rem',
                                marginBottom: '0.75rem',
                                background: 'rgba(0, 0, 0, 0.02)',
                                padding: '0.2rem',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                {selectedPlatforms.map(platform => (
                                    <button
                                        key={platform}
                                        onClick={() => setPreviewPlatform(platform)}
                                        style={{
                                            flex: 1,
                                            padding: '0.35rem',
                                            border: 'none',
                                            borderRadius: 'var(--radius-sm)',
                                            background: previewPlatform === platform ? 'white' : 'transparent',
                                            color: previewPlatform === platform ? 'var(--text-main)' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            transition: 'all 0.2s',
                                            boxShadow: previewPlatform === platform ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>
                            {renderPreview()}
                        </div>
                    </div>
                </div>

                {/* Added: Error placeholder UI (mock only); no backend. */}
                <div className="text-sm" style={{ minHeight: '24px', marginTop: '0.5rem' }} role="status" aria-live="polite">
                    {false && (
                        <span style={{ color: 'var(--input-error)' }}>
                            Something went wrong. Please try again.
                        </span>
                    )}
                </div>

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    flexWrap: 'wrap',
                    gap: '0.75rem', 
                    paddingTop: '1rem', 
                    marginTop: '1rem',
                    borderTop: '1px solid var(--input-border)' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        {/* Added: Draft saved indicator (mock); no backend. */}
                        {showDraftSaved && (
                            <span className="text-sm" style={{ color: 'var(--input-success)' }}>
                                Draft saved
                            </span>
                        )}
                        {/* Added: Ctrl/Cmd+Enter hint – visual only. */}
                        <span className="text-sm text-muted" title="Submit post">
                            Ctrl+Enter to post
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDraftSaved(true);
                                setTimeout(() => setShowDraftSaved(false), 3000);
                            }}
                        >
                            Save Draft
                        </Button>
                        <Button
                            variant="primary"
                            disabled={!caption.trim() || isPosting}
                            loading={isPosting}
                            onClick={() => {
                                if (!caption.trim()) return;
                                setIsPosting(true);
                                setTimeout(() => setIsPosting(false), 1500);
                            }}
                        >
                            {isPosting ? 'Posting...' : 'Schedule Post'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CreatePostModal;
