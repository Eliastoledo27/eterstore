/**
 * Order Manager Module - Handles all order-related operations
 * Order listing, filtering, status updates, order details
 */

class OrderManager {
    constructor() {
        this.orders = [];
        this.filteredOrders = [];
        this.currentFilters = {
            search: '',
            status: '',
            dateRange: { start: '', end: '' },
            paymentMethod: ''
        };
        this.sortConfig = {
            field: 'fecha',
            direction: 'desc'
        };
        this.pagination = {
            currentPage: 1,
            itemsPerPage: 10,
            totalPages: 1
        };
        
        this.init();
    }

    /**
     * Initialize order manager
     */
    async init() {
        try {
            await this.loadOrders();
            this.setupEventListeners();
            this.renderOrdersTable();
            this.updateStatistics();
            console.log('✅ Order Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Order Manager:', error);
        }
    }

    /**
     * Load orders from localStorage
     */
    async loadOrders() {
        try {
            const storedOrders = localStorage.getItem('pedidos');
            this.orders = storedOrders ? JSON.parse(storedOrders) : this.getDefaultOrders();
            this.filteredOrders = [...this.orders];
            this.updatePagination();
        } catch (error) {
            console.error('Error loading orders:', error);
            this.orders = this.getDefaultOrders();
            this.filteredOrders = [...this.orders];
        }
    }

    /**
     * Get default orders if none exist
     */
    getDefaultOrders() {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        return [
            {
                id: 1001,
                numero: 'PED-2024-001',
                cliente: {
                    nombre: 'María González',
                    email: 'maria.gonzalez@email.com',
                    telefono: '+56 9 8765 4321',
                    direccion: 'Av. Providencia 1234, Santiago'
                },
                productos: [
                    {
                        id: 1,
                        nombre: 'Collar Místico Luna',
                        precio: 45000,
                        cantidad: 1,
                        subtotal: 45000
                    },
                    {
                        id: 2,
                        nombre: 'Anillo Éter Dorado',
                        precio: 32000,
                        cantidad: 2,
                        subtotal: 64000
                    }
                ],
                subtotal: 109000,
                envio: 5000,
                descuento: 0,
                total: 114000,
                estado: 'pendiente',
                metodoPago: 'transferencia',
                estadoPago: 'pendiente',
                fecha: now.toISOString(),
                fechaEntrega: null,
                notas: 'Cliente solicita entrega en horario de mañana',
                tracking: null
            },
            {
                id: 1002,
                numero: 'PED-2024-002',
                cliente: {
                    nombre: 'Carlos Rodríguez',
                    email: 'carlos.rodriguez@email.com',
                    telefono: '+56 9 1234 5678',
                    direccion: 'Las Condes 567, Santiago'
                },
                productos: [
                    {
                        id: 3,
                        nombre: 'Pulsera Chakras',
                        precio: 28000,
                        cantidad: 1,
                        subtotal: 28000
                    }
                ],
                subtotal: 28000,
                envio: 3000,
                descuento: 2800,
                total: 28200,
                estado: 'procesando',
                metodoPago: 'tarjeta',
                estadoPago: 'pagado',
                fecha: yesterday.toISOString(),
                fechaEntrega: null,
                notas: '',
                tracking: 'TRK123456789'
            },
            {
                id: 1003,
                numero: 'PED-2024-003',
                cliente: {
                    nombre: 'Ana Martínez',
                    email: 'ana.martinez@email.com',
                    telefono: '+56 9 9876 5432',
                    direccion: 'Ñuñoa 890, Santiago'
                },
                productos: [
                    {
                        id: 1,
                        nombre: 'Collar Místico Luna',
                        precio: 45000,
                        cantidad: 1,
                        subtotal: 45000
                    }
                ],
                subtotal: 45000,
                envio: 4000,
                descuento: 0,
                total: 49000,
                estado: 'entregado',
                metodoPago: 'efectivo',
                estadoPago: 'pagado',
                fecha: lastWeek.toISOString(),
                fechaEntrega: yesterday.toISOString(),
                notas: 'Entrega exitosa',
                tracking: 'TRK987654321'
            }
        ];
    }

    /**
     * Save orders to localStorage
     */
    async saveOrders() {
        try {
            localStorage.setItem('pedidos', JSON.stringify(this.orders));
            console.log('✅ Orders saved successfully');
        } catch (error) {
            console.error('❌ Error saving orders:', error);
            throw error;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('order-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('order-status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.applyFilters();
            });
        }

        // Payment method filter
        const paymentFilter = document.getElementById('payment-method-filter');
        if (paymentFilter) {
            paymentFilter.addEventListener('change', (e) => {
                this.currentFilters.paymentMethod = e.target.value;
                this.applyFilters();
            });
        }

        // Date range filters
        const startDateFilter = document.getElementById('start-date-filter');
        const endDateFilter = document.getElementById('end-date-filter');
        
        if (startDateFilter) {
            startDateFilter.addEventListener('change', (e) => {
                this.currentFilters.dateRange.start = e.target.value;
                this.applyFilters();
            });
        }
        
        if (endDateFilter) {
            endDateFilter.addEventListener('change', (e) => {
                this.currentFilters.dateRange.end = e.target.value;
                this.applyFilters();
            });
        }

        // Export button
        const exportBtn = document.getElementById('export-orders-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportOrders();
            });
        }
    }

    /**
     * Apply current filters
     */
    applyFilters() {
        let filtered = [...this.orders];

        // Search filter
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(order => 
                order.numero.toLowerCase().includes(searchTerm) ||
                order.cliente.nombre.toLowerCase().includes(searchTerm) ||
                order.cliente.email.toLowerCase().includes(searchTerm) ||
                order.productos.some(product => 
                    product.nombre.toLowerCase().includes(searchTerm)
                )
            );
        }

        // Status filter
        if (this.currentFilters.status) {
            filtered = filtered.filter(order => 
                order.estado === this.currentFilters.status
            );
        }

        // Payment method filter
        if (this.currentFilters.paymentMethod) {
            filtered = filtered.filter(order => 
                order.metodoPago === this.currentFilters.paymentMethod
            );
        }

        // Date range filter
        if (this.currentFilters.dateRange.start) {
            const startDate = new Date(this.currentFilters.dateRange.start);
            filtered = filtered.filter(order => 
                new Date(order.fecha) >= startDate
            );
        }
        
        if (this.currentFilters.dateRange.end) {
            const endDate = new Date(this.currentFilters.dateRange.end);
            endDate.setHours(23, 59, 59, 999); // End of day
            filtered = filtered.filter(order => 
                new Date(order.fecha) <= endDate
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const aValue = this.getSortValue(a, this.sortConfig.field);
            const bValue = this.getSortValue(b, this.sortConfig.field);
            
            if (this.sortConfig.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        this.filteredOrders = filtered;
        this.pagination.currentPage = 1;
        this.updatePagination();
        this.renderOrdersTable();
        this.updateStatistics();
    }

    /**
     * Get sort value for a field
     */
    getSortValue(order, field) {
        switch (field) {
            case 'fecha':
                return new Date(order.fecha);
            case 'total':
                return order.total;
            case 'cliente':
                return order.cliente.nombre;
            case 'numero':
                return order.numero;
            default:
                return order[field] || '';
        }
    }

    /**
     * Update pagination
     */
    updatePagination() {
        this.pagination.totalPages = Math.ceil(
            this.filteredOrders.length / this.pagination.itemsPerPage
        );
        
        if (this.pagination.currentPage > this.pagination.totalPages) {
            this.pagination.currentPage = 1;
        }
    }

    /**
     * Get paginated orders
     */
    getPaginatedOrders() {
        const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
        const endIndex = startIndex + this.pagination.itemsPerPage;
        return this.filteredOrders.slice(startIndex, endIndex);
    }

    /**
     * Render orders table
     */
    renderOrdersTable() {
        const tableBody = document.getElementById('orders-table-body');
        if (!tableBody) return;

        const paginatedOrders = this.getPaginatedOrders();

        if (paginatedOrders.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-8">
                        <div class="empty-state">
                            <p class="text-muted">No se encontraron pedidos</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = paginatedOrders.map(order => `
            <tr data-order-id="${order.id}">
                <td>
                    <div class="order-info">
                        <strong>${order.numero}</strong>
                        <div class="text-muted text-sm">
                            ${this.formatDate(order.fecha)}
                        </div>
                    </div>
                </td>
                <td>
                    <div class="customer-info">
                        <strong>${order.cliente.nombre}</strong>
                        <div class="text-muted text-sm">${order.cliente.email}</div>
                    </div>
                </td>
                <td>
                    <div class="products-summary">
                        ${order.productos.length} producto${order.productos.length !== 1 ? 's' : ''}
                        <div class="text-muted text-sm">
                            ${order.productos.map(p => `${p.cantidad}x ${p.nombre}`).join(', ')}
                        </div>
                    </div>
                </td>
                <td class="text-right">
                    <strong>$${order.total.toLocaleString()}</strong>
                </td>
                <td>
                    <span class="badge ${this.getStatusBadgeClass(order.estado)}">
                        ${this.getStatusText(order.estado)}
                    </span>
                </td>
                <td>
                    <span class="badge ${this.getPaymentBadgeClass(order.estadoPago)}">
                        ${this.getPaymentStatusText(order.estadoPago)}
                    </span>
                    <div class="text-muted text-sm">${this.getPaymentMethodText(order.metodoPago)}</div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="table-action view" 
                                onclick="orderManager.viewOrder(${order.id})"
                                data-tooltip="Ver detalles">
                            👁️
                        </button>
                        <button class="table-action edit" 
                                onclick="orderManager.editOrderStatus(${order.id})"
                                data-tooltip="Cambiar estado">
                            ✏️
                        </button>
                        ${order.tracking ? `
                            <button class="table-action track" 
                                    onclick="orderManager.showTracking('${order.tracking}')"
                                    data-tooltip="Seguimiento">
                                📦
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Render pagination
        this.renderPagination();
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
     * Get payment badge class
     */
    getPaymentBadgeClass(paymentStatus) {
        const paymentClasses = {
            'pendiente': 'warning',
            'pagado': 'success',
            'fallido': 'danger',
            'reembolsado': 'info'
        };
        return paymentClasses[paymentStatus] || 'secondary';
    }

    /**
     * Get payment status text
     */
    getPaymentStatusText(paymentStatus) {
        const paymentTexts = {
            'pendiente': 'Pendiente',
            'pagado': 'Pagado',
            'fallido': 'Fallido',
            'reembolsado': 'Reembolsado'
        };
        return paymentTexts[paymentStatus] || paymentStatus;
    }

    /**
     * Get payment method text
     */
    getPaymentMethodText(method) {
        const methodTexts = {
            'tarjeta': 'Tarjeta',
            'transferencia': 'Transferencia',
            'efectivo': 'Efectivo',
            'paypal': 'PayPal'
        };
        return methodTexts[method] || method;
    }

    /**
     * Render pagination
     */
    renderPagination() {
        const paginationContainer = document.getElementById('orders-pagination');
        if (!paginationContainer) return;

        if (this.pagination.totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination">';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-item ${this.pagination.currentPage === 1 ? 'disabled' : ''}" 
                    onclick="orderManager.goToPage(${this.pagination.currentPage - 1})">
                ‹
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= this.pagination.totalPages; i++) {
            if (i === 1 || i === this.pagination.totalPages || 
                (i >= this.pagination.currentPage - 2 && i <= this.pagination.currentPage + 2)) {
                paginationHTML += `
                    <button class="pagination-item ${i === this.pagination.currentPage ? 'active' : ''}" 
                            onclick="orderManager.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.pagination.currentPage - 3 || i === this.pagination.currentPage + 3) {
                paginationHTML += '<span class="pagination-item">...</span>';
            }
        }
        
        // Next button
        paginationHTML += `
            <button class="pagination-item ${this.pagination.currentPage === this.pagination.totalPages ? 'disabled' : ''}" 
                    onclick="orderManager.goToPage(${this.pagination.currentPage + 1})">
                ›
            </button>
        `;
        
        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;
    }

    /**
     * Go to specific page
     */
    goToPage(page) {
        if (page < 1 || page > this.pagination.totalPages) return;
        
        this.pagination.currentPage = page;
        this.renderOrdersTable();
    }

    /**
     * Update statistics
     */
    updateStatistics() {
        const stats = {
            total: this.orders.length,
            pending: this.orders.filter(o => o.estado === 'pendiente').length,
            processing: this.orders.filter(o => o.estado === 'procesando').length,
            delivered: this.orders.filter(o => o.estado === 'entregado').length,
            totalRevenue: this.orders
                .filter(o => o.estadoPago === 'pagado')
                .reduce((sum, order) => sum + order.total, 0),
            pendingPayments: this.orders.filter(o => o.estadoPago === 'pendiente').length
        };

        // Update stat elements
        this.updateStatElement('total-orders-stat', stats.total);
        this.updateStatElement('pending-orders-stat', stats.pending);
        this.updateStatElement('processing-orders-stat', stats.processing);
        this.updateStatElement('delivered-orders-stat', stats.delivered);
        this.updateStatElement('total-revenue-stat', `$${stats.totalRevenue.toLocaleString()}`);
        this.updateStatElement('pending-payments-stat', stats.pendingPayments);
    }

    /**
     * Update stat element
     */
    updateStatElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * View order details
     */
    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('order-details-modal');
        if (!modal) return;

        // Populate order details
        this.populateOrderDetails(order);
        
        // Show modal
        modal.classList.add('show');
    }

    /**
     * Populate order details modal
     */
    populateOrderDetails(order) {
        // Order header
        const orderNumber = document.getElementById('order-detail-number');
        const orderDate = document.getElementById('order-detail-date');
        const orderStatus = document.getElementById('order-detail-status');
        
        if (orderNumber) orderNumber.textContent = order.numero;
        if (orderDate) orderDate.textContent = this.formatDate(order.fecha);
        if (orderStatus) {
            orderStatus.className = `badge ${this.getStatusBadgeClass(order.estado)}`;
            orderStatus.textContent = this.getStatusText(order.estado);
        }

        // Customer info
        const customerName = document.getElementById('customer-detail-name');
        const customerEmail = document.getElementById('customer-detail-email');
        const customerPhone = document.getElementById('customer-detail-phone');
        const customerAddress = document.getElementById('customer-detail-address');
        
        if (customerName) customerName.textContent = order.cliente.nombre;
        if (customerEmail) customerEmail.textContent = order.cliente.email;
        if (customerPhone) customerPhone.textContent = order.cliente.telefono;
        if (customerAddress) customerAddress.textContent = order.cliente.direccion;

        // Products
        const productsContainer = document.getElementById('order-products-list');
        if (productsContainer) {
            productsContainer.innerHTML = order.productos.map(product => `
                <div class="order-product-item">
                    <div class="product-info">
                        <strong>${product.nombre}</strong>
                        <div class="text-muted">Cantidad: ${product.cantidad}</div>
                    </div>
                    <div class="product-price">
                        <div>$${product.precio.toLocaleString()} c/u</div>
                        <div class="font-bold">$${product.subtotal.toLocaleString()}</div>
                    </div>
                </div>
            `).join('');
        }

        // Order totals
        const subtotalElement = document.getElementById('order-detail-subtotal');
        const shippingElement = document.getElementById('order-detail-shipping');
        const discountElement = document.getElementById('order-detail-discount');
        const totalElement = document.getElementById('order-detail-total');
        
        if (subtotalElement) subtotalElement.textContent = `$${order.subtotal.toLocaleString()}`;
        if (shippingElement) shippingElement.textContent = `$${order.envio.toLocaleString()}`;
        if (discountElement) discountElement.textContent = order.descuento > 0 ? `-$${order.descuento.toLocaleString()}` : '$0';
        if (totalElement) totalElement.textContent = `$${order.total.toLocaleString()}`;

        // Payment info
        const paymentMethod = document.getElementById('payment-detail-method');
        const paymentStatus = document.getElementById('payment-detail-status');
        
        if (paymentMethod) paymentMethod.textContent = this.getPaymentMethodText(order.metodoPago);
        if (paymentStatus) {
            paymentStatus.className = `badge ${this.getPaymentBadgeClass(order.estadoPago)}`;
            paymentStatus.textContent = this.getPaymentStatusText(order.estadoPago);
        }

        // Tracking info
        const trackingElement = document.getElementById('order-detail-tracking');
        if (trackingElement) {
            trackingElement.textContent = order.tracking || 'No disponible';
        }

        // Notes
        const notesElement = document.getElementById('order-detail-notes');
        if (notesElement) {
            notesElement.textContent = order.notas || 'Sin notas';
        }

        // Delivery date
        const deliveryElement = document.getElementById('order-detail-delivery');
        if (deliveryElement) {
            deliveryElement.textContent = order.fechaEntrega ? 
                this.formatDate(order.fechaEntrega) : 'Pendiente';
        }
    }

    /**
     * Edit order status
     */
    editOrderStatus(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const newStatus = prompt(
            `Estado actual: ${this.getStatusText(order.estado)}\n\n` +
            'Selecciona el nuevo estado:\n' +
            '1. Pendiente\n' +
            '2. Procesando\n' +
            '3. Enviado\n' +
            '4. Entregado\n' +
            '5. Cancelado\n\n' +
            'Ingresa el número (1-5):'
        );

        const statusMap = {
            '1': 'pendiente',
            '2': 'procesando',
            '3': 'enviado',
            '4': 'entregado',
            '5': 'cancelado'
        };

        if (statusMap[newStatus]) {
            this.updateOrderStatus(orderId, statusMap[newStatus]);
        }
    }

    /**
     * Update order status
     */
    async updateOrderStatus(orderId, newStatus) {
        try {
            const order = this.orders.find(o => o.id === orderId);
            if (!order) {
                throw new Error('Pedido no encontrado');
            }

            const oldStatus = order.estado;
            order.estado = newStatus;

            // Update delivery date if status is 'entregado'
            if (newStatus === 'entregado' && !order.fechaEntrega) {
                order.fechaEntrega = new Date().toISOString();
            }

            // Generate tracking number if status is 'enviado' and no tracking exists
            if (newStatus === 'enviado' && !order.tracking) {
                order.tracking = this.generateTrackingNumber();
            }

            await this.saveOrders();
            this.applyFilters();
            
            window.adminCore.showSuccess(
                `Estado del pedido ${order.numero} actualizado de "${this.getStatusText(oldStatus)}" a "${this.getStatusText(newStatus)}"`
            );
            
        } catch (error) {
            console.error('Error updating order status:', error);
            window.adminCore.showError('Error al actualizar el estado del pedido');
        }
    }

    /**
     * Generate tracking number
     */
    generateTrackingNumber() {
        const prefix = 'TRK';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substr(2, 3).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }

    /**
     * Show tracking information
     */
    showTracking(trackingNumber) {
        alert(`Número de seguimiento: ${trackingNumber}\n\nPuedes rastrear tu pedido en nuestro sistema de seguimiento.`);
    }

    /**
     * Close order details modal
     */
    closeOrderModal() {
        const modal = document.getElementById('order-details-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    /**
     * Export orders to CSV
     */
    exportOrders() {
        try {
            const headers = [
                'Número',
                'Fecha',
                'Cliente',
                'Email',
                'Teléfono',
                'Productos',
                'Subtotal',
                'Envío',
                'Descuento',
                'Total',
                'Estado',
                'Método de Pago',
                'Estado de Pago',
                'Tracking',
                'Notas'
            ];

            const csvContent = [
                headers.join(','),
                ...this.filteredOrders.map(order => [
                    order.numero,
                    this.formatDate(order.fecha),
                    `"${order.cliente.nombre}"`,
                    order.cliente.email,
                    order.cliente.telefono,
                    `"${order.productos.map(p => `${p.cantidad}x ${p.nombre}`).join('; ')}"`,
                    order.subtotal,
                    order.envio,
                    order.descuento,
                    order.total,
                    this.getStatusText(order.estado),
                    this.getPaymentMethodText(order.metodoPago),
                    this.getPaymentStatusText(order.estadoPago),
                    order.tracking || '',
                    `"${order.notas || ''}"`
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `pedidos-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            
            window.adminCore.showSuccess('Pedidos exportados exitosamente');
        } catch (error) {
            console.error('Error exporting orders:', error);
            window.adminCore.showError('Error al exportar pedidos');
        }
    }

    /**
     * Get recent orders for dashboard
     */
    getRecentOrders(limit = 5) {
        return this.orders
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .slice(0, limit);
    }

    /**
     * Get orders statistics for dashboard
     */
    getOrdersStats() {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        
        const thisMonthOrders = this.orders.filter(order => 
            new Date(order.fecha) >= thisMonth
        );
        
        const lastMonthOrders = this.orders.filter(order => {
            const orderDate = new Date(order.fecha);
            return orderDate >= lastMonth && orderDate < thisMonth;
        });

        const thisMonthRevenue = thisMonthOrders
            .filter(o => o.estadoPago === 'pagado')
            .reduce((sum, order) => sum + order.total, 0);
            
        const lastMonthRevenue = lastMonthOrders
            .filter(o => o.estadoPago === 'pagado')
            .reduce((sum, order) => sum + order.total, 0);

        return {
            pending: this.orders.filter(o => o.estado === 'pendiente').length,
            thisMonth: {
                count: thisMonthOrders.length,
                revenue: thisMonthRevenue
            },
            lastMonth: {
                count: lastMonthOrders.length,
                revenue: lastMonthRevenue
            },
            revenueChange: lastMonthRevenue > 0 ? 
                ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0
        };
    }
}

// Initialize order manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pedidos-section')) {
        window.orderManager = new OrderManager();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderManager;
}