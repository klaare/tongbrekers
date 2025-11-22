/**
 * Tering Tongbrekers - Main Application
 * Orchestrates all modules and handles UI updates
 */

import { generateTongbreker, validateApiKey } from './gemini.js';
import {
    getTongbrekers,
    saveTongbreker,
    generateId,
    hasApiKey,
    getApiKey,
    saveApiKey
} from './storage.js';
import { speak, stop, isTTSSupported, isSpeaking } from './tts.js';
import { shareWithFeedback, isShareSupported } from './share.js';

// DOM Elements
let generateBtn;
let tongbrekersList;
let apiKeySection;
let apiKeyInput;
let saveApiKeyBtn;

// State
let currentPlayingId = null;

/**
 * Initialize the app
 */
function init() {
    // Get DOM elements
    generateBtn = document.getElementById('generateBtn');
    tongbrekersList = document.getElementById('tongbrekersList');
    apiKeySection = document.getElementById('apiKeySection');
    apiKeyInput = document.getElementById('apiKeyInput');
    saveApiKeyBtn = document.getElementById('saveApiKeyBtn');

    // Check API key
    if (!hasApiKey()) {
        showApiKeySection();
    }

    // Event listeners
    generateBtn.addEventListener('click', handleGenerate);
    saveApiKeyBtn.addEventListener('click', handleSaveApiKey);

    // Load and render existing tongbrekers
    renderTongbrekers();

    console.log('🔥 Tering Tongbrekers app geladen!');
}

/**
 * Show API key input section
 */
function showApiKeySection() {
    apiKeySection.style.display = 'block';
}

/**
 * Hide API key input section
 */
function hideApiKeySection() {
    apiKeySection.style.display = 'none';
}

/**
 * Handle saving API key
 */
function handleSaveApiKey() {
    const key = apiKeyInput.value.trim();

    if (!key) {
        showError('Voer een API key in');
        return;
    }

    if (!validateApiKey(key)) {
        showError('Ongeldige API key formaat. Gemini keys beginnen met "AIza"');
        return;
    }

    saveApiKey(key);
    hideApiKeySection();
    apiKeyInput.value = '';
    showSuccess('API key opgeslagen! 🎉');
}

/**
 * Handle generate button click
 */
async function handleGenerate() {
    // Check API key
    const apiKey = getApiKey();
    if (!apiKey) {
        showApiKeySection();
        showError('API key vereist. Plak je Gemini API key hieronder.');
        return;
    }

    // Disable button and show loader
    setGenerating(true);

    try {
        // Generate tongbreker
        const text = await generateTongbreker(apiKey);

        // Create tongbreker object
        const tongbreker = {
            id: generateId(),
            text: text,
            created_at: new Date().toISOString()
        };

        // Save to localStorage
        saveTongbreker(tongbreker);

        // Re-render list
        renderTongbrekers();

        // Success feedback
        showSuccess('Tongbreker gegenereerd! 🔥');
    } catch (error) {
        console.error('Generation error:', error);
        showError(error.message || 'AI struikelde over zijn eigen tong...');
    } finally {
        setGenerating(false);
    }
}

/**
 * Set generating state
 */
function setGenerating(isGenerating) {
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoader = generateBtn.querySelector('.btn-loader');

    if (isGenerating) {
        generateBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
    } else {
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

/**
 * Render all tongbrekers
 */
function renderTongbrekers() {
    const tongbrekers = getTongbrekers();

    if (tongbrekers.length === 0) {
        tongbrekersList.innerHTML = '<p class="empty-state">Nog geen tongbrekers gegenereerd. Klik op de knop hierboven! 👆</p>';
        return;
    }

    tongbrekersList.innerHTML = tongbrekers
        .map(tongbreker => createTongbrekerHTML(tongbreker))
        .join('');

    // Attach event listeners to action buttons
    attachActionListeners();
}

/**
 * Create HTML for a single tongbreker
 */
function createTongbrekerHTML(tongbreker) {
    const date = new Date(tongbreker.created_at);
    const formattedDate = formatDate(date);

    return `
        <div class="tongbreker-item" data-id="${tongbreker.id}">
            <p class="tongbreker-text">${escapeHtml(tongbreker.text)}</p>
            <div class="tongbreker-meta">
                <span class="tongbreker-date">${formattedDate}</span>
                <div class="tongbreker-actions">
                    <button
                        class="action-btn play-btn"
                        data-id="${tongbreker.id}"
                        title="Speel af"
                        ${!isTTSSupported() ? 'disabled' : ''}
                    >
                        ▶️
                    </button>
                    <button
                        class="action-btn share-btn"
                        data-id="${tongbreker.id}"
                        title="${isShareSupported() ? 'Delen' : 'Kopieer'}"
                    >
                        ${isShareSupported() ? '📤' : '📋'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Attach event listeners to action buttons
 */
function attachActionListeners() {
    // Play buttons
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', handlePlay);
    });

    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', handleShare);
    });
}

/**
 * Handle play button click
 */
async function handlePlay(event) {
    const btn = event.currentTarget;
    const id = btn.dataset.id;
    const tongbrekers = getTongbrekers();
    const tongbreker = tongbrekers.find(t => t.id === id);

    if (!tongbreker) return;

    // If already playing this one, stop it
    if (currentPlayingId === id && isSpeaking()) {
        stop();
        btn.textContent = '▶️';
        currentPlayingId = null;
        return;
    }

    // Stop any current speech
    stop();

    // Reset all play buttons
    document.querySelectorAll('.play-btn').forEach(b => {
        b.textContent = '▶️';
    });

    // Update button to show playing
    btn.textContent = '⏸️';
    currentPlayingId = id;

    try {
        await speak(tongbreker.text, { rate: 0.85 });
        btn.textContent = '▶️';
        currentPlayingId = null;
    } catch (error) {
        console.error('TTS error:', error);
        showError('Audio afspelen mislukt');
        btn.textContent = '▶️';
        currentPlayingId = null;
    }
}

/**
 * Handle share button click
 */
async function handleShare(event) {
    const btn = event.currentTarget;
    const id = btn.dataset.id;
    const tongbrekers = getTongbrekers();
    const tongbreker = tongbrekers.find(t => t.id === id);

    if (!tongbreker) return;

    await shareWithFeedback(tongbreker);
}

/**
 * Show error message
 */
function showError(message) {
    // Remove existing error if any
    const existing = document.querySelector('.error-message');
    if (existing) existing.remove();

    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    // Insert after generate section
    const generateSection = document.querySelector('.generate-section');
    generateSection.insertAdjacentElement('afterend', errorDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Show success message
 */
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 255, 136, 0.9);
        color: #0a0a0a;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = message;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-in reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 2000);
}

/**
 * Format date to readable string
 */
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Zojuist';
    if (minutes < 60) return `${minutes}m geleden`;
    if (hours < 24) return `${hours}u geleden`;
    if (days < 7) return `${days}d geleden`;

    return date.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'short'
    });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
