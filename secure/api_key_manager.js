// Secure API Key Manager
// This module provides secure access to API keys with restricted permissions

class APIKeyManager {
    constructor() {
        // Private property to store the API key
        this._apiKey = null;
        this._initialized = false;
    }

    // Initialize the API key manager by loading the key from secure storage
    async initialize() {
        try {
            // In a real implementation, this would load from a secure server-side location
            // For this demo, we'll simulate loading from a secure file
            const response = await fetch('./secure/api_keys.json');
            const keys = await response.json();
            this._apiKey = keys.gemini_api_key;
            this._initialized = true;
            return true;
        } catch (error) {
            console.error('Failed to initialize API key manager:', error);
            return false;
        }
    }

    // Get the Gemini API key (only accessible through this secure method)
    getGeminiAPIKey() {
        if (!this._initialized) {
            throw new Error('APIKeyManager not initialized');
        }
        return this._apiKey;
    }

    // Check if the manager is initialized
    isInitialized() {
        return this._initialized;
    }
}

// Create a singleton instance
const apiKeyManager = new APIKeyManager();

// Export for use in other modules
export default apiKeyManager;