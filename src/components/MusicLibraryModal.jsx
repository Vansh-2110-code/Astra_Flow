import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Play, Pause, Music, Volume2, Check } from 'lucide-react';

const TRACKS = [
    {
        id: 'track-1',
        name: 'Summer Breeze',
        artist: 'Lofi Dreamer',
        genre: 'Lofi / Chill',
        duration: '3:12',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
        id: 'track-2',
        name: 'Neon Horizon',
        artist: 'Synthwave Pro',
        genre: 'Electronic',
        duration: '2:45',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
        id: 'track-3',
        name: 'Inspiring Growth',
        artist: 'Corporate Acoustic',
        genre: 'Acoustic / Happy',
        duration: '4:01',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
        id: 'track-4',
        name: 'Techno Beats',
        artist: 'DJ Peak',
        genre: 'Dance / House',
        duration: '3:30',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
    {
        id: 'track-5',
        name: 'Epic Journey',
        artist: 'Cinematic Orchestra',
        genre: 'Cinematic',
        duration: '5:12',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
    },
    {
        id: 'track-6',
        name: 'Acoustic Sunset',
        artist: 'Guitar Folk',
        genre: 'Acoustic / Happy',
        duration: '2:50',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
    }
];

const MusicLibraryModal = ({ isOpen, onClose, onSelect, currentSelectedTrackId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [playingTrackId, setPlayingTrackId] = useState(null);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        // Cleanup playing audio when modal closes or unmounts
        return () => {
            audioRef.current.pause();
            audioRef.current.src = '';
        };
    }, []);

    useEffect(() => {
        if (!isOpen) {
            audioRef.current.pause();
            setPlayingTrackId(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const togglePlay = (track) => {
        if (playingTrackId === track.id) {
            audioRef.current.pause();
            setPlayingTrackId(null);
        } else {
            audioRef.current.pause();
            audioRef.current.src = track.url;
            audioRef.current.play()
                .then(() => {
                    setPlayingTrackId(track.id);
                })
                .catch(err => {
                    console.error("Audio playback error:", err);
                    alert("Could not load preview song. Please try again.");
                });
        }
    };

    // Listen to audio end events
    audioRef.current.onended = () => {
        setPlayingTrackId(null);
    };

    const genres = ['all', 'Lofi / Chill', 'Electronic', 'Acoustic / Happy', 'Dance / House', 'Cinematic'];

    const filteredTracks = TRACKS.filter(track => {
        const matchesSearch = track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            track.artist.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    const handleSelect = (track) => {
        // Stop playing music preview
        audioRef.current.pause();
        setPlayingTrackId(null);

        onSelect(track);
        onClose();
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(8px)'
            }}
            onClick={() => {
                audioRef.current.pause();
                onClose();
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#ffffff', borderRadius: '16px', width: '90%', maxWidth: '580px',
                    height: '75vh', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden',
                    border: '1px solid rgba(226, 232, 240, 0.8)'
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ padding: '6px', background: '#ec48991a', color: '#ec4899', borderRadius: '8px' }}>
                            <Music size={18} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: '#0f172a' }}>Audio Library</h3>
                    </div>
                    <button
                        onClick={() => {
                            audioRef.current.pause();
                            onClose();
                        }}
                        style={{ background: '#f8fafc', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Search and Filters */}
                <div style={{
                    padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', flexDirection: 'column', gap: '12px'
                }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search by track name or artist..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px',
                                border: '1px solid #e2e8f0', fontSize: '0.88rem',
                                outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
                            }}
                            onFocus={e => e.target.style.borderColor = '#ec4899'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    {/* Genre categories scrolling */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                        {genres.map(g => (
                            <button
                                key={g}
                                onClick={() => setSelectedGenre(g)}
                                style={{
                                    whiteSpace: 'nowrap', padding: '6px 14px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 500,
                                    border: '1px solid',
                                    borderColor: selectedGenre === g ? '#ec4899' : '#e2e8f0',
                                    background: selectedGenre === g ? '#ec4899' : '#ffffff',
                                    color: selectedGenre === g ? '#ffffff' : '#64748b',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {g === 'all' ? 'All Genres' : g}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tracks List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
                    {filteredTracks.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                            <Music size={42} style={{ marginBottom: '12px', opacity: 0.4 }} />
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>No tracks match your search</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {filteredTracks.map(track => {
                                const isCurrentPlaying = playingTrackId === track.id;
                                const isSelected = currentSelectedTrackId === track.id;
                                return (
                                    <div
                                        key={track.id}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '14px',
                                            padding: '10px 14px', borderRadius: '12px',
                                            border: '1px solid',
                                            borderColor: isSelected ? '#ec489940' : '#f1f5f9',
                                            background: isSelected ? '#ec48990a' : '#f8fafc',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {/* Play / Pause button */}
                                        <button
                                            onClick={() => togglePlay(track)}
                                            style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: isCurrentPlaying ? '#ec4899' : '#ffffff',
                                                border: '1px solid #e2e8f0',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: isCurrentPlaying ? '#ffffff' : '#ec4899',
                                                cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                                            }}
                                        >
                                            {isCurrentPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} style={{ marginLeft: '2px' }} fill="currentColor" />}
                                        </button>

                                        {/* Track Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {track.name}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                                                {track.artist} • <span style={{ color: '#ec4899', fontWeight: 500 }}>{track.genre}</span>
                                            </div>
                                        </div>

                                        {/* Duration */}
                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {isCurrentPlaying && <Volume2 size={12} style={{ color: '#ec4899', animation: 'pulse 1s infinite' }} />}
                                            {track.duration}
                                        </div>

                                        {/* Select Button */}
                                        <button
                                            onClick={() => handleSelect(track)}
                                            style={{
                                                padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
                                                background: isSelected ? '#10b981' : '#ffffff',
                                                border: '1px solid',
                                                borderColor: isSelected ? '#10b981' : '#e2e8f0',
                                                color: isSelected ? '#ffffff' : '#0f172a',
                                                cursor: 'pointer', transition: 'all 0.2s',
                                                display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0
                                            }}
                                        >
                                            {isSelected ? (
                                                <>
                                                    <Check size={12} /> Selected
                                                </>
                                            ) : 'Select'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
};

export default MusicLibraryModal;
