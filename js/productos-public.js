// ===== PRODUCTOS-PUBLIC.JS - Funcionalidades para el Catálogo Público =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('🛍️ Inicializando Catálogo Público...');

    // Inicializar todas las funcionalidades
    initializeFilters();
    initializeSearch();
    initializeProductCards();
    initializePagination();
    initializeNavigation();

    console.log('✅ Catálogo Público inicializado correctamente');
});

// ===== FUNCIONALIDADES PRINCIPALES =====

function initializeFilters() {
    console.log('🔧 Inicializando filtros...');

    // Filtro por categoría
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterProducts();
        });
    }

    // Filtro por precio
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) {
        priceFilter.addEventListener('change', function() {
            filterProducts();
        });
    }

    // Ordenamiento
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            sortProducts();
        });
    }
}

function initializeSearch() {
    console.log('🔍 Inicializando búsqueda...');

    // Búsqueda en la barra de navegación
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchProducts(this.value);
        });
    }
}

function initializeProductCards() {
    console.log('📦 Inicializando tarjetas de productos...');

    // Configurar eventos para botones de productos
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // Botón de agregar al carrito
        const addToCartBtn = card.querySelector('.btn-primary');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                addToCart(card);
            });
        }

        // Botón de favoritos
        const favoriteBtn = card.querySelector('.btn-secondary');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleFavorite(card);
            });
        }

        // Botón de ver detalles
        const viewBtn = card.querySelector('.btn-outline');
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                viewProductDetails(card);
            });
        }
    });
}

function initializePagination() {
    console.log('📄 Inicializando paginación...');

    const paginationButtons = document.querySelectorAll('.products-pagination button');
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                navigatePage(this);
            }
        });
    });
}

function initializeNavigation() {
    console.log('🧭 Inicializando navegación...');

    // Botón de admin
    const adminBtn = document.querySelector('[onclick*="admin.html"]');
    if (adminBtn) {
        adminBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('admin.html', '_blank');
        });
    }
}

// ===== FUNCIONES DE FILTRADO Y BÚSQUEDA =====

function filterProducts() {
    console.log('🔍 Filtrando productos...');

    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const productCards = document.querySelectorAll('.product-card');

    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    const selectedPriceRange = priceFilter ? priceFilter.value : '';

    productCards.forEach(card => {
        let showCard = true;

        // Filtro por categoría
        if (selectedCategory) {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory !== selectedCategory) {
                showCard = false;
            }
        }

        // Filtro por precio
        if (showCard && selectedPriceRange) {
            const cardPrice = parseInt(card.getAttribute('data-price'));
            const [minPrice, maxPrice] = getPriceRange(selectedPriceRange);

            if (cardPrice < minPrice || cardPrice > maxPrice) {
                showCard = false;
            }
        }

        // Mostrar/ocultar tarjeta con animación
        if (showCard) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });

    updateProductCount();
}

function getPriceRange(priceRange) {
    switch (priceRange) {
        case '0-10000':
            return [0, 10000];
        case '10000-20000':
            return [10000, 20000];
        case '20000+':
            return [20000, Infinity];
        default:
            return [0, Infinity];
    }
}

function sortProducts() {
    console.log('📊 Ordenando productos...');

    const sortFilter = document.getElementById('sortFilter');
    const productsGrid = document.getElementById('productsGrid');

    if (!sortFilter || !productsGrid) return;

    const sortBy = sortFilter.value;
    const productCards = Array.from(productsGrid.querySelectorAll('.product-card'));

    productCards.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                const nameA = a.querySelector('.product-title').textContent.toLowerCase();
                const nameB = b.querySelector('.product-title').textContent.toLowerCase();
                return nameA.localeCompare(nameB);

            case 'price-low':
                const priceA = parseInt(a.getAttribute('data-price'));
                const priceB = parseInt(b.getAttribute('data-price'));
                return priceA - priceB;

            case 'price-high':
                const priceHighA = parseInt(a.getAttribute('data-price'));
                const priceHighB = parseInt(b.getAttribute('data-price'));
                return priceHighB - priceHighA;

            case 'rating':
                const ratingA = parseFloat(a.querySelector('.rating-text').textContent.match(/[\d.]+/)[0]);
                const ratingB = parseFloat(b.querySelector('.rating-text').textContent.match(/[\d.]+/)[0]);
                return ratingB - ratingA;

            default:
                return 0;
        }
    });

    // Reordenar elementos en el DOM
    productCards.forEach(card => {
        productsGrid.appendChild(card);
    });

    showNotification('Productos ordenados correctamente', 'success');
}

function searchProducts(query) {
    console.log(`🔍 Buscando: ${query}`);

    const productCards = document.querySelectorAll('.product-card');
    const queryLower = query.toLowerCase();

    productCards.forEach(card => {
        const productName = card.querySelector('.product-title').textContent.toLowerCase();
        const productDescription = card.querySelector('.product-description').textContent.toLowerCase();

        if (productName.includes(queryLower) || productDescription.includes(queryLower)) {
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

// ===== FUNCIONES DE PRODUCTOS =====

function addToCart(productCard) {
    console.log('🛒 Agregando al carrito...');

    const productName = productCard.querySelector('.product-title').textContent;
    const productPrice = productCard.querySelector('.price-current').textContent;

    // Simular agregar al carrito
    showNotification(`"${productName}" agregado al carrito`, 'success');

    // Animación de confirmación
    const addButton = productCard.querySelector('.btn-primary');
    const originalText = addButton.innerHTML;

    addButton.innerHTML = '<i class="fas fa-check"></i><span>Agregado</span>';
    addButton.classList.add('btn-success');

    setTimeout(() => {
        addButton.innerHTML = originalText;
        addButton.classList.remove('btn-success');
    }, 2000);
}

function toggleFavorite(productCard) {
    console.log('❤️ Alternando favorito...');

    const favoriteBtn = productCard.querySelector('.btn-secondary');
    const isFavorite = favoriteBtn.classList.contains('active');

    if (isFavorite) {
        favoriteBtn.classList.remove('active');
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        showNotification('Removido de favoritos', 'info');
    } else {
        favoriteBtn.classList.add('active');
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        showNotification('Agregado a favoritos', 'success');
    }
}

function viewProductDetails(productCard) {
    console.log('👁️ Viendo detalles del producto...');

    const productName = productCard.querySelector('.product-title').textContent;
    const productPrice = productCard.querySelector('.price-current').textContent;
    const productDescription = productCard.querySelector('.product-description').textContent;

    // Simular modal de detalles
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${productName}</h3>
                    <button class="modal-close" onclick="this.closest('.product-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="product-details">
                        <div class="product-image">
                            <img src="${productCard.querySelector('img').src}" alt="${productName}">
                        </div>
                        <div class="product-info">
                            <h4>${productName}</h4>
                            <p class="product-description">${productDescription}</p>
                            <div class="product-price">
                                <span class="price-current">${productPrice}</span>
                            </div>
                            <div class="product-rating">
                                ${productCard.querySelector('.product-rating').innerHTML}
                            </div>
                            <button class="btn btn-primary btn-full" onclick="addToCart(this.closest('.product-modal').querySelector('.product-card'))">
                                <i class="fas fa-shopping-cart"></i>
                                <span>Agregar al Carrito</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Agregar estilos temporales
    const style = document.createElement('style');
    style.textContent = `
        .product-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .modal-body {
            padding: 20px;
        }
        .product-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .product-image img {
            width: 100%;
            height: auto;
            border-radius: 8px;
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6b7280;
        }
        .modal-close:hover {
            color: #374151;
        }
        @media (max-width: 768px) {
            .product-details {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

function navigatePage(button) {
    console.log('📄 Navegando página...');

    const isNext = button.querySelector('.fa-chevron-right');
    const currentPage = document.querySelector('.pagination-info span');

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

// ===== FUNCIONES UTILITARIAS =====

function updateProductCount() {
    console.log('📊 Actualizando contador de productos...');

    const visibleProducts = document.querySelectorAll('.product-card[style*="display: block"], .product-card:not([style*="display: none"])');
    const totalProducts = visibleProducts.length;

    // Actualizar contador si existe
    const productCountElement = document.querySelector('.products-count');
    if (productCountElement) {
        productCountElement.textContent = `Mostrando ${totalProducts} productos`;
    }
}

function showNotification(message, type = 'info') {
    console.log(`🔔 Notificación [${type}]: ${message}`);

    // Crear contenedor de notificaciones si no existe
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);

        // Agregar estilos
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                max-width: 400px;
            }
            .notification {
                background: white;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-left: 4px solid #6366f1;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                border-left-color: #10b981;
            }
            .notification-error {
                border-left-color: #ef4444;
            }
            .notification-warning {
                border-left-color: #f59e0b;
            }
            .notification-info {
                border-left-color: #3b82f6;
            }
        `;
        document.head.appendChild(style);
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icon = getNotificationIcon(type);

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-${icon}" style="color: ${getNotificationColor(type)};"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; cursor: pointer; color: #6b7280;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    notificationContainer.appendChild(notification);

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

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#6366f1';
}

// ===== EVENTOS DE TECLADO =====

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + F para búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape para cerrar modales
    if (e.key === 'Escape') {
        const modal = document.querySelector('.product-modal');
        if (modal) {
            modal.remove();
        }
    }
});

// ===== FUNCIONES GLOBALES =====

// Función global para agregar al carrito
window.addToCart = function(productCard) {
    addToCart(productCard);
};

// Función global para alternar favorito
window.toggleFavorite = function(productCard) {
    toggleFavorite(productCard);
};

// Función global para ver detalles
window.viewProductDetails = function(productCard) {
    viewProductDetails(productCard);
};

console.log('🛍️ Productos-public.js cargado correctamente');



