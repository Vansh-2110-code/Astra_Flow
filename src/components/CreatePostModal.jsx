import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import PlatformRulesModal from './PlatformRulesModal';
import { X, Upload, Image as ImageIcon, Calendar, Clock, Facebook, Instagram, Twitter, Linkedin, Info, FileText } from 'lucide-react';

const CreatePostModal = ({ isOpen, onClose }) => {
    const [selectedPlatforms, setSelectedPlatforms] = useState(['Instagram']);
    const [postTypes, setPostTypes] = useState({ Instagram: 'Post' });
    const [previewPlatform, setPreviewPlatform] = useState('Instagram');
    const [showRules, setShowRules] = useState(false);
    const [caption, setCaption] = useState('');
    const [media, setMedia] = useState(null);

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
                maxWidth: '900px', 
                background: 'white', 
                maxHeight: '90vh', 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginBottom: '1.5rem', 
                    borderBottom: '1px solid var(--input-border)', 
                    paddingBottom: '1rem' 
                }}>
                    <h2 className="text-h3">Create New Post</h2>
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

                <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                marginBottom: '0.75rem' 
                            }}>
                                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>
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
                                                padding: '0.75rem 1rem',
                                                border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                                borderRadius: 'var(--radius-md)',
                                                background: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                                cursor: 'pointer',
                                                flex: '1 1 auto',
                                                minWidth: '100px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Icon size={20} color={isSelected ? p.color : 'var(--text-muted)'} />
                                            <span style={{ 
                                                fontSize: '0.8rem', 
                                                fontWeight: 500, 
                                                color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' 
                                            }}>
                                                {p.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {selectedPlatforms.length > 0 && (
                            <div>
                                <label style={{ 
                                    fontWeight: 600, 
                                    fontSize: '0.9rem', 
                                    display: 'block',
                                    marginBottom: '0.75rem' 
                                }}>
                                    Post Type per Platform
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {selectedPlatforms.map(platformName => {
                                        const platform = connectedPlatforms.find(p => p.name === platformName);
                                        return (
                                            <div key={platformName} style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '1rem',
                                                padding: '0.75rem',
                                                background: 'rgba(0, 0, 0, 0.02)',
                                                borderRadius: 'var(--radius-sm)'
                                            }}>
                                                <span style={{ 
                                                    fontSize: '0.85rem', 
                                                    fontWeight: 500,
                                                    minWidth: '80px'
                                                }}>
                                                    {platformName}
                                                </span>
                                                <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                                                    {platform.types.map(type => (
                                                        <button
                                                            key={type}
                                                            onClick={() => handlePostTypeChange(platformName, type)}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                border: `1px solid ${postTypes[platformName] === type ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                                                borderRadius: '20px',
                                                                background: postTypes[platformName] === type ? 'rgba(99, 102, 241, 0.1)' : 'white',
                                                                color: postTypes[platformName] === type ? 'var(--color-primary)' : 'var(--text-muted)',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem',
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
                                fontSize: '0.9rem', 
                                display: 'block',
                                marginBottom: '0.75rem' 
                            }}>
                                Caption
                            </label>
                            <textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="input"
                                placeholder="Write your caption here..."
                                rows={5}
                                style={{ resize: 'none', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div>
                            <label style={{ 
                                fontWeight: 600, 
                                fontSize: '0.9rem', 
                                display: 'block',
                                marginBottom: '0.75rem' 
                            }}>
                                Media
                            </label>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
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

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ 
                                    fontWeight: 600, 
                                    fontSize: '0.9rem', 
                                    display: 'block',
                                    marginBottom: '0.75rem' 
                                }}>
                                    Schedule Date
                                </label>
                                <input 
                                    type="date" 
                                    className="input"
                                    style={{ padding: '0.75rem' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ 
                                    fontWeight: 600, 
                                    fontSize: '0.9rem', 
                                    display: 'block',
                                    marginBottom: '0.75rem' 
                                }}>
                                    Time
                                </label>
                                <input 
                                    type="time" 
                                    className="input"
                                    style={{ padding: '0.75rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ 
                        width: '320px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div>
                            <label style={{ 
                                fontWeight: 600, 
                                fontSize: '0.9rem', 
                                display: 'block',
                                marginBottom: '0.75rem' 
                            }}>
                                Preview
                            </label>
                            <div style={{ 
                                display: 'flex', 
                                gap: '0.5rem',
                                marginBottom: '1rem',
                                background: 'rgba(0, 0, 0, 0.02)',
                                padding: '0.25rem',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                {selectedPlatforms.map(platform => (
                                    <button
                                        key={platform}
                                        onClick={() => setPreviewPlatform(platform)}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            border: 'none',
                                            borderRadius: 'var(--radius-sm)',
                                            background: previewPlatform === platform ? 'white' : 'transparent',
                                            color: previewPlatform === platform ? 'var(--text-main)' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
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

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end', 
                    gap: '1rem', 
                    paddingTop: '1.5rem', 
                    marginTop: '1.5rem',
                    borderTop: '1px solid var(--input-border)' 
                }}>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="outline">Save Draft</Button>
                    <Button variant="primary">Schedule Post</Button>
                </div>
            </Card>
        </div>
    );
};

export default CreatePostModal;
