import React from 'react';
import { Plus, Image as ImageIcon, FileText, ChevronLeft, ChevronRight, X, StickyNote } from 'lucide-react';

const StoryTab = ({
    uploadedMedia,
    currentMediaIndex,
    setCurrentMediaIndex,
    slideDirection,
    setSlideDirection,
    fileInputRef,
    setUploadedMedia,
    setShowStickersPanel,
    isCarouselMode
}) => {
    // Hidden if in Carousel Edit Mode (though technically stories don't use it, safety first)
    if (isCarouselMode) return null;

    return (
        <>
            {/* Story Mode Empty Placeholder Area */}
            {uploadedMedia.length === 0 && (
                <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', overflow: 'hidden' }}>
                    {/* Left Box */}
                    <div style={{ width: '40px', height: '140px', border: '1px dashed #d1d5db', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', flexShrink: 0 }}>
                        <Plus size={16} />
                    </div>

                    {/* Center Main Story Box */}
                    <div style={{
                        width: '220px', height: '380px', border: '1px dashed #d1d5db', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fdfdfd', position: 'relative', flexShrink: 0
                    }}>
                        <ImageIcon size={24} color="#9ca3af" strokeWidth={1.5} style={{ marginBottom: '12px' }} />
                        <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', lineHeight: '1.6', padding: '0 20px' }}>
                            Drop media from <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#6b7280' }}>your library</span><br />
                            or <span onClick={() => fileInputRef.current?.click()} style={{ textDecoration: 'underline', cursor: 'pointer', color: '#6b7280' }}>from computer</span>
                        </div>

                        <div
                            onClick={() => setShowStickersPanel(true)}
                            style={{ position: 'absolute', bottom: '16px', left: '16px', background: '#1f2937', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                        >
                            <FileText size={14} />
                        </div>
                    </div>

                    {/* Right Box */}
                    <div style={{ width: '40px', height: '140px', border: '1px dashed #d1d5db', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', flexShrink: 0 }}>
                        <Plus size={16} />
                    </div>
                </div>
            )}

            {/* Story Mode Uploaded Area */}
            {uploadedMedia.length > 0 && (
                <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', overflow: 'hidden' }}>
                    {/* Left Box or Prev Arrow */}
                    <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                        {currentMediaIndex > 0 ? (
                            <div
                                onClick={() => { setSlideDirection('left'); setCurrentMediaIndex(prev => prev - 1); }}
                                style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', color: '#4b5563' }}
                            >
                                <ChevronLeft size={16} strokeWidth={2} />
                            </div>
                        ) : (
                            <div onClick={() => fileInputRef.current?.click()} style={{ width: '40px', height: '140px', border: '1px dashed #d1d5db', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', flexShrink: 0, cursor: 'pointer' }}>
                                <Plus size={16} />
                            </div>
                        )}
                    </div>

                    {/* Center Main Story Box (Filled) */}
                    <div style={{
                        width: '220px', height: '380px', borderRadius: '16px', display: 'flex', flexDirection: 'column',
                        background: '#000', position: 'relative', flexShrink: 0, overflow: 'hidden'
                    }}>
                        {/* The Image */}
                        {uploadedMedia[currentMediaIndex]?.type?.startsWith('video/') ? (
                            <video
                                key={currentMediaIndex}
                                src={uploadedMedia[currentMediaIndex]?.url}
                                autoPlay
                                loop
                                muted
                                style={{
                                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                                    animation: slideDirection === 'right' ? 'slideInRight 0.3s ease-out' : 'slideInLeft 0.3s ease-out'
                                }}
                            />
                        ) : (
                            <img
                                key={currentMediaIndex}
                                src={uploadedMedia[currentMediaIndex]?.url}
                                alt="Story Media"
                                style={{
                                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                                    animation: slideDirection === 'right' ? 'slideInRight 0.3s ease-out' : 'slideInLeft 0.3s ease-out'
                                }}
                            />
                        )}

                        {/* Top Progress Bars */}
                        <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', gap: '4px', zIndex: 10 }}>
                            {uploadedMedia.map((_, idx) => (
                                <div key={idx} style={{ flex: 1, height: '3px', background: idx === currentMediaIndex ? 'white' : 'rgba(255,255,255,0.4)', borderRadius: '2px' }} />
                            ))}
                        </div>

                        {/* Add Stickers Button */}
                        <div
                            onClick={() => setShowStickersPanel(true)}
                            style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(31, 41, 55, 0.85)', borderRadius: '20px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)', fontSize: '13px', fontWeight: 600, zIndex: 10 }}
                        >
                            <StickyNote size={14} /> Add stickers
                        </div>

                        {/* Remove Button */}
                        <div
                            onClick={() => {
                                const newMedia = uploadedMedia.filter((_, idx) => idx !== currentMediaIndex);
                                setUploadedMedia(newMedia);
                                if (currentMediaIndex >= newMedia.length) {
                                    setCurrentMediaIndex(Math.max(0, newMedia.length - 1));
                                }
                            }}
                            style={{ position: 'absolute', top: '24px', right: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', zIndex: 10 }}
                        >
                            <X size={14} strokeWidth={2} />
                        </div>
                    </div>

                    {/* Right Box or Next Arrow */}
                    <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                        {currentMediaIndex < uploadedMedia.length - 1 ? (
                            <div
                                onClick={() => { setSlideDirection('right'); setCurrentMediaIndex(prev => prev + 1); }}
                                style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', color: '#4b5563' }}
                            >
                                <ChevronRight size={16} strokeWidth={2} />
                            </div>
                        ) : (
                            <div onClick={() => fileInputRef.current?.click()} style={{ width: '40px', height: '140px', border: '1px dashed #d1d5db', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', flexShrink: 0, cursor: 'pointer' }}>
                                <Plus size={16} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default StoryTab;
