/**
 * Admin Panel Enhanced JavaScript - Tienda Éter
 * Funcionalidades mejoradas para el panel de administración
 */

// Configuración global
const ADMIN_CONFIG = {
    apiEndpoint: '/api/admin',
    refreshInterval: 30000, // 30 segundos
    maxNotifications: 5,
    animationDuration: 300,
    storeName: 'Éter Store',
    storeSlogan: 'Calzados Premium en Mar del Plata',
    currency: 'ARS',
    locale: 'es-AR',
    timezone: 'America/Argentina/Buenos_Aires',
    maxProductsPerPage: 12,
    maxOrdersPerPage: 20,
    lowStockThreshold: 5,
    autoSaveInterval: 30000,
    backupInterval: 24 * 60 * 60 * 1000,
    maxFileSize: 5 * 1024 * 1024,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    defaultProductImage: '/images/placeholder-product.jpg',
    whatsappNumber: '+54 223 502 5196',
    businessHours: {
        monday: { open: '09:00', close: '19:00' },
        tuesday: { open: '09:00', close: '19:00' },
        wednesday: { open: '09:00', close: '19:00' },
        thursday: { open: '09:00', close: '19:00' },
        friday: { open: '09:00', close: '19:00' },
        saturday: { open: '09:00', close: '17:00' },
        sunday: { open: '10:00', close: '16:00' }
    },
    features: {
        enableAnalytics: true,
        enableNotifications: true,
        enableAutoBackup: true,
        enableAIAssistant: true,
        enableXMLImport: true,
        enableBulkOperations: true,
        enableAdvancedFilters: true
    },
    security: {
        sessionTimeout: 30 * 60 * 1000,
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000,
        requireStrongPassword: true,
        enableTwoFactor: false
    },
    performance: {
        enableLazyLoading: true,
        enableImageOptimization: true,
        enableCaching: true,
        cacheExpiration: 60 * 60 * 1000
    }
};}

// Estado global de la aplicación
const AppState = {
    currentUser: null,
    isAuthenticated: false,
    currentTab: 'dashboard',
    notifications: [],
    loadingStates: {},
    dataCache: {}
};

// Utilidades
const Utils = {
    // Debounce para optimizar llamadas
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle para limitar frecuencia de llamadas
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Formatear fechas
    formatDate(date) {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    // Formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Validar email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Sanitizar HTML
    sanitizeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
};

// Sistema de notificaciones mejorado
class NotificationManager {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.notifications = [];
    }

    show(message, type = 'info', duration = 5000) {
        const id = Utils.generateId();
        const notification = {
            id,
            message,
            type,
            timestamp: Date.now()
        };

        this.notifications.push(notification);
        this.render(notification);

        if (duration > 0) {
            setTimeout(() => this.remove(id), duration);
        }

        return id;
    }

    render(notification) {
        const element = document.createElement('div');
        element.className = `notification ${notification.type}`;
        element.id = `notification-${notification.id}`;

        const icon = this.getIconForType(notification.type);

        element.innerHTML = `
            <i class="fas ${icon}" aria-hidden="true"></i>
            <span>${Utils.sanitizeHtml(notification.message)}</span>
            <button class="notification-close" onclick="notificationManager.remove('${notification.id}')" aria-label="Cerrar notificación">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        `;

        this.container.appendChild(element);

        // Limitar número de notificaciones
        if (this.notifications.length > ADMIN_CONFIG.maxNotifications) {
            const oldest = this.notifications.shift();
            this.remove(oldest.id);
        }
    }

    remove(id) {
        const element = document.getElementById(`notification-${id}`);
        if (element) {
            element.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                element.remove();
                this.notifications = this.notifications.filter(n => n.id !== id);
            }, 300);
        }
    }

    getIconForType(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    clear() {
        this.notifications.forEach(n => this.remove(n.id));
    }
}

// Gestor de carga mejorado
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loadingStates = new Map();
    }

    show(identifier = 'global') {
        if (identifier === 'global') {
            this.loadingScreen.classList.remove('hidden');
        } else {
            this.loadingStates.set(identifier, true);
            this.updateLoadingState(identifier);
        }
    }

    hide(identifier = 'global') {
        if (identifier === 'global') {
            this.loadingScreen.classList.add('hidden');
        } else {
            this.loadingStates.set(identifier, false);
            this.updateLoadingState(identifier);
        }
    }

    updateLoadingState(identifier) {
        const element = document.querySelector(`[data-loading="${identifier}"]`);
        if (element) {
            const isLoading = this.loadingStates.get(identifier);
            if (isLoading) {
                element.classList.add('loading');
                element.innerHTML = '<div class="spinner"></div>';
            } else {
                element.classList.remove('loading');
                // Restaurar contenido original si existe
                const originalContent = element.getAttribute('data-original-content');
                if (originalContent) {
                    element.innerHTML = originalContent;
                }
            }
        }
    }

    async withLoading(identifier, asyncFunction) {
        try {
            this.show(identifier);
            const result = await asyncFunction();
            return result;
        } finally {
            this.hide(identifier);
        }
    }
}

// Gestor de pestañas mejorado
class TabManager {
    constructor() {
        this.currentTab = 'dashboard';
        this.tabPanels = new Map();
        this.init();
    }

    init() {
        // Mapear pestañas y paneles
        document.querySelectorAll('.nav-link').forEach(link => {
            const tabName = link.getAttribute('data-tab');
            const panel = document.getElementById(`${tabName}Panel`);
            if (panel) {
                this.tabPanels.set(tabName, { link, panel });
            }
        });

        // Event listeners
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = link.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1': this.switchTab('dashboard'); break;
                    case '2': this.switchTab('hero'); break;
                    case '3': this.switchTab('products'); break;
                    case '4': this.switchTab('orders'); break;
                    case '5': this.switchTab('content'); break;
                    case '6': this.switchTab('analytics'); break;
                    case '7': this.switchTab('settings'); break;
                }
            }
        });
    }

    switchTab(tabName) {
        if (!this.tabPanels.has(tabName)) return;

        // Actualizar estado
        const previousTab = this.currentTab;
        this.currentTab = tabName;
        AppState.currentTab = tabName;

        // Actualizar navegación
        this.tabPanels.get(previousTab)?.link.classList.remove('active');
        this.tabPanels.get(tabName).link.classList.add('active');

        // Actualizar paneles
        this.tabPanels.get(previousTab)?.panel.classList.remove('active');
        this.tabPanels.get(tabName).panel.classList.add('active');

        // Cargar contenido si es necesario
        this.loadTabContent(tabName);

        // Actualizar URL sin recargar
        history.pushState({ tab: tabName }, '', `#${tabName}`);

        // Notificar cambio
        this.onTabChange(tabName);
    }

    async loadTabContent(tabName) {
        const panel = this.tabPanels.get(tabName).panel;

        // Verificar si ya está cargado
        if (panel.dataset.loaded === 'true') return;

        try {
            await loadingManager.withLoading(tabName, async () => {
                switch(tabName) {
                    case 'dashboard':
                        await this.loadDashboard();
                        break;
                    case 'products':
                        await this.loadProducts();
                        break;
                    case 'orders':
                        await this.loadOrders();
                        break;
                    case 'analytics':
                        await this.loadAnalytics();
                        break;
                    case 'settings':
                        await this.loadSettings();
                        break;
                }
            });

            panel.dataset.loaded = 'true';
        } catch (error) {
            console.error(`Error loading tab ${tabName}:`, error);
            notificationManager.show(`Error al cargar ${tabName}`, 'error');
        }
    }

    async loadDashboard() {
        // Simular carga de datos del dashboard
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Actualizar métricas
        document.getElementById('totalProducts').textContent = '24';
        document.getElementById('pendingOrders').textContent = '8';
        document.getElementById('monthlySales').textContent = '$12,450';
        document.getElementById('newCustomers').textContent = '15';
    }

    async loadProducts() {
        // Implementar carga de productos
        const productsContent = document.getElementById('productsContent');
        productsContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box" aria-hidden="true"></i>
                <h3>Gestionar Productos</h3>
                <p>Aquí podrás administrar tu catálogo de productos</p>
                <button class="btn btn-primary" onclick="showAddProductModal()">
                    <i class="fas fa-plus" aria-hidden="true"></i>
                    Agregar Producto
                </button>
            </div>
        `;
    }

    async loadOrders() {
        // Implementar carga de pedidos
        const ordersContent = document.getElementById('ordersContent');
        ordersContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                <h3>Gestionar Pedidos</h3>
                <p>Aquí podrás administrar los pedidos de tus clientes</p>
            </div>
        `;
    }

    async loadAnalytics() {
        // Implementar carga de analytics
        const analyticsContent = document.getElementById('analyticsContent');
        analyticsContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-bar" aria-hidden="true"></i>
                <h3>Analytics y Reportes</h3>
                <p>Aquí podrás ver el rendimiento de tu tienda</p>
            </div>
        `;
    }

    async loadSettings() {
        // Implementar carga de configuración
        const settingsContent = document.getElementById('settingsContent');
        settingsContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-cog" aria-hidden="true"></i>
                <h3>Configuración del Sistema</h3>
                <p>Aquí podrás personalizar la configuración de tu tienda</p>
            </div>
        `;
    }

    onTabChange(tabName) {
        // Evento personalizado para cambios de pestaña
        const event = new CustomEvent('tabChange', {
            detail: { tabName, previousTab: AppState.currentTab }
        });
        document.dispatchEvent(event);
    }
}

// Gestor de autenticación mejorado
class AuthManager {
    constructor() {
        this.authModal = document.getElementById('authModal');
        this.authForm = document.getElementById('authForm');
        this.init();
    }

    init() {
        // Event listeners
        this.authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen()) {
                this.closeModal();
            }
        });

        // Verificar autenticación al cargar
        this.checkAuthStatus();
    }

    async handleLogin() {
        const formData = new FormData(this.authForm);
        const username = formData.get('username');
        const password = formData.get('password');

        // Validación básica
        if (!username || !password) {
            notificationManager.show('Por favor completa todos los campos', 'error');
            return;
        }

        try {
            await loadingManager.withLoading('auth', async () => {
                // Simular llamada a API
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Validación simple (en producción usar API real)
                if (username === 'admin' && password === 'admin123') {
                    this.loginSuccess({ username, role: 'admin' });
                } else {
                    throw new Error('Credenciales inválidas');
                }
            });
        } catch (error) {
            notificationManager.show(error.message, 'error');
        }
    }

    loginSuccess(userData) {
        AppState.currentUser = userData;
        AppState.isAuthenticated = true;

        // Guardar en localStorage
        localStorage.setItem('adminUser', JSON.stringify(userData));

        // Cerrar modal y mostrar app
        this.closeModal();
        this.showApp();

        // Actualizar UI
        document.getElementById('userName').textContent = userData.username;

        notificationManager.show(`Bienvenido, ${userData.username}!`, 'success');
    }

    logout() {
        AppState.currentUser = null;
        AppState.isAuthenticated = false;

        // Limpiar localStorage
        localStorage.removeItem('adminUser');

        // Mostrar modal de login
        this.showModal();
        this.hideApp();

        notificationManager.show('Sesión cerrada correctamente', 'info');
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('adminUser');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                this.loginSuccess(userData);
            } catch (error) {
                localStorage.removeItem('adminUser');
                this.showModal();
            }
        } else {
            this.showModal();
        }
    }

    showModal() {
        this.authModal.setAttribute('aria-hidden', 'false');
        document.getElementById('username').focus();
    }

    closeModal() {
        this.authModal.setAttribute('aria-hidden', 'true');
    }

    isModalOpen() {
        return this.authModal.getAttribute('aria-hidden') === 'false';
    }

    showApp() {
        document.getElementById('adminApp').style.display = 'flex';
    }

    hideApp() {
        document.getElementById('adminApp').style.display = 'none';
    }
}

// Gestor de sidebar mejorado
class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('adminSidebar');
        this.toggleBtn = document.getElementById('sidebarToggle');
        this.isCollapsed = false;
        this.init();
    }

    init() {
        this.toggleBtn.addEventListener('click', () => {
            this.toggle();
        });

        // Responsive: colapsar en móviles
        this.handleResize();
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Cerrar en móviles al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 &&
                !this.sidebar.contains(e.target) &&
                !this.toggleBtn.contains(e.target)) {
                this.collapse();
            }
        });
    }

    toggle() {
        this.isCollapsed = !this.isCollapsed;
        this.updateSidebar();
    }

    expand() {
        this.isCollapsed = false;
        this.updateSidebar();
    }

    collapse() {
        this.isCollapsed = true;
        this.updateSidebar();
    }

    updateSidebar() {
        this.sidebar.classList.toggle('collapsed', this.isCollapsed);
        document.body.classList.toggle('sidebar-collapsed', this.isCollapsed);

        // Actualizar aria-label
        this.toggleBtn.setAttribute('aria-expanded', !this.isCollapsed);
    }

    handleResize() {
        if (window.innerWidth <= 768) {
            this.collapse();
        } else {
            this.expand();
        }
    }
}

// Inicialización de la aplicación
class AdminApp {
    constructor() {
        this.notificationManager = new NotificationManager();
        this.loadingManager = new LoadingManager();
        this.tabManager = new TabManager();
        this.authManager = new AuthManager();
        this.sidebarManager = new SidebarManager();

        this.init();
    }

    init() {
        // Event listeners globales
        this.setupGlobalEvents();

        // Inicializar componentes
        this.initializeComponents();

        // Cargar datos iniciales
        this.loadInitialData();

        console.log('Admin Panel initialized successfully');
    }

    setupGlobalEvents() {
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.authManager.logout();
        });

        // Ver sitio
        document.getElementById('viewSiteBtn').addEventListener('click', () => {
            window.open('/', '_blank');
        });

        // Refresh dashboard
        document.getElementById('refreshDashboard').addEventListener('click', () => {
            this.refreshDashboard();
        });

        // Refresh orders
        document.getElementById('refreshOrdersBtn').addEventListener('click', () => {
            this.refreshOrders();
        });

        // Guardar cambios
        document.getElementById('saveHeroBtn').addEventListener('click', () => {
            this.saveHeroChanges();
        });

        document.getElementById('saveContentBtn').addEventListener('click', () => {
            this.saveContentChanges();
        });

        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.saveSettingsChanges();
        });

        // Exportar analytics
        document.getElementById('exportAnalyticsBtn').addEventListener('click', () => {
            this.exportAnalytics();
        });
    }

    initializeComponents() {
        // Inicializar tooltips
        this.initializeTooltips();

        // Inicializar formularios
        this.initializeForms();

        // Inicializar tablas
        this.initializeTables();
    }

    initializeTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.classList.add('tooltip');
        });
    }

    initializeForms() {
        // Validación de formularios
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    this.showFormErrors(form);
                }
            });
        });
    }

    initializeTables() {
        // Hacer tablas responsive
        document.querySelectorAll('.table').forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-container';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    }

    async loadInitialData() {
        try {
            await this.loadingManager.withLoading('global', async () => {
                // Cargar datos iniciales del dashboard
                await this.tabManager.loadDashboard();
            });
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.notificationManager.show('Error al cargar datos iniciales', 'error');
        }
    }

    async refreshDashboard() {
        try {
            await this.loadingManager.withLoading('dashboard', async () => {
                await this.tabManager.loadDashboard();
            });
            this.notificationManager.show('Dashboard actualizado', 'success');
        } catch (error) {
            this.notificationManager.show('Error al actualizar dashboard', 'error');
        }
    }

    async refreshOrders() {
        try {
            await this.loadingManager.withLoading('orders', async () => {
                await this.tabManager.loadOrders();
            });
            this.notificationManager.show('Pedidos actualizados', 'success');
        } catch (error) {
            this.notificationManager.show('Error al actualizar pedidos', 'error');
        }
    }

    async saveHeroChanges() {
        try {
            await this.loadingManager.withLoading('hero', async () => {
                // Simular guardado
                await new Promise(resolve => setTimeout(resolve, 1000));
            });
            this.notificationManager.show('Cambios guardados correctamente', 'success');
        } catch (error) {
            this.notificationManager.show('Error al guardar cambios', 'error');
        }
    }

    async saveContentChanges() {
        try {
            await this.loadingManager.withLoading('content', async () => {
                // Simular guardado
                await new Promise(resolve => setTimeout(resolve, 1000));
            });
            this.notificationManager.show('Contenido guardado correctamente', 'success');
        } catch (error) {
            this.notificationManager.show('Error al guardar contenido', 'error');
        }
    }

    async saveSettingsChanges() {
        try {
            await this.loadingManager.withLoading('settings', async () => {
                // Simular guardado
                await new Promise(resolve => setTimeout(resolve, 1000));
            });
            this.notificationManager.show('Configuración guardada correctamente', 'success');
        } catch (error) {
            this.notificationManager.show('Error al guardar configuración', 'error');
        }
    }

    async exportAnalytics() {
        try {
            await this.loadingManager.withLoading('export', async () => {
                // Simular exportación
                await new Promise(resolve => setTimeout(resolve, 2000));
            });
            this.notificationManager.show('Reporte exportado correctamente', 'success');
        } catch (error) {
            this.notificationManager.show('Error al exportar reporte', 'error');
        }
    }

    showFormErrors(form) {
        const errors = form.querySelectorAll(':invalid');
        errors.forEach(field => {
            const errorElement = document.getElementById(`${field.id}Error`);
            if (errorElement) {
                errorElement.textContent = field.validationMessage;
            }
        });
    }
}

// Variables globales para compatibilidad
let notificationManager;
let loadingManager;
let tabManager;
let authManager;
let sidebarManager;

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new AdminApp();

    // Hacer disponibles globalmente
    notificationManager = app.notificationManager;
    loadingManager = app.loadingManager;
    tabManager = app.tabManager;
    authManager = app.authManager;
    sidebarManager = app.sidebarManager;

    // Función global para mostrar secciones
    window.showSection = (sectionName) => {
        tabManager.switchTab(sectionName);
    };
});

// Función global para mostrar modales
window.showAddProductModal = () => {
    notificationManager.show('Funcionalidad de agregar producto en desarrollo', 'info');
};

// Manejar navegación del navegador
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.tab) {
        tabManager.switchTab(event.state.tab);
    }
});
