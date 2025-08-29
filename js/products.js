// Productos de calzado de Éter Store
let products = [
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
        isPremium: true
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
        isPremium: true
    },
    {
        id: 3,
        name: "Sandalias de Verano",
        description: "Sandalias cómodas y elegantes con tiras ajustables y suela antideslizante. Perfectas para el verano.",
        price: 75000,
        image: "images/products/summer-sandals.svg",
        category: "verano",
        stock: 35,
        rating: 4.9,
        reviews: 203,
        isPremium: false
    },
    {
        id: 4,
        name: "Zapatos Formales Oxford",
        description: "Zapatos formales de estilo Oxford con acabado en cuero pulido. Elegantes para eventos de negocios y ceremonias.",
        price: 165000,
        image: "images/products/formal-oxford.svg",
        category: "formal",
        stock: 22,
        rating: 4.6,
        reviews: 134,
        isPremium: true
    },
    {
        id: 5,
        name: "Tenis Urbanos",
        description: "Tenis urbanos con diseño moderno y materiales de alta calidad. Combinan estilo y comodidad para el día a día.",
        price: 95000,
        image: "images/products/urban-sneakers.svg",
        category: "urbano",
        stock: 30,
        rating: 4.9,
        reviews: 187,
        isPremium: true
    },
    {
        id: 6,
        name: "Mocasines Clásicos",
        description: "Mocasines de cuero suave con diseño atemporal. Ideales para un look casual elegante en cualquier ocasión.",
        price: 95000,
        image: "images/products/classic-moccasins.svg",
        category: "casual",
        stock: 16,
        rating: 4.5,
        reviews: 94,
        isPremium: false
    },
    {
        id: 7,
        name: "Zapatillas de Entrenamiento",
        description: "Zapatillas especializadas para entrenamiento con soporte lateral y suela de tracción. Perfectas para el gimnasio.",
        price: 85000,
        image: "images/products/training-shoes.svg",
        category: "deportivo",
        stock: 28,
        rating: 4.4,
        reviews: 112,
        isPremium: false
    },
    {
        id: 8,
        name: "Botines de Invierno",
        description: "Botines resistentes al agua con forro térmico. Ideales para el clima frío y lluvioso de Mar del Plata.",
        price: 145000,
        image: "images/products/winter-boots.svg",
        category: "invierno",
        stock: 20,
        rating: 4.7,
        reviews: 78,
        isPremium: true
    }
];

// Función para formatear precio en pesos argentinos
function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Función para verificar si un producto es premium (precio > $35.000)
function isPremiumProduct(product) {
    return product.price > 35000;
}

// Función para filtrar productos premium
function getPremiumProducts() {
    return products.filter(product => isPremiumProduct(product));
}

// Función para obtener productos por rango de precio
function getProductsByPriceRange(minPrice, maxPrice) {
    return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
}

// Función para mostrar estrellas de rating
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Función para renderizar productos
function renderProducts(productsToRender = products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Determinar si es una imagen SVG o un icono Font Awesome
        const isImage = product.image.includes('.svg') || product.image.includes('.jpg') || product.image.includes('.png');
        
        const imageHTML = isImage 
            ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
            : `<i class="${product.image}"></i>`;
        
        productCard.innerHTML = `
            <div class="product-image">
                ${imageHTML}
                <div class="product-overlay">
                    <div class="product-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${product.stock > 0 ? 'Disponible' : 'Agotado'}
                    </div>
                    ${isPremiumProduct(product) ? '<div class="premium-badge">Premium</div>' : ''}
                </div>
            </div>
            <div class="product-info">
                <div class="product-header">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        <span class="stars">${getRatingStars(product.rating)}</span>
                        <span class="rating-text">(${product.reviews})</span>
                    </div>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="price-amount">${formatPrice(product.price)}</span>
                    ${isPremiumProduct(product) ? '<span class="premium-indicator">⭐</span>' : ''}
                </div>
                <div class="product-stock">
                    <span class="stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${product.stock > 0 ? `Stock: ${product.stock} unidades` : 'Sin stock disponible'}
                    </span>
                </div>
                <div class="product-options">
                    <div class="size-selector">
                        <label for="size-${product.id}">Talla:</label>
                        <select id="size-${product.id}" class="size-select" data-product-id="${product.id}">
                            <option value="">Seleccionar talla</option>
                            <option value="36">36</option>
                            <option value="37">37</option>
                            <option value="38">38</option>
                            <option value="39">39</option>
                            <option value="40">40</option>
                            <option value="41">41</option>
                            <option value="42">42</option>
                            <option value="43">43</option>
                            <option value="44">44</option>
                            <option value="45">45</option>
                        </select>
                    </div>
                    <div class="profit-margin">
                        <label for="profit-${product.id}">Margen de Ganancia:</label>
                        <div class="profit-options">
                            <select id="profit-type-${product.id}" class="profit-type-select" data-product-id="${product.id}">
                                <option value="percentage">Porcentaje (%)</option>
                                <option value="fixed">Monto Fijo ($)</option>
                            </select>
                            <input type="number" id="profit-${product.id}" class="profit-input" data-product-id="${product.id}" min="0" value="20" placeholder="20">
                        </div>
                    </div>
                    <button class="add-to-cart" 
                            data-product-id="${product.id}"
                            ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        ${product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Agregar event listeners a los botones
    addProductEventListeners();
}

// Función para agregar event listeners a los productos
function addProductEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productId = parseInt(this.getAttribute('data-product-id'));
            const product = products.find(p => p.id === productId);
            
            if (product && product.stock > 0) {
                // Obtener talla seleccionada
                const sizeSelect = document.getElementById(`size-${productId}`);
                const selectedSize = sizeSelect ? sizeSelect.value : '';
                
                // Obtener margen de ganancia
                const profitInput = document.getElementById(`profit-${productId}`);
                const profitTypeSelect = document.getElementById(`profit-type-${productId}`);
                const profitValue = profitInput ? parseFloat(profitInput.value) || 20 : 20;
                const profitType = profitTypeSelect ? profitTypeSelect.value : 'percentage';
                
                // Calcular margen de ganancia según el tipo
                let profitMargin;
                if (profitType === 'fixed') {
                    // Para monto fijo, convertir a porcentaje basado en el precio del producto
                    profitMargin = (profitValue / product.price) * 100;
                } else {
                    // Para porcentaje, usar directamente
                    profitMargin = profitValue;
                }
                
                // Validar que se haya seleccionado una talla
                if (!selectedSize) {
                    showNotification('Por favor selecciona una talla', 'error');
                    return;
                }
                
                if (window.cart) {
                    const success = window.cart.addItem(product, 1, selectedSize, profitMargin);
                    if (success) {
                        showNotification(`✅ ${product.name} (Talla ${selectedSize}) agregado al carrito`, 'success');
                    }
                } else {
                    showNotification('❌ Error: Sistema de Carrito Completo no disponible', 'error');
                }
                
                // Limpiar selección de talla
                if (sizeSelect) {
                    sizeSelect.value = '';
                }
            }
        });
    });
}

// Función para mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Agregar estilos
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para buscar productos
function searchProducts(query) {
    if (!query.trim()) {
        return products;
    }
    
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// Función para filtrar productos por categoría
function filterProductsByCategory(category) {
    if (!category || category === 'all') {
        return products;
    }
    
    return products.filter(product => product.category === category);
}

// Función para ordenar productos
function sortProducts(productsToSort, sortBy = 'name', order = 'asc') {
    const sortedProducts = [...productsToSort];
    
    sortedProducts.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
            case 'price':
                aValue = a.price;
                bValue = b.price;
                break;
            case 'rating':
                aValue = a.rating;
                bValue = b.rating;
                break;
            case 'name':
            default:
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
        }
        
        if (order === 'desc') {
            return aValue < bValue ? 1 : -1;
        } else {
            return aValue > bValue ? 1 : -1;
        }
    });
    
    return sortedProducts;
}

// Función para obtener productos destacados
function getFeaturedProducts() {
    return products.filter(product => product.rating >= 4.5).slice(0, 4);
}

// Función para obtener productos por ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Función para actualizar stock
function updateProductStock(productId, quantity) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.stock = Math.max(0, product.stock - quantity);
        return product.stock;
    }
    return 0;
}

// Función para verificar disponibilidad
function checkProductAvailability(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    return product && product.stock >= quantity;
}

// Función para actualizar stock después de una venta
function updateProductStock(productId, quantity) {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products[productIndex].stock -= quantity;
        
        // Guardar cambios en localStorage
        localStorage.setItem('eterStore_products', JSON.stringify(products));
        
        // Disparar evento de actualización
        window.dispatchEvent(new CustomEvent('productsUpdated', {
            detail: products
        }));
        
        // Actualizar vista si es necesario
        if (window.ProductManager && window.ProductManager.renderProducts) {
            window.ProductManager.renderProducts();
        }
        
        return true;
    }
    return false;
}

// Función para restaurar stock (en caso de cancelación)
function restoreProductStock(productId, quantity) {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products[productIndex].stock += quantity;
        
        // Guardar cambios en localStorage
        localStorage.setItem('eterStore_products', JSON.stringify(products));
        
        // Disparar evento de actualización
        window.dispatchEvent(new CustomEvent('productsUpdated', {
            detail: products
        }));
        
        return true;
    }
    return false;
}

// Cargar productos desde localStorage al inicializar
function loadProductsFromStorage() {
    const savedProducts = localStorage.getItem('eterStore_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Si no hay productos guardados, usar los productos por defecto
        products = [
            {
                id: 1,
                name: "Zapatillas Running Pro",
                category: "deportivo",
                price: 125000,
                stock: 15,
                rating: 4.5,
                reviews: 128,
                image: "images/products/running-shoes.svg",
                description: "Zapatillas profesionales para running con tecnología de amortiguación avanzada."
            },
            {
                id: 2,
                name: "Mocasines Clásicos",
                category: "casual",
                price: 95000,
                stock: 8,
                rating: 4.2,
                reviews: 95,
                image: "images/products/classic-moccasins.svg",
                description: "Mocasines elegantes y cómodos para uso diario."
            },
            {
                id: 3,
                name: "Botas de Invierno",
                category: "invierno",
                price: 145000,
                stock: 12,
                rating: 4.7,
                reviews: 156,
                image: "images/products/winter-boots.svg",
                description: "Botas resistentes al agua y frío para el invierno."
            },
            {
                id: 4,
                name: "Zapatos Formales Oxford",
                category: "formal",
                price: 165000,
                stock: 6,
                rating: 4.4,
                reviews: 87,
                image: "images/products/formal-oxford.svg",
                description: "Zapatos formales Oxford de cuero genuino."
            },
            {
                id: 5,
                name: "Sandalias de Verano",
                category: "verano",
                price: 75000,
                stock: 20,
                rating: 4.1,
                reviews: 203,
                image: "images/products/summer-sandals.svg",
                description: "Sandalias ligeras y cómodas para el verano."
            },
            {
                id: 6,
                name: "Zapatillas Urbanas",
                category: "urbano",
                price: 95000,
                stock: 18,
                rating: 4.3,
                reviews: 142,
                image: "images/products/urban-sneakers.svg",
                description: "Zapatillas urbanas con estilo moderno y comodidad."
            },
            {
                id: 7,
                name: "Botas de Cuero",
                category: "invierno",
                price: 185000,
                stock: 10,
                rating: 4.6,
                reviews: 134,
                image: "images/products/leather-boots.svg",
                description: "Botas de cuero genuino con acabado premium."
            },
            {
                id: 8,
                name: "Zapatillas de Entrenamiento",
                category: "deportivo",
                price: 85000,
                stock: 14,
                rating: 4.4,
                reviews: 178,
                image: "images/products/training-shoes.svg",
                description: "Zapatillas especializadas para entrenamiento y gimnasio."
            }
        ];
        // Guardar productos por defecto
        localStorage.setItem('eterStore_products', JSON.stringify(products));
    }
}

// Sincronizar productos con cambios del panel de administración
function syncProducts() {
    loadProductsFromStorage();
    renderProducts();
    
    // Actualizar contadores y estadísticas
    updateProductCounters();
    
    // Notificar al carrito si está disponible
    if (window.CartManager && window.CartManager.updateCartFromProducts) {
        window.CartManager.updateCartFromProducts(products);
    }
}

// Actualizar contadores de productos
function updateProductCounters() {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= 5).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    
    // Actualizar elementos en la página si existen
    const totalElement = document.getElementById('totalProducts');
    if (totalElement) {
        totalElement.textContent = totalProducts;
    }
    
    const lowStockElement = document.getElementById('lowStockProducts');
    if (lowStockElement) {
        lowStockElement.textContent = lowStockProducts;
    }
    
    const outOfStockElement = document.getElementById('outOfStockProducts');
    if (outOfStockElement) {
        outOfStockElement.textContent = outOfStockProducts;
    }
}

// Exportar funciones para uso en otros archivos
window.ProductManager = {
    products,
    renderProducts,
    searchProducts,
    filterProductsByCategory,
    sortProducts,
    getFeaturedProducts,
    getProductById,
    updateProductStock,
    checkProductAvailability,
    formatPrice,
    isPremiumProduct,
    getPremiumProducts,
    getProductsByPriceRange,
    showNotification,
    loadProductsFromStorage,
    syncProducts,
    updateProductCounters,
    restoreProductStock
};

// Inicializar productos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromStorage();
    renderProducts();
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'eterStore_products') {
            syncProducts();
        }
    });
}); 