// Servicio de IA mejorado con medidas de seguridad
// Integración segura con Google Gemini API

class AIService {
    constructor() {
        this.config = window.AIConfig;
        this.rateLimiter = new RateLimiter();
        this.requestQueue = [];
        this.isProcessing = false;
        this.cache = new Map();
        this.securityToken = this.generateSecurityToken();
    }

    // Generar token de seguridad único
    generateSecurityToken() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        return btoa(`${timestamp}-${random}-eter-store-ai`).replace(/[^a-zA-Z0-9]/g, '');
    }

    // Validar token de seguridad
    validateSecurityToken(token) {
        return token === this.securityToken;
    }

    // Rate limiting para prevenir abuso
    async checkRateLimit() {
        return await this.rateLimiter.checkLimit();
    }

    // Generar contenido con IA
    async generateContent(prompt, options = {}) {
        try {
            // Validar configuración
            if (!this.config.validateConfig()) {
                throw new Error('Configuración de IA no válida');
            }

            // Verificar rate limit
            if (!(await this.checkRateLimit())) {
                throw new Error('Límite de peticiones excedido. Inténtalo más tarde.');
            }

            // Sanitizar y validar prompt
            const sanitizedPrompt = this.sanitizePrompt(prompt);
            if (!sanitizedPrompt) {
                throw new Error('Prompt no válido');
            }

            // Verificar cache
            const cacheKey = this.generateCacheKey(sanitizedPrompt, options);
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            // Preparar petición
            const requestData = this.prepareRequest(sanitizedPrompt, options);

            // Realizar petición con retry
            const response = await this.makeSecureRequest(requestData);

            // Procesar respuesta
            const result = this.processResponse(response);

            // Guardar en cache
            this.cache.set(cacheKey, result);

            return result;

        } catch (error) {
            console.error('Error en generación de contenido:', error);
            return this.getFallbackResponse(error.message);
        }
    }

    // Sanitizar prompt para prevenir inyección
    sanitizePrompt(prompt) {
        if (!prompt || typeof prompt !== 'string') {
            return null;
        }

        // Remover caracteres peligrosos
        let sanitized = prompt
            .replace(/[<>]/g, '') // Remover tags HTML
            .replace(/javascript:/gi, '') // Remover javascript:
            .replace(/on\w+=/gi, '') // Remover event handlers
            .trim();

        // Limitar longitud
        if (sanitized.length > 2000) {
            sanitized = sanitized.substring(0, 2000);
        }

        return sanitized;
    }

    // Generar clave de cache
    generateCacheKey(prompt, options) {
        const optionsStr = JSON.stringify(options);
        return btoa(`${prompt}-${optionsStr}`).substring(0, 50);
    }

    // Preparar petición para la API
    prepareRequest(prompt, options) {
        const defaultOptions = {
            temperature: this.config.temperature,
            maxTokens: this.config.maxTokens,
            topP: 0.8,
            topK: 40
        };

        const finalOptions = { ...defaultOptions, ...options };

        return {
            contents: [{
                parts: [{
                    text: this.enhancePrompt(prompt)
                }]
            }],
            generationConfig: {
                temperature: finalOptions.temperature,
                maxOutputTokens: finalOptions.maxTokens,
                topP: finalOptions.topP,
                topK: finalOptions.topK
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };
    }

    // Mejorar prompt para mejores resultados
    enhancePrompt(prompt) {
        return `Eres un experto en marketing digital y creación de anuncios para una tienda de calzados premium llamada "Éter Store" en Mar del Plata, Argentina.

Contexto del negocio:
- Tienda de calzados premium
- Ubicada en Mar del Plata
- Enfoque en revendedores y clientes mayoristas
- Productos de alta calidad
- Precios en pesos argentinos (ARS)

Instrucciones:
- Genera contenido creativo y persuasivo
- Mantén un tono profesional pero accesible
- Incluye elementos de urgencia y exclusividad cuando sea apropiado
- Usa emojis estratégicamente
- Adapta el contenido para WhatsApp Business
- Mantén la información precisa y relevante

Prompt del usuario: ${prompt}

Por favor, genera contenido optimizado para anuncios de WhatsApp que sea efectivo para aumentar las ventas.`;
    }

    // Realizar petición segura con retry
    async makeSecureRequest(requestData) {
        const maxRetries = this.config.getSecurityConfig().maxRetries;
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

                const response = await fetch(this.config.getAPIURL(), {
                    method: 'POST',
                    headers: this.config.getSecureHeaders(),
                    body: JSON.stringify(requestData),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                return data;

            } catch (error) {
                lastError = error;
                
                if (attempt < maxRetries) {
                    await this.delay(this.config.getSecurityConfig().retryDelay * attempt);
                }
            }
        }

        throw lastError;
    }

    // Procesar respuesta de la API
    processResponse(response) {
        try {
            if (!response || !response.candidates || !response.candidates[0]) {
                throw new Error('Respuesta de API inválida');
            }

            const content = response.candidates[0].content;
            if (!content || !content.parts || !content.parts[0]) {
                throw new Error('Contenido de respuesta inválido');
            }

            const text = content.parts[0].text;
            
            // Validar contenido de seguridad
            if (this.containsInappropriateContent(text)) {
                throw new Error('Contenido inapropiado detectado');
            }

            return {
                success: true,
                content: text,
                timestamp: Date.now(),
                token: this.securityToken
            };

        } catch (error) {
            throw new Error(`Error procesando respuesta: ${error.message}`);
        }
    }

    // Verificar contenido inapropiado
    containsInappropriateContent(text) {
        const inappropriateWords = [
            'hack', 'crack', 'exploit', 'vulnerability', 'sql injection',
            'xss', 'csrf', 'ddos', 'malware', 'virus', 'trojan'
        ];

        const lowerText = text.toLowerCase();
        return inappropriateWords.some(word => lowerText.includes(word));
    }

    // Respuesta de fallback
    getFallbackResponse(errorMessage) {
        return {
            success: false,
            content: 'Lo siento, no pude generar contenido en este momento. Por favor, inténtalo más tarde.',
            error: errorMessage,
            timestamp: Date.now(),
            token: this.securityToken
        };
    }

    // Delay para retry
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Limpiar cache
    clearCache() {
        this.cache.clear();
    }

    // Obtener estadísticas
    getStats() {
        return {
            cacheSize: this.cache.size,
            rateLimitInfo: this.rateLimiter.getStats(),
            securityToken: this.securityToken.substring(0, 10) + '...'
        };
    }
}

// Rate Limiter para prevenir abuso
class RateLimiter {
    constructor() {
        this.requests = [];
        this.maxRequests = 100; // Máximo 100 peticiones por minuto
        this.windowMs = 60000; // Ventana de 1 minuto
    }

    async checkLimit() {
        const now = Date.now();
        
        // Limpiar peticiones antiguas
        this.requests = this.requests.filter(time => now - time < this.windowMs);
        
        // Verificar límite
        if (this.requests.length >= this.maxRequests) {
            return false;
        }
        
        // Agregar nueva petición
        this.requests.push(now);
        return true;
    }

    getStats() {
        return {
            currentRequests: this.requests.length,
            maxRequests: this.maxRequests,
            windowMs: this.windowMs
        };
    }
}

// Exportar servicio
window.AIService = new AIService(); 