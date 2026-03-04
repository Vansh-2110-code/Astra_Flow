import React from 'react';
import { X, Image as ImageIcon, Folder } from 'lucide-react';

const CarouselEditView = ({
    uploadedMedia,
    setUploadedMedia,
    currentMediaIndex,
    setCurrentMediaIndex,
    setIsCarouselMode,
    fileInputRef
}) => {
    if (!uploadedMedia || uploadedMedia.length === 0) return null;

    return (
        <div style={{ padding: '24px 24px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingBottom: '8px' }}>
                {/* Mapping through uploaded images */}
                {uploadedMedia.map((media) => (
                    <div key={media.id} style={{ minWidth: '120px', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                        {media.type?.startsWith('video/') ? (
                            <video src={media.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <img src={media.url} alt="Carousel Item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        {/* Remove individual image from array */}
                        <div
                            onClick={() => {
                                const newMedia = uploadedMedia.filter(m => m.id !== media.id);
                                setUploadedMedia(newMedia);
                                if (newMedia.length === 0) setIsCarouselMode(false);
                                if (currentMediaIndex >= newMedia.length) {
                                    setCurrentMediaIndex(Math.max(0, newMedia.length - 1));
                                }
                            }}
                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px', cursor: 'pointer', color: 'white' }}
                        >
                            <X size={12} />
                        </div>
                    </div>
                ))}

                {/* Add from computer box */}
                <div style={{
                    minWidth: '120px', width: '120px', height: '120px', borderRadius: '8px',
                    border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    padding: '12px', textAlign: 'center', gap: '8px'
                }} onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon size={20} color="#6b7280" strokeWidth={1.5} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563', lineHeight: '1.2' }}>Add more from computer</span>
                </div>

                {/* Add from media library box */}
                <div style={{
                    minWidth: '120px', width: '120px', height: '120px', borderRadius: '8px',
                    border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    padding: '12px', textAlign: 'center', gap: '8px'
                }}>
                    <Folder size={20} color="#6b7280" strokeWidth={1.5} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563', lineHeight: '1.2' }}>Add more from media library</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>Drag & drop to reorder</span>
                <button
                    onClick={() => setIsCarouselMode(false)}
                    style={{
                        background: '#0A66C2', color: 'white', border: 'none', borderRadius: '6px',
                        padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                    }}
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default CarouselEditView;
