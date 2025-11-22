/**
 * LocalStorage Management
 * Handles saving, loading, and managing tongbrekers history
 */

const STORAGE_KEYS = {
    TONGBREKERS: 'tering_tongbrekers_history',
    API_KEY: 'gemini_api_key',
    MAX_ITEMS: 50
};

/**
 * Save a new tongbreker to localStorage
 * @param {Object} tongbreker - { id, text, created_at }
 */
export function saveTongbreker(tongbreker) {
    try {
        const history = getTongbrekers();
        history.unshift(tongbreker); // Add to beginning

        // Limit to MAX_ITEMS
        const trimmed = history.slice(0, STORAGE_KEYS.MAX_ITEMS);

        localStorage.setItem(STORAGE_KEYS.TONGBREKERS, JSON.stringify(trimmed));
        return true;
    } catch (error) {
        console.error('Error saving tongbreker:', error);
        return false;
    }
}

/**
 * Get all tongbrekers from localStorage
 * @returns {Array} Array of tongbreker objects
 */
export function getTongbrekers() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.TONGBREKERS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading tongbrekers:', error);
        return [];
    }
}

/**
 * Delete a tongbreker by ID
 * @param {string} id - Tongbreker ID
 */
export function deleteTongbreker(id) {
    try {
        const history = getTongbrekers();
        const filtered = history.filter(t => t.id !== id);
        localStorage.setItem(STORAGE_KEYS.TONGBREKERS, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error deleting tongbreker:', error);
        return false;
    }
}

/**
 * Clear all tongbrekers
 */
export function clearAllTongbrekers() {
    try {
        localStorage.removeItem(STORAGE_KEYS.TONGBREKERS);
        return true;
    } catch (error) {
        console.error('Error clearing tongbrekers:', error);
        return false;
    }
}

/**
 * Save Gemini API key
 * @param {string} apiKey - The API key
 */
export function saveApiKey(apiKey) {
    try {
        localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
        return true;
    } catch (error) {
        console.error('Error saving API key:', error);
        return false;
    }
}

/**
 * Get Gemini API key
 * @returns {string|null} The API key or null
 */
export function getApiKey() {
    try {
        return localStorage.getItem(STORAGE_KEYS.API_KEY);
    } catch (error) {
        console.error('Error getting API key:', error);
        return null;
    }
}

/**
 * Check if API key exists
 * @returns {boolean}
 */
export function hasApiKey() {
    const key = getApiKey();
    return key !== null && key.trim().length > 0;
}

/**
 * Generate a unique ID
 * @returns {string} UUID v4
 */
export function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
