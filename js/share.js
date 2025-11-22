/**
 * Web Share API Module
 * Handles sharing tongbrekers via the native share sheet
 */

/**
 * Check if Web Share API is supported
 * @returns {boolean}
 */
export function isShareSupported() {
    return 'share' in navigator;
}

/**
 * Share a tongbreker using Web Share API
 * @param {Object} tongbreker - The tongbreker object { text, id }
 * @param {string} appUrl - The app URL (optional)
 * @returns {Promise<boolean>}
 */
export async function shareTongbreker(tongbreker, appUrl = window.location.href) {
    if (!isShareSupported()) {
        // Fallback to clipboard
        return copyToClipboard(tongbreker.text);
    }

    try {
        const shareData = {
            title: '🔥 Tering Tongbreker',
            text: tongbreker.text,
            url: appUrl
        };

        await navigator.share(shareData);
        return true;
    } catch (error) {
        // User cancelled or error occurred
        if (error.name === 'AbortError') {
            // User cancelled, this is fine
            return false;
        }

        console.error('Error sharing:', error);
        // Fallback to clipboard
        return copyToClipboard(tongbreker.text);
    }
}

/**
 * Copy text to clipboard (fallback for non-supporting browsers)
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
    try {
        // Modern Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);

        return successful;
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        return false;
    }
}

/**
 * Show a temporary notification
 * @param {string} message - The message to show
 * @param {number} duration - Duration in ms
 */
export function showNotification(message, duration = 2000) {
    // Remove existing notification if any
    const existing = document.querySelector('.share-notification');
    if (existing) {
        existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'share-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 255, 136, 0.9);
        color: #0a0a0a;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-in reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, duration);
}

/**
 * Share with fallback handling and user feedback
 * @param {Object} tongbreker - The tongbreker to share
 * @returns {Promise<void>}
 */
export async function shareWithFeedback(tongbreker) {
    const success = await shareTongbreker(tongbreker);

    if (success) {
        if (!isShareSupported()) {
            showNotification('📋 Gekopieerd naar klembord!');
        }
        // If share dialog was used, no notification needed
    } else {
        showNotification('❌ Delen mislukt', 2000);
    }
}
