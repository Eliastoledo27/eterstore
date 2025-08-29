// Sistema de seguridad para la API de IA
// Protección contra ataques y abuso

class SecurityManager {
    constructor() {
        this.blockedIPs = new Set();
        this.suspiciousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+=/i,
            /eval\(/i,
            /document\./i,
            /window\./i,
            /alert\(/i,
            /confirm\(/i,
            /prompt\(/i
        ];
        this.requestHistory = new Map();
        this.maxRequestsPerMinute = 50;
        this.blockDuration = 300000; // 5 minutos
    }

    // Validar petición
    validateRequest(prompt, options = {}) {
        const validation = {
            isValid: true,
            errors: []
        };

        // Validar prompt
        if (!this.validatePrompt(prompt)) {
            validation.isValid = false;
            validation.errors.push('Prompt contiene contenido malicioso');
        }

        // Validar opciones
        if (!this.validateOptions(options)) {
            validation.isValid = false;
            validation.errors.push('Opciones de petición inválidas');
        }

        // Verificar rate limiting
        if (!this.checkRateLimit()) {
            validation.isValid = false;
            validation.errors.push('Límite de peticiones excedido');
        }

        return validation;
    }

    // Validar prompt
    validatePrompt(prompt) {
        if (!prompt || typeof prompt !== 'string') {
            return false;
        }

        // Verificar longitud
        if (prompt.length > 2000) {
            return false;
        }

        // Verificar patrones sospechosos
        for (const pattern of this.suspiciousPatterns) {
            if (pattern.test(prompt)) {
                this.logSuspiciousActivity('Patrón sospechoso detectado', prompt);
                return false;
            }
        }

        // Verificar contenido inapropiado
        if (this.containsInappropriateContent(prompt)) {
            this.logSuspiciousActivity('Contenido inapropiado detectado', prompt);
            return false;
        }

        return true;
    }

    // Validar opciones
    validateOptions(options) {
        const validOptions = ['temperature', 'maxTokens', 'topP', 'topK'];
        
        for (const [key, value] of Object.entries(options)) {
            if (!validOptions.includes(key)) {
                return false;
            }

            // Validar rangos
            if (key === 'temperature' && (value < 0 || value > 2)) {
                return false;
            }

            if (key === 'maxTokens' && (value < 1 || value > 2000)) {
                return false;
            }

            if (key === 'topP' && (value < 0 || value > 1)) {
                return false;
            }

            if (key === 'topK' && (value < 1 || value > 100)) {
                return false;
            }
        }

        return true;
    }

    // Verificar contenido inapropiado
    containsInappropriateContent(text) {
        const inappropriateWords = [
            'hack', 'crack', 'exploit', 'vulnerability', 'sql injection',
            'xss', 'csrf', 'ddos', 'malware', 'virus', 'trojan',
            'password', 'admin', 'root', 'sudo', 'privilege'
        ];

        const lowerText = text.toLowerCase();
        return inappropriateWords.some(word => lowerText.includes(word));
    }

    // Rate limiting
    checkRateLimit() {
        const now = Date.now();
        const clientId = this.getClientId();
        
        if (!this.requestHistory.has(clientId)) {
            this.requestHistory.set(clientId, []);
        }

        const requests = this.requestHistory.get(clientId);
        
        // Limpiar peticiones antiguas (más de 1 minuto)
        const recentRequests = requests.filter(time => now - time < 60000);
        
        if (recentRequests.length >= this.maxRequestsPerMinute) {
            this.logSuspiciousActivity('Rate limit excedido', { clientId, requests: recentRequests.length });
            return false;
        }

        // Agregar nueva petición
        recentRequests.push(now);
        this.requestHistory.set(clientId, recentRequests);
        
        return true;
    }

    // Obtener ID del cliente
    getClientId() {
        // Usar una combinación de características del navegador
        const userAgent = navigator.userAgent;
        const language = navigator.language;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        return btoa(`${userAgent}-${language}-${timezone}`).substring(0, 20);
    }

    // Registrar actividad sospechosa
    logSuspiciousActivity(type, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: type,
            data: data,
            clientId: this.getClientId(),
            userAgent: navigator.userAgent
        };

        console.warn('Actividad sospechosa detectada:', logEntry);
        
        // En producción, enviar a sistema de logging
        this.sendSecurityLog(logEntry);
    }

    // Enviar log de seguridad
    sendSecurityLog(logEntry) {
        // En producción, enviar a sistema de monitoreo
        // Por ahora, solo guardar en localStorage
        try {
            const securityLogs = JSON.parse(localStorage.getItem('eterStore_security_logs') || '[]');
            securityLogs.push(logEntry);
            
            // Mantener solo los últimos 100 logs
            if (securityLogs.length > 100) {
                securityLogs.splice(0, securityLogs.length - 100);
            }
            
            localStorage.setItem('eterStore_security_logs', JSON.stringify(securityLogs));
        } catch (error) {
            console.error('Error guardando log de seguridad:', error);
        }
    }

    // Obtener estadísticas de seguridad
    getSecurityStats() {
        return {
            totalRequests: Array.from(this.requestHistory.values()).flat().length,
            blockedRequests: 0, // Implementar contador
            suspiciousActivities: 0, // Implementar contador
            rateLimitInfo: {
                maxRequestsPerMinute: this.maxRequestsPerMinute,
                blockDuration: this.blockDuration
            }
        };
    }

    // Limpiar historial
    clearHistory() {
        this.requestHistory.clear();
    }
}

// Middleware de seguridad para el servicio de IA
class SecurityMiddleware {
    constructor(aiService) {
        this.aiService = aiService;
        this.securityManager = new SecurityManager();
    }

    // Wrapper seguro para generateContent
    async generateContent(prompt, options = {}) {
        // Validar petición
        const validation = this.securityManager.validateRequest(prompt, options);
        
        if (!validation.isValid) {
            return {
                success: false,
                content: 'Petición rechazada por motivos de seguridad.',
                error: validation.errors.join(', '),
                timestamp: Date.now()
            };
        }

        try {
            // Llamar al servicio de IA original
            const result = await this.aiService.generateContent(prompt, options);
            
            // Validar respuesta
            if (result.success && !this.securityManager.validatePrompt(result.content)) {
                return {
                    success: false,
                    content: 'Respuesta filtrada por motivos de seguridad.',
                    error: 'Contenido inapropiado en la respuesta',
                    timestamp: Date.now()
                };
            }

            return result;

        } catch (error) {
            this.securityManager.logSuspiciousActivity('Error en servicio de IA', error.message);
            throw error;
        }
    }

    // Obtener estadísticas
    getStats() {
        return {
            aiStats: this.aiService.getStats(),
            securityStats: this.securityManager.getSecurityStats()
        };
    }
}

// Exportar middleware de seguridad
window.SecurityMiddleware = SecurityMiddleware; 