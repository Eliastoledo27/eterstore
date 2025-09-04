/**
 * Admin Utilities Module - Common helper functions
 * Validation, formatting, storage, and shared operations
 */

const AdminUtils = {
    /**
     * Validation utilities
     */
    validation: {
        /**
         * Validate email format
         */
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        /**
         * Validate phone number (Chilean format)
         */
        isValidPhone(phone) {
            const phoneRegex = /^(\+56)?[2-9]\d{8}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        },

        /**
         * Validate price format
         */
        isValidPrice(price) {
            const priceRegex = /^\d+(\.\d{1,2})?$/;
            return priceRegex.test(price) && parseFloat(price) >= 0;
        },

        /**
         * Validate stock quantity
         */
        isValidStock(stock) {
            return Number.isInteger(Number(stock)) && Number(stock) >= 0;
        },

        /**
         * Validate URL format
         */
        isValidUrl(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        /**
         * Validate required fields
         */
        validateRequired(fields) {
            const errors = [];
            
            Object.entries(fields).forEach(([key, value]) => {
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    errors.push(`El campo ${key} es requerido`);
                }
            });
            
            return errors;
        },

        /**
         * Validate product data
         */
        validateProduct(product) {
            const errors = [];
            
            // Required fields
            const requiredFields = {
                'nombre': product.nombre,
                'categoria': product.categoria,
                'precio': product.precio,
                'descripcion': product.descripcion
            };
            
            errors.push(...this.validateRequired(requiredFields));
            
            // Price validation
            if (product.precio && !this.isValidPrice(product.precio)) {
                errors.push('El precio debe ser un número válido');
            }
            
            // Stock validation
            if (product.stock !== undefined && !this.isValidStock(product.stock)) {
                errors.push('El stock debe ser un número entero positivo');
            }
            
            // Image URL validation
            if (product.imagen && !this.isValidUrl(product.imagen)) {
                errors.push('La URL de la imagen no es válida');
            }
            
            return errors;
        },

        /**
         * Validate order data
         */
        validateOrder(order) {
            const errors = [];
            
            // Required fields
            const requiredFields = {
                'número': order.numero,
                'cliente': order.cliente?.nombre,
                'email': order.cliente?.email,
                'productos': order.productos
            };
            
            errors.push(...this.validateRequired(requiredFields));
            
            // Email validation
            if (order.cliente?.email && !this.isValidEmail(order.cliente.email)) {
                errors.push('El email del cliente no es válido');
            }
            
            // Phone validation
            if (order.cliente?.telefono && !this.isValidPhone(order.cliente.telefono)) {
                errors.push('El teléfono del cliente no es válido');
            }
            
            // Products validation
            if (!Array.isArray(order.productos) || order.productos.length === 0) {
                errors.push('El pedido debe tener al menos un producto');
            }
            
            return errors;
        }
    },

    /**
     * Formatting utilities
     */
    format: {
        /**
         * Format currency (Chilean Peso)
         */
        currency(amount, options = {}) {
            const defaults = {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            };
            
            const config = { ...defaults, ...options };
            
            try {
                return new Intl.NumberFormat('es-CL', config).format(amount);
            } catch (error) {
                return `$${amount.toLocaleString()}`;
            }
        },

        /**
         * Format number with thousands separator
         */
        number(num, decimals = 0) {
            try {
                return new Intl.NumberFormat('es-CL', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                }).format(num);
            } catch (error) {
                return num.toLocaleString();
            }
        },

        /**
         * Format date
         */
        date(date, options = {}) {
            const defaults = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            
            const config = { ...defaults, ...options };
            
            try {
                const dateObj = typeof date === 'string' ? new Date(date) : date;
                return new Intl.DateTimeFormat('es-CL', config).format(dateObj);
            } catch (error) {
                return date.toString();
            }
        },

        /**
         * Format datetime
         */
        datetime(date, options = {}) {
            const defaults = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            
            const config = { ...defaults, ...options };
            
            try {
                const dateObj = typeof date === 'string' ? new Date(date) : date;
                return new Intl.DateTimeFormat('es-CL', config).format(dateObj);
            } catch (error) {
                return date.toString();
            }
        },

        /**
         * Format relative time
         */
        relativeTime(date) {
            const now = new Date();
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            const diffInSeconds = Math.floor((now - dateObj) / 1000);
            
            if (diffInSeconds < 60) return 'Hace un momento';
            
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
            
            const diffInHours = Math.floor(diffInMinutes / 60);
            if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
            
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
            
            return this.date(dateObj);
        },

        /**
         * Format file size
         */
        fileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        /**
         * Format percentage
         */
        percentage(value, decimals = 1) {
            return `${value.toFixed(decimals)}%`;
        },

        /**
         * Truncate text
         */
        truncate(text, length = 50, suffix = '...') {
            if (!text || text.length <= length) return text;
            return text.substring(0, length) + suffix;
        },

        /**
         * Capitalize first letter
         */
        capitalize(text) {
            if (!text) return text;
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        },

        /**
         * Format slug for SEO
         */
        slug(text) {
            return text
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-') // Replace multiple hyphens with single
                .trim('-'); // Remove leading/trailing hyphens
        }
    },

    /**
     * Storage utilities
     */
    storage: {
        /**
         * Get item from localStorage with error handling
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error(`Error getting ${key} from localStorage:`, error);
                return defaultValue;
            }
        },

        /**
         * Set item in localStorage with error handling
         */
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error(`Error setting ${key} in localStorage:`, error);
                return false;
            }
        },

        /**
         * Remove item from localStorage
         */
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error(`Error removing ${key} from localStorage:`, error);
                return false;
            }
        },

        /**
         * Clear all localStorage
         */
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Error clearing localStorage:', error);
                return false;
            }
        },

        /**
         * Get storage usage
         */
        getUsage() {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            return total;
        },

        /**
         * Export all data
         */
        exportAll() {
            const data = {};
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    try {
                        data[key] = JSON.parse(localStorage[key]);
                    } catch {
                        data[key] = localStorage[key];
                    }
                }
            }
            return data;
        },

        /**
         * Import data
         */
        importAll(data) {
            try {
                Object.entries(data).forEach(([key, value]) => {
                    this.set(key, value);
                });
                return true;
            } catch (error) {
                console.error('Error importing data:', error);
                return false;
            }
        }
    },

    /**
     * DOM utilities
     */
    dom: {
        /**
         * Create element with attributes and content
         */
        createElement(tag, attributes = {}, content = '') {
            const element = document.createElement(tag);
            
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'dataset') {
                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                        element.dataset[dataKey] = dataValue;
                    });
                } else {
                    element.setAttribute(key, value);
                }
            });
            
            if (content) {
                if (typeof content === 'string') {
                    element.innerHTML = content;
                } else {
                    element.appendChild(content);
                }
            }
            
            return element;
        },

        /**
         * Add event listener with cleanup
         */
        addListener(element, event, handler, options = {}) {
            element.addEventListener(event, handler, options);
            
            // Return cleanup function
            return () => {
                element.removeEventListener(event, handler, options);
            };
        },

        /**
         * Show element with animation
         */
        show(element, animation = 'fadeIn') {
            element.style.display = '';
            element.classList.add(animation);
            
            setTimeout(() => {
                element.classList.remove(animation);
            }, 300);
        },

        /**
         * Hide element with animation
         */
        hide(element, animation = 'fadeOut') {
            element.classList.add(animation);
            
            setTimeout(() => {
                element.style.display = 'none';
                element.classList.remove(animation);
            }, 300);
        },

        /**
         * Toggle element visibility
         */
        toggle(element) {
            if (element.style.display === 'none') {
                this.show(element);
            } else {
                this.hide(element);
            }
        },

        /**
         * Scroll to element smoothly
         */
        scrollTo(element, options = {}) {
            const defaults = {
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            };
            
            element.scrollIntoView({ ...defaults, ...options });
        },

        /**
         * Get element position
         */
        getPosition(element) {
            const rect = element.getBoundingClientRect();
            return {
                top: rect.top + window.pageYOffset,
                left: rect.left + window.pageXOffset,
                width: rect.width,
                height: rect.height
            };
        },

        /**
         * Check if element is in viewport
         */
        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    },

    /**
     * Array utilities
     */
    array: {
        /**
         * Remove duplicates from array
         */
        unique(array, key = null) {
            if (key) {
                const seen = new Set();
                return array.filter(item => {
                    const value = item[key];
                    if (seen.has(value)) {
                        return false;
                    }
                    seen.add(value);
                    return true;
                });
            }
            return [...new Set(array)];
        },

        /**
         * Group array by key
         */
        groupBy(array, key) {
            return array.reduce((groups, item) => {
                const group = item[key];
                groups[group] = groups[group] || [];
                groups[group].push(item);
                return groups;
            }, {});
        },

        /**
         * Sort array by multiple keys
         */
        sortBy(array, keys) {
            return array.sort((a, b) => {
                for (let key of keys) {
                    let direction = 1;
                    if (key.startsWith('-')) {
                        direction = -1;
                        key = key.substring(1);
                    }
                    
                    if (a[key] < b[key]) return -1 * direction;
                    if (a[key] > b[key]) return 1 * direction;
                }
                return 0;
            });
        },

        /**
         * Paginate array
         */
        paginate(array, page, pageSize) {
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            
            return {
                data: array.slice(startIndex, endIndex),
                pagination: {
                    currentPage: page,
                    pageSize: pageSize,
                    totalItems: array.length,
                    totalPages: Math.ceil(array.length / pageSize),
                    hasNext: endIndex < array.length,
                    hasPrev: page > 1
                }
            };
        },

        /**
         * Search array
         */
        search(array, query, fields) {
            if (!query) return array;
            
            const searchTerm = query.toLowerCase();
            
            return array.filter(item => {
                return fields.some(field => {
                    const value = this.getNestedValue(item, field);
                    return value && value.toString().toLowerCase().includes(searchTerm);
                });
            });
        },

        /**
         * Get nested object value
         */
        getNestedValue(obj, path) {
            return path.split('.').reduce((current, key) => {
                return current && current[key] !== undefined ? current[key] : null;
            }, obj);
        }
    },

    /**
     * File utilities
     */
    file: {
        /**
         * Read file as text
         */
        readAsText(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = e => reject(e);
                reader.readAsText(file);
            });
        },

        /**
         * Read file as data URL
         */
        readAsDataURL(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = e => reject(e);
                reader.readAsDataURL(file);
            });
        },

        /**
         * Download data as file
         */
        download(data, filename, type = 'application/json') {
            const blob = new Blob([data], { type });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            
            URL.revokeObjectURL(url);
        },

        /**
         * Convert to CSV
         */
        toCSV(data, headers = null) {
            if (!Array.isArray(data) || data.length === 0) {
                return '';
            }
            
            const csvHeaders = headers || Object.keys(data[0]);
            const csvRows = [csvHeaders.join(',')];
            
            data.forEach(row => {
                const values = csvHeaders.map(header => {
                    const value = row[header] || '';
                    // Escape commas and quotes
                    return `"${value.toString().replace(/"/g, '""')}"`;
                });
                csvRows.push(values.join(','));
            });
            
            return csvRows.join('\n');
        },

        /**
         * Parse CSV
         */
        parseCSV(csv) {
            const lines = csv.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const data = [];
            
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim()) {
                    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                    const row = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index] || '';
                    });
                    data.push(row);
                }
            }
            
            return data;
        }
    },

    /**
     * URL utilities
     */
    url: {
        /**
         * Get URL parameters
         */
        getParams() {
            const params = new URLSearchParams(window.location.search);
            const result = {};
            for (let [key, value] of params) {
                result[key] = value;
            }
            return result;
        },

        /**
         * Set URL parameter
         */
        setParam(key, value) {
            const url = new URL(window.location);
            url.searchParams.set(key, value);
            window.history.replaceState({}, '', url);
        },

        /**
         * Remove URL parameter
         */
        removeParam(key) {
            const url = new URL(window.location);
            url.searchParams.delete(key);
            window.history.replaceState({}, '', url);
        },

        /**
         * Get hash without #
         */
        getHash() {
            return window.location.hash.substring(1);
        },

        /**
         * Set hash
         */
        setHash(hash) {
            window.location.hash = hash;
        }
    },

    /**
     * Debounce function
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Generate unique ID
     */
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Deep clone object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            Object.keys(obj).forEach(key => {
                clonedObj[key] = this.deepClone(obj[key]);
            });
            return clonedObj;
        }
    },

    /**
     * Merge objects deeply
     */
    deepMerge(target, source) {
        const result = { ...target };
        
        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        });
        
        return result;
    },

    /**
     * Check if object is empty
     */
    isEmpty(obj) {
        if (obj == null) return true;
        if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
        return Object.keys(obj).length === 0;
    },

    /**
     * Wait for specified time
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Retry function with exponential backoff
     */
    async retry(fn, maxAttempts = 3, baseDelay = 1000) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (attempt === maxAttempts) {
                    throw lastError;
                }
                
                const delay = baseDelay * Math.pow(2, attempt - 1);
                await this.wait(delay);
            }
        }
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                return true;
            } catch (fallbackError) {
                console.error('Failed to copy text:', fallbackError);
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    },

    /**
     * Get browser info
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        const browsers = {
            chrome: /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor),
            firefox: /Firefox/.test(ua),
            safari: /Safari/.test(ua) && /Apple Computer/.test(navigator.vendor),
            edge: /Edg/.test(ua),
            ie: /Trident/.test(ua)
        };
        
        const browser = Object.keys(browsers).find(key => browsers[key]) || 'unknown';
        
        return {
            name: browser,
            userAgent: ua,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    },

    /**
     * Check if device is mobile
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Get device info
     */
    getDeviceInfo() {
        return {
            isMobile: this.isMobile(),
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            touchSupport: 'ontouchstart' in window
        };
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminUtils;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.AdminUtils = AdminUtils;
}