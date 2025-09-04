/**
 * Dashboard Manager Module - Handles dashboard metrics and widgets
 * Statistics, charts, recent activity, performance indicators
 */

class DashboardManager {
    constructor() {
        this.metrics = {
            products: {
                total: 0,
                active: 0,
                lowStock: 0,
                outOfStock: 0
            },
            orders: {
                total: 0,
                pending: 0,
                processing: 0,
                delivered: 0,
                thisMonth: 0,
                revenue: 0
            },
            customers: {
                total: 0,
                new: 0,
                returning: 0
            },
            performance: {
                conversionRate: 0,
                averageOrderValue: 0,
                topProducts: [],
                recentActivity: []
            }
        };
        
        this.refreshInterval = null;
        this.charts = {};
        
        this.init();
    }

    /**
     * Initialize dashboard manager
     */
    async init() {
        try {
            await this.loadData();
            this.setupEventListeners();
            this.renderDashboard();
            this.startAutoRefresh();
            console.log('✅ Dashboard Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Dashboard Manager:', error);
        }
    }

    /**
     * Load data from various sources
     */
    async loadData() {
        try {
            await Promise.all([
                this.loadProductMetrics(),
                this.loadOrderMetrics(),
                this.loadCustomerMetrics(),
                this.loadPerformanceMetrics()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    /**
     * Load product metrics
     */
    async loadProductMetrics() {
        try {
            const storedProducts = localStorage.getItem('productos');
            const products = storedProducts ? JSON.parse(storedProducts) : [];
            
            this.metrics.products = {
                total: products.length,
                active: products.filter(p => p.estado === 'activo').length,
                lowStock: products.filter(p => p.stock > 0 && p.stock < 5).length,
                outOfStock: products.filter(p => p.stock === 0).length
            };
        } catch (error) {
            console.error('Error loading product metrics:', error);
        }
    }

    /**
     * Load order metrics
     */
    async loadOrderMetrics() {
        try {
            const storedOrders = localStorage.getItem('pedidos');
            const orders = storedOrders ? JSON.parse(storedOrders) : [];
            
            const today = new Date();
            const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            
            const thisMonthOrders = orders.filter(order => 
                new Date(order.fecha) >= thisMonth
            );
            
            const paidOrders = orders.filter(o => o.estadoPago === 'pagado');
            const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
            
            this.metrics.orders = {
                total: orders.length,
                pending: orders.filter(o => o.estado === 'pendiente').length,
                processing: orders.filter(o => o.estado === 'procesando').length,
                delivered: orders.filter(o => o.estado === 'entregado').length,
                thisMonth: thisMonthOrders.length,
                revenue: totalRevenue
            };
        } catch (error) {
            console.error('Error loading order metrics:', error);
        }
    }

    /**
     * Load customer metrics
     */
    async loadCustomerMetrics() {
        try {
            const storedOrders = localStorage.getItem('pedidos');
            const orders = storedOrders ? JSON.parse(storedOrders) : [];
            
            // Extract unique customers from orders
            const customers = new Map();
            orders.forEach(order => {
                const email = order.cliente.email;
                if (!customers.has(email)) {
                    customers.set(email, {
                        email: email,
                        nombre: order.cliente.nombre,
                        firstOrder: order.fecha,
                        orderCount: 1,
                        totalSpent: order.total
                    });
                } else {
                    const customer = customers.get(email);
                    customer.orderCount++;
                    customer.totalSpent += order.total;
                    if (new Date(order.fecha) < new Date(customer.firstOrder)) {
                        customer.firstOrder = order.fecha;
                    }
                }
            });
            
            const today = new Date();
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            
            const newCustomers = Array.from(customers.values()).filter(customer => 
                new Date(customer.firstOrder) >= lastMonth
            );
            
            this.metrics.customers = {
                total: customers.size,
                new: newCustomers.length,
                returning: Array.from(customers.values()).filter(c => c.orderCount > 1).length
            };
        } catch (error) {
            console.error('Error loading customer metrics:', error);
        }
    }

    /**
     * Load performance metrics
     */
    async loadPerformanceMetrics() {
        try {
            const storedProducts = localStorage.getItem('productos');
            const storedOrders = localStorage.getItem('pedidos');
            
            const products = storedProducts ? JSON.parse(storedProducts) : [];
            const orders = storedOrders ? JSON.parse(storedOrders) : [];
            
            // Calculate average order value
            const paidOrders = orders.filter(o => o.estadoPago === 'pagado');
            const averageOrderValue = paidOrders.length > 0 ? 
                paidOrders.reduce((sum, order) => sum + order.total, 0) / paidOrders.length : 0;
            
            // Calculate top products
            const productSales = new Map();
            orders.forEach(order => {
                order.productos.forEach(product => {
                    const id = product.id;
                    if (!productSales.has(id)) {
                        productSales.set(id, {
                            id: id,
                            nombre: product.nombre,
                            totalSold: 0,
                            revenue: 0
                        });
                    }
                    const productData = productSales.get(id);
                    productData.totalSold += product.cantidad;
                    productData.revenue += product.subtotal;
                });
            });
            
            const topProducts = Array.from(productSales.values())
                .sort((a, b) => b.totalSold - a.totalSold)
                .slice(0, 5);
            
            // Generate recent activity
            const recentActivity = this.generateRecentActivity(orders, products);
            
            this.metrics.performance = {
                conversionRate: this.calculateConversionRate(),
                averageOrderValue: averageOrderValue,
                topProducts: topProducts,
                recentActivity: recentActivity
            };
        } catch (error) {
            console.error('Error loading performance metrics:', error);
        }
    }

    /**
     * Calculate conversion rate (simplified)
     */
    calculateConversionRate() {
        // This is a simplified calculation
        // In a real scenario, you'd track website visits
        const orders = this.metrics.orders.total;
        const estimatedVisits = orders * 10; // Assume 10 visits per order
        return orders > 0 ? (orders / estimatedVisits * 100) : 0;
    }

    /**
     * Generate recent activity
     */
    generateRecentActivity(orders, products) {
        const activities = [];
        
        // Recent orders
        const recentOrders = orders
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .slice(0, 3);
            
        recentOrders.forEach(order => {
            activities.push({
                type: 'order',
                icon: '🛍️',
                message: `Nuevo pedido ${order.numero} de ${order.cliente.nombre}`,
                time: this.getRelativeTime(order.fecha),
                data: order
            });
        });
        
        // Low stock alerts
        const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 5);
        lowStockProducts.slice(0, 2).forEach(product => {
            activities.push({
                type: 'alert',
                icon: '⚠️',
                message: `Stock bajo: ${product.nombre} (${product.stock} unidades)`,
                time: 'Ahora',
                data: product
            });
        });
        
        // Out of stock alerts
        const outOfStockProducts = products.filter(p => p.stock === 0);
        outOfStockProducts.slice(0, 1).forEach(product => {
            activities.push({
                type: 'alert',
                icon: '🚫',
                message: `Sin stock: ${product.nombre}`,
                time: 'Ahora',
                data: product
            });
        });
        
        return activities.slice(0, 5);
    }

    /**
     * Get relative time
     */
    getRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Ahora';
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `Hace ${diffInHours}h`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `Hace ${diffInDays}d`;
        
        return date.toLocaleDateString('es-CL');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-dashboard-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }

        // Export report button
        const exportBtn = document.getElementById('export-report-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportReport();
            });
        }

        // Time range selector
        const timeRangeSelect = document.getElementById('dashboard-time-range');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', (e) => {
                this.updateTimeRange(e.target.value);
            });
        }
    }

    /**
     * Render dashboard
     */
    renderDashboard() {
        this.renderMetricCards();
        this.renderCharts();
        this.renderRecentOrders();
        this.renderLowStockProducts();
        this.renderRecentActivity();
        this.renderTopProducts();
    }

    /**
     * Render metric cards
     */
    renderMetricCards() {
        // Total products
        this.updateMetricCard('total-products', {
            value: this.metrics.products.total,
            label: 'Total Productos',
            icon: '📦',
            trend: this.calculateTrend('products')
        });

        // Pending orders
        this.updateMetricCard('pending-orders', {
            value: this.metrics.orders.pending,
            label: 'Pedidos Pendientes',
            icon: '⏳',
            trend: this.calculateTrend('orders')
        });

        // Monthly sales
        this.updateMetricCard('monthly-sales', {
            value: `$${this.metrics.orders.revenue.toLocaleString()}`,
            label: 'Ventas del Mes',
            icon: '💰',
            trend: this.calculateTrend('revenue')
        });

        // New customers
        this.updateMetricCard('new-customers', {
            value: this.metrics.customers.new,
            label: 'Clientes Nuevos',
            icon: '👥',
            trend: this.calculateTrend('customers')
        });
    }

    /**
     * Update metric card
     */
    updateMetricCard(cardId, data) {
        const card = document.getElementById(cardId);
        if (!card) return;

        const valueElement = card.querySelector('.metric-value');
        const labelElement = card.querySelector('.metric-label');
        const iconElement = card.querySelector('.metric-icon');
        const trendElement = card.querySelector('.metric-trend');

        if (valueElement) valueElement.textContent = data.value;
        if (labelElement) labelElement.textContent = data.label;
        if (iconElement) iconElement.textContent = data.icon;
        
        if (trendElement && data.trend) {
            trendElement.textContent = `${data.trend > 0 ? '+' : ''}${data.trend.toFixed(1)}%`;
            trendElement.className = `metric-trend ${data.trend > 0 ? 'positive' : data.trend < 0 ? 'negative' : 'neutral'}`;
        }
    }

    /**
     * Calculate trend (simplified)
     */
    calculateTrend(metric) {
        // This is a simplified calculation
        // In a real scenario, you'd compare with previous period
        const trends = {
            products: 5.2,
            orders: -2.1,
            revenue: 12.8,
            customers: 8.4
        };
        return trends[metric] || 0;
    }

    /**
     * Render charts
     */
    renderCharts() {
        this.renderSalesChart();
        this.renderOrderStatusChart();
        this.renderProductCategoryChart();
    }

    /**
     * Render sales chart (simplified)
     */
    renderSalesChart() {
        const chartContainer = document.getElementById('sales-chart');
        if (!chartContainer) return;

        // Generate sample data for the last 7 days
        const salesData = this.generateSalesChartData();
        
        chartContainer.innerHTML = `
            <div class="chart-header">
                <h3>Ventas de los últimos 7 días</h3>
            </div>
            <div class="simple-chart">
                ${salesData.map((day, index) => `
                    <div class="chart-bar">
                        <div class="bar" style="height: ${(day.sales / Math.max(...salesData.map(d => d.sales))) * 100}%"
                             data-tooltip="$${day.sales.toLocaleString()}">
                        </div>
                        <div class="bar-label">${day.label}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Generate sales chart data
     */
    generateSalesChartData() {
        const data = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Simulate sales data
            const sales = Math.floor(Math.random() * 100000) + 20000;
            
            data.push({
                date: date,
                label: date.toLocaleDateString('es-CL', { weekday: 'short' }),
                sales: sales
            });
        }
        
        return data;
    }

    /**
     * Render order status chart
     */
    renderOrderStatusChart() {
        const chartContainer = document.getElementById('order-status-chart');
        if (!chartContainer) return;

        const orders = this.metrics.orders;
        const total = orders.total || 1; // Avoid division by zero
        
        chartContainer.innerHTML = `
            <div class="chart-header">
                <h3>Estado de Pedidos</h3>
            </div>
            <div class="donut-chart">
                <div class="donut-segment pending" 
                     style="--percentage: ${(orders.pending / total * 100).toFixed(1)}%"
                     data-tooltip="Pendientes: ${orders.pending}">
                </div>
                <div class="donut-segment processing" 
                     style="--percentage: ${(orders.processing / total * 100).toFixed(1)}%"
                     data-tooltip="Procesando: ${orders.processing}">
                </div>
                <div class="donut-segment delivered" 
                     style="--percentage: ${(orders.delivered / total * 100).toFixed(1)}%"
                     data-tooltip="Entregados: ${orders.delivered}">
                </div>
            </div>
            <div class="chart-legend">
                <div class="legend-item">
                    <span class="legend-color pending"></span>
                    <span>Pendientes (${orders.pending})</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color processing"></span>
                    <span>Procesando (${orders.processing})</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color delivered"></span>
                    <span>Entregados (${orders.delivered})</span>
                </div>
            </div>
        `;
    }

    /**
     * Render product category chart
     */
    renderProductCategoryChart() {
        const chartContainer = document.getElementById('category-chart');
        if (!chartContainer) return;

        try {
            const storedProducts = localStorage.getItem('productos');
            const products = storedProducts ? JSON.parse(storedProducts) : [];
            
            // Count products by category
            const categories = {};
            products.forEach(product => {
                categories[product.categoria] = (categories[product.categoria] || 0) + 1;
            });
            
            const categoryData = Object.entries(categories)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count);
            
            if (categoryData.length === 0) {
                chartContainer.innerHTML = '<p class="text-muted">No hay datos de categorías</p>';
                return;
            }
            
            const maxCount = Math.max(...categoryData.map(c => c.count));
            
            chartContainer.innerHTML = `
                <div class="chart-header">
                    <h3>Productos por Categoría</h3>
                </div>
                <div class="horizontal-chart">
                    ${categoryData.map(category => `
                        <div class="chart-row">
                            <div class="row-label">${category.name}</div>
                            <div class="row-bar">
                                <div class="bar-fill" 
                                     style="width: ${(category.count / maxCount * 100)}%"
                                     data-tooltip="${category.count} productos">
                                </div>
                            </div>
                            <div class="row-value">${category.count}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Error rendering category chart:', error);
            chartContainer.innerHTML = '<p class="text-muted">Error al cargar datos</p>';
        }
    }

    /**
     * Render recent orders
     */
    renderRecentOrders() {
        const container = document.getElementById('recent-orders-list');
        if (!container) return;

        try {
            const storedOrders = localStorage.getItem('pedidos');
            const orders = storedOrders ? JSON.parse(storedOrders) : [];
            
            const recentOrders = orders
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                .slice(0, 5);
            
            if (recentOrders.length === 0) {
                container.innerHTML = '<p class="text-muted">No hay pedidos recientes</p>';
                return;
            }
            
            container.innerHTML = recentOrders.map(order => `
                <div class="recent-order-item">
                    <div class="order-info">
                        <strong>${order.numero}</strong>
                        <div class="text-muted">${order.cliente.nombre}</div>
                    </div>
                    <div class="order-amount">
                        $${order.total.toLocaleString()}
                    </div>
                    <div class="order-status">
                        <span class="badge ${this.getStatusBadgeClass(order.estado)}">
                            ${this.getStatusText(order.estado)}
                        </span>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error rendering recent orders:', error);
            container.innerHTML = '<p class="text-muted">Error al cargar pedidos</p>';
        }
    }

    /**
     * Render low stock products
     */
    renderLowStockProducts() {
        const container = document.getElementById('low-stock-list');
        if (!container) return;

        try {
            const storedProducts = localStorage.getItem('productos');
            const products = storedProducts ? JSON.parse(storedProducts) : [];
            
            const lowStockProducts = products
                .filter(p => p.stock > 0 && p.stock < 5)
                .sort((a, b) => a.stock - b.stock)
                .slice(0, 5);
            
            if (lowStockProducts.length === 0) {
                container.innerHTML = '<p class="text-muted">No hay productos con stock bajo</p>';
                return;
            }
            
            container.innerHTML = lowStockProducts.map(product => `
                <div class="low-stock-item">
                    <div class="product-info">
                        <strong>${product.nombre}</strong>
                        <div class="text-muted">${product.categoria}</div>
                    </div>
                    <div class="stock-info">
                        <span class="badge warning">${product.stock} unidades</span>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error rendering low stock products:', error);
            container.innerHTML = '<p class="text-muted">Error al cargar productos</p>';
        }
    }

    /**
     * Render recent activity
     */
    renderRecentActivity() {
        const container = document.getElementById('recent-activity-list');
        if (!container) return;

        const activities = this.metrics.performance.recentActivity;
        
        if (activities.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay actividad reciente</p>';
            return;
        }
        
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <div class="activity-message">${activity.message}</div>
                    <div class="activity-time text-muted">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render top products
     */
    renderTopProducts() {
        const container = document.getElementById('top-products-list');
        if (!container) return;

        const topProducts = this.metrics.performance.topProducts;
        
        if (topProducts.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay datos de productos</p>';
            return;
        }
        
        container.innerHTML = topProducts.map((product, index) => `
            <div class="top-product-item">
                <div class="product-rank">#${index + 1}</div>
                <div class="product-info">
                    <strong>${product.nombre}</strong>
                    <div class="text-muted">${product.totalSold} vendidos</div>
                </div>
                <div class="product-revenue">
                    $${product.revenue.toLocaleString()}
                </div>
            </div>
        `).join('');
    }

    /**
     * Get status badge class
     */
    getStatusBadgeClass(status) {
        const statusClasses = {
            'pendiente': 'warning',
            'procesando': 'info',
            'enviado': 'primary',
            'entregado': 'success',
            'cancelado': 'danger'
        };
        return statusClasses[status] || 'secondary';
    }

    /**
     * Get status text
     */
    getStatusText(status) {
        const statusTexts = {
            'pendiente': 'Pendiente',
            'procesando': 'Procesando',
            'enviado': 'Enviado',
            'entregado': 'Entregado',
            'cancelado': 'Cancelado'
        };
        return statusTexts[status] || status;
    }

    /**
     * Refresh dashboard
     */
    async refreshDashboard() {
        try {
            window.adminCore.showLoading('Actualizando dashboard...');
            
            await this.loadData();
            this.renderDashboard();
            
            window.adminCore.hideLoading();
            window.adminCore.showSuccess('Dashboard actualizado');
        } catch (error) {
            window.adminCore.hideLoading();
            console.error('Error refreshing dashboard:', error);
            window.adminCore.showError('Error al actualizar el dashboard');
        }
    }

    /**
     * Update time range
     */
    updateTimeRange(range) {
        // This would filter data based on the selected time range
        console.log('Time range updated:', range);
        // Implement time range filtering logic here
        this.refreshDashboard();
    }

    /**
     * Start auto refresh
     */
    startAutoRefresh() {
        // Refresh dashboard every 5 minutes
        this.refreshInterval = setInterval(() => {
            this.loadData().then(() => {
                this.renderDashboard();
            });
        }, 5 * 60 * 1000);
    }

    /**
     * Stop auto refresh
     */
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    /**
     * Export report
     */
    exportReport() {
        try {
            const report = {
                generatedAt: new Date().toISOString(),
                metrics: this.metrics,
                summary: {
                    totalProducts: this.metrics.products.total,
                    totalOrders: this.metrics.orders.total,
                    totalRevenue: this.metrics.orders.revenue,
                    totalCustomers: this.metrics.customers.total,
                    conversionRate: this.metrics.performance.conversionRate,
                    averageOrderValue: this.metrics.performance.averageOrderValue
                }
            };
            
            const dataStr = JSON.stringify(report, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `reporte-dashboard-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            window.adminCore.showSuccess('Reporte exportado exitosamente');
        } catch (error) {
            console.error('Error exporting report:', error);
            window.adminCore.showError('Error al exportar el reporte');
        }
    }

    /**
     * Get dashboard metrics
     */
    getMetrics() {
        return this.metrics;
    }

    /**
     * Destroy dashboard manager
     */
    destroy() {
        this.stopAutoRefresh();
        
        // Clean up event listeners
        const refreshBtn = document.getElementById('refresh-dashboard-btn');
        if (refreshBtn) {
            refreshBtn.removeEventListener('click', this.refreshDashboard);
        }
        
        console.log('Dashboard Manager destroyed');
    }
}

// Initialize dashboard manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dashboard-section')) {
        window.dashboardManager = new DashboardManager();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
}