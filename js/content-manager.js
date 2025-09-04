/**
 * Admin Panel Content Manager - Tienda Éter
 * Gestiona el contenido de cada sección y las vinculaciones entre archivos
 */

// Configuración específica de la tienda
const STORE_CONFIG = {
    name: 'Éter Store',
    slogan: 'Calzados Premium en Mar del Plata',
    website: {
        index: 'index.html',
        productos: 'productos.html',
        admin: 'admin.html'
    },
    contact: {
        phone: '+54 223 502 5196',
        email: 'equiporeveter@gmail.com',
        address: 'Mar del Plata, Buenos Aires, Argentina'
    },
    social: {
        whatsapp: 'https://wa.me/5492235025196',
        instagram: 'https://instagram.com/eterstore',
        facebook: 'https://facebook.com/eterstore'
    }
};

// Datos de ejemplo para las secciones
const SAMPLE_DATA = {
    products: [
        {
            id: 1,
            name: 'Oxford Formal Premium',
            category: 'Formal',
            price: 45000,
            stock: 15,
            image: 'images/products/formal-oxford.svg',
            status: 'active',
            featured: true
        },
        {
            id: 2,
            name: 'Mocasín Clásico',
            category: 'Casual',
            price: 38000,
            stock: 8,
            image: 'images/products/classic-moccasins.svg',
            status: 'active',
            featured: false
        },
        {
            id: 3,
            name: 'Botas de Cuero',
            category: 'Botas',
            price: 52000,
            stock: 3,
            image: 'images/products/leather-boots.svg',
            status: 'active',
            featured: true
        },
        {
            id: 4,
            name: 'Zapatillas Running',
            category: 'Deportivo',
            price: 35000,
            stock: 22,
            image: 'images/products/running-shoes.svg',
            status: 'active',
            featured: false
        }
    ],
    orders: [
        {
            id: 'ORD-001',
            customer: 'María González',
            email: 'maria@email.com',
            phone: '+54 223 123 4567',
            total: 45000,
            status: 'pending',
            date: '2024-01-15',
            items: [
                { product: 'Oxford Formal Premium', quantity: 1, price: 45000 }
            ]
        },
        {
            id: 'ORD-002',
            customer: 'Carlos Rodríguez',
            email: 'carlos@email.com',
            phone: '+54 223 987 6543',
            total: 87000,
            status: 'confirmed',
            date: '2024-01-14',
            items: [
                { product: 'Mocasín Clásico', quantity: 1, price: 38000 },
                { product: 'Botas de Cuero', quantity: 1, price: 52000 }
            ]
        },
        {
            id: 'ORD-003',
            customer: 'Ana Martínez',
            email: 'ana@email.com',
            phone: '+54 223 555 1234',
            total: 35000,
            status: 'shipped',
            date: '2024-01-13',
            items: [
                { product: 'Zapatillas Running', quantity: 1, price: 35000 }
            ]
        }
    ],
    hero: {
        title: 'Descubre el Lujo en Cada Paso',
        subtitle: 'Calzados Premium de Cuero Genuino',
        description: 'Experimenta la perfecta fusión entre elegancia y comodidad. Calzados artesanales diseñados para quienes valoran la excelencia y el estilo auténtico.',
        ctaText: 'Explorar Colección',
        ctaLink: 'productos.html',
        backgroundImage: 'images/hero/hero-shoes.svg',
        stats: [
            { number: '100%', label: 'Cuero Genuino' },
            { number: '24h', label: 'Envío Express' },
            { number: '5★', label: 'Calidad Premium' }
        ]
    },
    content: {
        about: {
            title: 'Sobre Éter Store',
            description: 'Somos una tienda especializada en calzados premium, comprometida con la calidad y el diseño exclusivo.',
            mission: 'Proporcionar calzados de la más alta calidad con un servicio excepcional.',
            vision: 'Ser la tienda líder en calzados premium de Mar del Plata.'
        },
        contact: {
            title: 'Información de Contacto',
            phone: STORE_CONFIG.contact.phone,
            email: STORE_CONFIG.contact.email,
            address: STORE_CONFIG.contact.address,
            hours: 'Lunes a Viernes: 9:00 - 19:00 | Sábados: 9:00 - 17:00'
        }
    }
};

// Gestor de contenido mejorado
class ContentManager {
    constructor() {
        this.currentData = { ...SAMPLE_DATA };
        this.init();
    }

    init() {
        // Vincular con archivos externos
        this.setupExternalLinks();

        // Cargar contenido inicial
        this.loadInitialContent();

        // Configurar event listeners
        this.setupEventListeners();
    }

    setupExternalLinks() {
        // Actualizar enlaces en el header
        const viewSiteBtn = document.getElementById('viewSiteBtn');
        if (viewSiteBtn) {
            viewSiteBtn.addEventListener('click', () => {
                window.open(STORE_CONFIG.website.index, '_blank');
            });
        }

        // Configurar enlaces de navegación
        this.updateNavigationLinks();
    }

    updateNavigationLinks() {
        // Enlaces en el sidebar para navegar a las páginas principales
        const navLinks = document.querySelectorAll('.nav-link[data-external]');
        navLinks.forEach(link => {
            const target = link.getAttribute('data-external');
            if (target && STORE_CONFIG.website[target]) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open(STORE_CONFIG.website[target], '_blank');
                });
            }
        });
    }

    loadInitialContent() {
        // Cargar contenido del dashboard
        this.loadDashboardContent();

        // Preparar contenido para otras secciones
        this.prepareSectionContent();
    }

    async loadDashboardContent() {
        try {
            // Simular carga de datos reales
            await this.loadMetrics();
            await this.loadRecentOrders();
            await this.loadLowStockProducts();
            await this.loadRecentActivity();
            await this.loadSystemAlerts();
        } catch (error) {
            console.error('Error loading dashboard content:', error);
            notificationManager.show('Error al cargar el dashboard', 'error');
        }
    }

    async loadMetrics() {
        const metrics = {
            totalProducts: this.currentData.products.length,
            pendingOrders: this.currentData.orders.filter(o => o.status === 'pending').length,
            monthlySales: this.calculateMonthlySales(),
            newCustomers: this.calculateNewCustomers()
        };

        // Actualizar métricas en el DOM
        Object.keys(metrics).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'monthlySales') {
                    element.textContent = this.formatCurrency(metrics[key]);
                } else {
                    element.textContent = metrics[key];
                }
            }
        });
    }

    async loadRecentOrders() {
        const recentOrders = this.currentData.orders.slice(0, 5);
        const container = document.getElementById('recentOrders');

        if (container && recentOrders.length > 0) {
            container.innerHTML = recentOrders.map(order => `
                <div class="order-item">
                    <div class="order-info">
                        <h4>${order.id}</h4>
                        <p>${order.customer}</p>
                        <span class="order-date">${this.formatDate(order.date)}</span>
                    </div>
                    <div class="order-status">
                        <span class="badge badge-${this.getStatusColor(order.status)}">${this.getStatusText(order.status)}</span>
                        <span class="order-total">${this.formatCurrency(order.total)}</span>
                    </div>
                </div>
            `).join('');
        } else if (container) {
            container.innerHTML = '<p class="text-secondary">No hay pedidos recientes</p>';
        }
    }

    async loadLowStockProducts() {
        const lowStockProducts = this.currentData.products.filter(p => p.stock <= 5);
        const container = document.getElementById('lowStockProducts');

        if (container && lowStockProducts.length > 0) {
            container.innerHTML = lowStockProducts.map(product => `
                <div class="product-item">
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <p>${product.category}</p>
                    </div>
                    <div class="product-stock">
                        <span class="stock-warning">Stock: ${product.stock}</span>
                        <button class="btn btn-sm btn-warning" onclick="contentManager.reorderProduct(${product.id})">
                            Reabastecer
                        </button>
                    </div>
                </div>
            `).join('');
        } else if (container) {
            container.innerHTML = '<p class="text-secondary">No hay productos con bajo stock</p>';
        }
    }

    async loadRecentActivity() {
        const activities = [
            { type: 'order', message: 'Nuevo pedido recibido: ORD-004', time: '2 min' },
            { type: 'product', message: 'Producto actualizado: Oxford Formal Premium', time: '15 min' },
            { type: 'customer', message: 'Nuevo cliente registrado: Laura Pérez', time: '1 hora' },
            { type: 'stock', message: 'Stock actualizado: Botas de Cuero', time: '2 horas' }
        ];

        const container = document.getElementById('recentActivity');
        if (container) {
            container.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <i class="fas ${this.getActivityIcon(activity.type)}" aria-hidden="true"></i>
                    <div class="activity-content">
                        <p>${activity.message}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    async loadSystemAlerts() {
        const alerts = [
            { type: 'warning', message: '3 productos con stock bajo', action: 'Revisar inventario' },
            { type: 'info', message: 'Backup automático completado', action: 'Ver detalles' },
            { type: 'success', message: 'Sistema actualizado correctamente', action: 'Ver cambios' }
        ];

        const container = document.getElementById('systemAlerts');
        if (container) {
            container.innerHTML = alerts.map(alert => `
                <div class="alert-item alert-${alert.type}">
                    <i class="fas ${this.getAlertIcon(alert.type)}" aria-hidden="true"></i>
                    <div class="alert-content">
                        <p>${alert.message}</p>
                        <button class="btn btn-sm btn-${alert.type}" onclick="contentManager.handleAlert('${alert.action}')">
                            ${alert.action}
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    prepareSectionContent() {
        // Preparar contenido para la sección Hero
        this.prepareHeroContent();

        // Preparar contenido para la sección Productos
        this.prepareProductsContent();

        // Preparar contenido para la sección Pedidos
        this.prepareOrdersContent();

        // Preparar contenido para la sección Contenido
        this.prepareGeneralContent();

        // Preparar contenido para Analytics
        this.prepareAnalyticsContent();

        // Preparar contenido para Configuración
        this.prepareSettingsContent();
    }

    prepareHeroContent() {
        const container = document.getElementById('heroContent');
        if (container) {
            container.innerHTML = `
                <div class="hero-editor">
                    <div class="form-section">
                        <h3>Configuración del Hero</h3>
                        <div class="form-group">
                            <label for="heroTitle">Título Principal</label>
                            <input type="text" id="heroTitle" value="${this.currentData.hero.title}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="heroSubtitle">Subtítulo</label>
                            <input type="text" id="heroSubtitle" value="${this.currentData.hero.subtitle}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="heroDescription">Descripción</label>
                            <textarea id="heroDescription" class="form-control" rows="3">${this.currentData.hero.description}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="heroCtaText">Texto del Botón</label>
                            <input type="text" id="heroCtaText" value="${this.currentData.hero.ctaText}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="heroCtaLink">Enlace del Botón</label>
                            <input type="text" id="heroCtaLink" value="${this.currentData.hero.ctaLink}" class="form-control">
                        </div>
                    </div>

                    <div class="preview-section">
                        <h3>Vista Previa</h3>
                        <div class="hero-preview">
                            <h1 id="previewTitle">${this.currentData.hero.title}</h1>
                            <h2 id="previewSubtitle">${this.currentData.hero.subtitle}</h2>
                            <p id="previewDescription">${this.currentData.hero.description}</p>
                            <a href="${this.currentData.hero.ctaLink}" class="btn btn-primary" id="previewCta">
                                ${this.currentData.hero.ctaText}
                            </a>
                        </div>
                    </div>
                </div>
            `;

            // Configurar event listeners para actualización en tiempo real
            this.setupHeroEditorListeners();
        }
    }

    prepareProductsContent() {
        const container = document.getElementById('productsContent');
        if (container) {
            container.innerHTML = `
                <div class="products-management">
                    <div class="products-filters">
                        <div class="filter-group">
                            <label for="categoryFilter">Categoría:</label>
                            <select id="categoryFilter" class="form-select">
                                <option value="">Todas las categorías</option>
                                <option value="Formal">Formal</option>
                                <option value="Casual">Casual</option>
                                <option value="Botas">Botas</option>
                                <option value="Deportivo">Deportivo</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label for="statusFilter">Estado:</label>
                            <select id="statusFilter" class="form-select">
                                <option value="">Todos los estados</option>
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <input type="text" id="searchProducts" placeholder="Buscar productos..." class="form-control">
                        </div>
                    </div>

                    <div class="products-table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="productsTableBody">
                                ${this.currentData.products.map(product => `
                                    <tr>
                                        <td>
                                            <div class="product-cell">
                                                <img src="${product.image}" alt="${product.name}" class="product-thumb">
                                                <span>${product.name}</span>
                                            </div>
                                        </td>
                                        <td>${product.category}</td>
                                        <td>${this.formatCurrency(product.price)}</td>
                                        <td>
                                            <span class="stock-${product.stock <= 5 ? 'low' : 'ok'}">${product.stock}</span>
                                        </td>
                                        <td>
                                            <span class="badge badge-${product.status === 'active' ? 'success' : 'danger'}">
                                                ${product.status === 'active' ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="action-buttons">
                                                <button class="btn btn-sm btn-secondary" onclick="contentManager.editProduct(${product.id})">
                                                    <i class="fas fa-edit" aria-hidden="true"></i>
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="contentManager.deleteProduct(${product.id})">
                                                    <i class="fas fa-trash" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            // Configurar filtros
            this.setupProductFilters();
        }
    }

    prepareOrdersContent() {
        const container = document.getElementById('ordersContent');
        if (container) {
            container.innerHTML = `
                <div class="orders-management">
                    <div class="orders-filters">
                        <div class="filter-group">
                            <label for="orderDateFilter">Fecha:</label>
                            <input type="date" id="orderDateFilter" class="form-control">
                        </div>
                        <div class="filter-group">
                            <input type="text" id="searchOrders" placeholder="Buscar por cliente o ID..." class="form-control">
                        </div>
                    </div>

                    <div class="orders-table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>ID Pedido</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="ordersTableBody">
                                ${this.currentData.orders.map(order => `
                                    <tr>
                                        <td>${order.id}</td>
                                        <td>
                                            <div class="customer-info">
                                                <span>${order.customer}</span>
                                                <small>${order.email}</small>
                                            </div>
                                        </td>
                                        <td>${this.formatDate(order.date)}</td>
                                        <td>${this.formatCurrency(order.total)}</td>
                                        <td>
                                            <span class="badge badge-${this.getStatusColor(order.status)}">
                                                ${this.getStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="action-buttons">
                                                <button class="btn btn-sm btn-secondary" onclick="contentManager.viewOrder('${order.id}')">
                                                    <i class="fas fa-eye" aria-hidden="true"></i>
                                                </button>
                                                <button class="btn btn-sm btn-primary" onclick="contentManager.updateOrderStatus('${order.id}')">
                                                    <i class="fas fa-edit" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            // Configurar filtros de pedidos
            this.setupOrderFilters();
        }
    }

    prepareGeneralContent() {
        const container = document.getElementById('contentManagement');
        if (container) {
            container.innerHTML = `
                <div class="content-editor">
                    <div class="content-section">
                        <h3>Información de la Tienda</h3>
                        <div class="form-group">
                            <label for="storeName">Nombre de la Tienda</label>
                            <input type="text" id="storeName" value="${STORE_CONFIG.name}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="storeSlogan">Slogan</label>
                            <input type="text" id="storeSlogan" value="${STORE_CONFIG.slogan}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="storeDescription">Descripción</label>
                            <textarea id="storeDescription" class="form-control" rows="4">${this.currentData.content.about.description}</textarea>
                        </div>
                    </div>

                    <div class="content-section">
                        <h3>Información de Contacto</h3>
                        <div class="form-group">
                            <label for="contactPhone">Teléfono</label>
                            <input type="tel" id="contactPhone" value="${this.currentData.content.contact.phone}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="contactEmail">Email</label>
                            <input type="email" id="contactEmail" value="${this.currentData.content.contact.email}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="contactAddress">Dirección</label>
                            <input type="text" id="contactAddress" value="${this.currentData.content.contact.address}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="contactHours">Horarios</label>
                            <input type="text" id="contactHours" value="${this.currentData.content.contact.hours}" class="form-control">
                        </div>
                    </div>

                    <div class="content-section">
                        <h3>Enlaces Importantes</h3>
                        <div class="form-group">
                            <label for="whatsappLink">WhatsApp</label>
                            <input type="url" id="whatsappLink" value="${STORE_CONFIG.social.whatsapp}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="instagramLink">Instagram</label>
                            <input type="url" id="instagramLink" value="${STORE_CONFIG.social.instagram}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="facebookLink">Facebook</label>
                            <input type="url" id="facebookLink" value="${STORE_CONFIG.social.facebook}" class="form-control">
                        </div>
                    </div>
                </div>
            `;
        }
    }

    prepareAnalyticsContent() {
        const container = document.getElementById('analyticsContent');
        if (container) {
            container.innerHTML = `
                <div class="analytics-dashboard">
                    <div class="analytics-cards">
                        <div class="analytics-card">
                            <h4>Ventas del Mes</h4>
                            <div class="analytics-value">${this.formatCurrency(this.calculateMonthlySales())}</div>
                            <div class="analytics-change positive">+12.5% vs mes anterior</div>
                        </div>
                        <div class="analytics-card">
                            <h4>Productos Vendidos</h4>
                            <div class="analytics-value">${this.calculateProductsSold()}</div>
                            <div class="analytics-change positive">+8.3% vs mes anterior</div>
                        </div>
                        <div class="analytics-card">
                            <h4>Clientes Nuevos</h4>
                            <div class="analytics-value">${this.calculateNewCustomers()}</div>
                            <div class="analytics-change positive">+15.2% vs mes anterior</div>
                        </div>
                        <div class="analytics-card">
                            <h4>Tasa de Conversión</h4>
                            <div class="analytics-value">3.2%</div>
                            <div class="analytics-change positive">+0.5% vs mes anterior</div>
                        </div>
                    </div>

                    <div class="analytics-charts">
                        <div class="chart-container">
                            <h4>Ventas por Categoría</h4>
                            <div class="chart-placeholder">
                                <p>Gráfico de ventas por categoría</p>
                                <small>Integración con Chart.js disponible</small>
                            </div>
                        </div>

                        <div class="chart-container">
                            <h4>Tendencias de Ventas</h4>
                            <div class="chart-placeholder">
                                <p>Gráfico de tendencias</p>
                                <small>Integración con Chart.js disponible</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    prepareSettingsContent() {
        const container = document.getElementById('settingsContent');
        if (container) {
            container.innerHTML = `
                <div class="settings-panel">
                    <div class="settings-section">
                        <h3>Configuración General</h3>
                        <div class="form-group">
                            <label for="siteTitle">Título del Sitio</label>
                            <input type="text" id="siteTitle" value="${STORE_CONFIG.name}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="siteDescription">Descripción del Sitio</label>
                            <textarea id="siteDescription" class="form-control" rows="3">Calzados Premium en Mar del Plata</textarea>
                        </div>
                        <div class="form-group">
                            <label for="currency">Moneda</label>
                            <select id="currency" class="form-select">
                                <option value="ARS" selected>Pesos Argentinos (ARS)</option>
                                <option value="USD">Dólares (USD)</option>
                                <option value="EUR">Euros (EUR)</option>
                            </select>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Configuración de Notificaciones</h3>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="emailNotifications" checked>
                                Notificaciones por email
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="whatsappNotifications" checked>
                                Notificaciones por WhatsApp
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="lowStockAlerts" checked>
                                Alertas de stock bajo
                            </label>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Configuración de Seguridad</h3>
                        <div class="form-group">
                            <label for="sessionTimeout">Tiempo de sesión (minutos)</label>
                            <input type="number" id="sessionTimeout" value="30" class="form-control">
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="requireStrongPassword" checked>
                                Requerir contraseña fuerte
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="enableTwoFactor">
                                Habilitar autenticación de dos factores
                            </label>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Métodos de utilidad
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    }

    formatDate(dateString) {
        return new Intl.DateTimeFormat('es-AR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(dateString));
    }

    getStatusColor(status) {
        const colors = {
            'pending': 'warning',
            'confirmed': 'info',
            'shipped': 'primary',
            'delivered': 'success',
            'cancelled': 'danger'
        };
        return colors[status] || 'secondary';
    }

    getStatusText(status) {
        const texts = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmado',
            'shipped': 'Enviado',
            'delivered': 'Entregado',
            'cancelled': 'Cancelado'
        };
        return texts[status] || status;
    }

    getActivityIcon(type) {
        const icons = {
            'order': 'fa-shopping-cart',
            'product': 'fa-box',
            'customer': 'fa-user',
            'stock': 'fa-warehouse'
        };
        return icons[type] || 'fa-info-circle';
    }

    getAlertIcon(type) {
        const icons = {
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle',
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    // Métodos de cálculo
    calculateMonthlySales() {
        return this.currentData.orders.reduce((total, order) => total + order.total, 0);
    }

    calculateProductsSold() {
        return this.currentData.orders.reduce((total, order) => {
            return total + order.items.reduce((sum, item) => sum + item.quantity, 0);
        }, 0);
    }

    calculateNewCustomers() {
        // Simular cálculo de nuevos clientes
        return Math.floor(Math.random() * 20) + 10;
    }

    // Métodos de acción
    reorderProduct(productId) {
        notificationManager.show(`Solicitud de reabastecimiento enviada para el producto ${productId}`, 'success');
    }

    editProduct(productId) {
        notificationManager.show(`Editando producto ${productId}`, 'info');
    }

    deleteProduct(productId) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            notificationManager.show(`Producto ${productId} eliminado`, 'success');
        }
    }

    viewOrder(orderId) {
        notificationManager.show(`Viendo detalles del pedido ${orderId}`, 'info');
    }

    updateOrderStatus(orderId) {
        notificationManager.show(`Actualizando estado del pedido ${orderId}`, 'info');
    }

    handleAlert(action) {
        notificationManager.show(`Ejecutando: ${action}`, 'info');
    }

    // Configuración de event listeners
    setupEventListeners() {
        // Event listeners para actualizaciones en tiempo real
        this.setupRealTimeUpdates();
    }

    setupHeroEditorListeners() {
        const heroInputs = ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroCtaText', 'heroCtaLink'];
        heroInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            const previewId = inputId.replace('hero', 'preview');
            const previewElement = document.getElementById(previewId);

            if (input && previewElement) {
                input.addEventListener('input', (e) => {
                    if (previewId === 'previewCta') {
                        previewElement.textContent = e.target.value;
                    } else {
                        previewElement.textContent = e.target.value;
                    }
                });
            }
        });
    }

    setupProductFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const searchInput = document.getElementById('searchProducts');

        [categoryFilter, statusFilter, searchInput].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.filterProducts());
                filter.addEventListener('input', () => this.filterProducts());
            }
        });
    }

    setupOrderFilters() {
        const dateFilter = document.getElementById('orderDateFilter');
        const searchInput = document.getElementById('searchOrders');

        [dateFilter, searchInput].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.filterOrders());
                filter.addEventListener('input', () => this.filterOrders());
            }
        });
    }

    setupRealTimeUpdates() {
        // Simular actualizaciones en tiempo real
        setInterval(() => {
            this.updateRandomMetrics();
        }, 30000); // Cada 30 segundos
    }

    updateRandomMetrics() {
        // Actualizar métricas aleatoriamente para simular actividad
        const metrics = ['totalProducts', 'pendingOrders', 'newCustomers'];
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        const element = document.getElementById(randomMetric);

        if (element) {
            const currentValue = parseInt(element.textContent.replace(/[^\d]/g, ''));
            const newValue = currentValue + Math.floor(Math.random() * 3) - 1;
            if (newValue >= 0) {
                element.textContent = randomMetric === 'monthlySales' ?
                    this.formatCurrency(newValue * 1000) : newValue;
            }
        }
    }

    filterProducts() {
        // Implementar filtrado de productos
        notificationManager.show('Filtros aplicados', 'info');
    }

    filterOrders() {
        // Implementar filtrado de pedidos
        notificationManager.show('Filtros aplicados', 'info');
    }
}

// Inicializar el gestor de contenido
let contentManager;

document.addEventListener('DOMContentLoaded', () => {
    contentManager = new ContentManager();
});

// Hacer disponible globalmente
window.contentManager = contentManager;



