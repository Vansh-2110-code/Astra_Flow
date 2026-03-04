import React from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, Download, X } from 'lucide-react';

const PostTab = ({
    uploadedMedia,
    currentMediaIndex,
    setCurrentMediaIndex,
    slideDirection,
    setSlideDirection,
    hoveredMedia,
    setHoveredMedia,
    setIsCarouselMode,
    setUploadedMedia,
    TooltipWrapper
}) => {
    if (uploadedMedia.length === 0) return null;

    return (
        <div
            style={{ padding: '24px 24px 0' }}
            onMouseEnter={() => setHoveredMedia(true)}
            onMouseLeave={() => setHoveredMedia(false)}
        >
            <div style={{ position: 'relative', width: '100%' }}>
                {/* Actual Image container with border radius and hidden overflow */}
                <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                    {uploadedMedia[currentMediaIndex]?.type?.startsWith('video/') ? (
                        <video
                            key={currentMediaIndex}
                            src={uploadedMedia[currentMediaIndex]?.url}
                            controls
                            style={{
                                width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block',
                                animation: slideDirection === 'right' ? 'slideInRight 0.3s ease-out' : 'slideInLeft 0.3s ease-out'
                            }}
                        />
                    ) : (
                        <img
                            key={currentMediaIndex}
                            src={uploadedMedia[currentMediaIndex]?.url}
                            alt="Uploaded Media"
                            style={{
                                width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block',
                                animation: slideDirection === 'right' ? 'slideInRight 0.3s ease-out' : 'slideInLeft 0.3s ease-out'
                            }}
                        />
                    )}
                </div>

                {/* Carousel Navigation Arrows */}
                {uploadedMedia.length > 1 && (
                    <>
                        {currentMediaIndex > 0 && (
                            <div
                                onClick={(e) => { e.stopPropagation(); setSlideDirection('left'); setCurrentMediaIndex(prev => prev - 1); }}
                                style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', background: 'rgba(31, 41, 55, 0.85)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', backdropFilter: 'blur(4px)', zIndex: 10 }}
                            >
                                <ChevronLeft size={16} strokeWidth={2} />
                            </div>
                        )}
                        {currentMediaIndex < uploadedMedia.length - 1 && (
                            <div
                                onClick={(e) => { e.stopPropagation(); setSlideDirection('right'); setCurrentMediaIndex(prev => prev + 1); }}
                                style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', background: 'rgba(31, 41, 55, 0.85)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', backdropFilter: 'blur(4px)', zIndex: 10 }}
                            >
                                <ChevronRight size={16} strokeWidth={2} />
                            </div>
                        )}
                    </>
                )}

                {/* Hover Top Action Bar */}
                {hoveredMedia && (
                    <div style={{
                        position: 'absolute', top: '10px', left: '10px', right: '10px',
                        display: 'flex', justifyContent: 'space-between', zIndex: 10
                    }}>
                        {/* Left Side Tools */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <TooltipWrapper id="carousel" title="Create or edit carousel">
                                <div
                                    onClick={() => setIsCarouselMode(true)}
                                    style={{ background: 'rgba(31, 41, 55, 0.85)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', backdropFilter: 'blur(4px)' }}
                                >
                                    <LayoutGrid size={15} strokeWidth={2} />
                                </div>
                            </TooltipWrapper>
                        </div>

                        {/* Right Side Tools */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <TooltipWrapper id="download" title="Download">
                                <div style={{ background: 'rgba(31, 41, 55, 0.85)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', backdropFilter: 'blur(4px)' }}>
                                    <Download size={15} strokeWidth={2} />
                                </div>
                            </TooltipWrapper>
                            <TooltipWrapper id="remove" title="Remove media">
                                <div
                                    onClick={() => {
                                        setUploadedMedia([]);
                                        setIsCarouselMode(false);
                                        setCurrentMediaIndex(0);
                                    }}
                                    style={{ background: 'rgba(31, 41, 55, 0.85)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', backdropFilter: 'blur(4px)' }}
                                >
                                    <X size={15} strokeWidth={2} />
                                </div>
                            </TooltipWrapper>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostTab;
