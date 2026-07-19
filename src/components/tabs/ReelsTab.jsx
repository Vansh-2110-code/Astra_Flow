import React from 'react';
import { X, Play, Info, Film, User, Image as ImageIcon, Music } from 'lucide-react';

const ReelsTab = ({
    uploadedMedia,
    currentMediaIndex,
    setCurrentMediaIndex,
    setUploadedMedia,
    fileInputRef,
    reelCover,
    setReelCover,
    setMediaLibraryTarget,
    setShowMediaLibrary,
    selectedTrack
}) => {
    const coverInputRef = React.useRef(null);

    const handleCoverUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setReelCover({
                id: Date.now() + Math.random(),
                file: file,
                url: reader.result,
                fromLibrary: false
            });
        };
        reader.readAsDataURL(file);
    };

    // Empty state
    if (uploadedMedia.length === 0) {
        return (
            <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    width: '280px', height: '500px', border: '1px dashed #d1d5db', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fdfdfd', cursor: 'pointer'
                }} onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon size={24} color="#9ca3af" strokeWidth={1.5} style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', lineHeight: '1.6' }}>
                        Drop a video here<br />
                        or <span style={{ textDecoration: 'underline', color: '#3b82f6' }}>browse</span>
                    </div>
                </div>
            </div>
        );
    }

    // Filled State
    return (
        <div style={{ padding: '24px 24px 0', display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'flex-start' }}>
            {/* Left: Video Preview */}
            <div style={{
                width: '280px', height: '500px',
                background: '#000',
                borderRadius: '12px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                flexShrink: 0
            }}>
                {uploadedMedia[currentMediaIndex]?.type?.startsWith('video/') ? (
                    <video
                        key={currentMediaIndex}
                        src={uploadedMedia[currentMediaIndex]?.url}
                        controls={false}
                        autoPlay
                        loop
                        muted
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                    />
                ) : (
                    <img
                        key={currentMediaIndex}
                        src={uploadedMedia[currentMediaIndex]?.url}
                        alt="Reels Media"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                    />
                )}

                {/* Top Left Icon */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={14} />
                    </div>
                </div>

                {/* Top Right Close Icon */}
                <div
                    onClick={() => {
                        const newMedia = uploadedMedia.filter((_, idx) => idx !== currentMediaIndex);
                        setUploadedMedia(newMedia);
                        if (currentMediaIndex >= newMedia.length) {
                            setCurrentMediaIndex(Math.max(0, newMedia.length - 1));
                        }
                    }}
                    style={{ position: 'absolute', top: '16px', right: '16px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', zIndex: 10 }}
                >
                    <X size={16} />
                </div>

                {/* Big Play Button Overlay (if video) */}
                {uploadedMedia[currentMediaIndex]?.type?.startsWith('video/') && (
                    <div style={{ position: 'absolute', color: 'rgba(255,255,255,0.9)', pointerEvents: 'none', zIndex: 5 }}>
                        <Play size={56} fill="currentColor" />
                    </div>
                )}

                {/* Bottom Left Music Overlay */}
                {selectedTrack && (
                    <div style={{
                        position: 'absolute', bottom: '46px', left: '16px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        color: 'white', fontSize: '11px', fontWeight: 500, zIndex: 10,
                        background: 'rgba(0,0,0,0.6)', padding: '6px 10px', borderRadius: '16px',
                        backdropFilter: 'blur(4px)', maxWidth: '80%'
                    }}>
                        <Music size={11} style={{ color: '#ec4899', animation: 'spin 4s linear infinite' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedTrack.artist} • {selectedTrack.name}
                        </span>
                        <style>{`
                            @keyframes spin {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                )}

                {/* Bottom Left Icon */}
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: 'white', zIndex: 10 }}>
                    <Film size={20} />
                </div>

                {/* Bottom Right Text */}
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: 'white', fontSize: '12px', fontWeight: 500, zIndex: 10, background: 'rgba(0,0,0,0.6)', padding: '6px 10px', borderRadius: '16px', backdropFilter: 'blur(4px)' }}>
                    <Info size={14} /> Desktop Instagram feed preview
                </div>
            </div>

            {/* Right: Reel Cover Page Selector */}
            <div style={{
                width: '240px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #e2e8f0',
                flexShrink: 0
            }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#334155' }}>Reel Cover Page</h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                    Add a custom cover thumbnail for your Reel. Ideal aspect ratio is 9:16.
                </p>

                {reelCover ? (
                    <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <img src={reelCover.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Reel Cover" />
                        <div
                            onClick={() => setReelCover(null)}
                            style={{
                                position: 'absolute', top: '8px', right: '8px',
                                width: '24px', height: '24px', borderRadius: '50%',
                                background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', zIndex: 20
                            }}
                        >
                            <X size={14} />
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => coverInputRef.current?.click()}
                        style={{
                            width: '100%', height: '200px', borderRadius: '8px', border: '1px dashed #cbd5e1',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            background: 'white', cursor: 'pointer', gap: '8px', color: '#64748b'
                        }}
                    >
                        <ImageIcon size={20} />
                        <span style={{ fontSize: '12px', fontWeight: 500 }}>Upload cover image</span>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button
                        onClick={() => coverInputRef.current?.click()}
                        style={{
                            flex: 1, padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px',
                            background: 'white', fontSize: '12px', fontWeight: 500, color: '#475569', cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        Browse file
                    </button>
                    <button
                        onClick={() => {
                            setMediaLibraryTarget('cover');
                            setShowMediaLibrary(true);
                        }}
                        style={{
                            flex: 1, padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px',
                            background: 'white', fontSize: '12px', fontWeight: 500, color: '#475569', cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        From Library
                    </button>
                </div>

                <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
};

export default ReelsTab;
