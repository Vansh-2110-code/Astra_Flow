/**
 * Social Media Image Rules
 * Definitions for standard aspect ratios and dimensions.
 */

export const PLATFORM_RATIOS = {
    Instagram: {
        square: "1 / 1",           // 1080x1080
        portrait: "4 / 5",         // 1080x1350
        landscape: "1.91 / 1",      // 1080x566
        story: "9 / 9",            // Display 9:9 (Original 9:16)
        default: "1 / 1",
        allowedFormats: ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'],
        validationRatios: ["1/1", "4/5", "1.91/1", "9/16"]
    },
    Facebook: {
        standard: "1.91 / 1",      // 1200x630
        landscape: "1.91 / 1",      // 1200x628
        square: "1 / 1",           // Profile Picture / Post
        cover: "2.7 / 1",          // 2037x754
        story: "9 / 9",            // Display 9:9 (Original 9:16)
        default: "1.91 / 1",
        allowedFormats: ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'],
        validationRatios: ["1.91/1", "1/1", "9/16"],
        minVideo: { width: 1280, height: 720 }
    },
    LinkedIn: {
        standard: "1.91 / 1",      // 1200x627
        square: "1 / 1",           // 1200x1200
        video: "16 / 9",           // 1920x1080
        default: "1.91 / 1",
        allowedFormats: ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'],
        validationRatios: ["1/1", "1.91/1", "16/9"]
    },
    YouTube: {
        standard: "16 / 9",
        default: "16 / 9",
        allowedFormats: ['video/mp4', 'video/quicktime', 'video/x-msvideo']
    },
    Pinterest: {
        standard: "2 / 3",
        default: "2 / 3",
        allowedFormats: ['image/jpeg', 'image/png']
    },
    TikTok: {
        standard: "9 / 9",         // Display 9:9 (Original 9:16)
        default: "9 / 9",
        allowedFormats: ['video/mp4', 'video/quicktime'],
        validationRatios: ["9/16"],
        minDimensions: { width: 720, height: 1280 },
        videoOnly: true
    },
    "X (Twitter)": {
        standard: "16 / 9",       // 1200x675
        square: "1 / 1",          // 1080x1080
        video: "16 / 9",          // 1280x720
        default: "16 / 9",
        allowedFormats: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
        validationRatios: ["16/9", "1/1"]
    }
};

/**
 * Returns the best fitting aspect ratio for a platform based on provided image dimensions.
 * @param {string} platform - Platform name
 * @param {string} type - Content type (Post, Story, Reel)
 * @param {number} width - Image width (optional)
 * @param {number} height - Image height (optional)
 * @returns {number} Aspect ratio
 */
export const getRecommendedRatio = (platform, type, width, height) => {
    const rules = PLATFORM_RATIOS[platform] || { default: 1 };

    // Type-specific overrides (Stories/Reels are usually 9:16)
    if (type === 'Story' || type === 'Reel') {
        return rules.story || 9 / 9;
    }

    if (!width || !height) return rules.default || 1;

    const imgRatio = width / height;

    // Special handling for Instagram
    if (platform === 'Instagram') {
        if (imgRatio > 1.2) return rules.landscape;
        if (imgRatio < 0.9) return rules.portrait;
        return rules.square;
    }

    // Default: return the closest standard ratio or just the default
    return rules.default || 1;
};

/**
 * Formats CSS aspect-ratio as a string.
 */
export const getAspectRatioStyles = (platform, type, width, height) => {
    const ratio = getRecommendedRatio(platform, type, width, height);
    return {
        aspectRatio: ratio.toString(),
        width: '100%',
        objectFit: 'cover',
        objectPosition: (type === 'Story' || type === 'Reel' || platform === 'TikTok') ? 'top' : 'center'
    };
};
