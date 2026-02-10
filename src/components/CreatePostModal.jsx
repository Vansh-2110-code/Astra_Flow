import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from './ui/Button';
import PlatformRulesModal from './PlatformRulesModal';
import { X, Upload, Image as ImageIcon, Calendar, Clock, Facebook, Instagram, Linkedin, Info, FileText, Trash2 } from 'lucide-react';
import { workspaces } from '../data/mockData';

const CreatePostModal = ({ isOpen, onClose }) => {
    const { workspaceId } = useParams();
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [postType, setPostType] = useState('Post');
    const [previewPlatform, setPreviewPlatform] = useState('');
    const [showRules, setShowRules] = useState(false);
    const [caption, setCaption] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [scheduleType, setScheduleType] = useState('now');
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');

    const currentWorkspace = workspaces.find(w => w.id === parseInt(workspaceId)) || workspaces[0];

    const allPlatforms = [
        { name: 'Instagram', icon: Instagram, color: '#E1306C', types: ['Post', 'Story', 'Reel'], accountName: '@brandstudio' },
        { name: 'Facebook', icon: Facebook, color: '#4267B2', types: ['Post', 'Story', 'Reel'], accountName: 'Brand Studio' },
        { name: 'LinkedIn', icon: Linkedin, color: '#0077b5', types: ['Post'], accountName: 'Brand Studio Inc.' }
    ];

    const connectedAccounts = allPlatforms.filter(platform => 
        currentWorkspace.connectedPlatforms?.includes(platform.name)
    );

    useEffect(() => {
        if (connectedAccounts.length > 0 && selectedPlatforms.length === 0) {
            setSelectedPlatforms([connectedAccounts[0].name]);
            setPreviewPlatform(connectedAccounts[0].name);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const togglePlatform = (platformName) => {
        if (selectedPlatforms.includes(platformName)) {
            if (selectedPlatforms.length > 1) {
                setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformName));
                if (previewPlatform === platformName) {
                    setPreviewPlatform(selectedPlatforms.find(p => p !== platformName));
                }
            }
        } else {
            setSelectedPlatforms([...selectedPlatforms, platformName]);
        }
    };

    const getAvailablePostTypes = () => {
        const types = new Set();
        selectedPlatforms.forEach(platformName => {
            const platform = connectedAccounts.find(p => p.name === platformName);
            if (platform) {
                platform.types.forEach(type => types.add(type));
            }
        });
        return Array.from(types);
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newMedia = files.map(file => ({
            id: Date.now() + Math.random(),
            url: URL.createObjectURL(file),
            file
        }));
        setMediaFiles([...mediaFiles, ...newMedia]);
    };

    const removeMedia = (id) => {
        setMediaFiles(mediaFiles.filter(m => m.id !== id));
    };

    const renderPreview = () => {
        const platform = connectedAccounts.find(p => p.name === previewPlatform);
        if (!platform) return null;

        if (previewPlatform === 'Instagram') {
            return (
                <div style={{
                    border: '1px solid var(--input-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'white'
                }}>
                    {mediaFiles.length > 0 && (
                        <div style={{ position: 'relative' }}>
                            <img 
                                src={mediaFiles[0].url} 
                                alt="Preview" 
                                style={{ 
                                    width: '100%', 
                                    aspectRatio: '1', 
                                    objectFit: 'cover' 
                                }} 
                            />
                            {mediaFiles.length > 1 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '0.75rem',
                                    right: '0.75rem',
                                    background: 'rgba(0, 0, 0, 0.6)',
                                    color: 'white',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                }}>
                                    1/{mediaFiles.length}
                                </div>
                            )}
                        </div>
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
                        marginBottom: mediaFiles.length > 0 ? '1rem' : 0,
                        whiteSpace: 'pre-wrap'
                    }}>
                        {caption || 'Your caption will appear here...'}
                    </div>
                    {mediaFiles.length > 0 && (
                        <img 
                            src={mediaFiles[0].url} 
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
                        marginBottom: mediaFiles.length > 0 ? '1rem' : 0,
                        whiteSpace: 'pre-wrap'
                    }}>
                        {caption || 'Your professional update will appear here...'}
                    </div>
                    {mediaFiles.length > 0 && (
                        <img 
                            src={mediaFiles[0].url} 
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

    const availablePostTypes = getAvailablePostTypes();

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backdropFilter: 'blur(4px)'
        }}>
            <PlatformRulesModal 
                isOpen={showRules} 
                onClose={() => setShowRules(false)} 
                platform={previewPlatform}
            />
            
            <div style={{ 
                width: '100%', 
                maxWidth: '1200px', 
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                maxHeight: '90vh', 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid var(--input-border)'
                }}>
                    <h2 className="text-h2">Create New Post</h2>
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

                <div style={{ 
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid var(--input-border)',
                    background: 'rgba(0, 0, 0, 0.01)'
                }}>
                    <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem'
                    }}>
                        <label style={{ 
                            fontWeight: 600, 
                            fontSize: '0.95rem', 
                            color: 'var(--text-main)'
                        }}>
                            Connected Accounts
                        </label>
                        <button
                            onClick={() => setShowRules(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                padding: '0.375rem 0.75rem',
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
                            Platform Guidelines
                        </button>
                    </div>

                    <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        {connectedAccounts.map((account) => {
                            const Icon = account.icon;
                            const isSelected = selectedPlatforms.includes(account.name);
                            return (
                                <button
                                    key={account.name}
                                    onClick={() => togglePlatform(account.name)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem 1.25rem',
                                        border: `2px solid ${isSelected ? account.color : 'var(--input-border)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        background: isSelected ? 'white' : 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        textAlign: 'left',
                                        boxShadow: isSelected ? `0 0 0 4px ${account.color}15` : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.borderColor = account.color;
                                            e.currentTarget.style.background = `${account.color}03`;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.borderColor = 'var(--input-border)';
                                            e.currentTarget.style.background = 'white';
                                        }
                                    }}
                                >
                                    <div style={{
                                        padding: '0.75rem',
                                        background: isSelected ? `${account.color}15` : 'rgba(0, 0, 0, 0.03)',
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon size={20} color={isSelected ? account.color : 'var(--text-muted)'} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ 
                                            fontSize: '0.95rem', 
                                            fontWeight: 600, 
                                            color: isSelected ? account.color : 'var(--text-main)',
                                            marginBottom: '0.125rem'
                                        }}>
                                            {account.name}
                                        </div>
                                        <div style={{ 
                                            fontSize: '0.8rem', 
                                            color: 'var(--text-muted)'
                                        }}>
                                            {account.accountName}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
                    <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <label style={{ 
                                fontWeight: 600, 
                                fontSize: '0.95rem', 
                                color: 'var(--text-main)',
                                display: 'block',
                                marginBottom: '1rem'
                            }}>
                                Post Type
                            </label>
                            <div style={{ 
                                display: 'flex', 
                                gap: '0.75rem',
                                padding: '0.5rem',
                                background: 'rgba(0, 0, 0, 0.02)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                {availablePostTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setPostType(type)}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem 1rem',
                                            border: 'none',
                                            borderRadius: 'var(--radius-sm)',
                                            background: postType === type ? 'white' : 'transparent',
                                            color: postType === type ? 'var(--color-primary)' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: postType === type ? 600 : 500,
                                            transition: 'all 0.2s',
                                            boxShadow: postType === type ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{ 
                                fontWeight: 600, 
                                fontSize: '0.95rem', 
                                color: 'var(--text-main)',
                                display: 'block',
                                marginBottom: '1rem'
                            }}>
                                Caption
                            </label>
                            <textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="input"
                                placeholder="Write your caption here..."
                                rows={6}
                                style={{ 
                                    resize: 'none', 
                                    fontFamily: 'inherit',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ 
                                fontWeight: 600, 
                                fontSize: '0.95rem', 
                                color: 'var(--text-main)',
                                display: 'block',
                                marginBottom: '1rem'
                            }}>
                                Media
                            </label>
                            
                            {mediaFiles.length > 0 && (
                                <div style={{ 
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    {mediaFiles.map(media => (
                                        <div key={media.id} style={{ position: 'relative', aspectRatio: '1' }}>
                                            <img 
                                                src={media.url} 
                                                alt="" 
                                                style={{ 
                                                    width: '100%', 
                                                    height: '100%', 
                                                    objectFit: 'cover',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '1px solid var(--input-border)'
                                                }}
                                            />
                                            <button
                                                onClick={() => removeMedia(media.id)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '0.5rem',
                                                    right: '0.5rem',
                                                    padding: '0.5rem',
                                                    background: 'rgba(0, 0, 0, 0.7)',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                <label style={{ cursor: 'pointer' }}>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <div style={{
                                        padding: '1.25rem',
                                        border: '1px solid var(--input-border)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        background: 'white'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--input-border)';
                                        e.currentTarget.style.background = 'white';
                                    }}
                                    >
                                        <div style={{
                                            padding: '0.75rem',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            borderRadius: '50%'
                                        }}>
                                            <Upload size={20} color="var(--color-primary)" />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>
                                            Upload
                                        </span>
                                    </div>
                                </label>

                                <button style={{
                                    padding: '1.25rem',
                                    border: '1px solid var(--input-border)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: 'white'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.02)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--input-border)';
                                    e.currentTarget.style.background = 'white';
                                }}
                                >
                                    <div style={{
                                        padding: '0.75rem',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        borderRadius: '50%'
                                    }}>
                                        <ImageIcon size={20} color="var(--color-primary)" />
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>
                                        Library
                                    </span>
                                </button>

                                <button style={{
                                    padding: '1.25rem',
                                    border: '1px solid var(--input-border)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: 'white'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.02)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--input-border)';
                                    e.currentTarget.style.background = 'white';
                                }}
                                >
                                    <div style={{
                                        padding: '0.75rem',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        borderRadius: '50%'
                                    }}>
                                        <FileText size={20} color="var(--color-primary)" />
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>
                                        Canva
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{ 
                                fontWeight: 600, 
                                fontSize: '0.95rem', 
                                color: 'var(--text-main)',
                                display: 'block',
                                marginBottom: '1rem'
                            }}>
                                Schedule
                            </label>
                            <div style={{ 
                                display: 'flex', 
                                gap: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <button
                                    onClick={() => setScheduleType('now')}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        border: `2px solid ${scheduleType === 'now' ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        background: scheduleType === 'now' ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                        color: scheduleType === 'now' ? 'var(--color-primary)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Post Now
                                </button>
                                <button
                                    onClick={() => setScheduleType('later')}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        border: `2px solid ${scheduleType === 'later' ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        background: scheduleType === 'later' ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                        color: scheduleType === 'later' ? 'var(--color-primary)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Schedule
                                </button>
                            </div>

                            {scheduleType === 'later' && (
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                            color: 'var(--text-muted)',
                                            marginBottom: '0.5rem'
                                        }}>
                                            Date
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <Calendar size={18} style={{
                                                position: 'absolute',
                                                left: '1rem',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'var(--text-muted)',
                                                pointerEvents: 'none'
                                            }} />
                                            <input 
                                                type="date"
                                                value={scheduleDate}
                                                onChange={(e) => setScheduleDate(e.target.value)}
                                                className="input"
                                                style={{ 
                                                    paddingLeft: '3rem',
                                                    paddingTop: '0.75rem',
                                                    paddingBottom: '0.75rem'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                            color: 'var(--text-muted)',
                                            marginBottom: '0.5rem'
                                        }}>
                                            Time
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <Clock size={18} style={{
                                                position: 'absolute',
                                                left: '1rem',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'var(--text-muted)',
                                                pointerEvents: 'none'
                                            }} />
                                            <input 
                                                type="time"
                                                value={scheduleTime}
                                                onChange={(e) => setScheduleTime(e.target.value)}
                                                className="input"
                                                style={{ 
                                                    paddingLeft: '3rem',
                                                    paddingTop: '0.75rem',
                                                    paddingBottom: '0.75rem'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ 
                        flex: '1 1 40%',
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '1rem',
                        position: 'sticky',
                        top: '2rem',
                        alignSelf: 'flex-start'
                    }}>
                        <div>
                            <label style={{ 
                                fontWeight: 600, 
                                fontSize: '0.95rem', 
                                color: 'var(--text-main)',
                                display: 'block',
                                marginBottom: '1rem'
                            }}>
                                Preview
                            </label>
                            <div style={{ 
                                display: 'flex', 
                                gap: '0.5rem',
                                marginBottom: '1.5rem',
                                background: 'rgba(0, 0, 0, 0.02)',
                                padding: '0.375rem',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                {selectedPlatforms.map(platform => (
                                    <button
                                        key={platform}
                                        onClick={() => setPreviewPlatform(platform)}
                                        style={{
                                            flex: 1,
                                            padding: '0.625rem',
                                            border: 'none',
                                            borderRadius: 'var(--radius-sm)',
                                            background: previewPlatform === platform ? 'white' : 'transparent',
                                            color: previewPlatform === platform ? 'var(--text-main)' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            transition: 'all 0.2s',
                                            boxShadow: previewPlatform === platform ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
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
                    padding: '1.5rem 2rem',
                    borderTop: '1px solid var(--input-border)',
                    background: 'white'
                }}>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="outline">Save Draft</Button>
                    <Button variant="primary">
                        {scheduleType === 'now' ? 'Publish Now' : 'Schedule Post'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
