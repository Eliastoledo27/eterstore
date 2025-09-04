/**
 * Product Manager Module - Handles all product-related operations
 * CRUD operations, filtering, search, import/export functionality
 */

class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentFilters = {
            search: '',
            category: '',
            status: '',
            stock: '',
            priceRange: { min: 0, max: 0 }
        };
        this.sortConfig = {
            field: 'nombre',
            direction: 'asc'
        };
        this.pagination = {
            currentPage: 1,
            itemsPerPage: 10,
            totalPages: 1
        };
        this.selectedProducts = new Set();
        
        this.init();
    }

    /**
     * Initialize product manager
     */
    async init() {
        try {
            await this.loadProducts();
            this.setupEventListeners();
            this.renderProductsTable();
            this.updateStatistics();
            console.log('✅ Product Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Product Manager:', error);
        }
    }

    /**
     * Load products from localStorage
     */
    async loadProducts() {
        try {
            const storedProducts = localStorage.getItem('productos');
            this.products = storedProducts ? JSON.parse(storedProducts) : this.getDefaultProducts();
            this.filteredProducts = [...this.products];
            this.updatePagination();
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = this.getDefaultProducts();
            this.filteredProducts = [...this.products];
        }
    }

    /**
     * Get default products if none exist
     */
    getDefaultProducts() {
        return [
            {
                id: 1,
                nombre: 'Collar Místico Luna',
                categoria: 'Collares',
                descripcion: 'Collar artesanal con colgante de luna y cristales naturales',
                precio: 45000,
                stock: 15,
                imagen: 'images/productos/collar-luna.jpg',
                rating: 4.8,
                reseñas: 24,
                estado: 'activo',
                destacado: true,
                nuevoLanzamiento: false,
                etiquetas: ['místico', 'luna', 'cristales'],
                slug: 'collar-mistico-luna',
                fechaCreacion: new Date().toISOString(),
                fechaActualizacion: new Date().toISOString()
            },
            {
                id: 2,
                nombre: 'Anillo Éter Dorado',
                categoria: 'Anillos',
                descripcion: 'Anillo de plata bañado en oro con diseño etéreo',
                precio: 32000,
                stock: 8,
                imagen: 'images/productos/anillo-eter.jpg',
                rating: 4.9,
                reseñas: 18,
                estado: 'activo',
                destacado: false,
                nuevoLanzamiento: true,
                etiquetas: ['dorado', 'éter', 'elegante'],
                slug: 'anillo-eter-dorado',
                fechaCreacion: new Date().toISOString(),
                fechaActualizacion: new Date().toISOString()
            },
            {
                id: 3,
                nombre: 'Pulsera Chakras',
                categoria: 'Pulseras',
                descripcion: 'Pulsera con piedras de los 7 chakras para equilibrio energético',
                precio: 28000,
                stock: 0,
                imagen: 'images/productos/pulsera-chakras.jpg',
                rating: 4.7,
                reseñas: 31,
                estado: 'agotado',
                destacado: true,
                nuevoLanzamiento: false,
                etiquetas: ['chakras', 'energía', 'equilibrio'],
                slug: 'pulsera-chakras',
                fechaCreacion: new Date().toISOString(),
                fechaActualizacion: new Date().toISOString()
            }
        ];
    }

    /**
     * Save products to localStorage
     */
    async saveProducts() {
        try {
            localStorage.setItem('productos', JSON.stringify(this.products));
            
            // Also update the main products data for the website
            if (window.productosData) {
                window.productosData.productos = this.products;
            }
            
            console.log('✅ Products saved successfully');
        } catch (error) {
            console.error('❌ Error saving products:', error);
            throw error;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            });
        }

        // Filter selects
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
        }

        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.applyFilters();
            });
        }

        const stockFilter = document.getElementById('stock-filter');
        if (stockFilter) {
            stockFilter.addEventListener('change', (e) => {
                this.currentFilters.stock = e.target.value;
                this.applyFilters();
            });
        }

        // Add product button
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.showProductModal();
            });
        }

        // Bulk actions
        const bulkActionSelect = document.getElementById('bulk-action');
        const applyBulkBtn = document.getElementById('apply-bulk-action');
        
        if (applyBulkBtn) {
            applyBulkBtn.addEventListener('click', () => {
                const action = bulkActionSelect?.value;
                if (action && this.selectedProducts.size > 0) {
                    this.applyBulkAction(action);
                }
            });
        }

        // Export/Import buttons
        const exportBtn = document.getElementById('export-products-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportProducts();
            });
        }

        const importBtn = document.getElementById('import-products-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.showImportModal();
            });
        }

        // Product form submission
        const productForm = document.getElementById('product-form');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProductSubmit(e.target);
            });
        }

        // Select all checkbox
        const selectAllCheckbox = document.getElementById('select-all-products');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }
    }

    /**
     * Apply current filters
     */
    applyFilters() {
        let filtered = [...this.products];

        // Search filter
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(product => 
                product.nombre.toLowerCase().includes(searchTerm) ||
                product.categoria.toLowerCase().includes(searchTerm) ||
                product.descripcion.toLowerCase().includes(searchTerm) ||
                (product.etiquetas && product.etiquetas.some(tag => 
                    tag.toLowerCase().includes(searchTerm)
                ))
            );
        }

        // Category filter
        if (this.currentFilters.category) {
            filtered = filtered.filter(product => 
                product.categoria === this.currentFilters.category
            );
        }

        // Status filter
        if (this.currentFilters.status) {
            filtered = filtered.filter(product => 
                product.estado === this.currentFilters.status
            );
        }

        // Stock filter
        if (this.currentFilters.stock) {
            switch (this.currentFilters.stock) {
                case 'in-stock':
                    filtered = filtered.filter(product => product.stock > 0);
                    break;
                case 'low-stock':
                    filtered = filtered.filter(product => product.stock > 0 && product.stock < 5);
                    break;
                case 'out-of-stock':
                    filtered = filtered.filter(product => product.stock === 0);
                    break;
            }
        }

        this.filteredProducts = filtered;
        this.pagination.currentPage = 1;
        this.updatePagination();
        this.renderProductsTable();
        this.updateStatistics();
    }

    /**
     * Update pagination
     */
    updatePagination() {
        this.pagination.totalPages = Math.ceil(
            this.filteredProducts.length / this.pagination.itemsPerPage
        );
        
        if (this.pagination.currentPage > this.pagination.totalPages) {
            this.pagination.currentPage = 1;
        }
    }

    /**
     * Get paginated products
     */
    getPaginatedProducts() {
        const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
        const endIndex = startIndex + this.pagination.itemsPerPage;
        return this.filteredProducts.slice(startIndex, endIndex);
    }

    /**
     * Render products table
     */
    renderProductsTable() {
        const tableBody = document.getElementById('products-table-body');
        if (!tableBody) return;

        const paginatedProducts = this.getPaginatedProducts();

        if (paginatedProducts.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-8">
                        <div class="empty-state">
                            <p class="text-muted">No se encontraron productos</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = paginatedProducts.map(product => `
            <tr data-product-id="${product.id}">
                <td>
                    <input type="checkbox" 
                           class="product-checkbox" 
                           value="${product.id}"
                           ${this.selectedProducts.has(product.id) ? 'checked' : ''}>
                </td>
                <td>
                    <div class="product-info">
                        <img src="${product.imagen}" 
                             alt="${product.nombre}" 
                             class="product-thumbnail"
                             onerror="this.src='images/placeholder.jpg'">
                        <div>
                            <strong>${product.nombre}</strong>
                            <div class="text-muted text-sm">${product.categoria}</div>
                        </div>
                    </div>
                </td>
                <td>$${product.precio.toLocaleString()}</td>
                <td>
                    <span class="badge ${this.getStockBadgeClass(product.stock)}">
                        ${product.stock} unidades
                    </span>
                </td>
                <td>
                    <span class="badge ${product.estado}">
                        ${this.getStatusText(product.estado)}
                    </span>
                </td>
                <td>
                    <div class="rating">
                        ${'★'.repeat(Math.floor(product.rating))}
                        <span class="text-muted">(${product.reseñas})</span>
                    </div>
                </td>
                <td>
                    <div class="product-flags">
                        ${product.destacado ? '<span class="badge primary">Destacado</span>' : ''}
                        ${product.nuevoLanzamiento ? '<span class="badge success">Nuevo</span>' : ''}
                    </div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="table-action edit" 
                                onclick="productManager.editProduct(${product.id})"
                                data-tooltip="Editar">
                            ✏️
                        </button>
                        <button class="table-action delete" 
                                onclick="productManager.deleteProduct(${product.id})"
                                data-tooltip="Eliminar">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Setup checkbox listeners
        this.setupCheckboxListeners();
        
        // Render pagination
        this.renderPagination();
    }

    /**
     * Setup checkbox listeners
     */
    setupCheckboxListeners() {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const productId = parseInt(e.target.value);
                if (e.target.checked) {
                    this.selectedProducts.add(productId);
                } else {
                    this.selectedProducts.delete(productId);
                }
                this.updateBulkActionsState();
            });
        });
    }

    /**
     * Toggle select all products
     */
    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const productId = parseInt(checkbox.value);
            if (checked) {
                this.selectedProducts.add(productId);
            } else {
                this.selectedProducts.delete(productId);
            }
        });
        this.updateBulkActionsState();
    }

    /**
     * Update bulk actions state
     */
    updateBulkActionsState() {
        const bulkActions = document.getElementById('bulk-actions');
        const selectedCount = document.getElementById('selected-count');
        
        if (bulkActions) {
            bulkActions.style.display = this.selectedProducts.size > 0 ? 'flex' : 'none';
        }
        
        if (selectedCount) {
            selectedCount.textContent = this.selectedProducts.size;
        }
    }

    /**
     * Get stock badge class
     */
    getStockBadgeClass(stock) {
        if (stock === 0) return 'danger';
        if (stock < 5) return 'warning';
        return 'success';
    }

    /**
     * Get status text
     */
    getStatusText(status) {
        const statusMap = {
            'activo': 'Activo',
            'inactivo': 'Inactivo',
            'agotado': 'Agotado',
            'descontinuado': 'Descontinuado'
        };
        return statusMap[status] || status;
    }

    /**
     * Render pagination
     */
    renderPagination() {
        const paginationContainer = document.getElementById('products-pagination');
        if (!paginationContainer) return;

        if (this.pagination.totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination">';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-item ${this.pagination.currentPage === 1 ? 'disabled' : ''}" 
                    onclick="productManager.goToPage(${this.pagination.currentPage - 1})">
                ‹
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= this.pagination.totalPages; i++) {
            if (i === 1 || i === this.pagination.totalPages || 
                (i >= this.pagination.currentPage - 2 && i <= this.pagination.currentPage + 2)) {
                paginationHTML += `
                    <button class="pagination-item ${i === this.pagination.currentPage ? 'active' : ''}" 
                            onclick="productManager.goToPage(${i})">
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
                    onclick="productManager.goToPage(${this.pagination.currentPage + 1})">
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
        this.renderProductsTable();
    }

    /**
     * Update statistics
     */
    updateStatistics() {
        const stats = {
            total: this.products.length,
            active: this.products.filter(p => p.estado === 'activo').length,
            lowStock: this.products.filter(p => p.stock > 0 && p.stock < 5).length,
            outOfStock: this.products.filter(p => p.stock === 0).length
        };

        // Update stat elements
        this.updateStatElement('total-products-stat', stats.total);
        this.updateStatElement('active-products-stat', stats.active);
        this.updateStatElement('low-stock-stat', stats.lowStock);
        this.updateStatElement('out-of-stock-stat', stats.outOfStock);
    }

    /**
     * Update stat element
     */
    updateStatElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toLocaleString();
        }
    }

    /**
     * Show product modal for adding/editing
     */
    showProductModal(product = null) {
        const modal = document.getElementById('product-modal');
        const form = document.getElementById('product-form');
        const title = document.getElementById('product-modal-title');
        
        if (!modal || !form) return;

        // Reset form
        form.reset();
        
        if (product) {
            // Edit mode
            title.textContent = 'Editar Producto';
            this.populateProductForm(form, product);
        } else {
            // Add mode
            title.textContent = 'Agregar Producto';
            // Set default values
            form.querySelector('#product-estado').value = 'activo';
            form.querySelector('#product-rating').value = '4.5';
            form.querySelector('#product-reseñas').value = '0';
        }

        modal.classList.add('show');
    }

    /**
     * Populate product form with data
     */
    populateProductForm(form, product) {
        const fields = {
            'product-id': product.id,
            'product-nombre': product.nombre,
            'product-categoria': product.categoria,
            'product-descripcion': product.descripcion,
            'product-precio': product.precio,
            'product-stock': product.stock,
            'product-imagen': product.imagen,
            'product-rating': product.rating,
            'product-reseñas': product.reseñas,
            'product-estado': product.estado,
            'product-destacado': product.destacado,
            'product-nuevo': product.nuevoLanzamiento,
            'product-etiquetas': product.etiquetas ? product.etiquetas.join(', ') : '',
            'product-slug': product.slug
        };

        Object.entries(fields).forEach(([fieldId, value]) => {
            const field = form.querySelector(`#${fieldId}`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = value;
                } else {
                    field.value = value;
                }
            }
        });
    }

    /**
     * Handle product form submission
     */
    async handleProductSubmit(form) {
        try {
            const formData = new FormData(form);
            const productData = this.extractProductData(formData);
            
            // Validate product data
            if (!this.validateProductData(productData)) {
                return;
            }

            const productId = productData.id;
            
            if (productId) {
                // Update existing product
                await this.updateProduct(productId, productData);
                window.adminCore.showSuccess('Producto actualizado exitosamente');
            } else {
                // Create new product
                await this.createProduct(productData);
                window.adminCore.showSuccess('Producto creado exitosamente');
            }

            // Close modal and refresh table
            this.closeProductModal();
            this.renderProductsTable();
            this.updateStatistics();
            
        } catch (error) {
            console.error('Error saving product:', error);
            window.adminCore.showError('Error al guardar el producto');
        }
    }

    /**
     * Extract product data from form
     */
    extractProductData(formData) {
        const etiquetas = formData.get('etiquetas');
        
        return {
            id: formData.get('id') ? parseInt(formData.get('id')) : null,
            nombre: formData.get('nombre').trim(),
            categoria: formData.get('categoria'),
            descripcion: formData.get('descripcion').trim(),
            precio: parseFloat(formData.get('precio')),
            stock: parseInt(formData.get('stock')),
            imagen: formData.get('imagen').trim(),
            rating: parseFloat(formData.get('rating')),
            reseñas: parseInt(formData.get('reseñas')),
            estado: formData.get('estado'),
            destacado: formData.has('destacado'),
            nuevoLanzamiento: formData.has('nuevo'),
            etiquetas: etiquetas ? etiquetas.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            slug: formData.get('slug').trim() || this.generateSlug(formData.get('nombre')),
            fechaActualizacion: new Date().toISOString()
        };
    }

    /**
     * Validate product data
     */
    validateProductData(data) {
        const errors = [];

        if (!data.nombre) errors.push('El nombre es requerido');
        if (!data.categoria) errors.push('La categoría es requerida');
        if (!data.descripcion) errors.push('La descripción es requerida');
        if (isNaN(data.precio) || data.precio <= 0) errors.push('El precio debe ser mayor a 0');
        if (isNaN(data.stock) || data.stock < 0) errors.push('El stock no puede ser negativo');
        if (!data.imagen) errors.push('La imagen es requerida');

        if (errors.length > 0) {
            window.adminCore.showError(errors.join('\n'));
            return false;
        }

        return true;
    }

    /**
     * Generate slug from name
     */
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/[ñ]/g, 'n')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    /**
     * Create new product
     */
    async createProduct(productData) {
        // Generate new ID
        const maxId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) : 0;
        productData.id = maxId + 1;
        productData.fechaCreacion = new Date().toISOString();
        
        // Add to products array
        this.products.push(productData);
        
        // Save to localStorage
        await this.saveProducts();
        
        // Update filtered products
        this.applyFilters();
    }

    /**
     * Update existing product
     */
    async updateProduct(productId, productData) {
        const index = this.products.findIndex(p => p.id === productId);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }
        
        // Preserve creation date
        productData.fechaCreacion = this.products[index].fechaCreacion;
        
        // Update product
        this.products[index] = productData;
        
        // Save to localStorage
        await this.saveProducts();
        
        // Update filtered products
        this.applyFilters();
    }

    /**
     * Edit product
     */
    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.showProductModal(product);
        }
    }

    /**
     * Delete product
     */
    async deleteProduct(productId) {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            return;
        }

        try {
            const index = this.products.findIndex(p => p.id === productId);
            if (index === -1) {
                throw new Error('Producto no encontrado');
            }

            // Remove from products array
            this.products.splice(index, 1);
            
            // Remove from selected products
            this.selectedProducts.delete(productId);
            
            // Save to localStorage
            await this.saveProducts();
            
            // Update display
            this.applyFilters();
            this.updateBulkActionsState();
            
            window.adminCore.showSuccess('Producto eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting product:', error);
            window.adminCore.showError('Error al eliminar el producto');
        }
    }

    /**
     * Close product modal
     */
    closeProductModal() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    /**
     * Apply bulk action
     */
    async applyBulkAction(action) {
        if (this.selectedProducts.size === 0) {
            window.adminCore.showError('No hay productos seleccionados');
            return;
        }

        try {
            const selectedIds = Array.from(this.selectedProducts);
            
            switch (action) {
                case 'activate':
                    await this.bulkUpdateStatus(selectedIds, 'activo');
                    window.adminCore.showSuccess(`${selectedIds.length} productos activados`);
                    break;
                    
                case 'deactivate':
                    await this.bulkUpdateStatus(selectedIds, 'inactivo');
                    window.adminCore.showSuccess(`${selectedIds.length} productos desactivados`);
                    break;
                    
                case 'feature':
                    await this.bulkUpdateFeature(selectedIds, true);
                    window.adminCore.showSuccess(`${selectedIds.length} productos destacados`);
                    break;
                    
                case 'unfeature':
                    await this.bulkUpdateFeature(selectedIds, false);
                    window.adminCore.showSuccess(`${selectedIds.length} productos no destacados`);
                    break;
                    
                case 'delete':
                    if (confirm(`¿Estás seguro de eliminar ${selectedIds.length} productos?`)) {
                        await this.bulkDelete(selectedIds);
                        window.adminCore.showSuccess(`${selectedIds.length} productos eliminados`);
                    }
                    break;
                    
                default:
                    window.adminCore.showError('Acción no válida');
                    return;
            }
            
            // Clear selection and refresh
            this.selectedProducts.clear();
            this.applyFilters();
            this.updateBulkActionsState();
            
        } catch (error) {
            console.error('Error applying bulk action:', error);
            window.adminCore.showError('Error al aplicar la acción masiva');
        }
    }

    /**
     * Bulk update status
     */
    async bulkUpdateStatus(productIds, status) {
        productIds.forEach(id => {
            const product = this.products.find(p => p.id === id);
            if (product) {
                product.estado = status;
                product.fechaActualizacion = new Date().toISOString();
            }
        });
        
        await this.saveProducts();
    }

    /**
     * Bulk update feature status
     */
    async bulkUpdateFeature(productIds, featured) {
        productIds.forEach(id => {
            const product = this.products.find(p => p.id === id);
            if (product) {
                product.destacado = featured;
                product.fechaActualizacion = new Date().toISOString();
            }
        });
        
        await this.saveProducts();
    }

    /**
     * Bulk delete products
     */
    async bulkDelete(productIds) {
        this.products = this.products.filter(product => !productIds.includes(product.id));
        await this.saveProducts();
    }

    /**
     * Export products to JSON
     */
    exportProducts() {
        try {
            const dataStr = JSON.stringify(this.products, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `productos-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            window.adminCore.showSuccess('Productos exportados exitosamente');
        } catch (error) {
            console.error('Error exporting products:', error);
            window.adminCore.showError('Error al exportar productos');
        }
    }

    /**
     * Show import modal
     */
    showImportModal() {
        const modal = document.getElementById('import-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    /**
     * Import products from file
     */
    async importProducts(file) {
        try {
            const text = await file.text();
            const importedProducts = JSON.parse(text);
            
            if (!Array.isArray(importedProducts)) {
                throw new Error('El archivo debe contener un array de productos');
            }
            
            // Validate imported products
            const validProducts = importedProducts.filter(product => {
                return product.nombre && product.categoria && product.precio;
            });
            
            if (validProducts.length === 0) {
                throw new Error('No se encontraron productos válidos en el archivo');
            }
            
            // Assign new IDs to avoid conflicts
            const maxId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) : 0;
            validProducts.forEach((product, index) => {
                product.id = maxId + index + 1;
                product.fechaCreacion = new Date().toISOString();
                product.fechaActualizacion = new Date().toISOString();
            });
            
            // Add to products
            this.products.push(...validProducts);
            
            // Save and refresh
            await this.saveProducts();
            this.applyFilters();
            this.updateStatistics();
            
            window.adminCore.showSuccess(`${validProducts.length} productos importados exitosamente`);
            
        } catch (error) {
            console.error('Error importing products:', error);
            window.adminCore.showError('Error al importar productos: ' + error.message);
        }
    }
}

// Initialize product manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productos-section')) {
        window.productManager = new ProductManager();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductManager;
}