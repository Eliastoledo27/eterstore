/**
 * Sistema CRUD Completo para Gestión de Productos
 * Éter Store - Panel de Administración
 */

class ProductCRUDManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.selectedProducts = new Set();
        this.currentEditingId = null;
        this.syncStatus = 'synced';

        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.renderProducts();
        this.updateStatistics();
    }

    // ===== DATA MANAGEMENT =====

    loadProducts() {
        const savedProducts = localStorage.getItem('eterStore_products');
        if (savedProducts) {
            this.products = JSON.parse(savedProducts);
        } else {
            // Productos por defecto si no hay datos
            this.products = this.getDefaultProducts();
            this.saveProducts();
        }
        this.filteredProducts = [...this.products];
    }

    saveProducts() {
        localStorage.setItem('eterStore_products', JSON.stringify(this.products));
        this.syncWithCatalog();
        this.showNotification('Productos guardados correctamente', 'success');
    }

    getDefaultProducts() {
        return [
            {
                id: 1,
                name: "Zapatillas Running Pro",
                description: "Zapatillas deportivas de alto rendimiento con tecnología de amortiguación avanzada. Perfectas para corredores profesionales y aficionados.",
                price: 125000,
                image: "images/products/running-shoes.svg",
                category: "deportivo",
                stock: 25,
                rating: 4.8,
                reviews: 156,
                status: "active",
                featured: true,
                newArrival: false,
                tags: ["deportivo", "running", "cómodo"],
                seo: "zapatillas-running-pro",
                dateCreated: new Date().toISOString(),
                dateModified: new Date().toISOString()
            },
            {
                id: 2,
                name: "Botas de Cuero Premium",
                description: "Botas elegantes de cuero genuino con suela de goma resistente. Ideal para uso diario y ocasiones especiales.",
                price: 185000,
                image: "images/products/leather-boots.svg",
                category: "casual",
                stock: 18,
                rating: 4.7,
                reviews: 89,
                status: "active",
                featured: false,
                newArrival: true,
                tags: ["cuero", "elegante", "resistente"],
                seo: "botas-cuero-premium",
                dateCreated: new Date().toISOString(),
                dateModified: new Date().toISOString()
            }
        ];
    }

    // ===== CRUD OPERATIONS =====

    createProduct(productData) {
        try {
            // Validar datos
            const validation = this.validateProductData(productData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Generar nuevo ID
            const newId = this.generateNewId();

            // Crear producto
            const newProduct = {
                id: newId,
                ...productData,
                dateCreated: new Date().toISOString(),
                dateModified: new Date().toISOString(),
                seo: productData.seo || this.generateSlug(productData.name),
                tags: productData.tags ? productData.tags.split(',').map(tag => tag.trim()) : []
            };

            this.products.push(newProduct);
            this.saveProducts();
            this.renderProducts();
            this.updateStatistics();

            this.showNotification(`Producto "${newProduct.name}" creado exitosamente`, 'success');
            return { success: true, product: newProduct };

        } catch (error) {
            this.showNotification(`Error al crear producto: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    updateProduct(id, productData) {
        try {
            const index = this.products.findIndex(p => p.id === parseInt(id));
            if (index === -1) {
                throw new Error('Producto no encontrado');
            }

            // Validar datos
            const validation = this.validateProductData(productData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Actualizar producto
            this.products[index] = {
                ...this.products[index],
                ...productData,
                id: parseInt(id), // Mantener ID original
                dateModified: new Date().toISOString(),
                seo: productData.seo || this.generateSlug(productData.name),
                tags: productData.tags ? productData.tags.split(',').map(tag => tag.trim()) : []
            };

            this.saveProducts();
            this.renderProducts();
            this.updateStatistics();

            this.showNotification(`Producto "${this.products[index].name}" actualizado exitosamente`, 'success');
            return { success: true, product: this.products[index] };

        } catch (error) {
            this.showNotification(`Error al actualizar producto: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    deleteProduct(id) {
        try {
            const index = this.products.findIndex(p => p.id === parseInt(id));
            if (index === -1) {
                throw new Error('Producto no encontrado');
            }

            const productName = this.products[index].name;
            this.products.splice(index, 1);

            this.saveProducts();
            this.renderProducts();
            this.updateStatistics();

            this.showNotification(`Producto "${productName}" eliminado exitosamente`, 'success');
            return { success: true };

        } catch (error) {
            this.showNotification(`Error al eliminar producto: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    bulkDelete(ids) {
        try {
            const idsToDelete = Array.from(ids).map(id => parseInt(id));
            const deletedCount = idsToDelete.length;

            this.products = this.products.filter(p => !idsToDelete.includes(p.id));

            this.saveProducts();
            this.renderProducts();
            this.updateStatistics();
            this.clearSelection();

            this.showNotification(`${deletedCount} productos eliminados exitosamente`, 'success');
            return { success: true, count: deletedCount };

        } catch (error) {
            this.showNotification(`Error al eliminar productos: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    bulkUpdate(ids, updateData) {
        try {
            const idsToUpdate = Array.from(ids).map(id => parseInt(id));
            let updatedCount = 0;

            this.products.forEach((product, index) => {
                if (idsToUpdate.includes(product.id)) {
                    // Aplicar actualizaciones según el tipo
                    if (updateData.category) {
                        this.products[index].category = updateData.category;
                    }

                    if (updateData.status) {
                        this.products[index].status = updateData.status;
                    }

                    if (updateData.stockAction && updateData.stockValue !== undefined) {
                        const currentStock = this.products[index].stock;
                        const value = parseInt(updateData.stockValue);

                        switch (updateData.stockAction) {
                            case 'set':
                                this.products[index].stock = value;
                                break;
                            case 'add':
                                this.products[index].stock = currentStock + value;
                                break;
                            case 'subtract':
                                this.products[index].stock = Math.max(0, currentStock - value);
                                break;
                        }
                    }

                    if (updateData.priceAction && updateData.priceValue !== undefined) {
                        const currentPrice = this.products[index].price;
                        const value = parseFloat(updateData.priceValue);

                        switch (updateData.priceAction) {
                            case 'set':
                                this.products[index].price = value;
                                break;
                            case 'increase':
                                this.products[index].price = currentPrice * (1 + value / 100);
                                break;
                            case 'decrease':
                                this.products[index].price = currentPrice * (1 - value / 100);
                                break;
                        }
                    }

                    this.products[index].dateModified = new Date().toISOString();
                    updatedCount++;
                }
            });

            this.saveProducts();
            this.renderProducts();
            this.updateStatistics();
            this.clearSelection();

            this.showNotification(`${updatedCount} productos actualizados exitosamente`, 'success');
            return { success: true, count: updatedCount };

        } catch (error) {
            this.showNotification(`Error al actualizar productos: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    // ===== VALIDATION =====

    validateProductData(data) {
        const errors = [];

        if (!data.name || data.name.trim().length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        }

        if (!data.description || data.description.trim().length < 10) {
            errors.push('La descripción debe tener al menos 10 caracteres');
        }

        if (!data.category) {
            errors.push('Debe seleccionar una categoría');
        }

        if (!data.price || data.price <= 0) {
            errors.push('El precio debe ser mayor a 0');
        }

        if (data.stock === undefined || data.stock < 0) {
            errors.push('El stock no puede ser negativo');
        }

        if (!data.image) {
            errors.push('Debe proporcionar una imagen');
        }

        if (!data.rating || data.rating < 0 || data.rating > 5) {
            errors.push('El rating debe estar entre 0 y 5');
        }

        if (!data.reviews || data.reviews < 0) {
            errors.push('El número de reseñas no puede ser negativo');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // ===== UTILITY FUNCTIONS =====

    generateNewId() {
        return this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    }

    generateSlug(name) {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    formatPrice(price) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    isPremiumProduct(product) {
        return product.price > 35000;
    }

    // ===== FILTERING AND SEARCH =====

    applyFilters() {
        const categoryFilter = document.getElementById('adminCategoryFilter')?.value || '';
        const stockFilter = document.getElementById('adminStockFilter')?.value || '';
        const priceFilter = document.getElementById('adminPriceFilter')?.value || '';
        const searchFilter = document.getElementById('adminSearchFilter')?.value.toLowerCase() || '';

        this.filteredProducts = this.products.filter(product => {
            // Filtro de categoría
            if (categoryFilter && product.category !== categoryFilter) {
                return false;
            }

            // Filtro de stock
            if (stockFilter) {
                switch (stockFilter) {
                    case 'in-stock':
                        if (product.stock <= 0) return false;
                        break;
                    case 'low-stock':
                        if (product.stock > 5) return false;
                        break;
                    case 'out-of-stock':
                        if (product.stock > 0) return false;
                        break;
                }
            }

            // Filtro de precio
            if (priceFilter) {
                switch (priceFilter) {
                    case 'premium':
                        if (!this.isPremiumProduct(product)) return false;
                        break;
                    case 'standard':
                        if (this.isPremiumProduct(product)) return false;
                        break;
                }
            }

            // Filtro de búsqueda
            if (searchFilter) {
                const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
                if (!searchableText.includes(searchFilter)) return false;
            }

            return true;
        });

        this.renderProducts();
    }

    clearFilters() {
        document.getElementById('adminCategoryFilter').value = '';
        document.getElementById('adminStockFilter').value = '';
        document.getElementById('adminPriceFilter').value = '';
        document.getElementById('adminSearchFilter').value = '';

        this.filteredProducts = [...this.products];
        this.renderProducts();
    }

    // ===== RENDERING =====

    renderProducts() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.filteredProducts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="11" style="text-align: center; padding: 2rem; color: #666;">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        No se encontraron productos
                    </td>
                </tr>
            `;
            return;
        }

        this.filteredProducts.forEach(product => {
            const row = document.createElement('tr');
            row.dataset.productId = product.id;

            const isSelected = this.selectedProducts.has(product.id);
            if (isSelected) {
                row.classList.add('selected');
            }

            const stockBadgeClass = product.stock > 5 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
            const stockBadgeText = product.stock > 0 ? product.stock : 'Agotado';

            row.innerHTML = `
                <td>
                    <input type="checkbox" ${isSelected ? 'checked' : ''}
                           onchange="productCRUD.toggleProductSelection(${product.id})">
                </td>
                <td>${product.id}</td>
                <td>
                    <div class="product-image">
                        ${product.image.includes('.svg') || product.image.includes('.jpg') || product.image.includes('.png')
                            ? `<img src="${product.image}" alt="${product.name}">`
                            : `<i class="${product.image}"></i>`}
                    </div>
                </td>
                <td>
                    <strong>${product.name}</strong>
                    ${product.featured ? '<span class="badge-featured">★ Destacado</span>' : ''}
                    ${product.newArrival ? '<span class="badge-new">Nuevo</span>' : ''}
                </td>
                <td><span class="category-badge">${product.category}</span></td>
                <td><strong>${this.formatPrice(product.price)}</strong></td>
                <td><span class="stock-badge ${stockBadgeClass}">${stockBadgeText}</span></td>
                <td><span class="premium-status ${this.isPremiumProduct(product) ? 'premium' : 'standard'}">
                    ${this.isPremiumProduct(product) ? 'Premium' : 'Estándar'}
                </span></td>
                <td>
                    <div class="rating-display">
                        ${this.generateStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                </td>
                <td><span class="status-indicator ${product.status}">${this.getStatusText(product.status)}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-secondary" onclick="productCRUD.editProduct(${product.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="productCRUD.duplicateProduct(${product.id})" title="Duplicar">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="productCRUD.confirmDeleteProduct(${product.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(row);
        });
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    getStatusText(status) {
        const statusMap = {
            'active': 'Activo',
            'inactive': 'Inactivo',
            'draft': 'Borrador'
        };
        return statusMap[status] || status;
    }

    updateStatistics() {
        const totalProducts = this.products.length;
        const premiumProducts = this.products.filter(p => this.isPremiumProduct(p)).length;
        const lowStockProducts = this.products.filter(p => p.stock <= 5 && p.stock > 0).length;
        const outOfStockProducts = this.products.filter(p => p.stock === 0).length;

        // Actualizar elementos en el DOM
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };

        updateElement('totalProductsCount', totalProducts);
        updateElement('premiumProductsCount', premiumProducts);
        updateElement('lowStockCount', lowStockProducts);
        updateElement('outOfStockCount', outOfStockProducts);

        // También actualizar en dashboard si existe
        updateElement('totalProducts', totalProducts);
        updateElement('lowStockProducts', lowStockProducts);
    }

    // ===== SELECTION MANAGEMENT =====

    toggleProductSelection(productId) {
        if (this.selectedProducts.has(productId)) {
            this.selectedProducts.delete(productId);
        } else {
            this.selectedProducts.add(productId);
        }

        this.updateSelectionUI();
        this.renderProducts();
    }

    toggleAllSelection() {
        const selectAllCheckbox = document.getElementById('selectAllProducts');

        if (selectAllCheckbox.checked) {
            // Seleccionar todos los productos filtrados
            this.filteredProducts.forEach(product => {
                this.selectedProducts.add(product.id);
            });
        } else {
            // Deseleccionar todos
            this.clearSelection();
        }

        this.updateSelectionUI();
        this.renderProducts();
    }

    clearSelection() {
        this.selectedProducts.clear();
        const selectAllCheckbox = document.getElementById('selectAllProducts');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
        }
        this.updateSelectionUI();
    }

    updateSelectionUI() {
        const selectedCount = this.selectedProducts.size;
        const bulkActions = document.getElementById('bulkActions');
        const selectedCountElement = document.getElementById('selectedCount');

        if (selectedCount > 0) {
            bulkActions.style.display = 'block';
            selectedCountElement.textContent = `${selectedCount} producto${selectedCount > 1 ? 's' : ''} seleccionado${selectedCount > 1 ? 's' : ''}`;
        } else {
            bulkActions.style.display = 'none';
        }
    }

    // ===== MODAL MANAGEMENT =====

    showAddProductModal() {
        this.currentEditingId = null;
        this.resetProductForm();
        document.getElementById('productModalTitle').textContent = 'Agregar Producto';
        document.getElementById('productModal').classList.add('active');
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === parseInt(id));
        if (!product) {
            this.showNotification('Producto no encontrado', 'error');
            return;
        }

        this.currentEditingId = id;
        this.populateProductForm(product);
        document.getElementById('productModalTitle').textContent = 'Editar Producto';
        document.getElementById('productModal').classList.add('active');
    }

    duplicateProduct(id) {
        const product = this.products.find(p => p.id === parseInt(id));
        if (!product) {
            this.showNotification('Producto no encontrado', 'error');
            return;
        }

        const duplicatedProduct = {
            ...product,
            name: product.name + ' (Copia)',
            seo: product.seo + '-copia'
        };

        delete duplicatedProduct.id; // Se generará un nuevo ID

        this.currentEditingId = null;
        this.populateProductForm(duplicatedProduct);
        document.getElementById('productModalTitle').textContent = 'Duplicar Producto';
        document.getElementById('productModal').classList.add('active');
    }

    confirmDeleteProduct(id) {
        const product = this.products.find(p => p.id === parseInt(id));
        if (!product) {
            this.showNotification('Producto no encontrado', 'error');
            return;
        }

        if (confirm(`¿Estás seguro de que deseas eliminar "${product.name}"?`)) {
            this.deleteProduct(id);
        }
    }

    populateProductForm(product) {
        document.getElementById('productId').value = product.id || '';
        document.getElementById('productName').value = product.name || '';
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productCategory').value = product.category || '';
        document.getElementById('productPrice').value = product.price || '';
        document.getElementById('productStock').value = product.stock || '';
        document.getElementById('productImage').value = product.image || '';
        document.getElementById('productRating').value = product.rating || '';
        document.getElementById('productReviews').value = product.reviews || '';
        document.getElementById('productStatus').value = product.status || 'active';
        document.getElementById('productFeatured').checked = product.featured || false;
        document.getElementById('productNewArrival').checked = product.newArrival || false;
        document.getElementById('productTags').value = Array.isArray(product.tags) ? product.tags.join(', ') : '';
        document.getElementById('productSeo').value = product.seo || '';

        // Actualizar contador de descripción
        this.updateDescriptionCounter();

        // Mostrar vista previa de imagen si existe
        this.updateImagePreview();
    }

    resetProductForm() {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('productStatus').value = 'active';
        document.getElementById('descriptionCount').textContent = '0/500';
        document.getElementById('imagePreview').style.display = 'none';
    }

    updateDescriptionCounter() {
        const textarea = document.getElementById('productDescription');
        const counter = document.getElementById('descriptionCount');
        if (textarea && counter) {
            const length = textarea.value.length;
            counter.textContent = `${length}/500`;

            if (length > 450) {
                counter.style.color = '#dc3545';
            } else if (length > 300) {
                counter.style.color = '#ffc107';
            } else {
                counter.style.color = '#6c757d';
            }
        }
    }

    updateImagePreview() {
        const imageInput = document.getElementById('productImage');
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');

        if (imageInput && preview && previewImg) {
            const imagePath = imageInput.value;
            if (imagePath) {
                previewImg.src = imagePath;
                preview.style.display = 'block';
                preview.classList.add('loaded');
            } else {
                preview.style.display = 'none';
                preview.classList.remove('loaded');
            }
        }
    }

    // ===== SYNC FUNCTIONALITY =====

    syncWithCatalog() {
        try {
            this.setSyncStatus('syncing');

            // Simular sincronización
            setTimeout(() => {
                // Disparar evento personalizado para que productos.html se actualice
                window.dispatchEvent(new CustomEvent('productsUpdated', {
                    detail: this.products
                }));

                this.setSyncStatus('synced');
                console.log('Catálogo sincronizado exitosamente');
            }, 1000);

        } catch (error) {
            this.setSyncStatus('error');
            this.showNotification('Error al sincronizar catálogo', 'error');
        }
    }

    setSyncStatus(status) {
        this.syncStatus = status;
        const syncButton = document.getElementById('syncProductsBtn');
        const syncIcon = syncButton?.querySelector('i');

        if (syncButton && syncIcon) {
            syncIcon.className = status === 'syncing' ? 'fas fa-sync fa-spin' : 'fas fa-sync';
            syncButton.disabled = status === 'syncing';
        }
    }

    // ===== EXPORT/IMPORT =====

    exportProducts(selectedOnly = false) {
        try {
            const productsToExport = selectedOnly ?
                this.products.filter(p => this.selectedProducts.has(p.id)) :
                this.products;

            const dataStr = JSON.stringify(productsToExport, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `productos-eter-store-${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            this.showNotification(`${productsToExport.length} productos exportados exitosamente`, 'success');

        } catch (error) {
            this.showNotification(`Error al exportar productos: ${error.message}`, 'error');
        }
    }

    /**
     * Importar productos desde archivo XML (.xml)
     */
    importProductsFromXmlFile(file) {
        try {
            if (!file) {
                this.showNotification('No se seleccionó ningún archivo XML', 'warning');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const xmlText = e.target.result;
                    const imported = this.parseProductsFromXml(xmlText);

                    if (!Array.isArray(imported) || imported.length === 0) {
                        throw new Error('El XML no contiene productos válidos');
                    }

                    // Normalizar y asignar IDs
                    const validProducts = imported.map((p, idx) => ({
                        id: this.generateNewId() + idx,
                        name: p.name,
                        description: p.description || '',
                        category: p.category || 'otros',
                        price: Number(p.price) || 0,
                        stock: Number(p.stock ?? 10),
                        image: p.image || '',
                        rating: Number(p.rating ?? 4.5),
                        reviews: Number(p.reviews ?? 0),
                        status: p.status || 'active',
                        featured: Boolean(p.featured ?? false),
                        newArrival: Boolean(p.newArrival ?? false),
                        tags: Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? p.tags.split(',').map(t => t.trim()) : []),
                        seo: p.seo || this.generateSlug(p.name),
                        dateCreated: new Date().toISOString(),
                        dateModified: new Date().toISOString()
                    }));

                    this.products.push(...validProducts);
                    this.filteredProducts = [...this.products];
                    this.saveProducts();
                    this.renderProducts();
                    this.updateStatistics();

                    this.showNotification(`${validProducts.length} productos importados desde XML`, 'success');
                } catch (err) {
                    this.showNotification(`Error al procesar XML: ${err.message}`, 'error');
                }
            };
            reader.readAsText(file);
        } catch (error) {
            this.showNotification(`Error al importar XML: ${error.message}`, 'error');
        }
    }

    /**
     * Parsear XML a objetos de producto (acepta estructura <catalogo><productos><producto>...)
     */
    parseProductsFromXml(xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

        // Detectar errores de parseo
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            throw new Error('XML inválido');
        }

        const productsNodes = xmlDoc.querySelectorAll('catalogo > productos > producto, producto');
        const parsed = [];
        productsNodes.forEach(node => {
            const get = (sel) => node.querySelector(sel)?.textContent?.trim() || '';
            parsed.push({
                name: get('nombre'),
                category: get('categoria'),
                price: get('precio'),
                image: get('imagen'),
                // Campos opcionales/extendidos si existieran
                description: get('descripcion') || get('descripción') || '',
                stock: get('stock'),
                rating: get('rating'),
                reviews: get('reseñas') || get('reviews'),
                status: get('estado'),
                seo: get('seo'),
                tags: get('etiquetas')
            });
        });

        // Validar nombre mínimo
        return parsed.filter(p => p.name && p.name.length >= 1);
    }

    importProducts(file) {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedProducts = JSON.parse(e.target.result);

                    if (!Array.isArray(importedProducts)) {
                        throw new Error('El archivo no contiene un array de productos válido');
                    }

                    // Validar productos importados
                    const validProducts = [];
                    const errors = [];

                    importedProducts.forEach((product, index) => {
                        const validation = this.validateProductData(product);
                        if (validation.isValid) {
                            // Asignar nuevo ID para evitar conflictos
                            product.id = this.generateNewId() + validProducts.length;
                            product.dateCreated = new Date().toISOString();
                            product.dateModified = new Date().toISOString();
                            validProducts.push(product);
                        } else {
                            errors.push(`Producto ${index + 1}: ${validation.errors.join(', ')}`);
                        }
                    });

                    if (validProducts.length > 0) {
                        this.products.push(...validProducts);
                        this.saveProducts();
                        this.renderProducts();
                        this.updateStatistics();

                        this.showNotification(`${validProducts.length} productos importados exitosamente`, 'success');

                        if (errors.length > 0) {
                            console.warn('Errores en importación:', errors);
                        }
                    } else {
                        throw new Error('No se encontraron productos válidos para importar');
                    }

                } catch (parseError) {
                    this.showNotification(`Error al procesar archivo: ${parseError.message}`, 'error');
                }
            };

            reader.readAsText(file);

        } catch (error) {
            this.showNotification(`Error al importar productos: ${error.message}`, 'error');
        }
    }

    // ===== EVENT LISTENERS =====

    setupEventListeners() {
        // Modal events
        document.getElementById('addProductBtn')?.addEventListener('click', () => this.showAddProductModal());
        document.getElementById('closeProductModal')?.addEventListener('click', () => this.closeModal('productModal'));
        document.getElementById('cancelProduct')?.addEventListener('click', () => this.closeModal('productModal'));

        // Form submission
        document.getElementById('productForm')?.addEventListener('submit', (e) => this.handleProductSubmit(e));

        // Filter events
        document.getElementById('adminCategoryFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('adminStockFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('adminPriceFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('adminSearchFilter')?.addEventListener('input', this.debounce(() => this.applyFilters(), 300));
        document.getElementById('clearAdminFilters')?.addEventListener('click', () => this.clearFilters());

        // Selection events
        document.getElementById('selectAllProducts')?.addEventListener('change', () => this.toggleAllSelection());

        // Bulk actions
        document.getElementById('bulkDeleteBtn')?.addEventListener('click', () => this.handleBulkDelete());
        document.getElementById('bulkEditBtn')?.addEventListener('click', () => this.showBulkEditModal());
        document.getElementById('bulkExportBtn')?.addEventListener('click', () => this.exportProducts(true));

        // Sync and import/export
        document.getElementById('syncProductsBtn')?.addEventListener('click', () => this.syncWithCatalog());
        document.getElementById('exportProductsBtn')?.addEventListener('click', () => this.exportProducts(false));
        document.getElementById('importProductsBtn')?.addEventListener('click', () => this.triggerFileImport());

        // Form helpers
        document.getElementById('productDescription')?.addEventListener('input', () => this.updateDescriptionCounter());
        document.getElementById('productImage')?.addEventListener('input', () => this.updateImagePreview());
        document.getElementById('productName')?.addEventListener('input', (e) => this.generateSeoSlug(e.target.value));
    }

    handleProductSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const productData = {
            name: formData.get('productName'),
            description: formData.get('productDescription'),
            category: formData.get('productCategory'),
            price: parseFloat(formData.get('productPrice')),
            stock: parseInt(formData.get('productStock')),
            image: formData.get('productImage'),
            rating: parseFloat(formData.get('productRating')),
            reviews: parseInt(formData.get('productReviews')),
            status: formData.get('productStatus') || 'active',
            featured: formData.has('productFeatured'),
            newArrival: formData.has('productNewArrival'),
            tags: formData.get('productTags') || '',
            seo: formData.get('productSeo') || ''
        };

        let result;
        if (this.currentEditingId) {
            result = this.updateProduct(this.currentEditingId, productData);
        } else {
            result = this.createProduct(productData);
        }

        if (result.success) {
            this.closeModal('productModal');
        }
    }

    handleBulkDelete() {
        if (this.selectedProducts.size === 0) {
            this.showNotification('No hay productos seleccionados', 'warning');
            return;
        }

        const count = this.selectedProducts.size;
        if (confirm(`¿Estás seguro de que deseas eliminar ${count} producto${count > 1 ? 's' : ''}?`)) {
            this.bulkDelete(this.selectedProducts);
        }
    }

    showBulkEditModal() {
        if (this.selectedProducts.size === 0) {
            this.showNotification('No hay productos seleccionados', 'warning');
            return;
        }

        document.getElementById('bulkEditModal').classList.add('active');
    }

    triggerFileImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.importProducts(file);
            }
        };
        input.click();
    }

    generateSeoSlug(name) {
        const seoInput = document.getElementById('productSeo');
        if (seoInput && !seoInput.value) {
            seoInput.value = this.generateSlug(name);
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        if (modalId === 'productModal') {
            this.currentEditingId = null;
        }
    }

    // ===== UTILITIES =====

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
    }

    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Mostrar notificación
        setTimeout(() => notification.classList.add('show'), 100);

        // Ocultar y remover notificación
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Inicializar el sistema CRUD cuando el DOM esté listo
let productCRUD;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productsTable')) {
        productCRUD = new ProductCRUDManager();

        // Hacer disponible globalmente para uso en HTML
        window.productCRUD = productCRUD;

        // función global para el input Importar XML en admin.html
        window.importarXML = function(event) {
            const file = event.target.files && event.target.files[0];
            if (file && productCRUD && typeof productCRUD.importProductsFromXmlFile === 'function') {
                productCRUD.importProductsFromXmlFile(file);
            }
        };
    }
});

// Exportar para uso como módulo si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductCRUDManager;
}
