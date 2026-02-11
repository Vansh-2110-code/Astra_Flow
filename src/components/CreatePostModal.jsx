import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Button from './ui/Button';
import PlatformRulesModal from './PlatformRulesModal';
import { X, Upload, Image as ImageIcon, Calendar, Clock, Facebook, Instagram, Linkedin, Info, FileText, Trash2, Check, Twitter, Youtube, LayoutGrid, Music, MessageCircle, FolderOpen, Cloud, PenTool, Smile, Camera, Share2 } from 'lucide-react';
import { workspaces } from '../data/mockData';
import ManageAccountsModal from './ManageAccountsModal';

// Short labels for "Posting to" pills
const PLATFORM_SHORT = { 'Instagram': 'IG', 'Facebook': 'FB', 'LinkedIn': 'LI', 'X (Twitter)': 'X', 'YouTube': 'YT', 'Pinterest': 'Pin', 'Threads': 'Threads', 'TikTok': 'TikTok', 'Snapchat': 'SC', 'Reddit': 'Reddit' };

// All platforms with multiple accounts per platform (mock data; role for drawer)
const PLATFORMS_WITH_ACCOUNTS = [
    { name: 'Instagram', icon: Instagram, color: '#E1306C', types: ['Post', 'Story', 'Reel'], accounts: [{ id: 'ig1', name: 'Main', handle: '@brandstudio', role: 'Admin' }, { id: 'ig2', name: 'Secondary', handle: '@brandstudio2', role: 'Editor' }] },
    { name: 'Facebook', icon: Facebook, color: '#4267B2', types: ['Post', 'Story', 'Reel'], accounts: [{ id: 'fb1', name: 'Brand Studio', handle: 'Brand Studio', role: 'Admin' }, { id: 'fb2', name: 'Page 2', handle: 'Brand Studio Page 2', role: 'Editor' }] },
    { name: 'LinkedIn', icon: Linkedin, color: '#0077b5', types: ['Post'], accounts: [{ id: 'li1', name: 'Company', handle: 'Brand Studio Inc.', role: 'Admin' }, { id: 'li2', name: 'Page 2', handle: 'Brand Studio LinkedIn', role: 'Viewer' }] },
    { name: 'X (Twitter)', icon: Twitter, color: '#1DA1F2', types: ['Post'], accounts: [{ id: 'tw1', handle: '@company', name: 'Company', role: 'Admin' }, { id: 'tw2', handle: '@personal', name: 'Personal', role: 'Editor' }] },
    { name: 'YouTube', icon: Youtube, color: '#FF0000', types: ['Post', 'Video'], accounts: [{ id: 'yt1', handle: '@channel', name: 'Channel', role: 'Admin' }, { id: 'yt2', handle: '@channel2', name: 'Channel 2', role: 'Editor' }] },
    { name: 'Pinterest', icon: LayoutGrid, color: '#E60023', types: ['Post'], accounts: [{ id: 'pin1', handle: '@boards', name: 'Boards', role: 'Editor' }, { id: 'pin2', handle: '@brand', name: 'Brand', role: 'Viewer' }] },
    { name: 'Threads', icon: MessageCircle, color: '#000000', types: ['Post'], accounts: [{ id: 'th1', handle: '@brand', name: 'Brand', role: 'Admin' }] },
    { name: 'TikTok', icon: Music, color: '#000000', types: ['Post', 'Reel'], accounts: [{ id: 'tk1', handle: '@brand', name: 'Brand', role: 'Admin' }, { id: 'tk2', handle: '@brand2', name: 'Brand 2', role: 'Editor' }] },
    { name: 'Snapchat', icon: Camera, color: '#FFFC00', types: ['Story', 'Spotlight'], accounts: [{ id: 'sc1', handle: '@brand_snap', name: 'Brand', role: 'Admin' }, { id: 'sc2', handle: '@secondary', name: 'Secondary', role: 'Editor' }] },
    { name: 'Reddit', icon: Share2, color: '#FF4500', types: ['Post'], accounts: [{ id: 'rd1', handle: 'u/brandstudio', name: 'Brand', role: 'Admin' }, { id: 'rd2', handle: 'u/community', name: 'Community', role: 'Editor' }] }
];

const APPS_INTEGRATIONS = [
    { id: 'canva', name: 'Canva', icon: FileText },
    { id: 'gdrive', name: 'Google Drive', icon: FolderOpen },
    { id: 'dropbox', name: 'Dropbox', icon: Cloud },
    { id: 'figma', name: 'Figma', icon: PenTool },
    { id: 'unsplash', name: 'Unsplash', icon: ImageIcon },
    { id: 'giphy', name: 'Giphy', icon: Smile },
    { id: 'notion', name: 'Notion', icon: FileText },
    { id: 'slack', name: 'Slack', icon: MessageCircle }
];

const CreatePostModal = ({ isOpen, onClose }) => {
    const { workspaceId } = useParams();
    const fileInputRef = useRef(null);
    const [selectedAccountIds, setSelectedAccountIds] = useState({});
    const [openDrawerPlatform, setOpenDrawerPlatform] = useState(null);
    const [postType, setPostType] = useState('Post');
    const [previewPlatform, setPreviewPlatform] = useState('');
    const [showRules, setShowRules] = useState(false);
    const [showManageAccounts, setShowManageAccounts] = useState(false);
    const [caption, setCaption] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedAppIds, setSelectedAppIds] = useState([]);
    const [scheduleType, setScheduleType] = useState('now');
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');

    const currentWorkspace = workspaces.find(w => w.id === parseInt(workspaceId)) || workspaces[0];

    const connectedAccounts = PLATFORMS_WITH_ACCOUNTS.filter(platform =>
        currentWorkspace.connectedPlatforms?.includes(platform.name)
    );

    const selectedPlatforms = Object.keys(selectedAccountIds).filter(p => selectedAccountIds[p]?.length > 0);

    const getAvailablePostTypes = () => {
        const types = new Set();
        selectedPlatforms.forEach(platformName => {
            const platform = connectedAccounts.find(p => p.name === platformName);
            if (platform) (platform.types || []).forEach(type => types.add(type));
        });
        return Array.from(types);
    };

    useEffect(() => {
        if (connectedAccounts.length > 0 && selectedPlatforms.length === 0) {
            const first = connectedAccounts[0];
            setSelectedAccountIds(prev => ({ ...prev, [first.name]: [first.accounts[0].id] }));
            setPreviewPlatform(first.name);
        }
    }, [isOpen]);

    const availablePostTypesList = getAvailablePostTypes();
    useEffect(() => {
        if (availablePostTypesList.length > 0 && !availablePostTypesList.includes(postType)) {
            setPostType(availablePostTypesList[0]);
        }
    }, [availablePostTypesList.join(','), postType]);

    if (!isOpen) return null;

    const toggleAccount = (platformName, accountId) => {
        setSelectedAccountIds(prev => {
            const current = prev[platformName] || [];
            const next = current.includes(accountId) ? current.filter(id => id !== accountId) : [...current, accountId];
            if (next.length === 0) {
                const nextState = { ...prev };
                delete nextState[platformName];
                return nextState;
            }
            return { ...prev, [platformName]: next };
        });
    };

    const isAccountSelected = (platformName, accountId) => (selectedAccountIds[platformName] || []).includes(accountId);

    const toggleApp = (appId) => {
        setSelectedAppIds(prev => prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]);
    };

    const removeSelectedAccount = (platformName, accountId) => {
        setSelectedAccountIds(prev => {
            const current = prev[platformName] || [];
            const next = current.filter(id => id !== accountId);
            if (next.length === 0) {
                const nextState = { ...prev };
                delete nextState[platformName];
                return nextState;
            }
            return { ...prev, [platformName]: next };
        });
    };

    const getSelectedAccountsFlat = () => {
        const flat = [];
        connectedAccounts.forEach(platform => {
            (selectedAccountIds[platform.name] || []).forEach(accId => {
                const acc = (platform.accounts || []).find(a => a.id === accId);
                if (acc) flat.push({ platform, acc, platformShort: PLATFORM_SHORT[platform.name] || platform.name });
            });
        });
        return flat;
    };

    const getPlatformsForType = (type) => {
        return connectedAccounts.filter(p => (p.types || []).includes(type)).map(p => PLATFORM_SHORT[p.name] || p.name);
    };

    const simulateUploadProgress = (onDone) => {
        setUploadProgress(0);
        let v = 0;
        const t = setInterval(() => {
            v += 10;
            if (v >= 100) {
                clearInterval(t);
                setUploadProgress(100);
                setTimeout(() => setUploadProgress(0), 400);
                onDone();
            } else {
                setUploadProgress(v);
            }
        }, 80);
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        simulateUploadProgress(() => {
            const newMedia = files.map(file => ({
                id: Date.now() + Math.random(),
                url: URL.createObjectURL(file),
                file
            }));
            setMediaFiles(prev => [...prev, ...newMedia]);
        });
    };

    const replaceMedia = (id, e) => {
        e.stopPropagation();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*';
        input.multiple = false;
        input.onchange = (ev) => {
            const files = Array.from(ev.target.files || []);
            if (files.length === 0) return;
            simulateUploadProgress(() => {
                const file = files[0];
                setMediaFiles(prev => prev.map(m => m.id === id ? { ...m, url: URL.createObjectURL(file), file } : m));
            });
        };
        input.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
        if (files.length === 0) return;
        simulateUploadProgress(() => {
            const newMedia = files.map(file => ({
                id: Date.now() + Math.random(),
                url: URL.createObjectURL(file),
                file
            }));
            setMediaFiles(prev => [...prev, ...newMedia]);
        });
    };

    const handleAICaption = () => {
        setCaption(prev => prev + (prev ? '\n\n' : '') + '✨ Suggested caption: Share your story with your audience! #Engage');
    };

    const removeMedia = (id) => {
        setMediaFiles(mediaFiles.filter(m => m.id !== id));
    };

    const renderPreview = () => {
        const platform = connectedAccounts.find(p => p.name === previewPlatform);
        if (!platform) return null;

        const verticalStyle = { aspectRatio: '9/16', maxHeight: 380, width: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' };
        const captionBlock = (placeholder, small) => (
            <div style={{ fontSize: small ? '0.85rem' : '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, whiteSpace: 'pre-wrap', padding: small ? '0.75rem' : '1rem' }}>
                {caption || placeholder}
            </div>
        );

        if (previewPlatform === 'Instagram') {
            if (postType === 'Story' || postType === 'Reel') {
                return (
                    <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000', maxWidth: 220 }}>
                        {mediaFiles.length > 0 ? (
                            <img src={mediaFiles[0].url} alt="Preview" style={verticalStyle} />
                        ) : (
                            <div style={{ ...verticalStyle, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                                {postType === 'Reel' ? 'Reel' : 'Story'} (9:16)
                            </div>
                        )}
                        {postType === 'Reel' && (
                            <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '2px 8px', borderRadius: 12, fontSize: '0.7rem' }}>Reel</div>
                        )}
                    </div>
                );
            }
            return (
                <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'white' }}>
                    {mediaFiles.length > 0 && (
                        <div style={{ position: 'relative' }}>
                            <img src={mediaFiles[0].url} alt="Preview" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                            {mediaFiles.length > 1 && (
                                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600 }}>1/{mediaFiles.length}</div>
                            )}
                        </div>
                    )}
                    {captionBlock('Your caption will appear here...')}
                </div>
            );
        }

        if (previewPlatform === 'Facebook') {
            if (postType === 'Story' || postType === 'Reel') {
                return (
                    <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000', maxWidth: 220 }}>
                        {mediaFiles.length > 0 ? <img src={mediaFiles[0].url} alt="Preview" style={verticalStyle} /> : <div style={{ ...verticalStyle, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{postType} (9:16)</div>}
                    </div>
                );
            }
            return (
                <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'white', padding: '1rem' }}>
                    {captionBlock('What\'s on your mind?', false)}
                    {mediaFiles.length > 0 && <img src={mediaFiles[0].url} alt="Preview" style={{ width: '100%', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />}
                </div>
            );
        }

        if (previewPlatform === 'LinkedIn') {
            return (
                <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'white', padding: '1rem' }}>
                    {captionBlock('Your professional update will appear here...', false)}
                    {mediaFiles.length > 0 && <img src={mediaFiles[0].url} alt="Preview" style={{ width: '100%', borderRadius: 'var(--radius-sm)', objectFit: 'cover', maxHeight: 280 }} />}
                </div>
            );
        }

        if (previewPlatform === 'X (Twitter)') {
            return (
                <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'white', padding: '1rem' }}>
                    {captionBlock('What\'s happening?', false)}
                    {mediaFiles.length > 0 && <img src={mediaFiles[0].url} alt="Preview" style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: 300 }} />}
                </div>
            );
        }

        if (previewPlatform === 'YouTube') {
            return (
                <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#0f0f0f', padding: 0 }}>
                    {mediaFiles.length > 0 ? <img src={mediaFiles[0].url} alt="Preview" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} /> : <div style={{ width: '100%', aspectRatio: '16/9', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Video thumbnail</div>}
                    <div style={{ padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>{caption || 'Video title'}</div>
                </div>
            );
        }

        if (previewPlatform === 'Pinterest') {
            return (
                <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'white', maxWidth: 220 }}>
                    {mediaFiles.length > 0 ? <img src={mediaFiles[0].url} alt="Preview" style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }} /> : <div style={{ width: '100%', aspectRatio: '2/3', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pin (2:3)</div>}
                    {captionBlock('Pin description...', true)}
                </div>
            );
        }

        if (previewPlatform === 'TikTok') {
            return (
                <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000', maxWidth: 220 }}>
                    {mediaFiles.length > 0 ? <img src={mediaFiles[0].url} alt="Preview" style={verticalStyle} /> : <div style={{ ...verticalStyle, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>TikTok (9:16)</div>}
                </div>
            );
        }

        if (previewPlatform === 'Snapchat') {
            return (
                <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000', maxWidth: 220 }}>
                    {mediaFiles.length > 0 ? <img src={mediaFiles[0].url} alt="Preview" style={verticalStyle} /> : <div style={{ ...verticalStyle, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{postType} (9:16)</div>}
                </div>
            );
        }

        if (previewPlatform === 'Reddit') {
            return (
                <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'white', padding: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>r/community</div>
                    {captionBlock('Post title and text...', false)}
                    {mediaFiles.length > 0 && <img src={mediaFiles[0].url} alt="Preview" style={{ width: '100%', borderRadius: 'var(--radius-sm)', objectFit: 'cover', maxHeight: 260 }} />}
                </div>
            );
        }

        if (previewPlatform === 'Threads') {
            return (
                <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'white', padding: '1rem' }}>
                    {captionBlock('Start a thread...', false)}
                    {mediaFiles.length > 0 && <img src={mediaFiles[0].url} alt="Preview" style={{ width: '100%', borderRadius: 'var(--radius-sm)', objectFit: 'cover', maxHeight: 280 }} />}
                </div>
            );
        }

        return (
            <div style={{ border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'white', padding: '1rem' }}>
                {captionBlock('Your caption will appear here...', false)}
                {mediaFiles.length > 0 && <img src={mediaFiles[0].url} alt="Preview" style={{ width: '100%', borderRadius: 'var(--radius-sm)', objectFit: 'cover', maxHeight: 300 }} />}
            </div>
        );
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
            <ManageAccountsModal
                isOpen={showManageAccounts}
                onClose={() => setShowManageAccounts(false)}
                connectedAccounts={connectedAccounts}
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
                    background: 'rgba(0, 0, 0, 0.01)',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <label style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>Connected Accounts</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => setShowRules(true)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                                    background: 'none', border: 'none', color: 'var(--color-primary)',
                                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                                    padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s'
                                }}
                            >
                                <Info size={14} /> Platform Guidelines
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowManageAccounts(true)}
                                style={{
                                    fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-primary)',
                                    background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'
                                }}
                            >
                                Manage Accounts
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', position: 'relative' }}>
                        {connectedAccounts.map((platform) => {
                            const Icon = platform.icon;
                            const selectedIds = selectedAccountIds[platform.name] || [];
                            const isActive = openDrawerPlatform === platform.name;
                            return (
                                <button
                                    key={platform.name}
                                    type="button"
                                    onClick={() => setOpenDrawerPlatform(prev => prev === platform.name ? null : platform.name)}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        border: `2px solid ${selectedIds.length > 0 ? platform.color : 'var(--input-border)'}`,
                                        background: selectedIds.length > 0 ? `${platform.color}18` : 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        flexShrink: 0
                                    }}
                                    title={platform.name}
                                >
                                    <Icon size={20} color={selectedIds.length > 0 ? platform.color : 'var(--text-muted)'} />
                                </button>
                            );
                        })}
                    </div>

                    {openDrawerPlatform && (() => {
                        const platform = connectedAccounts.find(p => p.name === openDrawerPlatform);
                        if (!platform) return null;
                        const Icon = platform.icon;
                        return (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    marginTop: '0.5rem',
                                    minWidth: 280,
                                    maxWidth: 320,
                                    maxHeight: 280,
                                    overflowY: 'auto',
                                    background: 'white',
                                    border: '1px solid var(--input-border)',
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                                    zIndex: 50,
                                    animation: 'fadeIn 0.2s ease'
                                }}
                            >
                                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--input-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{platform.name}</span>
                                    <button type="button" onClick={() => setOpenDrawerPlatform(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={16} /></button>
                                </div>
                                <div style={{ padding: '0.5rem' }}>
                                    {(platform.accounts || []).map((acc) => {
                                        const selected = isAccountSelected(platform.name, acc.id);
                                        return (
                                            <button
                                                type="button"
                                                key={acc.id}
                                                onClick={() => toggleAccount(platform.name, acc.id)}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.625rem 0.75rem',
                                                    marginBottom: '0.25rem',
                                                    border: `1px solid ${selected ? platform.color : 'var(--input-border)'}`,
                                                    borderRadius: 'var(--radius-sm)',
                                                    background: selected ? `${platform.color}08` : 'white',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    background: `${platform.color}25`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <Icon size={16} color={platform.color} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{acc.handle || acc.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{acc.role || 'Member'}</div>
                                                </div>
                                                <div style={{
                                                    width: 18,
                                                    height: 18,
                                                    borderRadius: 4,
                                                    border: `2px solid ${selected ? platform.color : '#d1d5db'}`,
                                                    background: selected ? platform.color : 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {selected && <Check size={12} color="white" strokeWidth={3} />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
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
                                flexWrap: 'wrap',
                                gap: '0.75rem',
                                padding: '0.5rem',
                                background: 'rgba(0, 0, 0, 0.02)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                {availablePostTypes.map(type => {
                                    const platformsForType = getPlatformsForType(type);
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => setPostType(type)}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                border: 'none',
                                                borderRadius: 'var(--radius-sm)',
                                                background: postType === type ? 'white' : 'transparent',
                                                color: postType === type ? 'var(--color-primary)' : 'var(--text-muted)',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                fontWeight: postType === type ? 600 : 500,
                                                transition: 'all 0.2s',
                                                boxShadow: postType === type ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                gap: '0.15rem'
                                            }}
                                        >
                                            <span>{type}</span>
                                            {platformsForType.length > 0 && (
                                                <span className="text-muted" style={{ fontSize: '0.7rem', fontWeight: 400 }}>
                                                    {platformsForType.join(', ')}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            {getSelectedAccountsFlat().length > 0 && (
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Posting to:</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {getSelectedAccountsFlat().map(({ platform, acc, platformShort }) => (
                                            <span
                                                key={`${platform.name}-${acc.id}`}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    padding: '0.35rem 0.6rem',
                                                    borderRadius: '999px',
                                                    border: `1px solid ${platform.color}`,
                                                    background: `${platform.color}12`,
                                                    fontSize: '0.8rem',
                                                    fontWeight: 500,
                                                    color: 'var(--text-main)'
                                                }}
                                            >
                                                [{platformShort} – {acc.handle || acc.name}]
                                                <button
                                                    type="button"
                                                    onClick={() => removeSelectedAccount(platform.name, acc.id)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                        marginLeft: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'var(--text-muted)',
                                                        fontSize: '1rem',
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <label style={{ 
                                    fontWeight: 600, 
                                    fontSize: '0.95rem', 
                                    color: 'var(--text-main)'
                                }}>
                                    Caption
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAICaption}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        padding: '0.375rem 0.75rem',
                                        border: '1px solid var(--input-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'white',
                                        color: 'var(--color-primary)',
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <FileText size={14} /> AI suggestion
                                </button>
                            </div>
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
                                                type="button"
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
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => replaceMedia(media.id, e)}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '0.5rem',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    padding: '0.35rem 0.5rem',
                                                    background: 'rgba(0, 0, 0, 0.7)',
                                                    border: 'none',
                                                    borderRadius: 'var(--radius-sm)',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 500
                                                }}
                                            >
                                                Replace
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                style={{
                                    padding: '1.25rem',
                                    border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: isDragging ? 'rgba(99, 102, 241, 0.04)' : 'white',
                                    marginBottom: '1rem'
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                                <div style={{
                                    padding: '0.75rem',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    borderRadius: '50%'
                                }}>
                                    <Upload size={20} color="var(--color-primary)" />
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>
                                    Drag & drop or click to upload (multiple images)
                                </span>
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div style={{ width: '100%', maxWidth: 200, height: 6, background: 'var(--input-border)', borderRadius: 3, overflow: 'hidden' }}>
                                        <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.1s' }} />
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ 
                                    fontWeight: 600, 
                                    fontSize: '0.9rem', 
                                    color: 'var(--text-main)',
                                    display: 'block',
                                    marginBottom: '0.75rem'
                                }}>
                                    Apps & Integrations
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                                    {APPS_INTEGRATIONS.map((app) => {
                                        const Icon = app.icon;
                                        const selected = selectedAppIds.includes(app.id);
                                        return (
                                            <button
                                                type="button"
                                                key={app.id}
                                                onClick={() => toggleApp(app.id)}
                                                style={{
                                                    padding: '0.75rem',
                                                    border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                                    borderRadius: 'var(--radius-md)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    background: selected ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 500,
                                                    color: 'var(--text-main)'
                                                }}
                                            >
                                                <Icon size={18} color={selected ? 'var(--color-primary)' : 'var(--text-muted)'} />
                                                {app.name}
                                            </button>
                                        );
                                    })}
                                </div>
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
