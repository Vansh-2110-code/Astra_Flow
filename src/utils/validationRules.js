
import { PLATFORM_RATIOS } from './mediaRules';

/**
 * Validates a media file against platform-specific rules.
 * @param {File} file - The file to validate.
 * @param {string} platform - The platform name (Instagram, Facebook, etc.)
 * @returns {Promise<{isValid: boolean, error: string | null}>}
 */
export const validateMedia = async (file, platform) => {
    const rules = PLATFORM_RATIOS[platform];
    if (!rules) return { isValid: true, error: null }; // No rules defined for this platform

    // 1. Format Validation
    if (rules.allowedFormats && !rules.allowedFormats.includes(file.type)) {
        return {
            isValid: false,
            error: `${platform} does not support ${file.type.split('/')[1].toUpperCase()} files.`
        };
    }

    // 2. Video Only Validation (TikTok)
    if (rules.videoOnly && !file.type.startsWith('video/')) {
        return { isValid: false, error: `${platform} only allows vertical videos.` };
    }

    // 3. Dimension & Aspect Ratio Validation
    try {
        const dims = await getMediaDimensions(file);
        const { width, height } = dims;
        const ratio = width / height;

        // Check Minimum Dimensions
        if (rules.minDimensions) {
            if (width < rules.minDimensions.width || height < rules.minDimensions.height) {
                return {
                    isValid: false,
                    error: `${platform} requires at least ${rules.minDimensions.width}x${rules.minDimensions.height} resolution.`
                };
            }
        }

        // Check Video Minimums (Facebook)
        if (file.type.startsWith('video/') && rules.minVideo) {
            if (width < rules.minVideo.width || height < rules.minVideo.height) {
                return {
                    isValid: false,
                    error: `${platform} video requires at least ${rules.minVideo.width}x${rules.minVideo.height} resolution.`
                };
            }
        }

        // Check Aspect Ratios
        if (rules.validationRatios) {
            const isRatioValid = rules.validationRatios.some(r => {
                const [w, h] = r.split('/').map(Number);
                const targetRatio = w / h;
                // Allow a small tolerance (0.05) for aspect ratio calculation
                return Math.abs(ratio - targetRatio) < 0.05;
            });

            if (!isRatioValid) {
                const ratioLabels = rules.validationRatios.join(', ');
                return {
                    isValid: false,
                    error: `${platform} requires one of these aspect ratios: ${ratioLabels}. Your file is ${width}x${height} (~${ratio.toFixed(2)}:1).`
                };
            }
        }

        return { isValid: true, error: null };
    } catch {
        // If we can't read dimensions (e.g. PDF), and it's allowed, pass it
        if (file.type === 'application/pdf' && rules.allowedFormats.includes('application/pdf')) {
            return { isValid: true, error: null };
        }
        return { isValid: false, error: "Could not read media dimensions." };
    }
};

/**
 * Helper to get dimensions of image or video files.
 */
const getMediaDimensions = (file) => {
    return new Promise((resolve, reject) => {
        if (file.type.startsWith('image/')) {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.onloadedmetadata = () => resolve({ width: video.videoWidth, height: video.videoHeight });
            video.onerror = reject;
            video.src = URL.createObjectURL(file);
        } else {
            reject(new Error("Unsupported media type for dimension check"));
        }
    });
};
