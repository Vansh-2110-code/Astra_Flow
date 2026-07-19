import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
    X, Layout, PlusCircle, Film, Sparkles, Lightbulb, Image as ImageIcon,
    Folder, MessageSquare, MapPin, Smile, Clock, Eye,
    ChevronDown, Facebook, Linkedin, Instagram, Twitter, Music, LayoutGrid, Youtube, Globe, Hash,
    FileText, Megaphone, Tag, ChevronLeft, ChevronRight, Info, Plus, Send, Download,
    StickyNote, Type, Link as LinkIcon, AtSign, HelpCircle, List, PanelRightClose
} from 'lucide-react';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';
import { getConnectedChannels, createFacebookPost } from '../services/channelService';
import { getUserData } from '../services/authService';
import PostTab from './tabs/PostTab';
import StoryTab from './tabs/StoryTab';
import CarouselEditView from './tabs/CarouselEditView';
import ReelsTab from './tabs/ReelsTab';
import AIAssistantPanel from './AIAssistantPanel';
import MediaLibraryModal from './MediaLibraryModal';
import MusicLibraryModal from './MusicLibraryModal';

const CreatePostModal = ({ isOpen, onClose, initialTab = 'Post', onPublishSuccess, onPostCreated, prefilledDate }) => {
    const { workspaceId } = useParams();
    const [caption, setCaption] = useState('');
    const [firstComment, setFirstComment] = useState('');
    const [postType, setPostType] = useState(initialTab);
    const [connectedApps, setConnectedApps] = useState([]);
    const [selectedAccounts, setSelectedAccounts] = useState([]);

    // Music states
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [showMusicLibrary, setShowMusicLibrary] = useState(false);

    // New UI states
    const [hoveredAccount, setHoveredAccount] = useState(null);
    const [showFirstComment, setShowFirstComment] = useState(false);
    const [showStickersPanel, setShowStickersPanel] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showScheduleOptions, setShowScheduleOptions] = useState(false);
    const [isCarouselMode, setIsCarouselMode] = useState(false);
    const [selectedPublishAction, setSelectedPublishAction] = useState('Publish now');
    const [selectedDate, setSelectedDate] = useState(null); // Changed to null to represent "No date selected"
    const [tempDate, setTempDate] = useState(new Date());
    const [isPublishing, setIsPublishing] = useState(false);
    const [showAIPanel, setShowAIPanel] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [reelCover, setReelCover] = useState(null);
    const [mediaLibraryTarget, setMediaLibraryTarget] = useState('media');

    const [hourInput, setHourInput] = useState('02');
    const [minuteInput, setMinuteInput] = useState('03');

    const updateSelectedDate = (newDate) => {
        setSelectedDate(newDate);
        if (newDate) {
            const h = newDate.getHours() % 12 || 12;
            const m = newDate.getMinutes();
            setHourInput(h.toString().padStart(2, '0'));
            setMinuteInput(m.toString().padStart(2, '0'));
        } else {
            setHourInput('02');
            setMinuteInput('03');
        }
    };

    const applyAISuggestion = (newCaption, newHashtags, targetForHashtags = 'comment') => {
        if (newCaption) {
            setCaption(prev => {
                if (prev) {
                    return prev + '\n' + newCaption;
                }
                return newCaption;
            });
        }
        if (newHashtags) {
            if (targetForHashtags === 'caption') {
                setCaption(prev => {
                    if (prev) {
                        return prev + '\n\n' + newHashtags;
                    }
                    return newHashtags;
                });
            } else {
                setFirstComment(prev => {
                    if (prev) {
                        return prev + ' ' + newHashtags;
                    }
                    return newHashtags;
                });
            }
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (prefilledDate) {
                const dateObj = new Date(prefilledDate);
                updateSelectedDate(dateObj);
                setTempDate(dateObj);
            } else {
                updateSelectedDate(null);
                setTempDate(new Date());
            }
        }
    }, [isOpen, prefilledDate]);

    // Tooltip State for bottom icons
    const [hoveredTool, setHoveredTool] = useState(null);
    const [hoveredMedia, setHoveredMedia] = useState(false);

    // Media Upload State
    const [uploadedMedia, setUploadedMedia] = useState([]);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState('right');
    const fileInputRef = useRef(null);

    const datePickerRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const scheduleOptionsRef = useRef(null);

    useEffect(() => {
        if (!workspaceId) return;

        getConnectedChannels(workspaceId)
            .then(channels => {
                const list = channels || [];

                const fbAccounts = list.filter(ch => ch.platform === 'facebook').map(ch => ({
                    id: ch.id,
                    handle: ch.name || ch.id,
                    name: ch.name || ch.id
                }));

                const igAccounts = list.filter(ch => ch.platform === 'instagram').map(ch => ({
                    id: ch.id,
                    handle: ch.name || ch.id,
                    name: ch.name || ch.id
                }));

                const liAccounts = list.filter(ch => ch.platform === 'linkedin').map(ch => ({
                    id: ch.id,
                    handle: ch.name || ch.id,
                    name: ch.name || ch.id
                }));

                const twAccounts = list.filter(ch => ch.platform === 'twitter').map(ch => ({
                    id: ch.id,
                    handle: ch.name || ch.id,
                    name: ch.name || ch.id
                }));

                const activeApps = [];

                if (igAccounts.length > 0) {
                    activeApps.push({
                        id: 'Instagram',
                        icon: Instagram,
                        name: 'Instagram',
                        count: igAccounts.length,
                        color: '#E1306C',
                        accounts: igAccounts
                    });
                }
                if (liAccounts.length > 0) {
                    activeApps.push({
                        id: 'LinkedIn',
                        icon: Linkedin,
                        name: 'LinkedIn',
                        count: liAccounts.length,
                        color: '#0A66C2',
                        accounts: liAccounts
                    });
                }
                if (twAccounts.length > 0) {
                    activeApps.push({
                        id: 'Twitter',
                        icon: Twitter,
                        name: 'X (Twitter)',
                        count: twAccounts.length,
                        color: '#1DA1F2',
                        accounts: twAccounts
                    });
                }
                if (fbAccounts.length > 0) {
                    activeApps.push({
                        id: 'Facebook',
                        icon: Facebook,
                        name: 'Facebook',
                        count: fbAccounts.length,
                        color: '#1877F2',
                        accounts: fbAccounts
                    });
                }

                setConnectedApps(activeApps);

                // Auto-select the first account if none are selected
                if (activeApps.length > 0) {
                    const firstApp = activeApps[0];
                    setSelectedAccounts([`${firstApp.id}-${firstApp.accounts[0].id}`]);
                }
            })
            .catch(err => {
                console.error("Failed to load connected channels for Modal:", err);
                setConnectedApps([]);
            });
    }, [workspaceId]);

    // Close Date Picker and Emoji Picker on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
            if (scheduleOptionsRef.current && !scheduleOptionsRef.current.contains(event.target)) {
                setShowScheduleOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleAccountSelection = (accountId) => {
        setSelectedAccounts(prev =>
            prev.includes(accountId)
                ? prev.filter(id => id !== accountId)
                : [...prev, accountId]
        );
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadPromises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        id: Date.now() + Math.random(),
                        file: file,
                        url: reader.result,
                        type: file.type
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(uploadPromises).then(newMediaItems => {
            setUploadedMedia(prev => [...prev, ...newMediaItems]);
            // Reset input so the same file could be selected again if needed
            e.target.value = null;
        });
    };

    const handleMediaLibrarySelect = (item) => {
        if (mediaLibraryTarget === 'cover') {
            setReelCover({
                id: Date.now() + Math.random(),
                file: null, // No file object — this is a server-hosted URL
                url: item.url,
                fromLibrary: true,
                libraryItem: item,
            });
            setShowMediaLibrary(false);
            return;
        }

        // item from the media library has: { id, url, type, name, ... }
        // Map type: 'image' -> 'image/jpeg' prefix, 'video' -> 'video/mp4' prefix for compatibility
        const mimeType = item.type === 'video' ? 'video/mp4' : 'image/jpeg';
        const newMedia = {
            id: Date.now() + Math.random(),
            file: null, // No file object — this is a server-hosted URL
            url: item.url,
            type: mimeType,
            fromLibrary: true,
            libraryItem: item,
        };
        setUploadedMedia(prev => [...prev, newMedia]);
    };

    const handlePublish = async () => {
        if (isPublishing) return;

        // Validation: Must have at least one account selected
        if (selectedAccounts.length === 0) {
            alert("Please select at least one social media account to publish to.");
            return;
        }

        setIsPublishing(true);

        const selectedChannelDetails = [];
        connectedApps.forEach(app => {
            app.accounts.forEach(acc => {
                const accountId = `${app.id}-${acc.id}`;
                if (selectedAccounts.includes(accountId)) {
                    selectedChannelDetails.push({
                        platform: app.id,
                        channelId: acc.id
                    });
                }
            });
        });

        if (selectedChannelDetails.length === 0) {
            alert("No social media accounts selected. Please click on an account icon above to select it.");
            setIsPublishing(false);
            return;
        }

        try {
            let lastCreatedPost = null;
            for (const { channelId } of selectedChannelDetails) {
                // Spec 4 Integration:
                // - post_type: "text" for text, "image" for ANY media (Spec 4.2-4.4)
                const hasMedia = uploadedMedia.length > 0;
                let payload;

                const user = getUserData();
                const creatorName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : 'Admin User';

                if (hasMedia) {
                    payload = new FormData();
                    payload.append('post_type', 'image');
                    payload.append('message', caption);
                    payload.append('created_by', creatorName);
                    payload.append('content_type', postType.toLowerCase());

                    // Add scheduled_time if in any future/scheduled action
                    // Spec 4.2 requires ISO format: 2026-03-03T08:40:00Z
                    if (selectedDate) {
                        const isoString = selectedDate.toISOString().split('.')[0] + 'Z';
                        payload.append('scheduled_time', isoString);
                    }

                    // Build the media files array — library items need to be fetched as blobs first
                    const mediaFiles = await Promise.all(uploadedMedia.map(async (media) => {
                        if (media.fromLibrary && !media.file) {
                            // Fetch the server-hosted file as a blob
                            const resp = await fetch(media.url);
                            const blob = await resp.blob();
                            const filename = media.libraryItem?.name || 'media_file';
                            return { file: new File([blob], filename, { type: blob.type }), type: media.type };
                        }
                        return { file: media.file, type: media.type };
                    }));

                    mediaFiles.forEach(({ file, type }) => {
                        const isVideo = type?.startsWith('video/') ||
                            file?.name?.toLowerCase().endsWith('.mp4') ||
                            file?.name?.toLowerCase().endsWith('.mov');

                        // Spec 4.3: Multiple 'image' fields for carousel
                        // Spec 4.4: 'video' key for video
                        payload.append(isVideo ? 'video' : 'image', file);
                    });

                    if (postType.toLowerCase() === 'reels' && reelCover) {
                        if (reelCover.file) {
                            payload.append('cover', reelCover.file);
                        } else if (reelCover.url) {
                            payload.append('cover_url', reelCover.url);
                        }
                    }

                    if (selectedTrack) {
                        payload.append('audio_track', JSON.stringify(selectedTrack));
                    }
                } else {
                    // Spec 4.1: Text Post (Standard JSON)
                    payload = {
                        post_type: 'text',
                        message: caption,
                        created_by: creatorName,
                        content_type: postType.toLowerCase()
                    };

                    // Scheduled time for text post
                    if (selectedDate) {
                        payload.scheduled_time = selectedDate.toISOString().split('.')[0] + 'Z';
                    }

                    if (selectedTrack) {
                        payload.audio_track = selectedTrack;
                    }
                }

                const createdPost = await createFacebookPost(channelId, payload);
                lastCreatedPost = createdPost;
            }
            // Success reset
            setCaption('');
            setUploadedMedia([]);
            setReelCover(null);
            setCurrentMediaIndex(0);
            setIsCarouselMode(false);
            setSelectedTrack(null);

            // Show toast message based on action
            if (selectedDate) {
                toast.success('Post scheduled successfully!');
            } else if (selectedPublishAction === 'Save draft') {
                toast.success('Draft saved successfully!');
            } else {
                toast.success('Post published successfully!');
            }
            // Close the compose modal via its prop
            onClose();

            if (lastCreatedPost && onPostCreated) {
                onPostCreated(lastCreatedPost);
            }

            // Trigger refresh in parent if callback exists
            if (onPublishSuccess) {
                onPublishSuccess();
            }
        } catch (error) {
            console.error("Failed to publish post:", error.response?.data || error);
            const errMsg = error.response?.data?.error || error.response?.data?.detail || error.message || "Please try again.";
            alert(`Error publishing: ${errMsg}`);
        } finally {
            setIsPublishing(false);
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setCaption((prev) => prev + emojiObject.emoji);
    };

    const formatSelectedDate = (date) => {
        if (!date) return null;
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('en-US', options).replace(',', '');
    };

    const adjustTime = (hoursDiff, minutesDiff) => {
        const base = new Date(selectedDate || tempDate);
        if (!selectedDate) {
            base.setHours(14, 3, 0); // start at default 02:03 PM
        }
        if (hoursDiff !== 0) {
            base.setHours(base.getHours() + hoursDiff);
        }
        if (minutesDiff !== 0) {
            base.setMinutes(base.getMinutes() + minutesDiff);
        }
        updateSelectedDate(base);
    };

    const handleHourChange = (val) => {
        const clean = val.replace(/[^0-9]/g, '').slice(0, 2);
        setHourInput(clean);

        if (clean !== '') {
            let h = parseInt(clean, 10);
            if (!isNaN(h)) {
                if (h >= 1 && h <= 12) {
                    const base = new Date(selectedDate || tempDate);
                    if (!selectedDate) base.setHours(14, 3, 0);
                    const isPm = base.getHours() >= 12;
                    if (isPm) {
                        base.setHours(h === 12 ? 12 : h + 12);
                    } else {
                        base.setHours(h === 12 ? 0 : h);
                    }
                    setSelectedDate(base);
                }
            }
        }
    };

    const handleHourBlur = () => {
        let h = parseInt(hourInput, 10);
        if (isNaN(h) || h < 1) h = 12;
        if (h > 12) h = 12;
        
        const formatted = h.toString().padStart(2, '0');
        setHourInput(formatted);

        const base = new Date(selectedDate || tempDate);
        if (!selectedDate) base.setHours(14, 3, 0);
        const isPm = base.getHours() >= 12;
        if (isPm) {
            base.setHours(h === 12 ? 12 : h + 12);
        } else {
            base.setHours(h === 12 ? 0 : h);
        }
        setSelectedDate(base);
    };

    const handleMinuteChange = (val) => {
        const clean = val.replace(/[^0-9]/g, '').slice(0, 2);
        setMinuteInput(clean);

        if (clean !== '') {
            let m = parseInt(clean, 10);
            if (!isNaN(m)) {
                if (m >= 0 && m <= 59) {
                    const base = new Date(selectedDate || tempDate);
                    if (!selectedDate) base.setHours(14, 3, 0);
                    base.setMinutes(m);
                    setSelectedDate(base);
                }
            }
        }
    };

    const handleMinuteBlur = () => {
        let m = parseInt(minuteInput, 10);
        if (isNaN(m) || m < 0) m = 0;
        if (m > 59) m = 59;

        const formatted = m.toString().padStart(2, '0');
        setMinuteInput(formatted);

        const base = new Date(selectedDate || tempDate);
        if (!selectedDate) base.setHours(14, 3, 0);
        base.setMinutes(m);
        setSelectedDate(base);
    };

    const toggleAmPm = () => {
        const base = new Date(selectedDate || tempDate);
        if (!selectedDate) {
            base.setHours(14, 3, 0); // start at default 02:03 PM
        }
        const currentHours = base.getHours();
        if (currentHours >= 12) {
            base.setHours(currentHours - 12);
        } else {
            base.setHours(currentHours + 12);
        }
        updateSelectedDate(base);
    };

    if (!isOpen) return null;

    // Days in month logic for calendar mockup
    const currYear = tempDate.getFullYear();
    const currMonth = tempDate.getMonth();
    const daysInMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currYear, currMonth, 1).getDay();
    const prevDays = new Date(currYear, currMonth, 0).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const calendarCells = [];
    // Prev month days
    for (let x = firstDayIndex; x > 0; x--) {
        calendarCells.push({ day: prevDays - x + 1, current: false, date: new Date(currYear, currMonth - 1, prevDays - x + 1) });
    }
    // Curr month days
    for (let i = 1; i <= daysInMonth; i++) {
        calendarCells.push({ day: i, current: true, date: new Date(currYear, currMonth, i) });
    }
    // Next month days
    const nextDays = 42 - calendarCells.length; // 6 rows * 7 days
    for (let j = 1; j <= nextDays; j++) {
        calendarCells.push({ day: j, current: false, date: new Date(currYear, currMonth + 1, j) });
    }

    // Custom Tooltip Component for Bottom Icons
    const TooltipWrapper = ({ title, children, id }) => {
        const isHovered = hoveredTool === id;
        return (
            <div
                style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={() => setHoveredTool(id)}
                onMouseLeave={() => setHoveredTool(null)}
            >
                {/* Tooltip Popeup */}
                {isHovered && (
                    <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translate(-50%, -8px)',
                        background: '#1f2937',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        zIndex: 30,
                        pointerEvents: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        {title}
                        {/* Little triangle arrow pointing down */}
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderWidth: '4px',
                            borderStyle: 'solid',
                            borderColor: '#1f2937 transparent transparent transparent'
                        }} />
                    </div>
                )}
                {children}
            </div>
        );
    };

    return (
        <>
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000,
            overflowY: 'auto', display: 'flex', padding: '4rem 1rem',
            backdropFilter: 'blur(8px)'
        }} onClick={onClose}>
            <style>
                {`
                    @keyframes slideInRight {
                        from { transform: translateX(20px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideInLeft {
                        from { transform: translateX(-20px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes scaleIn {
                        from { transform: scale(0.95); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `}
            </style>

            {/* Modal Flex Wrapper for Main and Sidebar */}
            <div style={{ display: 'flex', margin: 'auto', gap: '16px', alignItems: 'stretch', animation: 'scaleIn 0.2s ease-out' }} onClick={e => e.stopPropagation()}>

                {/* Main Modal Container */}
                <div style={{
                    width: '100%',
                    minWidth: postType === 'Reels' && uploadedMedia.length > 0 ? '620px' : '540px',
                    maxWidth: postType === 'Reels' && uploadedMedia.length > 0 ? '620px' : '540px',
                    background: 'white', borderRadius: '14px',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)', position: 'relative',
                    display: 'flex', flexDirection: 'column', overflow: 'visible',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    transition: 'all 0.2s ease-in-out'
                }}>

                    {/* Hidden File Input for Image/Video Upload */}
                    <input
                        type="file"
                        accept="image/*,video/*"
                        multiple // Allow multi select from the OS dialog
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />

                    {/* 1. Header Section: Options & Close Button */}
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', border: '1px dashed #d1d5db', borderRadius: '8px', fontSize: '12px', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }}>
                                <FileText size={14} strokeWidth={1.5} /> Template
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', border: '1px dashed #d1d5db', borderRadius: '8px', fontSize: '12px', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }}>
                                <Megaphone size={14} strokeWidth={1.5} /> Campaign
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', border: '1px dashed #d1d5db', borderRadius: '8px', fontSize: '12px', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }}>
                                <Tag size={14} strokeWidth={1.5} /> Labels
                            </div>
                        </div>
                        <div style={{ flex: 1 }} />
                        <div onClick={onClose} style={{
                            width: '28px', height: '28px', borderRadius: '50%', background: '#f3f4f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280'
                        }}>
                            <X size={16} strokeWidth={2.5} />
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div style={{ width: '100%' }}>
                        {/* 2. Account selection area */}
                        <div style={{ padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {connectedApps.map(app =>
                                app.accounts.map(acc => {
                                    const accountId = `${app.id}-${acc.id}`;
                                    const isSelected = selectedAccounts.includes(accountId);
                                    const isHovered = hoveredAccount === accountId;
                                    const Icon = app.icon;

                                    return (
                                        <div
                                            key={accountId}
                                            onClick={() => toggleAccountSelection(accountId)}
                                            onMouseEnter={() => setHoveredAccount(accountId)}
                                            onMouseLeave={() => setHoveredAccount(null)}
                                            style={{
                                                position: 'relative', cursor: 'pointer', zIndex: isHovered ? 10 : 1
                                            }}
                                        >
                                            <div style={{
                                                width: '40px', height: '40px',
                                                background: '#f3f4f6',
                                                borderRadius: '10px',
                                                border: isSelected ? '1px solid transparent' : '1px solid #e5e7eb',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                opacity: isSelected ? 1 : 0.6,
                                                overflow: 'hidden'
                                            }}>
                                                {/* Fallback initials if no avatar */}
                                                <div style={{
                                                    width: '100%', height: '100%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '14px', fontWeight: 700, color: '#4b5563',
                                                    background: '#e5e7eb'
                                                }}>
                                                    {acc.name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>

                                            <div style={{
                                                position: 'absolute', top: '-6px', right: '-6px',
                                                width: '18px', height: '18px', borderRadius: '50%',
                                                background: isSelected ? app.color : '#9ca3af', border: '2px solid white',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}>
                                                <Icon size={10} color="white" strokeWidth={2} />
                                            </div>

                                            {isSelected && (
                                                <div style={{ position: 'absolute', bottom: '-8px', left: '50%', marginLeft: '-8px', width: '16px', height: '3px', background: '#3b82f6', borderRadius: '4px' }} />
                                            )}

                                            {isHovered && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, 8px)',
                                                    background: '#1f2937',
                                                    color: '#f9fafb',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    minWidth: '200px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                                    zIndex: 20
                                                }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#4b5563', flexShrink: 0 }}></div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                                        <span style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{acc.name}</span>
                                                        <span style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Profile • {acc.handle}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* 3. Post type tabs (Post, Story, Reels) */}
                        <div style={{ display: 'flex', gap: '20px', padding: '8px 24px 0', borderBottom: '1px solid #f3f4f6' }}>
                            <div
                                onClick={() => setPostType('Post')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '12px', fontSize: '14px', fontWeight: postType === 'Post' ? 700 : 500,
                                    color: postType === 'Post' ? '#3b82f6' : '#6b7280', borderBottom: postType === 'Post' ? '2px solid #3b82f6' : '2px solid transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                <Layout size={16} strokeWidth={2} /> Post
                            </div>
                            <div
                                onClick={() => setPostType('Story')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '12px', fontSize: '14px', fontWeight: postType === 'Story' ? 700 : 500,
                                    color: postType === 'Story' ? '#3b82f6' : '#6b7280', borderBottom: postType === 'Story' ? '2px solid #3b82f6' : '2px solid transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                <PlusCircle size={16} strokeWidth={2} /> Story
                            </div>
                            <div
                                onClick={() => setPostType('Reels')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '12px', fontSize: '14px', fontWeight: postType === 'Reels' ? 700 : 500,
                                    color: postType === 'Reels' ? '#3b82f6' : '#6b7280', borderBottom: postType === 'Reels' ? '2px solid #3b82f6' : '2px solid transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                <Film size={16} strokeWidth={2} /> Reels
                            </div>
                        </div>

                        {/* Image Upload Area (Post Tab) */}
                        {uploadedMedia.length > 0 && !isCarouselMode && postType === 'Post' && (
                            <PostTab
                                uploadedMedia={uploadedMedia}
                                currentMediaIndex={currentMediaIndex}
                                setCurrentMediaIndex={setCurrentMediaIndex}
                                slideDirection={slideDirection}
                                setSlideDirection={setSlideDirection}
                                hoveredMedia={hoveredMedia}
                                setHoveredMedia={setHoveredMedia}
                                setIsCarouselMode={setIsCarouselMode}
                                setUploadedMedia={setUploadedMedia}
                                TooltipWrapper={TooltipWrapper}
                            />
                        )}

                        {/* Carousel Edit Mode Area */}
                        {uploadedMedia.length > 0 && isCarouselMode && (
                            <CarouselEditView
                                uploadedMedia={uploadedMedia}
                                setUploadedMedia={setUploadedMedia}
                                currentMediaIndex={currentMediaIndex}
                                setCurrentMediaIndex={setCurrentMediaIndex}
                                setIsCarouselMode={setIsCarouselMode}
                                fileInputRef={fileInputRef}
                            />
                        )}

                        {/* Story Mode Area (Contains both Empty and Filled states internally) */}
                        {postType === 'Story' && (
                            <StoryTab
                                uploadedMedia={uploadedMedia}
                                currentMediaIndex={currentMediaIndex}
                                setCurrentMediaIndex={setCurrentMediaIndex}
                                slideDirection={slideDirection}
                                setSlideDirection={setSlideDirection}
                                fileInputRef={fileInputRef}
                                setUploadedMedia={setUploadedMedia}
                                setShowStickersPanel={setShowStickersPanel}
                                isCarouselMode={isCarouselMode}
                                selectedTrack={selectedTrack}
                            />
                        )}

                        {/* Reels Mode Area */}
                        {postType === 'Reels' && (
                            <ReelsTab
                                uploadedMedia={uploadedMedia}
                                currentMediaIndex={currentMediaIndex}
                                setCurrentMediaIndex={setCurrentMediaIndex}
                                setUploadedMedia={setUploadedMedia}
                                fileInputRef={fileInputRef}
                                reelCover={reelCover}
                                setReelCover={setReelCover}
                                setMediaLibraryTarget={setMediaLibraryTarget}
                                setShowMediaLibrary={setShowMediaLibrary}
                                selectedTrack={selectedTrack}
                            />
                        )}

                        {/* 4. Caption Area */}
                        <div style={{ padding: '24px 24px 0', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <textarea
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                                placeholder={uploadedMedia.length > 0 ? "Write something... or type :balloon: to insert a 🎈" : "Write something... or type :balloon: to insert a 🎈"}
                                style={{
                                    width: '100%', minHeight: (uploadedMedia.length > 0 || postType === 'Story') ? '40px' : '80px', border: 'none', outline: 'none',
                                    fontSize: '15px', color: '#111827', resize: 'none', fontFamily: 'inherit',
                                    lineHeight: 1.5,
                                    flex: 1
                                }}
                            />

                            {/* AI Generate Caption Feature */}
                            {!showFirstComment && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', alignItems: 'center' }}>
                                    <button 
                                        onClick={() => setShowAIPanel(true)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', border: '1px solid #cbd5e1',
                                            borderRadius: '20px', fontSize: '13px', fontWeight: 600, color: '#6366f1', background: 'white', cursor: 'pointer',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.15s'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#f5f3ff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = 'white'; }}
                                    >
                                        <Sparkles size={14} strokeWidth={2} /> {uploadedMedia.length > 0 ? "Generate caption for image" : "Generate with AI"}
                                    </button>
                                    {!uploadedMedia.length && (
                                        <div 
                                            onClick={() => setShowAIPanel(true)}
                                            style={{ width: '32px', height: '32px', border: '1px solid #e5e7eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', transition: 'all 0.15s' }} 
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#eab308'; e.currentTarget.style.color = '#eab308'; e.currentTarget.style.background = '#fef9c3'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'transparent'; }}
                                            title="AI suggestions"
                                        >
                                            <Lightbulb size={16} strokeWidth={1.5} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Attached Music track preview badge */}
                            {selectedTrack && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '8px 12px', background: '#ec48990a', border: '1px solid #ec489920',
                                    borderRadius: '10px', marginTop: '16px', fontSize: '13px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#db2777' }}>
                                        <Music size={14} className="spinning-music-icon" />
                                        <span style={{ fontWeight: 600 }}>{selectedTrack.artist}</span>
                                        <span style={{ opacity: 0.7 }}>-</span>
                                        <span style={{ fontWeight: 500 }}>{selectedTrack.name}</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTrack(null)}
                                        style={{
                                            border: 'none', background: 'none', cursor: 'pointer',
                                            color: '#94a3b8', display: 'flex', alignItems: 'center'
                                        }}
                                        title="Remove track"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* First Comment Area */}
                        {showFirstComment && (
                            <div style={{ margin: '0 24px 16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#d1d5db' }}></div>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#4b5563' }}>Current Account</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: '#9ca3af', cursor: 'pointer' }} onClick={() => setShowFirstComment(false)}>
                                        FIRST COMMENT <X size={12} strokeWidth={3} />
                                    </div>
                                </div>
                                <textarea
                                    value={firstComment}
                                    onChange={e => setFirstComment(e.target.value)}
                                    placeholder="Add #hashtags or tag relevant accounts..."
                                    style={{
                                        width: '100%', minHeight: '60px', border: 'none', outline: 'none',
                                        fontSize: '14px', color: '#111827', resize: 'none', fontFamily: 'inherit',
                                        background: 'transparent'
                                    }}
                                />
                            </div>
                        )}

                        {/* 5. Tool icons (pushed to right if image uploaded) */}
                        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: uploadedMedia.length > 0 ? 'flex-end' : 'flex-start', position: 'relative' }}>
                            {!uploadedMedia.length && (
                                <>
                                    <TooltipWrapper id="upload" title="Upload Media">
                                        <div onClick={() => fileInputRef.current?.click()} style={{ padding: '8px', color: '#6b7280', cursor: 'pointer', borderRadius: '6px' }} ><ImageIcon size={18} strokeWidth={2} /></div>
                                    </TooltipWrapper>
                                    <TooltipWrapper id="folder" title="Media Library">
                                        <div onClick={() => setShowMediaLibrary(true)} style={{ padding: '8px', color: '#6b7280', cursor: 'pointer', borderRadius: '6px' }} ><Folder size={18} strokeWidth={2} /></div>
                                    </TooltipWrapper>

                                    <TooltipWrapper id="comment" title="First Comment">
                                        <div
                                            onClick={() => setShowFirstComment(!showFirstComment)}
                                            style={{ padding: '8px', color: showFirstComment ? '#3b82f6' : '#6b7280', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '2px' }}
                                        >
                                            <MessageSquare size={18} strokeWidth={2} />
                                            {showFirstComment ? null : <span style={{ fontSize: '10px', fontWeight: 'bold' }}>1</span>}
                                        </div>
                                    </TooltipWrapper>

                                    <div style={{ flex: 1 }} />
                                </>
                            )}

                            {/* Always show these utilities */}
                            {uploadedMedia.length > 0 && (
                                <TooltipWrapper id="comment_alt" title="First Comment">
                                    <div
                                        onClick={() => setShowFirstComment(!showFirstComment)}
                                        style={{ padding: '8px', color: showFirstComment ? '#3b82f6' : '#6b7280', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '2px' }}
                                    >
                                        <MessageSquare size={18} strokeWidth={2} />
                                        {showFirstComment ? null : <span style={{ fontSize: '10px', fontWeight: 'bold' }}>1</span>}
                                    </div>
                                </TooltipWrapper>
                            )}
                            <TooltipWrapper id="location" title="Add location">
                                <div style={{ padding: '8px', color: '#6b7280', cursor: 'pointer', borderRadius: '6px' }} ><MapPin size={18} strokeWidth={2} /></div>
                            </TooltipWrapper>

                            <TooltipWrapper id="music" title={selectedTrack ? `Music: ${selectedTrack.artist} - ${selectedTrack.name}` : "Add music/audio"}>
                                <div
                                    onClick={() => setShowMusicLibrary(true)}
                                    style={{
                                        padding: '8px',
                                        color: selectedTrack ? '#ec4899' : '#6b7280',
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: selectedTrack ? '#ec48991a' : 'transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Music size={18} strokeWidth={2} />
                                    {selectedTrack && <span style={{ fontSize: '10px', fontWeight: 600, paddingLeft: '4px' }}>1</span>}
                                </div>
                            </TooltipWrapper>

                            <div ref={emojiPickerRef} style={{ position: 'relative' }}>
                                <TooltipWrapper id="emoji" title="Add emoji">
                                    <div onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ padding: '8px', color: showEmojiPicker ? '#eab308' : '#6b7280', cursor: 'pointer', borderRadius: '6px' }} >
                                        <Smile size={18} strokeWidth={2} />
                                    </div>
                                </TooltipWrapper>

                                {/* Emoji Picker Popup Module */}
                                {showEmojiPicker && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        marginBottom: '10px',
                                        right: '0',
                                        zIndex: 50,
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}>
                                        <EmojiPicker onEmojiClick={handleEmojiClick} lazyLoadEmojis={true} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 6. Footer section */}
                    <div style={{
                        padding: '16px 24px', background: '#fdfdfd', borderTop: '1px solid #f3f4f6',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative',
                        borderBottomLeftRadius: '14px', borderBottomRightRadius: '14px'
                    }}>
                        {/* Date/Time Toggle (Updated to display selected date/time) */}
                        <div
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: selectedDate ? '#111827' : '#6b7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            {selectedDate ? (
                                <>
                                    <Clock size={16} strokeWidth={2} color="#9ca3af" />
                                    {formatSelectedDate(selectedDate)}
                                    <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: '4px' }}>(Asia: Calcutta)</span>
                                    <ChevronDown size={14} color="#9ca3af" />
                                </>
                            ) : (
                                <>
                                    <Clock size={16} strokeWidth={2} /> Select date & time <ChevronDown size={14} />
                                </>
                            )}
                        </div>

                        {/* Submit Actions (Schedule UI override if Date selected) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Eye size={20} color="#9ca3af" strokeWidth={1.5} style={{ cursor: 'pointer' }} title="Preview" />
                            <div ref={scheduleOptionsRef} style={{ position: 'relative' }}>
                                <div style={{ display: 'flex', border: '1px solid #0A66C2', borderRadius: '8px', overflow: 'hidden', height: '40px' }}>
                                    <div
                                        onClick={handlePublish}
                                        style={{
                                            background: '#0A66C2',
                                            color: 'white',
                                            fontSize: '13px', fontWeight: 700, padding: '0 20px',
                                            display: 'flex', alignItems: 'center',
                                            cursor: (isPublishing || selectedAccounts.length === 0) ? 'default' : 'pointer',
                                            transition: 'background 0.2s',
                                            opacity: (isPublishing || selectedAccounts.length === 0) ? 0.6 : 1
                                        }}
                                    >
                                        {isPublishing ? 'Publishing...' : (selectedDate ? 'Schedule' : selectedPublishAction)}
                                    </div>
                                    <div
                                        onClick={() => setShowScheduleOptions(!showScheduleOptions)}
                                        style={{
                                            background: '#0A66C2',
                                            borderLeft: '1px solid rgba(255,255,255,0.2)',
                                            display: 'flex', alignItems: 'center', padding: '0 10px',
                                            cursor: 'pointer', color: 'white',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <ChevronDown size={16} strokeWidth={2.5} />
                                    </div>
                                </div>

                                {/* Schedule Options Dropdown */}
                                {showScheduleOptions && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        marginBottom: '8px',
                                        right: 0,
                                        background: 'white',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                        border: '1px solid #f3f4f6',
                                        minWidth: '180px',
                                        padding: '8px 0',
                                        zIndex: 60,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <div onClick={() => { setSelectedPublishAction('Save draft'); setShowScheduleOptions(false); }} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                            <Plus size={15} strokeWidth={1.5} /> <span>Save draft</span>
                                        </div>
                                        <div onClick={() => { setSelectedPublishAction('Publish now'); setShowScheduleOptions(false); }} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                            <Send size={15} strokeWidth={1.5} style={{ transform: 'rotate(-45deg)' }} /> <span>Publish now</span>
                                        </div>
                                        <div onClick={() => { setSelectedPublishAction('Save as template'); setShowScheduleOptions(false); }} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                            <FileText size={15} strokeWidth={1.5} /> <span>Save as template</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date/Time Picker Popup Modal */}
                        {showDatePicker && (
                            <div
                                ref={datePickerRef}
                                style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: '20px',
                                    marginBottom: '10px',
                                    background: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                    padding: '20px',
                                    display: 'flex',
                                    gap: '24px',
                                    zIndex: 50,
                                    width: '560px',
                                    border: '1px solid #f3f4f6'
                                }}
                            >
                                {/* Calendar Side */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', gap: '10px', color: '#d1d5db' }}>
                                            <ChevronLeft size={16} /><ChevronLeft size={16} style={{ marginLeft: '-12px' }} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <ChevronLeft
                                                size={16}
                                                color="#9ca3af"
                                                cursor="pointer"
                                                onClick={() => setTempDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                                            />
                                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                                                {monthNames[currMonth]} {currYear}
                                            </span>
                                            <ChevronRight
                                                size={16}
                                                color="#9ca3af"
                                                cursor="pointer"
                                                onClick={() => setTempDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', color: '#d1d5db' }}>
                                            <ChevronRight size={16} /><ChevronRight size={16} style={{ marginLeft: '-12px' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>
                                        <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                                        {calendarCells.map((cell, idx) => {
                                            const isSelected = selectedDate && cell.current && cell.date.toDateString() === selectedDate.toDateString();
                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        const newDate = new Date(cell.date);
                                                        if (selectedDate) {
                                                            newDate.setHours(selectedDate.getHours());
                                                            newDate.setMinutes(selectedDate.getMinutes());
                                                        } else {
                                                            newDate.setHours(14, 3, 0); // Default 02:03 PM
                                                        }
                                                        updateSelectedDate(newDate);
                                                    }}
                                                    style={{
                                                        padding: '6px 0', fontSize: '13px',
                                                        background: isSelected ? '#3b82f6' : 'transparent',
                                                        color: isSelected ? 'white' : (cell.current ? '#111827' : '#d1d5db'),
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontWeight: isSelected ? 700 : 500
                                                    }}
                                                >
                                                    {cell.day}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div style={{ width: '1px', background: '#f3f4f6' }} />

                                {/* Time Selection Side */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Select time</div>

                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Top picks for you <Info size={12} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                                        <div onClick={() => {
                                            const next = new Date(selectedDate || tempDate);
                                            next.setHours(14, 3, 0); // 02:03 PM
                                            updateSelectedDate(next);
                                        }} style={{ padding: '6px 12px', border: '1px solid #3b82f6', borderRadius: '20px', fontSize: '13px', fontWeight: 600, color: '#3b82f6', cursor: 'pointer' }}>02:03 PM</div>
                                        <div onClick={() => {
                                            const next = new Date(selectedDate || tempDate);
                                            next.setHours(20, 4, 0); // 08:04 PM
                                            updateSelectedDate(next);
                                        }} style={{ padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '20px', fontSize: '13px', fontWeight: 600, color: '#4b5563', cursor: 'pointer' }}>08:04 PM</div>
                                    </div>

                                    <div style={{ fontSize: '12px', color: '#111827', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        Engagement forecast <ChevronDown size={14} />
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '12px' }}>3-hour average performance</div>

                                    {/* Mock Chart */}
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '50px', marginBottom: '8px', padding: '0 8px' }}>
                                        <div style={{ width: '20px', height: '10%', background: '#d1d5db', borderRadius: '2px 2px 0 0' }} />
                                        <div style={{ width: '20px', height: '15%', background: '#d1d5db', borderRadius: '2px 2px 0 0' }} />
                                        <div style={{ width: '20px', height: '30%', background: '#d1d5db', borderRadius: '2px 2px 0 0' }} />
                                        <div style={{ width: '20px', height: '100%', background: '#3b82f6', borderRadius: '2px 2px 0 0' }} />
                                        <div style={{ width: '20px', height: '90%', background: '#3b82f6', borderRadius: '2px 2px 0 0' }} />
                                        <div style={{ width: '20px', height: '40%', background: '#3b82f6', borderRadius: '2px 2px 0 0' }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9ca3af', padding: '0 8px', marginBottom: '16px' }}>
                                        <span>12a</span><span>3a</span><span>6a</span><span>9a</span><span>12p</span><span>3p</span><span>6p</span><span>9p</span>
                                    </div>

                                    {/* Custom Time Input below chart */}
                                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                         <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '6px', padding: '4px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', background: 'white' }}>
                                             <input
                                                 type="text"
                                                 value={hourInput}
                                                 onChange={(e) => handleHourChange(e.target.value)}
                                                 onBlur={handleHourBlur}
                                                 style={{ width: '28px', border: 'none', outline: 'none', fontWeight: 600, color: '#4b5563', padding: 0 }}
                                             />
                                             <div style={{ display: 'flex', flexDirection: 'column', color: '#9ca3af', justifyContent: 'center' }}>
                                                <ChevronDown size={10} style={{ transform: 'rotate(180deg)', cursor: 'pointer', padding: '2px' }} onClick={() => adjustTime(1, 0)} />
                                                <ChevronDown size={10} style={{ cursor: 'pointer', padding: '2px' }} onClick={() => adjustTime(-1, 0)} />
                                             </div>
                                         </div>
                                         <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '6px', padding: '4px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', background: 'white' }}>
                                             <input
                                                 type="text"
                                                 value={minuteInput}
                                                 onChange={(e) => handleMinuteChange(e.target.value)}
                                                 onBlur={handleMinuteBlur}
                                                 style={{ width: '28px', border: 'none', outline: 'none', fontWeight: 600, color: '#4b5563', padding: 0 }}
                                             />
                                             <div style={{ display: 'flex', flexDirection: 'column', color: '#9ca3af', justifyContent: 'center' }}>
                                                <ChevronDown size={10} style={{ transform: 'rotate(180deg)', cursor: 'pointer', padding: '2px' }} onClick={() => adjustTime(0, 1)} />
                                                <ChevronDown size={10} style={{ cursor: 'pointer', padding: '2px' }} onClick={() => adjustTime(0, -1)} />
                                             </div>
                                         </div>
                                         <div onClick={toggleAmPm} style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 600, color: '#4b5563', cursor: 'pointer', background: 'white' }}>
                                             {selectedDate ? (selectedDate.getHours() >= 12 ? 'PM' : 'AM') : 'PM'}
                                             <ChevronDown size={12} color="#9ca3af" />
                                         </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stickers Side Panel */}
                    {showStickersPanel && (
                        <div style={{
                            width: '320px', background: 'white', borderRadius: '14px',
                            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                            flexShrink: 0
                        }}>
                            {/* Header */}
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                                    Add stickers <HelpCircle size={14} color="#9ca3af" />
                                </div>
                                <div onClick={() => setShowStickersPanel(false)} style={{ cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#f3f4f6' }}>
                                    <PanelRightClose size={16} />
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {[
                                    { icon: <Type size={16} color="#ef4444" />, label: 'Text' },
                                    { icon: <MapPin size={16} color="#8b5cf6" />, label: 'Location' },
                                    { icon: <LinkIcon size={16} color="#3b82f6" />, label: 'Link' },
                                    { icon: <Music size={16} color="#ec4899" />, label: 'Music' },
                                    { icon: <AtSign size={16} color="#f97316" />, label: '@mention' },
                                    { icon: <Hash size={16} color="#ec4899" />, label: '# hashtags' },
                                    { icon: <HelpCircle size={16} color="#0ea5e9" />, label: 'Questions' },
                                    { icon: <List size={16} color="#22c55e" />, label: 'Notes' },
                                    { icon: <Plus size={16} color="#6b7280" />, label: '+ Other' },
                                ].map((btn, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
                                        border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: '#4b5563',
                                        cursor: 'pointer', background: 'white', transition: 'background 0.2s'
                                    }} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                        {btn.icon} {btn.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* AI Assistant Side Panel */}
                {showAIPanel && (
                    <AIAssistantPanel
                        onClose={() => setShowAIPanel(false)}
                        uploadedMedia={uploadedMedia}
                        currentMediaIndex={currentMediaIndex}
                        applySuggestion={applyAISuggestion}
                        showFirstComment={showFirstComment}
                        setShowFirstComment={setShowFirstComment}
                    />
                )}
            </div>
        </div>
        {/* Media Library Picker Modal */}
        <MediaLibraryModal
            isOpen={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            workspaceId={workspaceId}
            onSelect={handleMediaLibrarySelect}
        />
        {/* Music Library Picker Modal */}
        <MusicLibraryModal
            isOpen={showMusicLibrary}
            onClose={() => setShowMusicLibrary(false)}
            onSelect={(track) => setSelectedTrack(track)}
            currentSelectedTrackId={selectedTrack?.id}
        />
        </>
    );
};

export default CreatePostModal;
