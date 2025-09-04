/**
 * Admin Core Module - Main administration panel functionality
 * Handles initialization, authentication, navigation, and core features
 */

class AdminCore {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.loadingStates = new Map();
        this.eventListeners = new Map();
        this.modules = new Map();
        
        // Initialize core functionality
        this.init();
    }

    /**
     * Initialize the admin panel
     */
    async init() {
        try {
            // Show loading screen
            this.showLoadingScreen();
            
            // Check authentication status
            await this.checkAuthStatus();
            
            // Initialize UI components
            this.initializeUI();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load initial data
            await this.loadInitialData();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            console.log('✅ Admin panel initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize admin panel:', error);
            this.showError('Error al inicializar el panel de administración');
        }
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
    }

    /**
     * Check authentication status
     */
    async checkAuthStatus() {
        try {
            // Check for stored authentication
            const storedAuth = localStorage.getItem('admin_auth');
            const storedUser = localStorage.getItem('admin_user');
            
            if (storedAuth && storedUser) {
                const authData = JSON.parse(storedAuth);
                const userData = JSON.parse(storedUser);
                
                // Verify token is still valid (simple expiration check)
                if (authData.expires > Date.now()) {
                    this.isAuthenticated = true;
                    this.currentUser = userData;
                    this.showAdminPanel();
                    return;
                }
            }
            
            // Show authentication modal if not authenticated
            this.showAuthModal();
        } catch (error) {
            console.error('Error checking auth status:', error);
            this.showAuthModal();
        }
    }

    /**
     * Show authentication modal
     */
    showAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.add('show');
            
            // Focus on username field
            const usernameField = authModal.querySelector('#auth-username');
            if (usernameField) {
                setTimeout(() => usernameField.focus(), 100);
            }
        }
    }

    /**
     * Hide authentication modal
     */
    hideAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.remove('show');
        }
    }

    /**
     * Show admin panel
     */
    showAdminPanel() {
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
            adminPanel.classList.add('show');
        }
        this.hideAuthModal();
    }

    /**
     * Handle authentication
     */
    async authenticate(username, password) {
        try {
            // Show loading state
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                loginBtn.classList.add('loading');
                loginBtn.disabled = true;
            }

            // Simple authentication (in production, this should be server-side)
            const validCredentials = [
                { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
                { username: 'tienda', password: 'eter2024', role: 'admin', name: 'Tienda Éter' }
            ];

            const user = validCredentials.find(cred => 
                cred.username === username && cred.password === password
            );

            if (user) {
                // Set authentication data
                this.isAuthenticated = true;
                this.currentUser = {
                    username: user.username,
                    name: user.name,
                    role: user.role,
                    loginTime: new Date().toISOString()
                };

                // Store authentication data
                const authData = {
                    token: this.generateToken(),
                    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
                };

                localStorage.setItem('admin_auth', JSON.stringify(authData));
                localStorage.setItem('admin_user', JSON.stringify(this.currentUser));

                // Show success notification
                this.showNotification('Inicio de sesión exitoso', 'success');

                // Show admin panel
                this.showAdminPanel();

                // Update user info in header
                this.updateUserInfo();

                return true;
            } else {
                throw new Error('Credenciales inválidas');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            this.showNotification(error.message || 'Error de autenticación', 'error');
            return false;
        } finally {
            // Remove loading state
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
            }
        }
    }

    /**
     * Generate a simple token
     */
    generateToken() {
        return btoa(Date.now() + Math.random().toString(36));
    }

    /**
     * Update user info in header
     */
    updateUserInfo() {
        const userNameElement = document.getElementById('user-name');
        const userRoleElement = document.getElementById('user-role');
        
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.name;
        }
        
        if (userRoleElement && this.currentUser) {
            userRoleElement.textContent = this.currentUser.role;
        }
    }

    /**
     * Logout user
     */
    logout() {
        // Clear authentication data
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('admin_user');
        
        // Reset state
        this.isAuthenticated = false;
        this.currentUser = null;
        
        // Show notification
        this.showNotification('Sesión cerrada exitosamente', 'info');
        
        // Show auth modal
        this.showAuthModal();
        
        // Hide admin panel
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
            adminPanel.classList.remove('show');
        }
    }

    /**
     * Initialize UI components
     */
    initializeUI() {
        // Initialize sidebar navigation
        this.initializeSidebar();
        
        // Initialize modals
        this.initializeModals();
        
        // Initialize forms
        this.initializeForms();
        
        // Initialize tooltips
        this.initializeTooltips();
    }

    /**
     * Initialize sidebar navigation
     */
    initializeSidebar() {
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const section = item.dataset.section;
                if (section) {
                    this.navigateToSection(section);
                }
            });
        });
    }

    /**
     * Navigate to a specific section
     */
    navigateToSection(section) {
        // Update active sidebar item
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-section="${section}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update current section
        this.currentSection = section;
        
        // Load section data if needed
        this.loadSectionData(section);
        
        // Update URL hash
        window.location.hash = section;
    }

    /**
     * Load section-specific data
     */
    async loadSectionData(section) {
        try {
            switch (section) {
                case 'dashboard':
                    await this.loadDashboardData();
                    break;
                case 'productos':
                    await this.loadProductsData();
                    break;
                case 'pedidos':
                    await this.loadOrdersData();
                    break;
                case 'hero':
                    await this.loadHeroData();
                    break;
                case 'contenido':
                    await this.loadContentData();
                    break;
            }
        } catch (error) {
            console.error(`Error loading ${section} data:`, error);
            this.showNotification(`Error al cargar datos de ${section}`, 'error');
        }
    }

    /**
     * Load dashboard data
     */
    async loadDashboardData() {
        try {
            // Load products for metrics
            const products = await this.loadProducts();
            const orders = await this.loadOrders();
            
            // Update metrics
            this.updateMetric('total-products', products.length);
            this.updateMetric('pending-orders', orders.filter(o => o.estado === 'pendiente').length);
            this.updateMetric('monthly-sales', this.calculateMonthlySales(orders));
            this.updateMetric('new-customers', this.calculateNewCustomers(orders));
            
            // Update recent orders table
            this.updateRecentOrders(orders.slice(0, 5));
            
            // Update low stock products
            this.updateLowStockProducts(products.filter(p => p.stock < 5));
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    /**
     * Update metric display
     */
    updateMetric(metricId, value) {
        const element = document.getElementById(metricId);
        if (element) {
            // Animate number change
            const currentValue = parseInt(element.textContent) || 0;
            this.animateNumber(element, currentValue, value);
        }
    }

    /**
     * Animate number change
     */
    animateNumber(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const difference = end - start;
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (difference * progress));
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Authentication form
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            authForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const username = document.getElementById('auth-username').value;
                const password = document.getElementById('auth-password').value;
                
                await this.authenticate(username, password);
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Handle hash changes for navigation
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && hash !== this.currentSection) {
                this.navigateToSection(hash);
            }
        });

        // Handle initial hash
        const initialHash = window.location.hash.substring(1);
        if (initialHash) {
            this.navigateToSection(initialHash);
        }

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.focusSearch();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeActiveModal();
            }
        });
    }

    /**
     * Focus search input
     */
    focusSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    /**
     * Close active modal
     */
    closeActiveModal() {
        const activeModal = document.querySelector('.modal-overlay.show');
        if (activeModal) {
            activeModal.classList.remove('show');
        }
    }

    /**
     * Initialize modals
     */
    initializeModals() {
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal-overlay');
                if (modal) {
                    modal.classList.remove('show');
                }
            });
        });

        // Modal overlay clicks
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('show');
                }
            });
        });
    }

    /**
     * Initialize forms
     */
    initializeForms() {
        // Add form validation
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    /**
     * Validate form
     */
    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Este campo es requerido');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    /**
     * Initialize tooltips
     */
    initializeTooltips() {
        // Simple tooltip implementation
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    /**
     * Show tooltip
     */
    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.id = 'active-tooltip';
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        setTimeout(() => tooltip.classList.add('show'), 10);
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltip = document.getElementById('active-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    /**
     * Load initial data
     */
    async loadInitialData() {
        if (this.isAuthenticated) {
            await this.loadDashboardData();
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                ${this.getNotificationIcon(type)}
            </div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                ×
            </button>
        `;

        container.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    /**
     * Get notification icon
     */
    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    /**
     * Show error message
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Load products from localStorage
     */
    async loadProducts() {
        try {
            const products = localStorage.getItem('productos');
            return products ? JSON.parse(products) : [];
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    }

    /**
     * Load orders from localStorage
     */
    async loadOrders() {
        try {
            const orders = localStorage.getItem('pedidos');
            return orders ? JSON.parse(orders) : [];
        } catch (error) {
            console.error('Error loading orders:', error);
            return [];
        }
    }

    /**
     * Calculate monthly sales
     */
    calculateMonthlySales(orders) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return orders
            .filter(order => {
                const orderDate = new Date(order.fecha);
                return orderDate.getMonth() === currentMonth && 
                       orderDate.getFullYear() === currentYear;
            })
            .reduce((total, order) => total + (order.total || 0), 0);
    }

    /**
     * Calculate new customers
     */
    calculateNewCustomers(orders) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const uniqueCustomers = new Set();
        
        orders
            .filter(order => {
                const orderDate = new Date(order.fecha);
                return orderDate.getMonth() === currentMonth && 
                       orderDate.getFullYear() === currentYear;
            })
            .forEach(order => {
                if (order.cliente && order.cliente.email) {
                    uniqueCustomers.add(order.cliente.email);
                }
            });
        
        return uniqueCustomers.size;
    }

    /**
     * Update recent orders table
     */
    updateRecentOrders(orders) {
        const container = document.getElementById('recent-orders-list');
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay pedidos recientes</p>';
            return;
        }

        container.innerHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-info">
                    <strong>#${order.id}</strong>
                    <span class="text-muted">${order.cliente?.nombre || 'Cliente'}</span>
                </div>
                <div class="order-status">
                    <span class="badge ${order.estado}">${order.estado}</span>
                </div>
                <div class="order-total">
                    $${(order.total || 0).toLocaleString()}
                </div>
            </div>
        `).join('');
    }

    /**
     * Update low stock products
     */
    updateLowStockProducts(products) {
        const container = document.getElementById('low-stock-list');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = '<p class="text-muted">Todos los productos tienen stock suficiente</p>';
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="product-item">
                <div class="product-info">
                    <strong>${product.nombre}</strong>
                    <span class="text-muted">${product.categoria}</span>
                </div>
                <div class="product-stock">
                    <span class="badge ${product.stock === 0 ? 'danger' : 'warning'}">
                        ${product.stock} unidades
                    </span>
                </div>
            </div>
        `).join('');
    }
}

// Initialize admin core when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminCore = new AdminCore();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminCore;
}