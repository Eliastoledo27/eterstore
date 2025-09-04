// ===== PRODUCTOS.JS - Funcionalidades específicas para Gestión de Productos =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Productos Panel...');

    // Ocultar pantalla de carga después de 1.5 segundos
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
        }
    }, 1500);

    // Establecer usuario por defecto
    updateUserName('Product Manager');

    // Inicializar todas las funcionalidades
    initializeProducts();
    initializeNavigation();
    initializeNotifications();
    initializeSearch();
    initializeFilters();
    initializeEventListeners();

    console.log('✅ Productos Panel inicializado correctamente');
});

// ===== FUNCIONALIDADES PRINCIPALES =====

function initializeProducts() {
    console.log('📦 Inicializando funcionalidades de Productos...');

    // Cargar productos iniciales
    loadProducts();

    // Configurar contadores
    updateProductCount();

    // Configurar paginación
    setupPagination();
}

function initializeNavigation() {
    console.log('🧭 Inicializando navegación...');

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            document.body.classList.toggle('sidebar-collapsed');
        });
    }

    // User menu dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
            userMenuBtn.setAttribute('aria-expanded', userDropdown.classList.contains('show'));
        });

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', function() {
            userDropdown.classList.remove('show');
            userMenuBtn.setAttribute('aria-expanded', 'false');
        });
    }

    // Búsqueda en la barra superior
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
}

function initializeNotifications() {
    console.log('🔔 Inicializando sistema de notificaciones...');

    // Configurar botón de notificaciones
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotification('Sistema de notificaciones en desarrollo', 'info');
        });
    }
}

function initializeSearch() {
    console.log('🔍 Inicializando búsqueda...');

    // Búsqueda en el header
    const productSearchHeader = document.getElementById('productSearchHeader');
    if (productSearchHeader) {
        productSearchHeader.addEventListener('input', function() {
            filterProducts(this.value);
        });
    }
}

function initializeFilters() {
    console.log('🔧 Inicializando filtros...');

    // Filtro por categoría
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterByCategory(this.value);
        });
    }
}

function initializeEventListeners() {
    console.log('🎧 Configurando event listeners...');

    // Botón de exportación
    const exportBtn = document.getElementById('exportProductsBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportProducts();
        });
    }

    // Botón de edición masiva
    const bulkEditBtn = document.getElementById('bulkEditBtn');
    if (bulkEditBtn) {
        bulkEditBtn.addEventListener('click', function() {
            showBulkEditModal();
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Función de logout en desarrollo', 'info');
        });
    }
}

// ===== FUNCIONES DE PRODUCTOS =====

function loadProducts() {
    console.log('📦 Cargando productos...');

    // Simular carga de productos
    setTimeout(() => {
        updateProductGrid();
        showNotification('Productos cargados correctamente', 'success');
    }, 1000);
}

function updateProductCount() {
    console.log('📊 Actualizando contador de productos...');

    const productsCount = document.querySelector('.products-count');
    if (productsCount) {
        const totalProducts = document.querySelectorAll('.product-card').length;
        productsCount.textContent = `Mostrando ${totalProducts} productos`;
    }
}

function setupPagination() {
    console.log('📄 Configurando paginación...');

    const paginationButtons = document.querySelectorAll('.products-pagination button');
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                navigatePage(this);
            }
        });
    });
}

function updateProductGrid() {
    console.log('🔄 Actualizando grid de productos...');

    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        // Simular animación de carga
        productsGrid.style.opacity = '0';
        setTimeout(() => {
            productsGrid.style.opacity = '1';
        }, 300);
    }
}

function filterProducts(query) {
    console.log(`🔍 Filtrando productos: ${query}`);

    const productCards = document.querySelectorAll('.product-card');
    const queryLower = query.toLowerCase();

    productCards.forEach(card => {
        const productName = card.querySelector('h4').textContent.toLowerCase();
        const productCategory = card.querySelector('.product-category').textContent.toLowerCase();

        if (productName.includes(queryLower) || productCategory.includes(queryLower)) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.opacity = '0.5';
            if (query) {
                card.style.display = 'none';
            }
        }
    });

    updateProductCount();
}

function filterByCategory(category) {
    console.log(`🏷️ Filtrando por categoría: ${category}`);

    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productCategory = card.querySelector('.product-category').textContent;

        if (!category || productCategory.includes(category)) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
        }
    });

    updateProductCount();
    showNotification(`Filtrado por categoría: ${category || 'Todas'}`, 'info');
}

function performSearch(query) {
    console.log(`🔍 Realizando búsqueda: ${query}`);

    if (query.trim()) {
        showNotification(`Buscando: "${query}"`, 'info');

        // Simular búsqueda
        setTimeout(() => {
            const results = Math.floor(Math.random() * 10) + 1;
            showNotification(`Se encontraron ${results} productos para "${query}"`, 'success');
        }, 1000);
    } else {
        showNotification('Por favor ingresa un término de búsqueda', 'warning');
    }
}

function exportProducts() {
    console.log('📤 Exportando productos...');

    showNotification('Generando archivo de exportación...', 'info');

    // Simular exportación
    setTimeout(() => {
        const exportData = {
            date: new Date().toISOString(),
            products: [
                {
                    id: 1,
                    name: 'Producto Premium A',
                    category: 'Premium',
                    price: 25000,
                    stock: 45
                },
                {
                    id: 2,
                    name: 'Producto Premium B',
                    category: 'Premium',
                    price: 18500,
                    stock: 32
                }
            ]
        };

        // Crear archivo de descarga
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `productos-export-${exportData.date.split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);

        showNotification('Productos exportados correctamente', 'success');
    }, 2000);
}

function showBulkEditModal() {
    console.log('✏️ Mostrando modal de edición masiva...');

    showNotification('Funcionalidad de edición masiva en desarrollo', 'info');
}

function navigatePage(button) {
    console.log('📄 Navegando página...');

    const isNext = button.querySelector('.fa-chevron-right');
    const currentPage = document.querySelector('.pagination-info');

    if (currentPage) {
        const currentText = currentPage.textContent;
        const currentPageNum = parseInt(currentText.match(/\d+/)[0]);

        if (isNext) {
            if (currentPageNum < 3) {
                currentPage.textContent = `Página ${currentPageNum + 1} de 3`;
                showNotification(`Navegando a página ${currentPageNum + 1}`, 'info');
            }
        } else {
            if (currentPageNum > 1) {
                currentPage.textContent = `Página ${currentPageNum - 1} de 3`;
                showNotification(`Navegando a página ${currentPageNum - 1}`, 'info');
            }
        }
    }
}

// ===== FUNCIONES DE MODAL =====

function showAddProductModal() {
    console.log('➕ Mostrando modal de agregar producto...');

    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Focus en el primer input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeAddProductModal() {
    console.log('❌ Cerrando modal de agregar producto...');

    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';

        // Limpiar formulario
        const form = document.getElementById('addProductForm');
        if (form) {
            form.reset();
        }
    }
}

function saveProduct() {
    console.log('💾 Guardando producto...');

    const form = document.getElementById('addProductForm');
    if (form) {
        const formData = new FormData(form);
        const productData = {
            name: formData.get('productName') || document.getElementById('productName').value,
            category: formData.get('productCategory') || document.getElementById('productCategory').value,
            price: formData.get('productPrice') || document.getElementById('productPrice').value,
            stock: formData.get('productStock') || document.getElementById('productStock').value,
            description: document.getElementById('productDescription').value
        };

        // Validar datos
        if (!productData.name || !productData.category || !productData.price || !productData.stock) {
            showNotification('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        showNotification('Guardando producto...', 'info');

        // Simular guardado
        setTimeout(() => {
            // Agregar producto al grid
            addProductToGrid(productData);

            closeAddProductModal();
            showNotification('Producto guardado correctamente', 'success');
            updateProductCount();
        }, 1500);
    }
}

function addProductToGrid(productData) {
    console.log('➕ Agregando producto al grid:', productData);

    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        const newProductCard = document.createElement('div');
        newProductCard.className = 'product-card';
        newProductCard.innerHTML = `
            <div class="product-card-header">
                <div class="product-image">
                    <img src="images/product-placeholder.jpg" alt="${productData.name}">
                    <div class="product-overlay">
                        <button class="btn btn-sm btn-primary" onclick="editProduct(${Date.now()})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${Date.now()})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="product-status active">Activo</div>
            </div>
            <div class="product-card-content">
                <h4>${productData.name}</h4>
                <p class="product-category">Categoría: ${productData.category}</p>
                <div class="product-meta">
                    <span class="product-price">$${parseInt(productData.price).toLocaleString()}</span>
                    <span class="product-stock">Stock: ${productData.stock}</span>
                </div>
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="far fa-star"></i>
                    <span>(0.0)</span>
                </div>
            </div>
        `;

        // Agregar con animación
        newProductCard.style.opacity = '0';
        newProductCard.style.transform = 'translateY(20px)';
        productsGrid.insertBefore(newProductCard, productsGrid.firstChild);

        setTimeout(() => {
            newProductCard.style.transition = 'all 0.3s ease';
            newProductCard.style.opacity = '1';
            newProductCard.style.transform = 'translateY(0)';
        }, 100);
    }
}

// ===== FUNCIONES DE ACCIONES =====

function editProduct(productId) {
    console.log(`✏️ Editando producto ID: ${productId}`);

    showNotification('Funcionalidad de edición en desarrollo', 'info');

    // Simular carga de datos del producto
    setTimeout(() => {
        showAddProductModal();
        // Aquí se cargarían los datos del producto en el formulario
    }, 500);
}

function deleteProduct(productId) {
    console.log(`🗑️ Eliminando producto ID: ${productId}`);

    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        showNotification('Eliminando producto...', 'info');

        // Simular eliminación
        setTimeout(() => {
            const productCard = document.querySelector(`[onclick="deleteProduct(${productId})"]`).closest('.product-card');
            if (productCard) {
                productCard.style.transition = 'all 0.3s ease';
                productCard.style.opacity = '0';
                productCard.style.transform = 'scale(0.8)';

                setTimeout(() => {
                    productCard.remove();
                    updateProductCount();
                    showNotification('Producto eliminado correctamente', 'success');
                }, 300);
            }
        }, 1000);
    }
}

// ===== FUNCIONES UTILITARIAS =====

function updateUserName(name) {
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = name;
    });
}

function showNotification(message, type = 'info') {
    console.log(`🔔 Notificación [${type}]: ${message}`);

    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icon = getNotificationIcon(type);

    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon} notification-icon"></i>
            <span class="notification-text">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    container.appendChild(notification);

    // Animación de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// ===== FUNCIONES GLOBALES =====

// Función global para navegación entre secciones
window.navigateToSection = function(section) {
    console.log(`🧭 Navegando a sección: ${section}`);

    const sectionUrls = {
        'dashboard': 'admin.html',
        'analytics': 'analytics.html',
        'productos': 'productos.html',
        'pedidos': 'pedidos.html',
        'clientes': 'clientes.html',
        'hero': 'hero.html',
        'contenido': 'contenido.html',
        'configuracion': 'configuracion.html',
        'backup': 'backup.html'
    };

    const url = sectionUrls[section];
    if (url) {
        window.location.href = url;
    } else {
        showNotification(`Sección "${section}" no encontrada`, 'error');
    }
};

// Función global para agregar producto
window.showAddProductModal = function() {
    showAddProductModal();
};

// Función global para editar producto
window.editProduct = function(productId) {
    editProduct(productId);
};

// Función global para eliminar producto
window.deleteProduct = function(productId) {
    deleteProduct(productId);
};

// Función global para cerrar modal
window.closeAddProductModal = function() {
    closeAddProductModal();
};

// Función global para guardar producto
window.saveProduct = function() {
    saveProduct();
};

// ===== EVENTOS DE TECLADO =====

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N para nuevo producto
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        showAddProductModal();
    }

    // Ctrl/Cmd + F para búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape para cerrar modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('addProductModal');
        if (modal && modal.classList.contains('show')) {
            closeAddProductModal();
        }
    }
});

// ===== FUNCIONES DE DEBUG =====

// Función para mostrar información de debug
window.debugProducts = function() {
    console.log('🐛 Información de debug de Productos:');
    console.log('- Total productos:', document.querySelectorAll('.product-card').length);
    console.log('- Filtro de categoría:', document.getElementById('categoryFilter')?.value);
    console.log('- Búsqueda activa:', document.getElementById('productSearchHeader')?.value);
    console.log('- Modal abierto:', document.getElementById('addProductModal')?.classList.contains('show'));
    console.log('- Sidebar visible:', document.getElementById('adminSidebar')?.classList.contains('show'));
    console.log('- User dropdown visible:', document.getElementById('userDropdown')?.classList.contains('show'));
};

// Función para simular errores
window.simulateError = function() {
    console.error('❌ Error simulado para testing');
    showNotification('Error simulado para testing', 'error');
};

// Función para simular carga lenta
window.simulateSlowLoad = function() {
    console.log('⏳ Simulando carga lenta...');
    showNotification('Simulando carga lenta...', 'info');

    setTimeout(() => {
        showNotification('Carga lenta completada', 'success');
    }, 5000);
};

console.log('📦 Productos.js cargado correctamente');



