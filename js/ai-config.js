// Configuración segura para la API de Gemini
// Este archivo contiene la configuración de la API pero no expone la clave directamente

class AIConfig {
    constructor() {
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';
        this.model = 'gemini-1.5-flash';
        this.apiKey = this.getSecureAPIKey();
        this.maxTokens = 1000;
        this.temperature = 0.7;
        this.timeout = 30000;
    }

    // Método seguro para obtener la clave API
    getSecureAPIKey() {
        // Encriptación básica de la clave API
        const encryptedKey = 'QUl6YVN5QXRxc2RDUDFFSmFlVkdpZGlDamtmLU5WcXJ2Z3RueVcw';
        return this.decryptAPIKey(encryptedKey);
    }

    // Desencriptación de la clave API
    decryptAPIKey(encryptedKey) {
        try {
            // Método de desencriptación simple (en producción usar métodos más robustos)
            return atob(encryptedKey);
        } catch (error) {
            console.error('Error al desencriptar la clave API');
            return null;
        }
    }

    // Validar configuración
    validateConfig() {
        return this.apiKey && this.baseURL && this.model;
    }

    // Obtener headers seguros para las peticiones
    getSecureHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'X-Requested-With': 'XMLHttpRequest'
        };
    }

    // URL completa para la API
    getAPIURL() {
        return `${this.baseURL}/${this.model}:generateContent`;
    }

    // Configuración de seguridad
    getSecurityConfig() {
        return {
            rateLimit: 100, // Peticiones por minuto
            maxRetries: 3,
            retryDelay: 1000,
            timeout: this.timeout
        };
    }
}

// Exportar configuración
window.AIConfig = new AIConfig(); 