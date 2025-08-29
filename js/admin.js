// Panel de Administración - Éter Store

// Credenciales predeterminadas
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'eterstore2024'
};

// Estado de la aplicación
let isAuthenticated = false;
let currentTab = 'dashboard';
let products = [];
let orders = [];
let heroContent = {};
let storeContent = {};
let heroSlides = [];
let heroConfig = {};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

// Función de inicialización
function initializeAdmin() {
    loadData();
    setupEventListeners();
    checkAuthentication();
}

// Cargar datos desde localStorage
function loadData() {
    // Cargar productos
    const savedProducts = localStorage.getItem('eterStore_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Cargar productos por defecto desde products.js
        if (window.ProductManager && window.ProductManager.products) {
            products = [...window.ProductManager.products];
            // Guardar productos por defecto
            localStorage.setItem('eterStore_products', JSON.stringify(products));
        }
    }

    // Cargar pedidos
    const savedOrders = localStorage.getItem('eterStore_orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }

    // Cargar contenido hero
    const savedHero = localStorage.getItem('eterStore_hero');
    if (savedHero) {
        heroContent = JSON.parse(savedHero);
    } else {
        // Contenido hero por defecto
        heroContent = {
            title: 'Calzados que Definen tu Estilo',
            subtitle: 'Descubre nuestra colección premium de calzados diseñados para quienes buscan calidad, comodidad y elegancia',
            primaryButtonText: 'Ver Colección',
            primaryButtonLink: '#products',
            secondaryButtonText: 'Conoce Más',
            secondaryButtonLink: '#about',
            image: 'images/hero/hero-shoes.svg'
        };
    }

    // Cargar configuración del hero
    const savedHeroConfig = localStorage.getItem('eterStore_hero_config');
    if (savedHeroConfig) {
        heroConfig = JSON.parse(savedHeroConfig);
    } else {
        // Configuración por defecto
        heroConfig = {
            mode: 'manual',
            slideInterval: 5,
            transitionEffect: 'fade'
        };
    }

    // Cargar slides del hero
    const savedHeroSlides = localStorage.getItem('eterStore_hero_slides');
    if (savedHeroSlides) {
        heroSlides = JSON.parse(savedHeroSlides);
    } else {
        // Slides por defecto
        heroSlides = [
            {
                id: 1,
                title: 'AIR MAX',
                subtitle: 'NIKE AIR MAX 90',
                description: 'Nothing as fly, nothing as comfortable, nothing as proven-the Nike Air Max 90 stays true to its roots with the iconic Waffle sole, stitched overlays and classic TPU accents.',
                price: '$98.000',
                buttonText: 'ADD TO CART',
                image: 'images/hero/hero-shoes.svg',
                active: true
            }
        ];
        localStorage.setItem('eterStore_hero_slides', JSON.stringify(heroSlides));
    }

    // Cargar contenido de la tienda
    const savedContent = localStorage.getItem('eterStore_content');
    if (savedContent) {
        storeContent = JSON.parse(savedContent);
    } else {
        // Contenido por defecto
        storeContent = {
            phone: '+54 223 123 4567',
            email: 'info@eterstore.com',
            address: 'Zona Jara y Berutti, Mar del Plata',
            aboutTitle: 'Quiénes Somos',
            aboutDescription: 'En Éter Store, nos especializamos en calzados de la más alta calidad. Nuestra pasión es ofrecer productos que combinen elegancia, comodidad y durabilidad.',
            facebookUrl: '',
            instagramUrl: '',
            whatsappNumber: '+54 223 123 4567'
        };
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Hero form
    const heroForm = document.getElementById('heroForm');
    if (heroForm) {
        heroForm.addEventListener('submit', handleHeroSubmit);
        loadHeroForm();
    }

    // Content form
    const contentForm = document.getElementById('contentForm');
    if (contentForm) {
        contentForm.addEventListener('submit', handleContentSubmit);
        loadContentForm();
    }

    // Product management
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', showAddProductModal);
    }

    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }

    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Order status filter
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', filterOrders);
    }

    // Reset buttons
    const resetHeroBtn = document.getElementById('resetHero');
    if (resetHeroBtn) {
        resetHeroBtn.addEventListener('click', resetHeroContent);
    }

    const resetContentBtn = document.getElementById('resetContent');
    if (resetContentBtn) {
        resetContentBtn.addEventListener('click', resetStoreContent);
    }

    // Botón de prueba de sincronización
    const testSyncBtn = document.getElementById('testSync');
    if (testSyncBtn) {
        testSyncBtn.addEventListener('click', testSynchronization);
    }

    // Botón de vista previa del hero
    const previewHeroBtn = document.getElementById('previewHero');
    if (previewHeroBtn) {
        previewHeroBtn.addEventListener('click', showHeroPreview);
    }

    // Botón de agregar slide
    const addSlideBtn = document.getElementById('addSlideBtn');
    if (addSlideBtn) {
        addSlideBtn.addEventListener('click', showAddSlideModal);
    }

    // Formulario de slide hero
    const heroSlideForm = document.getElementById('heroSlideForm');
    if (heroSlideForm) {
        heroSlideForm.addEventListener('submit', handleHeroSlideSubmit);
    }

    // Botón cancelar slide
    const cancelSlideBtn = document.getElementById('cancelSlide');
    if (cancelSlideBtn) {
        cancelSlideBtn.addEventListener('click', closeSlideModal);
    }

    // Sincronizar cambios con la página principal
    window.addEventListener('storage', handleStorageChange);
    
    // Event listener para cambio de modo hero
    const heroModeSelect = document.getElementById('heroMode');
    if (heroModeSelect) {
        heroModeSelect.addEventListener('change', updateHeroModeDisplay);
    }
}

// Manejar cambios en localStorage
function handleStorageChange(e) {
    if (e.key === 'eterStore_products') {
        products = JSON.parse(e.newValue || '[]');
        if (currentTab === 'products') {
            loadProductsTable();
        }
        loadDashboardData();
    }
}

// Verificar autenticación
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('eterStore_admin_logged_in');
    if (isLoggedIn === 'true') {
        isAuthenticated = true;
        showDashboard();
    } else {
        showLogin();
    }
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        isAuthenticated = true;
        localStorage.setItem('eterStore_admin_logged_in', 'true');
        showDashboard();
        showNotification('Inicio de sesión exitoso', 'success');
    } else {
        showNotification('Credenciales incorrectas', 'error');
    }
}

// Manejar logout
function handleLogout() {
    isAuthenticated = false;
    localStorage.removeItem('eterStore_admin_logged_in');
    showLogin();
    showNotification('Sesión cerrada', 'info');
}

// Mostrar login
function showLogin() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Mostrar dashboard
function showDashboard() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadDashboardData();
}

// Cambiar tab
function switchTab(tabName) {
    // Remover active de todos los tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activar tab seleccionado
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    currentTab = tabName;
    
    // Cargar datos específicos del tab
    switch(tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProductsTable();
            break;
        case 'orders':
            loadOrdersTable();
            break;
    }
}

// Cargar datos del dashboard
function loadDashboardData() {
    // Actualizar estadísticas
    document.getElementById('totalProducts').textContent = products.length;
    
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    
    const monthlySales = calculateMonthlySales();
    document.getElementById('monthlySales').textContent = formatPrice(monthlySales);
    
    const newCustomers = calculateNewCustomers();
    document.getElementById('newCustomers').textContent = newCustomers;
    
    // Cargar pedidos recientes
    loadRecentOrders();
    
    // Cargar productos con bajo stock
    loadLowStockProducts();
}

// Calcular ventas del mes
function calculateMonthlySales() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return orders
        .filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === currentMonth && 
                   orderDate.getFullYear() === currentYear &&
                   order.status !== 'cancelled';
        })
        .reduce((total, order) => total + order.finalTotal, 0);
}

// Calcular clientes nuevos
function calculateNewCustomers() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const newCustomers = new Set();
    
    orders
        .filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === currentMonth && 
                   orderDate.getFullYear() === currentYear;
        })
        .forEach(order => {
            newCustomers.add(order.customer.customerPhone);
        });
    
    return newCustomers.size;
}

// Cargar pedidos recientes
function loadRecentOrders() {
    const recentOrdersContainer = document.getElementById('recentOrders');
    if (!recentOrdersContainer) return;
    
    const recentOrders = orders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    if (recentOrders.length === 0) {
        recentOrdersContainer.innerHTML = '<p>No hay pedidos recientes</p>';
        return;
    }
    
    recentOrdersContainer.innerHTML = recentOrders.map(order => `
        <div class="recent-order-item">
            <div class="order-info">
                <strong>Pedido #${order.id}</strong>
                <span>${order.customer.customerName}</span>
            </div>
            <div class="order-status">
                <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
            </div>
        </div>
    `).join('');
}

// Cargar productos con bajo stock
function loadLowStockProducts() {
    const lowStockContainer = document.getElementById('lowStockProducts');
    if (!lowStockContainer) return;
    
    const lowStockProducts = products.filter(product => product.stock <= 5);
    
    if (lowStockProducts.length === 0) {
        lowStockContainer.innerHTML = '<p>No hay productos con bajo stock</p>';
        return;
    }
    
    lowStockContainer.innerHTML = lowStockProducts.map(product => `
        <div class="low-stock-item">
            <div class="product-info">
                <strong>${product.name}</strong>
                <span>Stock: ${product.stock}</span>
            </div>
            <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">
                <i class="fas fa-edit"></i> Editar
            </button>
        </div>
    `).join('');
}

// Cargar tabla de productos
function loadProductsTable() {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = products.map(product => `
        <tr>
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
                <br>
                <small>${product.description.substring(0, 50)}...</small>
            </td>
            <td>
                <span class="category-badge">${product.category}</span>
            </td>
            <td>
                <strong>${formatPrice(product.price)}</strong>
            </td>
            <td>
                <span class="premium-status ${product.price > 35000 ? 'premium' : 'standard'}">
                    ${product.price > 35000 ? 'Premium' : 'Estándar'}
                </span>
            </td>
            <td>
                <span class="stock-badge ${product.stock <= 5 ? 'low-stock' : 'in-stock'}">
                    ${product.stock}
                </span>
            </td>
            <td>
                <div class="rating-display">
                    ${getRatingStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Cargar tabla de pedidos
function loadOrdersTable() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer.customerName}</td>
            <td>${order.items.length} productos</td>
            <td>${formatPrice(order.finalTotal)}</td>
            <td>
                <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
            </td>
            <td>${formatDate(order.date)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-primary" onclick="viewOrder(${order.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="updateOrderStatus(${order.id})" title="Cambiar estado">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Filtrar pedidos
function filterOrders() {
    const statusFilter = document.getElementById('orderStatusFilter').value;
    const tableBody = document.getElementById('ordersTableBody');
    
    if (!tableBody) return;
    
    let filteredOrders = orders;
    if (statusFilter !== 'all') {
        filteredOrders = orders.filter(order => order.status === statusFilter);
    }
    
    tableBody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer.customerName}</td>
            <td>${order.items.length} productos</td>
            <td>${formatPrice(order.finalTotal)}</td>
            <td>
                <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
            </td>
            <td>${formatDate(order.date)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-primary" onclick="viewOrder(${order.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="updateOrderStatus(${order.id})" title="Cambiar estado">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Cargar formulario hero
function loadHeroForm() {
    document.getElementById('heroTitle').value = heroContent.title || '';
    document.getElementById('heroSubtitle').value = heroContent.subtitle || '';
    document.getElementById('primaryButtonText').value = heroContent.primaryButtonText || '';
    document.getElementById('primaryButtonLink').value = heroContent.primaryButtonLink || '';
    document.getElementById('secondaryButtonText').value = heroContent.secondaryButtonText || '';
    document.getElementById('secondaryButtonLink').value = heroContent.secondaryButtonLink || '';
    document.getElementById('heroImage').value = heroContent.image || '';
    
    // Cargar configuración del sistema de alternancia
    document.getElementById('heroMode').value = heroConfig.mode || 'manual';
    document.getElementById('slideInterval').value = heroConfig.slideInterval || 5;
    document.getElementById('transitionEffect').value = heroConfig.transitionEffect || 'fade';
    
    // Actualizar visualización del modo
    updateHeroModeDisplay();
    
    updateHeroImagePreview();
    loadHeroSlidesList();
}

// Cargar formulario de contenido
function loadContentForm() {
    document.getElementById('storePhone').value = storeContent.phone || '';
    document.getElementById('storeEmail').value = storeContent.email || '';
    document.getElementById('storeAddress').value = storeContent.address || '';
    document.getElementById('aboutTitle').value = storeContent.aboutTitle || '';
    document.getElementById('aboutDescription').value = storeContent.aboutDescription || '';
    document.getElementById('facebookUrl').value = storeContent.facebookUrl || '';
    document.getElementById('instagramUrl').value = storeContent.instagramUrl || '';
    document.getElementById('whatsappNumber').value = storeContent.whatsappNumber || '';
}

// Manejar envío del formulario hero
function handleHeroSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    heroContent = {
        title: formData.get('heroTitle'),
        subtitle: formData.get('heroSubtitle'),
        primaryButtonText: formData.get('primaryButtonText'),
        primaryButtonLink: formData.get('primaryButtonLink'),
        secondaryButtonText: formData.get('secondaryButtonText'),
        secondaryButtonLink: formData.get('secondaryButtonLink'),
        image: formData.get('heroImage')
    };
    
    // Actualizar configuración del sistema de alternancia
    heroConfig = {
        mode: formData.get('heroMode'),
        slideInterval: parseInt(formData.get('slideInterval')),
        transitionEffect: formData.get('transitionEffect')
    };
    
    localStorage.setItem('eterStore_hero', JSON.stringify(heroContent));
    localStorage.setItem('eterStore_hero_config', JSON.stringify(heroConfig));
    
    // Disparar evento personalizado para sincronización inmediata
    window.dispatchEvent(new CustomEvent('heroContentUpdated', {
        detail: heroContent
    }));
    
    window.dispatchEvent(new CustomEvent('heroConfigUpdated', {
        detail: { content: heroContent, config: heroConfig, slides: heroSlides }
    }));
    
    showNotification('Contenido hero y configuración actualizados', 'success');
}

// Manejar envío del formulario de contenido
function handleContentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    storeContent = {
        phone: formData.get('storePhone'),
        email: formData.get('storeEmail'),
        address: formData.get('storeAddress'),
        aboutTitle: formData.get('aboutTitle'),
        aboutDescription: formData.get('aboutDescription'),
        facebookUrl: formData.get('facebookUrl'),
        instagramUrl: formData.get('instagramUrl'),
        whatsappNumber: formData.get('whatsappNumber')
    };
    
    localStorage.setItem('eterStore_content', JSON.stringify(storeContent));
    
    // Disparar evento personalizado para sincronización inmediata
    window.dispatchEvent(new CustomEvent('storeContentUpdated', {
        detail: storeContent
    }));
    
    showNotification('Contenido actualizado', 'success');
}

// Mostrar modal de agregar producto
function showAddProductModal() {
    document.getElementById('productModalTitle').textContent = 'Agregar Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productForm').removeAttribute('data-product-id');
    document.getElementById('productModal').classList.add('active');
}

// Editar producto
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('productModalTitle').textContent = 'Editar Producto';
    
    // Llenar formulario con datos del producto
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productRating').value = product.rating;
    document.getElementById('productReviews').value = product.reviews;
    
    // Agregar ID del producto al formulario
    document.getElementById('productForm').dataset.productId = productId;
    
    document.getElementById('productModal').classList.add('active');
}

// Manejar envío del formulario de producto
function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productId = e.target.dataset.productId;
    
    const productData = {
        name: formData.get('productName'),
        category: formData.get('productCategory'),
        description: formData.get('productDescription'),
        price: parseFloat(formData.get('productPrice')),
        stock: parseInt(formData.get('productStock')),
        image: formData.get('productImage'),
        rating: parseFloat(formData.get('productRating')),
        reviews: parseInt(formData.get('productReviews'))
    };
    
    if (productId) {
        // Editar producto existente
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
        }
    } else {
        // Agregar nuevo producto
        productData.id = Date.now();
        products.push(productData);
    }
    
    // Guardar productos y sincronizar
    localStorage.setItem('eterStore_products', JSON.stringify(products));
    
    // Disparar evento personalizado para sincronización inmediata
    window.dispatchEvent(new CustomEvent('productsUpdated', {
        detail: products
    }));
    
    // Actualizar ProductManager si está disponible
    if (window.ProductManager) {
        window.ProductManager.products = [...products];
    }
    
    closeModal();
    loadProductsTable();
    loadDashboardData();
    showNotification('Producto guardado exitosamente', 'success');
}

// Eliminar producto
function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
        products = products.filter(p => p.id !== productId);
        
        // Guardar productos y sincronizar
        localStorage.setItem('eterStore_products', JSON.stringify(products));
        
        // Disparar evento personalizado para sincronización inmediata
        window.dispatchEvent(new CustomEvent('productsUpdated', {
            detail: products
        }));
        
        // Actualizar ProductManager si está disponible
        if (window.ProductManager) {
            window.ProductManager.products = [...products];
        }
        
        loadProductsTable();
        loadDashboardData();
        showNotification('Producto eliminado exitosamente', 'success');
    }
}

// Ver pedido
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const orderDetails = document.getElementById('orderDetails');
    orderDetails.innerHTML = `
        <div class="order-info">
            <div class="order-info-item">
                <h4>Cliente</h4>
                <p>${order.customer.customerName}</p>
            </div>
            <div class="order-info-item">
                <h4>Teléfono</h4>
                <p>${order.customer.customerPhone}</p>
            </div>
            <div class="order-info-item">
                <h4>Estado</h4>
                <p><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></p>
            </div>
            <div class="order-info-item">
                <h4>Fecha</h4>
                <p>${formatDate(order.date)}</p>
            </div>
            <div class="order-info-item">
                <h4>Precio Mayorista</h4>
                <p>${formatPrice(order.wholesaleTotal)}</p>
            </div>
            <div class="order-info-item">
                <h4>Precio Final</h4>
                <p>${formatPrice(order.finalTotal)}</p>
            </div>
        </div>
        <div class="order-items">
            <h4>Productos</h4>
            ${order.items.map(item => `
                <div class="order-item">
                    <div class="order-item-image">
                        ${item.image.includes('.svg') || item.image.includes('.jpg') || item.image.includes('.png') 
                            ? `<img src="${item.image}" alt="${item.name}">` 
                            : `<i class="${item.image}"></i>`}
                    </div>
                    <div class="order-item-info">
                        <div class="order-item-title">${item.name}</div>
                        <div class="order-item-details">Talla: ${item.size} | Cantidad: ${item.quantity}</div>
                    </div>
                    <div class="order-item-price">${formatPrice(item.finalPrice * item.quantity)}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('orderModal').classList.add('active');
}

// Actualizar estado del pedido
function updateOrderStatus(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    const statusNames = ['Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'];
    
    const currentIndex = statuses.indexOf(order.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const newStatus = statuses[nextIndex];
    
    order.status = newStatus;
    localStorage.setItem('eterStore_orders', JSON.stringify(orders));
    
    loadOrdersTable();
    loadDashboardData();
    showNotification(`Estado cambiado a: ${statusNames[nextIndex]}`, 'success');
}

// Cerrar modal
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Actualizar preview de imagen hero
function updateHeroImagePreview() {
    const imageUrl = document.getElementById('heroImage').value;
    const preview = document.getElementById('heroImagePreview');
    const img = preview.querySelector('img');
    
    if (imageUrl) {
        img.src = imageUrl;
        img.style.display = 'block';
    } else {
        img.style.display = 'none';
    }
}

// Restaurar contenido hero original
function resetHeroContent() {
    heroContent = {
        title: 'Calzados que Definen tu Estilo',
        subtitle: 'Descubre nuestra colección premium de calzados diseñados para quienes buscan calidad, comodidad y elegancia',
        primaryButtonText: 'Ver Colección',
        primaryButtonLink: '#products',
        secondaryButtonText: 'Conoce Más',
        secondaryButtonLink: '#about',
        image: 'images/hero/hero-shoes.svg'
    };
    
    loadHeroForm();
    localStorage.setItem('eterStore_hero', JSON.stringify(heroContent));
    showNotification('Contenido hero restaurado', 'success');
}

// Restaurar contenido de la tienda original
function resetStoreContent() {
    storeContent = {
        phone: '+54 223 123 4567',
        email: 'info@eterstore.com',
        address: 'Zona Jara y Berutti, Mar del Plata',
        aboutTitle: 'Quiénes Somos',
        aboutDescription: 'En Éter Store, nos especializamos en calzados de la más alta calidad. Nuestra pasión es ofrecer productos que combinen elegancia, comodidad y durabilidad.',
        facebookUrl: '',
        instagramUrl: '',
        whatsappNumber: '+54 223 123 4567'
    };
    
    loadContentForm();
    localStorage.setItem('eterStore_content', JSON.stringify(storeContent));
    showNotification('Contenido restaurado', 'success');
}

// Utilidades
function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(price);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES');
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendiente',
        'confirmed': 'Confirmado',
        'shipped': 'Enviado',
        'delivered': 'Entregado',
        'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
}

function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star" style="color: #d4af37;"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt" style="color: #d4af37;"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star" style="color: #d4af37;"></i>';
    }
    
    return starsHTML;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Event listeners adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Preview de imagen hero
    const heroImageInput = document.getElementById('heroImage');
    if (heroImageInput) {
        heroImageInput.addEventListener('input', updateHeroImagePreview);
    }
    
    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
});

// Función de prueba de sincronización
function testSynchronization() {
    // Probar sincronización de hero
    const testHeroContent = {
        title: 'Prueba de Sincronización - Éter Store',
        subtitle: 'Este es un mensaje de prueba para verificar que la sincronización funciona correctamente',
        primaryButtonText: 'Probar Ahora',
        primaryButtonLink: '#products',
        secondaryButtonText: 'Más Info',
        secondaryButtonLink: '#about',
        image: 'images/hero/hero-shoes.svg'
    };
    
    localStorage.setItem('eterStore_hero', JSON.stringify(testHeroContent));
    
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('heroContentUpdated', {
        detail: testHeroContent
    }));
    
    showNotification('Prueba de sincronización enviada. Verifica la página principal.', 'info');
    
    // Restaurar contenido original después de 5 segundos
    setTimeout(() => {
        resetHeroContent();
    }, 5000);
}

// Exportar funciones para uso global
window.AdminPanel = {
    switchTab,
    editProduct,
    deleteProduct,
    viewOrder,
    updateOrderStatus,
    closeModal,
    showNotification,
    testSynchronization,
    editSlide,
    deleteSlide,
    toggleSlideActive,
    nextPreviewSlide,
    previousPreviewSlide
}; 

// ===== SISTEMA DE ALTERNANCIA HERO =====

// Cargar lista de slides
function loadHeroSlidesList() {
    const slidesList = document.getElementById('slidesList');
    if (!slidesList) return;
    
    slidesList.innerHTML = heroSlides.map((slide, index) => `
        <div class="slide-item" data-slide-id="${slide.id}">
            <div class="slide-preview">
                <img src="${slide.image}" alt="${slide.title}" onerror="this.src='images/hero/hero-shoes.svg'">
                <div class="slide-info">
                    <h5>${slide.title}</h5>
                    <p>${slide.subtitle}</p>
                    <span class="slide-status ${slide.active ? 'active' : 'inactive'}">
                        ${slide.active ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
            </div>
            <div class="slide-actions">
                <button type="button" class="btn btn-sm btn-primary" onclick="editSlide(${slide.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn btn-sm btn-danger" onclick="deleteSlide(${slide.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
                <button type="button" class="btn btn-sm btn-secondary" onclick="toggleSlideActive(${slide.id})" title="${slide.active ? 'Desactivar' : 'Activar'}">
                    <i class="fas fa-${slide.active ? 'eye-slash' : 'eye'}"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Mostrar modal para agregar slide
function showAddSlideModal() {
    document.getElementById('heroSlideModalTitle').textContent = 'Agregar Slide Hero';
    document.getElementById('heroSlideForm').reset();
    document.getElementById('heroSlideForm').removeAttribute('data-slide-id');
    document.getElementById('heroSlideModal').classList.add('active');
}

// Editar slide
function editSlide(slideId) {
    const slide = heroSlides.find(s => s.id === slideId);
    if (!slide) return;
    
    document.getElementById('heroSlideModalTitle').textContent = 'Editar Slide Hero';
    
    // Llenar formulario con datos del slide
    document.getElementById('slideTitle').value = slide.title;
    document.getElementById('slideSubtitle').value = slide.subtitle;
    document.getElementById('slideDescription').value = slide.description;
    document.getElementById('slidePrice').value = slide.price || '';
    document.getElementById('slideButtonText').value = slide.buttonText || '';
    document.getElementById('slideImage').value = slide.image;
    document.getElementById('slideActive').value = slide.active.toString();
    
    // Agregar ID del slide al formulario
    document.getElementById('heroSlideForm').dataset.slideId = slideId;
    
    document.getElementById('heroSlideModal').classList.add('active');
}

// Manejar envío del formulario de slide
function handleHeroSlideSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const slideId = e.target.dataset.slideId;
    
    const slideData = {
        title: formData.get('slideTitle'),
        subtitle: formData.get('slideSubtitle'),
        description: formData.get('slideDescription'),
        price: formData.get('slidePrice'),
        buttonText: formData.get('slideButtonText'),
        image: formData.get('slideImage'),
        active: formData.get('slideActive') === 'true'
    };
    
    if (slideId) {
        // Editar slide existente
        const index = heroSlides.findIndex(s => s.id === parseInt(slideId));
        if (index !== -1) {
            heroSlides[index] = { ...heroSlides[index], ...slideData };
        }
    } else {
        // Agregar nuevo slide
        const newId = Math.max(...heroSlides.map(s => s.id), 0) + 1;
        slideData.id = newId;
        heroSlides.push(slideData);
    }
    
    localStorage.setItem('eterStore_hero_slides', JSON.stringify(heroSlides));
    
    // Disparar evento personalizado para sincronización
    window.dispatchEvent(new CustomEvent('heroSlidesUpdated', {
        detail: { slides: heroSlides, config: heroConfig }
    }));
    
    loadHeroSlidesList();
    closeSlideModal();
    showNotification('Slide guardado exitosamente', 'success');
}

// Eliminar slide
function deleteSlide(slideId) {
    if (confirm('¿Estás seguro de que quieres eliminar este slide?')) {
        heroSlides = heroSlides.filter(s => s.id !== slideId);
        localStorage.setItem('eterStore_hero_slides', JSON.stringify(heroSlides));
        
        window.dispatchEvent(new CustomEvent('heroSlidesUpdated', {
            detail: { slides: heroSlides, config: heroConfig }
        }));
        
        loadHeroSlidesList();
        showNotification('Slide eliminado', 'success');
    }
}

// Cambiar estado activo/inactivo del slide
function toggleSlideActive(slideId) {
    const slide = heroSlides.find(s => s.id === slideId);
    if (slide) {
        slide.active = !slide.active;
        localStorage.setItem('eterStore_hero_slides', JSON.stringify(heroSlides));
        
        window.dispatchEvent(new CustomEvent('heroSlidesUpdated', {
            detail: { slides: heroSlides, config: heroConfig }
        }));
        
        loadHeroSlidesList();
        showNotification(`Slide ${slide.active ? 'activado' : 'desactivado'}`, 'success');
    }
}

// Cerrar modal de slide
function closeSlideModal() {
    document.getElementById('heroSlideModal').classList.remove('active');
}

// Mostrar vista previa del hero
function showHeroPreview() {
    const previewContainer = document.getElementById('heroPreviewContainer');
    if (!previewContainer) return;
    
    const activeSlides = heroSlides.filter(s => s.active);
    if (activeSlides.length === 0) {
        showNotification('No hay slides activos para mostrar', 'warning');
        return;
    }
    
    let previewHTML = `
        <div class="hero-preview-wrapper">
            <div class="hero-preview-slides" id="previewSlides">
    `;
    
    activeSlides.forEach((slide, index) => {
        previewHTML += `
            <div class="hero-preview-slide ${index === 0 ? 'active' : ''}" data-slide="${index}">
                <div class="hero-preview-content">
                    <h2>${slide.title}</h2>
                    <h3>${slide.subtitle}</h3>
                    <p>${slide.description}</p>
                    ${slide.price ? `<div class="hero-preview-price">${slide.price}</div>` : ''}
                    ${slide.buttonText ? `<button class="btn btn-primary">${slide.buttonText}</button>` : ''}
                </div>
                <div class="hero-preview-image">
                    <img src="${slide.image}" alt="${slide.title}" onerror="this.src='images/hero/hero-shoes.svg'">
                </div>
            </div>
        `;
    });
    
    previewHTML += `
            </div>
            <div class="hero-preview-controls">
                <button class="btn btn-sm btn-secondary" onclick="previousPreviewSlide()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span class="preview-counter">1 / ${activeSlides.length}</span>
                <button class="btn btn-sm btn-secondary" onclick="nextPreviewSlide()">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;
    
    previewContainer.innerHTML = previewHTML;
    document.getElementById('heroPreviewModal').classList.add('active');
    
    // Iniciar auto-play si hay más de un slide
    if (activeSlides.length > 1) {
        startPreviewAutoPlay();
    }
}

// Navegación de vista previa
let currentPreviewSlide = 0;
let previewAutoPlayInterval;

function nextPreviewSlide() {
    const slides = document.querySelectorAll('.hero-preview-slide');
    const totalSlides = slides.length;
    
    slides[currentPreviewSlide].classList.remove('active');
    currentPreviewSlide = (currentPreviewSlide + 1) % totalSlides;
    slides[currentPreviewSlide].classList.add('active');
    
    updatePreviewCounter();
}

function previousPreviewSlide() {
    const slides = document.querySelectorAll('.hero-preview-slide');
    const totalSlides = slides.length;
    
    slides[currentPreviewSlide].classList.remove('active');
    currentPreviewSlide = (currentPreviewSlide - 1 + totalSlides) % totalSlides;
    slides[currentPreviewSlide].classList.add('active');
    
    updatePreviewCounter();
}

function updatePreviewCounter() {
    const counter = document.querySelector('.preview-counter');
    if (counter) {
        counter.textContent = `${currentPreviewSlide + 1} / ${document.querySelectorAll('.hero-preview-slide').length}`;
    }
}

function startPreviewAutoPlay() {
    if (previewAutoPlayInterval) {
        clearInterval(previewAutoPlayInterval);
    }
    
    previewAutoPlayInterval = setInterval(() => {
        nextPreviewSlide();
    }, heroConfig.slideInterval * 1000);
}

// Algoritmo automático para selección de contenido destacado
function getAutomaticFeaturedContent() {
    // Obtener productos con mejor rating y stock disponible
    const featuredProducts = products
        .filter(p => p.stock > 0 && p.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    
    return featuredProducts.map((product, index) => ({
        id: `auto_${product.id}`,
        title: product.name.toUpperCase(),
        subtitle: product.category.toUpperCase(),
        description: product.description,
        price: formatPrice(product.price),
        buttonText: 'VER PRODUCTO',
        image: product.image,
        active: true,
        isAutomatic: true
    }));
}

// Actualizar visualización del modo hero
function updateHeroModeDisplay() {
    const mode = document.getElementById('heroMode').value;
    const slidesContainer = document.getElementById('heroSlidesContainer');
    
    if (slidesContainer) {
        slidesContainer.setAttribute('data-mode', mode);
        
        if (mode === 'automatic') {
            // Hacer backup de slides manuales actuales
            const currentSlides = heroSlides.filter(slide => !slide.isAutomatic);
            if (currentSlides.length > 0) {
                localStorage.setItem('eterStore_hero_slides_backup', JSON.stringify(currentSlides));
            }
            
            // Generar slides automáticos
            const automaticSlides = getAutomaticFeaturedContent();
            heroSlides = automaticSlides;
            localStorage.setItem('eterStore_hero_slides', JSON.stringify(heroSlides));
            loadHeroSlidesList();
            
            showNotification('Modo automático activado - Slides generados automáticamente', 'info');
        } else {
            // Restaurar slides manuales
            const savedSlides = localStorage.getItem('eterStore_hero_slides_backup');
            if (savedSlides) {
                heroSlides = JSON.parse(savedSlides);
                localStorage.setItem('eterStore_hero_slides', JSON.stringify(heroSlides));
                loadHeroSlidesList();
            }
            
            showNotification('Modo manual activado - Puedes editar los slides manualmente', 'info');
        }
    }
} 

// ===== HERO MANAGEMENT FUNCTIONALITY =====

// Hero Management Controller
class HeroManager {
    constructor() {
        this.currentTab = 'featured-product';
        this.billboardSlides = [];
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.loadFeaturedProduct();
        this.loadBillboardSlides();
        this.setupEventListeners();
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.hero-management-tabs .tab-btn');
        const tabContents = document.querySelectorAll('.hero-tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.hero-management-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab contents
        document.querySelectorAll('.hero-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;
    }

    setupEventListeners() {
        // Featured Product Events
        const featuredProductSelect = document.getElementById('featuredProductSelect');
        if (featuredProductSelect) {
            featuredProductSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.loadProductData(e.target.value);
                }
            });
        }

        const createCustomProductBtn = document.getElementById('createCustomProduct');
        if (createCustomProductBtn) {
            createCustomProductBtn.addEventListener('click', () => {
                this.createCustomProduct();
            });
        }

        const featuredProductForm = document.getElementById('featuredProductForm');
        if (featuredProductForm) {
            featuredProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveFeaturedProduct();
            });
        }

        const previewFeaturedProductBtn = document.getElementById('previewFeaturedProduct');
        if (previewFeaturedProductBtn) {
            previewFeaturedProductBtn.addEventListener('click', () => {
                this.previewFeaturedProduct();
            });
        }

        // Billboard Events
        const addBillboardSlideBtn = document.getElementById('addBillboardSlide');
        if (addBillboardSlideBtn) {
            addBillboardSlideBtn.addEventListener('click', () => {
                this.showBillboardSlideModal();
            });
        }

        const saveBillboardBtn = document.getElementById('saveBillboard');
        if (saveBillboardBtn) {
            saveBillboardBtn.addEventListener('click', () => {
                this.saveBillboardSlides();
            });
        }

        const previewBillboardBtn = document.getElementById('previewBillboard');
        if (previewBillboardBtn) {
            previewBillboardBtn.addEventListener('click', () => {
                this.previewBillboard();
            });
        }

        // Settings Events
        const heroSettingsForm = document.getElementById('heroSettingsForm');
        if (heroSettingsForm) {
            heroSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveHeroSettings();
            });
        }

        const resetHeroSettingsBtn = document.getElementById('resetHeroSettings');
        if (resetHeroSettingsBtn) {
            resetHeroSettingsBtn.addEventListener('click', () => {
                this.resetHeroSettings();
            });
        }
    }

    // Featured Product Management
    loadFeaturedProduct() {
        const savedProduct = localStorage.getItem('eterStore_featured_product');
        if (savedProduct) {
            const product = JSON.parse(savedProduct);
            this.populateFeaturedProductForm(product);
        }

        // Load products for dropdown
        this.loadProductsDropdown();
    }

    loadProductsDropdown() {
        const select = document.getElementById('featuredProductSelect');
        if (!select) return;

        // Get products from ProductManager
        const products = window.ProductManager ? window.ProductManager.products : [];
        
        select.innerHTML = '<option value="">Seleccionar producto existente</option>';
        
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            select.appendChild(option);
        });
    }

    loadProductData(productId) {
        const products = window.ProductManager ? window.ProductManager.products : [];
        const product = products.find(p => p.id === productId);
        
        if (product) {
            this.populateFeaturedProductForm(product);
        }
    }

    populateFeaturedProductForm(product) {
        const fields = [
            'featuredProductTitle',
            'featuredProductDescription',
            'featuredProductPrice',
            'featuredProductImage',
            'featuredProductSales',
            'featuredProductRating',
            'featuredProductReviews',
            'featuredProductCategory'
        ];

        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element && product[field.replace('featuredProduct', '').toLowerCase()]) {
                element.value = product[field.replace('featuredProduct', '').toLowerCase()];
            }
        });
    }

    createCustomProduct() {
        // Clear form for custom product
        const fields = [
            'featuredProductTitle',
            'featuredProductDescription',
            'featuredProductPrice',
            'featuredProductImage',
            'featuredProductSales',
            'featuredProductRating',
            'featuredProductReviews'
        ];

        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) element.value = '';
        });

        // Reset product select
        const select = document.getElementById('featuredProductSelect');
        if (select) select.value = '';
    }

    saveFeaturedProduct() {
        const formData = new FormData(document.getElementById('featuredProductForm'));
        const product = {
            id: 'featured-' + Date.now(),
            title: formData.get('featuredProductTitle'),
            description: formData.get('featuredProductDescription'),
            price: parseFloat(formData.get('featuredProductPrice')),
            image: formData.get('featuredProductImage'),
            sales: parseInt(formData.get('featuredProductSales')),
            rating: parseFloat(formData.get('featuredProductRating')),
            reviews: parseInt(formData.get('featuredProductReviews')),
            category: formData.get('featuredProductCategory'),
            cta: formData.get('featuredProductCTA'),
            secondaryCta: formData.get('featuredProductSecondaryCTA')
        };

        localStorage.setItem('eterStore_featured_product', JSON.stringify(product));
        
        // Trigger update on main page
        window.dispatchEvent(new CustomEvent('featuredProductUpdated', { detail: product }));
        
        this.showNotification('Producto estrella guardado exitosamente', 'success');
    }

    previewFeaturedProduct() {
        const formData = new FormData(document.getElementById('featuredProductForm'));
        const product = {
            title: formData.get('featuredProductTitle'),
            description: formData.get('featuredProductDescription'),
            price: parseFloat(formData.get('featuredProductPrice')),
            image: formData.get('featuredProductImage'),
            sales: parseInt(formData.get('featuredProductSales')),
            rating: parseFloat(formData.get('featuredProductRating')),
            reviews: parseInt(formData.get('featuredProductReviews'))
        };

        // Show preview modal
        this.showPreviewModal('Producto Estrella', product);
    }

    // Billboard Management
    loadBillboardSlides() {
        const savedSlides = localStorage.getItem('eterStore_billboard_slides');
        if (savedSlides) {
            this.billboardSlides = JSON.parse(savedSlides);
            this.renderBillboardSlides();
        }
    }

    renderBillboardSlides() {
        const container = document.getElementById('billboardSlidesList');
        if (!container) return;

        container.innerHTML = '';

        this.billboardSlides.forEach((slide, index) => {
            const slideElement = this.createBillboardSlideElement(slide, index);
            container.appendChild(slideElement);
        });
    }

    createBillboardSlideElement(slide, index) {
        const div = document.createElement('div');
        div.className = 'billboard-slide-item';
        div.innerHTML = `
            <div class="slide-item-header">
                <div class="slide-item-title">${slide.title}</div>
                <div class="slide-item-actions">
                    <button class="slide-action-btn edit" onclick="heroManager.editBillboardSlide(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="slide-action-btn delete" onclick="heroManager.deleteBillboardSlide(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="slide-item-content">
                <div class="slide-preview">
                    <div class="slide-preview-icon">
                        <i class="fas fa-${slide.icon}"></i>
                    </div>
                    <div class="slide-preview-title">${slide.title}</div>
                    <div class="slide-preview-text">${slide.description}</div>
                </div>
                <div class="slide-form">
                    <div class="slide-form-row">
                        <div class="slide-form-group">
                            <label>Tipo:</label>
                            <span>${slide.type}</span>
                        </div>
                        <div class="slide-form-group">
                            <label>Estado:</label>
                            <span>${slide.active ? 'Activo' : 'Inactivo'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return div;
    }

    showBillboardSlideModal(slide = null, index = null) {
        const modal = document.createElement('div');
        modal.className = 'billboard-slide-modal active';
        modal.innerHTML = `
            <div class="billboard-slide-content">
                <div class="billboard-slide-header">
                    <h3>${slide ? 'Editar Anuncio Premium' : 'Agregar Anuncio Premium'}</h3>
                    <button class="close-billboard-modal" onclick="this.closest('.billboard-slide-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="billboard-slide-body">
                    <div class="slide-type-selection">
                        <div class="slide-type-option" data-type="offer">
                            <div class="slide-type-icon">
                                <i class="fas fa-fire"></i>
                            </div>
                            <div class="slide-type-title">Oferta Especial</div>
                            <div class="slide-type-description">Descuentos y promociones limitadas</div>
                        </div>
                        <div class="slide-type-option" data-type="launch">
                            <div class="slide-type-icon">
                                <i class="fas fa-rocket"></i>
                            </div>
                            <div class="slide-type-title">Nuevo Lanzamiento</div>
                            <div class="slide-type-description">Productos nuevos y exclusivos</div>
                        </div>
                        <div class="slide-type-option" data-type="vip">
                            <div class="slide-type-icon">
                                <i class="fas fa-gem"></i>
                            </div>
                            <div class="slide-type-title">Programa VIP</div>
                            <div class="slide-type-description">Beneficios exclusivos para revendedores</div>
                        </div>
                    </div>
                    <form id="billboardSlideForm">
                        <div class="slide-form-row">
                            <div class="slide-form-group">
                                <label for="slideTitle">Título</label>
                                <input type="text" id="slideTitle" name="slideTitle" required value="${slide ? slide.title : ''}">
                            </div>
                            <div class="slide-form-group">
                                <label for="slideIcon">Icono</label>
                                <select id="slideIcon" name="slideIcon">
                                    <option value="fire" ${slide && slide.icon === 'fire' ? 'selected' : ''}>Fuego</option>
                                    <option value="rocket" ${slide && slide.icon === 'rocket' ? 'selected' : ''}>Cohete</option>
                                    <option value="gem" ${slide && slide.icon === 'gem' ? 'selected' : ''}>Gema</option>
                                    <option value="star" ${slide && slide.icon === 'star' ? 'selected' : ''}>Estrella</option>
                                    <option value="crown" ${slide && slide.icon === 'crown' ? 'selected' : ''}>Corona</option>
                                </select>
                            </div>
                        </div>
                        <div class="slide-form-group">
                            <label for="slideDescription">Descripción</label>
                            <textarea id="slideDescription" name="slideDescription" required>${slide ? slide.description : ''}</textarea>
                        </div>
                        <div class="slide-form-group">
                            <label for="slideCTA">Texto del Botón</label>
                            <input type="text" id="slideCTA" name="slideCTA" required value="${slide ? slide.cta : ''}">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Guardar Anuncio</button>
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.billboard-slide-modal').remove()">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup slide type selection
        const typeOptions = modal.querySelectorAll('.slide-type-option');
        typeOptions.forEach(option => {
            option.addEventListener('click', () => {
                typeOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Setup form submission
        const form = modal.querySelector('#billboardSlideForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBillboardSlide(modal, slide, index);
        });
    }

    saveBillboardSlide(modal, slide = null, index = null) {
        const formData = new FormData(modal.querySelector('#billboardSlideForm'));
        const selectedType = modal.querySelector('.slide-type-option.selected');
        
        const newSlide = {
            id: slide ? slide.id : 'slide-' + Date.now(),
            type: selectedType ? selectedType.dataset.type : 'offer',
            title: formData.get('slideTitle'),
            description: formData.get('slideDescription'),
            icon: formData.get('slideIcon'),
            cta: formData.get('slideCTA'),
            active: true,
            createdAt: slide ? slide.createdAt : new Date().toISOString()
        };

        if (index !== null) {
            this.billboardSlides[index] = newSlide;
        } else {
            this.billboardSlides.push(newSlide);
        }
        this.saveBillboardSlides();
        this.renderBillboardSlides();
        
        modal.remove();
        this.showNotification('Anuncio guardado exitosamente', 'success');
    }

    editBillboardSlide(index) {
        const slide = this.billboardSlides[index];
        this.showBillboardSlideModal(slide, index);
    }

    deleteBillboardSlide(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
            this.billboardSlides.splice(index, 1);
            this.saveBillboardSlides();
            this.renderBillboardSlides();
            this.showNotification('Anuncio eliminado exitosamente', 'success');
        }
    }

    saveBillboardSlides() {
        localStorage.setItem('eterStore_billboard_slides', JSON.stringify(this.billboardSlides));
        
        // Trigger update on main page
        window.dispatchEvent(new CustomEvent('billboardSlidesUpdated', { detail: this.billboardSlides }));
    }

    previewBillboard() {
        this.showPreviewModal('Anuncios Premium', this.billboardSlides);
    }

    // Hero Settings Management
    saveHeroSettings() {
        const formData = new FormData(document.getElementById('heroSettingsForm'));
        const settings = {
            backgroundStyle: formData.get('heroBackgroundStyle'),
            animationSpeed: formData.get('heroAnimationSpeed'),
            mobileLayout: formData.get('heroMobileLayout'),
            showClientStats: formData.get('showClientStats') === 'on',
            showShippingStats: formData.get('showShippingStats') === 'on'
        };

        localStorage.setItem('eterStore_hero_settings', JSON.stringify(settings));
        
        // Trigger update on main page
        window.dispatchEvent(new CustomEvent('heroSettingsUpdated', { detail: settings }));
        
        this.showNotification('Configuración del Hero guardada exitosamente', 'success');
    }

    resetHeroSettings() {
        if (confirm('¿Estás seguro de que quieres restaurar la configuración original?')) {
            localStorage.removeItem('eterStore_hero_settings');
            localStorage.removeItem('eterStore_featured_product');
            localStorage.removeItem('eterStore_billboard_slides');
            
            // Reload forms
            this.loadFeaturedProduct();
            this.loadBillboardSlides();
            
            this.showNotification('Configuración restaurada exitosamente', 'success');
        }
    }

    // Utility Methods
    showPreviewModal(title, data) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Vista Previa: ${title}</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="preview-content">
                        <p>Esta es una vista previa de cómo se verá el contenido en el Hero.</p>
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize Hero Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('hero')) {
        window.heroManager = new HeroManager();
    }
});

// Export for global access
window.HeroManager = HeroManager; 

// ===== AI ASSISTANT FUNCTIONALITY =====

// AI Assistant Controller
class AIAssistant {
    constructor() {
        this.isConnected = true;
        this.suggestions = {};
        this.currentContent = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAIStatus();
        this.loadIconOptions();
    }

    setupEventListeners() {
        // AI Content Generation
        const generateAIContentBtn = document.getElementById('generateAIContent');
        if (generateAIContentBtn) {
            generateAIContentBtn.addEventListener('click', () => {
                this.generateContent();
            });
        }

        const optimizeExistingContentBtn = document.getElementById('optimizeExistingContent');
        if (optimizeExistingContentBtn) {
            optimizeExistingContentBtn.addEventListener('click', () => {
                this.optimizeExistingContent();
            });
        }

        // Suggestions Panel
        const refreshSuggestionsBtn = document.getElementById('refreshSuggestions');
        if (refreshSuggestionsBtn) {
            refreshSuggestionsBtn.addEventListener('click', () => {
                this.refreshSuggestions();
            });
        }

        // Suggestion Tabs
        const suggestionTabs = document.querySelectorAll('.suggestion-tab');
        suggestionTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchSuggestionTab(tab.dataset.suggestion);
            });
        });

        // AI Content Editor
        const applyAIContentBtn = document.getElementById('applyAIContent');
        if (applyAIContentBtn) {
            applyAIContentBtn.addEventListener('click', () => {
                this.applyAIContent();
            });
        }

        const discardAIContentBtn = document.getElementById('discardAIContent');
        if (discardAIContentBtn) {
            discardAIContentBtn.addEventListener('click', () => {
                this.discardAIContent();
            });
        }

        // Real-time feedback
        const aiGeneratedTitle = document.getElementById('aiGeneratedTitle');
        if (aiGeneratedTitle) {
            aiGeneratedTitle.addEventListener('input', () => {
                this.analyzeContent('title', aiGeneratedTitle.value);
            });
        }

        const aiGeneratedDescription = document.getElementById('aiGeneratedDescription');
        if (aiGeneratedDescription) {
            aiGeneratedDescription.addEventListener('input', () => {
                this.analyzeContent('description', aiGeneratedDescription.value);
            });
        }
    }

    updateAIStatus() {
        const indicator = document.getElementById('aiStatusIndicator');
        const statusText = document.getElementById('aiStatusText');
        
        if (this.isConnected) {
            indicator.classList.remove('offline');
            statusText.textContent = 'IA Conectada';
        } else {
            indicator.classList.add('offline');
            statusText.textContent = 'IA Desconectada';
        }
    }

    loadIconOptions() {
        const iconSelect = document.getElementById('aiGeneratedIcon');
        if (!iconSelect) return;

        const icons = [
            { value: 'fire', name: 'Fuego', icon: 'fas fa-fire' },
            { value: 'rocket', name: 'Cohete', icon: 'fas fa-rocket' },
            { value: 'gem', name: 'Gema', icon: 'fas fa-gem' },
            { value: 'star', name: 'Estrella', icon: 'fas fa-star' },
            { value: 'crown', name: 'Corona', icon: 'fas fa-crown' },
            { value: 'bolt', name: 'Rayo', icon: 'fas fa-bolt' },
            { value: 'heart', name: 'Corazón', icon: 'fas fa-heart' },
            { value: 'trophy', name: 'Trofeo', icon: 'fas fa-trophy' },
            { value: 'medal', name: 'Medalla', icon: 'fas fa-medal' },
            { value: 'gift', name: 'Regalo', icon: 'fas fa-gift' }
        ];

        icons.forEach(icon => {
            const option = document.createElement('option');
            option.value = icon.value;
            option.textContent = `${icon.name} (${icon.icon})`;
            iconSelect.appendChild(option);
        });
    }

    async generateContent() {
        const productType = document.getElementById('aiProductType').value;
        const targetAudience = document.getElementById('aiTargetAudience').value;
        const campaignGoal = document.getElementById('aiCampaignGoal').value;
        const tone = document.getElementById('aiTone').value;
        const keywords = document.getElementById('aiKeywords').value;

        if (!productType || !targetAudience || !campaignGoal || !tone) {
            this.showNotification('Por favor completa todos los campos requeridos', 'warning');
            return;
        }

        this.showLoadingState();
        
        try {
            // Verificar que el servicio de IA esté disponible
            if (!window.AIService) {
                throw new Error('Servicio de IA no disponible');
            }

            // Construir prompt para la IA
            const prompt = this.buildPrompt(productType, targetAudience, campaignGoal, tone, keywords);
            
            // Llamar al servicio de IA
            const aiResponse = await window.AIService.generateContent(prompt, {
                temperature: 0.8,
                maxTokens: 800
            });

            if (!aiResponse.success) {
                throw new Error(aiResponse.error || 'Error generando contenido');
            }

            // Procesar respuesta de la IA
            this.processAIResponse(aiResponse.content, { productType, targetAudience, campaignGoal, tone, keywords });
            
            this.showSuggestionsPanel();
            this.hideLoadingState();
            this.showNotification('Contenido generado exitosamente', 'success');

        } catch (error) {
            console.error('Error generando contenido:', error);
            this.hideLoadingState();
            this.showNotification(error.message, 'error');
            
            // Fallback a generación local
            this.generateAISuggestions(productType, targetAudience, campaignGoal, tone, keywords);
            this.showSuggestionsPanel();
        }
    }

    buildPrompt(productType, targetAudience, campaignGoal, tone, keywords) {
        return `Genera un anuncio publicitario para WhatsApp Business con las siguientes especificaciones:

Tipo de Producto: ${productType}
Audiencia Objetivo: ${targetAudience}
Objetivo de Campaña: ${campaignGoal}
Tono del Mensaje: ${tone}
Palabras Clave: ${keywords || 'No especificadas'}

Por favor genera:
1. Un título llamativo y efectivo
2. Una descripción persuasiva y atractiva
3. Un call-to-action convincente
4. Sugerencias de diseño y optimización

El anuncio debe ser para una tienda de calzados premium llamada "Éter Store" en Mar del Plata, Argentina.`;
    }

    processAIResponse(content, formData) {
        // Parsear la respuesta de la IA
        const sections = this.parseAIResponse(content);
        
        // Actualizar sugerencias
        this.suggestions = {
            titles: sections.titles || [],
            descriptions: sections.descriptions || [],
            ctas: sections.ctas || [],
            design: this.generateDesignSuggestions(formData.productType, formData.tone),
            optimization: this.generateOptimizationSuggestions()
        };

        // Actualizar contenido actual
        this.currentContent = {
            title: sections.titles?.[0]?.text || '',
            description: sections.descriptions?.[0]?.text || '',
            cta: sections.ctas?.[0]?.text || '',
            formData: formData
        };

        this.renderSuggestions();
        this.updateAnalytics();
    }

    parseAIResponse(content) {
        // Parsear la respuesta de la IA para extraer diferentes secciones
        const sections = {
            titles: [],
            descriptions: [],
            ctas: []
        };

        // Dividir el contenido en líneas
        const lines = content.split('\n').filter(line => line.trim());
        
        let currentSection = null;
        
        lines.forEach(line => {
            const lowerLine = line.toLowerCase();
            
            if (lowerLine.includes('título') || lowerLine.includes('title')) {
                currentSection = 'titles';
            } else if (lowerLine.includes('descripción') || lowerLine.includes('description')) {
                currentSection = 'descriptions';
            } else if (lowerLine.includes('call-to-action') || lowerLine.includes('cta')) {
                currentSection = 'ctas';
            } else if (line.trim() && currentSection) {
                // Agregar contenido a la sección actual
                sections[currentSection].push({
                    text: line.trim(),
                    score: Math.floor(Math.random() * 20) + 80,
                    type: 'ai-generated'
                });
            }
        });

        // Si no se encontraron secciones específicas, dividir el contenido
        if (!sections.titles.length && !sections.descriptions.length && !sections.ctas.length) {
            const parts = content.split('\n\n');
            if (parts.length >= 3) {
                sections.titles = [{ text: parts[0], score: 85, type: 'ai-generated' }];
                sections.descriptions = [{ text: parts[1], score: 82, type: 'ai-generated' }];
                sections.ctas = [{ text: parts[2], score: 88, type: 'ai-generated' }];
            } else {
                sections.descriptions = [{ text: content, score: 80, type: 'ai-generated' }];
            }
        }

        return sections;
    }

    generateAISuggestions(productType, targetAudience, campaignGoal, tone, keywords) {
        // AI Content Generation Logic
        const contentTemplates = this.getContentTemplates(productType, targetAudience, campaignGoal, tone);
        const keywordsArray = keywords ? keywords.split(',').map(k => k.trim()) : [];

        // Generate titles
        const titles = this.generateTitles(contentTemplates, keywordsArray);
        
        // Generate descriptions
        const descriptions = this.generateDescriptions(contentTemplates, keywordsArray);
        
        // Generate CTAs
        const ctas = this.generateCTAs(campaignGoal, tone);
        
        // Generate design suggestions
        const designSuggestions = this.generateDesignSuggestions(productType, tone);
        
        // Generate optimization suggestions
        const optimizationSuggestions = this.generateOptimizationSuggestions();

        this.suggestions = {
            titles,
            descriptions,
            ctas,
            design: designSuggestions,
            optimization: optimizationSuggestions
        };

        this.renderSuggestions();
        this.updateAnalytics();
    }

    getContentTemplates(productType, targetAudience, campaignGoal, tone) {
        const templates = {
            deportivo: {
                revendedores: {
                    ventas: {
                        profesional: {
                            titles: ['CALZADO DEPORTIVO PREMIUM', 'RUNNING SHOES PROFESIONALES', 'DEPORTIVOS DE ALTA GAMA'],
                            descriptions: ['Calzado deportivo de máxima calidad para revendedores exigentes. Tecnología avanzada y diseño premium.']
                        },
                        urgente: {
                            titles: ['¡OFERTA LIMITADA! DEPORTIVOS PREMIUM', 'ÚLTIMAS UNIDADES - RUNNING SHOES', 'STOCK AGOTÁNDOSE - DEPORTIVOS'],
                            descriptions: ['¡No te pierdas esta oportunidad única! Stock limitado de calzado deportivo premium.']
                        }
                    }
                }
            },
            casual: {
                revendedores: {
                    ventas: {
                        amigable: {
                            titles: ['CALZADO CASUAL COMFORT', 'CASUAL SHOES ELEGANTES', 'URBAN SHOES PREMIUM'],
                            descriptions: ['Comodidad y estilo en cada paso. Calzado casual que combina elegancia y confort.']
                        }
                    }
                }
            }
        };

        return templates[productType]?.[targetAudience]?.[campaignGoal]?.[tone] || {
            titles: ['PRODUCTO PREMIUM', 'CALZADO DE CALIDAD', 'SHOES EXCLUSIVOS'],
            descriptions: ['Descubre nuestra colección premium de calzado de alta calidad.']
        };
    }

    generateTitles(templates, keywords) {
        const baseTitles = templates.titles || ['PRODUCTO PREMIUM', 'CALZADO DE CALIDAD'];
        const titles = [];

        baseTitles.forEach(title => {
            titles.push({
                text: title,
                score: Math.floor(Math.random() * 20) + 80,
                keywords: keywords.slice(0, 2),
                type: 'primary'
            });

            // Generate variations
            const variations = [
                `${title} - EDICIÓN LIMITADA`,
                `¡${title}! OFERTA ESPECIAL`,
                `${title} - EXCLUSIVO PARA REVENDEDORES`
            ];

            variations.forEach(variation => {
                titles.push({
                    text: variation,
                    score: Math.floor(Math.random() * 15) + 75,
                    keywords: keywords.slice(0, 1),
                    type: 'variation'
                });
            });
        });

        return titles.sort((a, b) => b.score - a.score);
    }

    generateDescriptions(templates, keywords) {
        const baseDescriptions = templates.descriptions || ['Descubre nuestra colección premium de calzado de alta calidad.'];
        const descriptions = [];

        baseDescriptions.forEach(desc => {
            descriptions.push({
                text: desc,
                score: Math.floor(Math.random() * 20) + 80,
                length: 'optimal',
                keywords: keywords
            });

            // Generate variations
            const variations = [
                `${desc} Perfecto para revendedores que buscan calidad y rentabilidad.`,
                `${desc} Con tecnología avanzada y materiales premium.`,
                `${desc} Ideal para clientes exigentes que valoran la excelencia.`
            ];

            variations.forEach(variation => {
                descriptions.push({
                    text: variation,
                    score: Math.floor(Math.random() * 15) + 75,
                    length: 'extended',
                    keywords: keywords
                });
            });
        });

        return descriptions.sort((a, b) => b.score - a.score);
    }

    generateCTAs(campaignGoal, tone) {
        const ctaTemplates = {
            ventas: {
                profesional: ['COMPRAR AHORA', 'SOLICITAR COTIZACIÓN', 'AGREGAR AL CARRITO'],
                urgente: ['¡COMPRAR YA!', 'STOCK LIMITADO', 'OFERTA POR TIEMPO LIMITADO'],
                amigable: ['Ver Productos', 'Explorar Colección', 'Contactar']
            },
            lanzamiento: {
                profesional: ['RESERVAR AHORA', 'PRE-ORDER', 'ACCESO ANTICIPADO'],
                exclusivo: ['EXCLUSIVO VIP', 'ACCESO PRIVILEGIADO', 'INVITACIÓN ESPECIAL']
            }
        };

        const ctas = ctaTemplates[campaignGoal]?.[tone] || ['VER MÁS', 'CONTACTAR', 'EXPLORAR'];
        
        return ctas.map(cta => ({
            text: cta,
            score: Math.floor(Math.random() * 20) + 80,
            type: campaignGoal
        }));
    }

    generateDesignSuggestions(productType, tone) {
        const colorPalettes = [
            {
                name: 'Premium Blue',
                colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd'],
                score: 94
            },
            {
                name: 'Elegant Purple',
                colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'],
                score: 91
            },
            {
                name: 'Modern Green',
                colors: ['#059669', '#10b981', '#34d399', '#6ee7b7'],
                score: 88
            }
        ];

        const icons = [
            { name: 'fire', icon: 'fas fa-fire', relevance: 95 },
            { name: 'star', icon: 'fas fa-star', relevance: 92 },
            { name: 'crown', icon: 'fas fa-crown', relevance: 89 },
            { name: 'gem', icon: 'fas fa-gem', relevance: 87 }
        ];

        const layouts = [
            { name: 'Centrado con CTA prominente', engagement: 89 },
            { name: 'Asimétrico con imagen destacada', engagement: 87 },
            { name: 'Grid con múltiples elementos', engagement: 85 }
        ];

        return { colorPalettes, icons, layouts };
    }

    generateOptimizationSuggestions() {
        return {
            performance: {
                engagement: Math.floor(Math.random() * 20) + 80,
                clickRate: Math.floor(Math.random() * 10) + 5,
                conversion: Math.floor(Math.random() * 15) + 10
            },
            improvements: [
                'Usar números en el título para mayor impacto',
                'Incluir palabras de acción en el CTA',
                'Optimizar para dispositivos móviles',
                'Agregar elementos de urgencia'
            ],
            timing: [
                'Mejor horario: 9:00 - 11:00 AM',
                'Días óptimos: Martes y Jueves',
                'Frecuencia recomendada: 2-3 veces por semana'
            ]
        };
    }

    renderSuggestions() {
        this.renderTitleSuggestions();
        this.renderDescriptionSuggestions();
        this.renderCTASuggestions();
        this.renderDesignSuggestions();
        this.renderOptimizationSuggestions();
    }

    renderTitleSuggestions() {
        const container = document.getElementById('titleSuggestions');
        if (!container || !this.suggestions.titles) return;

        container.innerHTML = '';
        this.suggestions.titles.slice(0, 5).forEach((title, index) => {
            const option = this.createSuggestionOption(title.text, title.score, 'title', index);
            container.appendChild(option);
        });
    }

    renderDescriptionSuggestions() {
        const container = document.getElementById('descriptionSuggestions');
        if (!container || !this.suggestions.descriptions) return;

        container.innerHTML = '';
        this.suggestions.descriptions.slice(0, 3).forEach((desc, index) => {
            const option = this.createSuggestionOption(desc.text, desc.score, 'description', index);
            container.appendChild(option);
        });
    }

    renderCTASuggestions() {
        const container = document.getElementById('ctaSuggestions');
        if (!container || !this.suggestions.ctas) return;

        container.innerHTML = '';
        this.suggestions.ctas.slice(0, 4).forEach((cta, index) => {
            const option = this.createSuggestionOption(cta.text, cta.score, 'cta', index);
            container.appendChild(option);
        });
    }

    renderDesignSuggestions() {
        this.renderColorPalettes();
        this.renderIconSuggestions();
        this.renderLayoutSuggestions();
    }

    renderColorPalettes() {
        const container = document.getElementById('colorPaletteSuggestions');
        if (!container || !this.suggestions.design?.colorPalettes) return;

        container.innerHTML = '';
        this.suggestions.design.colorPalettes.forEach(palette => {
            const paletteElement = document.createElement('div');
            paletteElement.className = 'color-palette';
            paletteElement.innerHTML = `
                <div class="color-palette-header">
                    <span class="color-palette-name">${palette.name}</span>
                    <span class="color-palette-score">${palette.score}%</span>
                </div>
                <div class="color-swatches">
                    ${palette.colors.map(color => `<div class="color-swatch" style="background-color: ${color}"></div>`).join('')}
                </div>
            `;
            paletteElement.addEventListener('click', () => this.selectColorPalette(palette));
            container.appendChild(paletteElement);
        });
    }

    renderIconSuggestions() {
        const container = document.getElementById('iconSuggestions');
        if (!container || !this.suggestions.design?.icons) return;

        container.innerHTML = '';
        this.suggestions.design.icons.forEach(icon => {
            const iconElement = document.createElement('div');
            iconElement.className = 'icon-suggestion';
            iconElement.innerHTML = `
                <i class="${icon.icon}"></i>
                <div class="icon-name">${icon.name}</div>
            `;
            iconElement.addEventListener('click', () => this.selectIcon(icon));
            container.appendChild(iconElement);
        });
    }

    renderLayoutSuggestions() {
        const container = document.getElementById('layoutSuggestions');
        if (!container || !this.suggestions.design?.layouts) return;

        container.innerHTML = '';
        this.suggestions.design.layouts.forEach(layout => {
            const layoutElement = document.createElement('div');
            layoutElement.className = 'suggestion-option';
            layoutElement.innerHTML = `
                <div class="option-text">${layout.name}</div>
                <div class="option-meta">
                    <span>Engagement: ${layout.engagement}%</span>
                </div>
            `;
            layoutElement.addEventListener('click', () => this.selectLayout(layout));
            container.appendChild(layoutElement);
        });
    }

    renderOptimizationSuggestions() {
        this.renderPerformanceAnalysis();
        this.renderImprovementSuggestions();
        this.renderTimingSuggestions();
    }

    renderPerformanceAnalysis() {
        const container = document.getElementById('performanceAnalysis');
        if (!container || !this.suggestions.optimization?.performance) return;

        const performance = this.suggestions.optimization.performance;
        container.innerHTML = `
            <div class="performance-metrics">
                <div class="metric">
                    <span class="metric-label">Engagement:</span>
                    <span class="metric-value">${performance.engagement}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">CTR:</span>
                    <span class="metric-value">${performance.clickRate}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Conversión:</span>
                    <span class="metric-value">${performance.conversion}%</span>
                </div>
            </div>
        `;
    }

    renderImprovementSuggestions() {
        const container = document.getElementById('improvementSuggestions');
        if (!container || !this.suggestions.optimization?.improvements) return;

        container.innerHTML = '';
        this.suggestions.optimization.improvements.forEach(improvement => {
            const improvementElement = document.createElement('div');
            improvementElement.className = 'suggestion-option';
            improvementElement.innerHTML = `
                <div class="option-text">${improvement}</div>
            `;
            container.appendChild(improvementElement);
        });
    }

    renderTimingSuggestions() {
        const container = document.getElementById('timingSuggestions');
        if (!container || !this.suggestions.optimization?.timing) return;

        container.innerHTML = '';
        this.suggestions.optimization.timing.forEach(timing => {
            const timingElement = document.createElement('div');
            timingElement.className = 'suggestion-option';
            timingElement.innerHTML = `
                <div class="option-text">${timing}</div>
            `;
            container.appendChild(timingElement);
        });
    }

    createSuggestionOption(text, score, type, index) {
        const option = document.createElement('div');
        option.className = 'suggestion-option';
        option.innerHTML = `
            <div class="option-text">${text}</div>
            <div class="option-meta">
                <span>Score: ${score}%</span>
                <div class="option-actions">
                    <button class="btn btn-sm btn-primary" onclick="aiAssistant.useSuggestion('${type}', ${index})">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
        `;
        return option;
    }

    useSuggestion(type, index) {
        const suggestions = this.suggestions[type === 'cta' ? 'ctas' : type + 's'];
        if (!suggestions || !suggestions[index]) return;

        const suggestion = suggestions[index];
        
        switch(type) {
            case 'title':
                document.getElementById('aiGeneratedTitle').value = suggestion.text;
                break;
            case 'description':
                document.getElementById('aiGeneratedDescription').value = suggestion.text;
                break;
            case 'cta':
                document.getElementById('aiGeneratedCTA').value = suggestion.text;
                break;
        }

        this.showContentEditor();
        this.updatePreview();
    }

    selectColorPalette(palette) {
        // Apply color palette to preview
        this.currentContent.colors = palette.colors;
        this.updatePreview();
    }

    selectIcon(icon) {
        document.getElementById('aiGeneratedIcon').value = icon.name;
        this.currentContent.icon = icon.icon;
        this.updatePreview();
    }

    selectLayout(layout) {
        this.currentContent.layout = layout.name;
        this.updatePreview();
    }

    switchSuggestionTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.suggestion-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-suggestion="${tabName}"]`).classList.add('active');

        // Update tab contents
        document.querySelectorAll('.suggestion-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Suggestions`).classList.add('active');
    }

    showSuggestionsPanel() {
        document.getElementById('aiSuggestionsPanel').style.display = 'block';
        document.getElementById('aiSuggestionsPanel').scrollIntoView({ behavior: 'smooth' });
    }

    showContentEditor() {
        document.getElementById('aiContentEditor').style.display = 'block';
        document.getElementById('aiContentEditor').scrollIntoView({ behavior: 'smooth' });
    }

    updatePreview() {
        const previewCard = document.getElementById('aiPreviewCard');
        if (!previewCard) return;

        const title = document.getElementById('aiGeneratedTitle').value || 'Título del Anuncio';
        const description = document.getElementById('aiGeneratedDescription').value || 'Descripción del anuncio';
        const cta = document.getElementById('aiGeneratedCTA').value || 'Ver Más';

        previewCard.innerHTML = `
            <div class="preview-content">
                <div class="preview-title">${title}</div>
                <div class="preview-description">${description}</div>
                <div class="preview-cta">${cta}</div>
            </div>
        `;
    }

    analyzeContent(type, content) {
        let score = 0;
        let feedback = '';

        switch(type) {
            case 'title':
                score = this.analyzeTitle(content);
                feedback = this.getTitleFeedback(content);
                break;
            case 'description':
                score = this.analyzeDescription(content);
                feedback = this.getDescriptionFeedback(content);
                break;
        }

        document.getElementById(`${type}Score`).textContent = score;
        document.getElementById(`${type}Feedback`).textContent = feedback;
    }

    analyzeTitle(title) {
        let score = 50;
        
        if (title.length > 0) score += 10;
        if (title.length <= 50) score += 10;
        if (title.includes('!')) score += 5;
        if (title.includes('%') || title.includes('$')) score += 5;
        if (title.includes('LIMITADO') || title.includes('EXCLUSIVO')) score += 10;
        if (title.includes('OFERTA') || title.includes('DESCUENTO')) score += 10;

        return Math.min(score, 100);
    }

    analyzeDescription(description) {
        let score = 50;
        
        if (description.length > 0) score += 10;
        if (description.length >= 50 && description.length <= 200) score += 20;
        if (description.includes('calidad') || description.includes('premium')) score += 10;
        if (description.includes('revendedores') || description.includes('mayorista')) score += 10;

        return Math.min(score, 100);
    }

    getTitleFeedback(title) {
        if (title.length === 0) return 'Agrega un título';
        if (title.length > 50) return 'Considera acortar el título';
        if (!title.includes('!') && !title.includes('LIMITADO')) return 'Agrega elementos de urgencia';
        return 'Título optimizado';
    }

    getDescriptionFeedback(description) {
        if (description.length === 0) return 'Agrega una descripción';
        if (description.length < 50) return 'Considera expandir la descripción';
        if (!description.includes('calidad') && !description.includes('premium')) return 'Incluye palabras clave de valor';
        return 'Descripción optimizada';
    }

    updateAnalytics() {
        const engagement = Math.floor(Math.random() * 20) + 80;
        const clickRate = (Math.random() * 5 + 3).toFixed(1);
        const roi = (Math.random() * 200 + 150).toFixed(0);

        document.getElementById('engagementPrediction').textContent = `${engagement}%`;
        document.getElementById('clickRatePrediction').textContent = `${clickRate}%`;
        document.getElementById('roiPrediction').textContent = `${roi}%`;
    }

    applyAIContent() {
        const title = document.getElementById('aiGeneratedTitle').value;
        const description = document.getElementById('aiGeneratedDescription').value;
        const cta = document.getElementById('aiGeneratedCTA').value;
        const icon = document.getElementById('aiGeneratedIcon').value;
        const type = document.getElementById('aiGeneratedType').value;

        if (!title || !description || !cta) {
            this.showNotification('Por favor completa todos los campos requeridos', 'warning');
            return;
        }

        // Create new billboard slide with AI content
        const slide = {
            id: 'ai-slide-' + Date.now(),
            type: type,
            title: title,
            description: description,
            icon: icon,
            cta: cta,
            active: true,
            createdAt: new Date().toISOString(),
            aiGenerated: true
        };

        // Add to billboard slides
        if (window.heroManager) {
            window.heroManager.billboardSlides.push(slide);
            window.heroManager.saveBillboardSlides();
            window.heroManager.renderBillboardSlides();
        }

        this.showNotification('Contenido de IA aplicado exitosamente', 'success');
        this.hideContentEditor();
    }

    discardAIContent() {
        this.hideContentEditor();
        this.showNotification('Cambios descartados', 'info');
    }

    hideContentEditor() {
        document.getElementById('aiContentEditor').style.display = 'none';
    }

    optimizeExistingContent() {
        // Get current billboard slides
        if (window.heroManager && window.heroManager.billboardSlides.length > 0) {
            const currentSlides = window.heroManager.billboardSlides;
            this.optimizeSlides(currentSlides);
        } else {
            this.showNotification('No hay contenido existente para optimizar', 'warning');
        }
    }

    optimizeSlides(slides) {
        this.showLoadingState();
        
        setTimeout(() => {
            slides.forEach((slide, index) => {
                const optimizedTitle = this.optimizeTitle(slide.title);
                const optimizedDescription = this.optimizeDescription(slide.description);
                const optimizedCTA = this.optimizeCTA(slide.cta);

                slides[index] = {
                    ...slide,
                    title: optimizedTitle,
                    description: optimizedDescription,
                    cta: optimizedCTA,
                    optimized: true
                };
            });

            if (window.heroManager) {
                window.heroManager.saveBillboardSlides();
                window.heroManager.renderBillboardSlides();
            }

            this.hideLoadingState();
            this.showNotification('Contenido optimizado exitosamente', 'success');
        }, 1500);
    }

    optimizeTitle(title) {
        if (title.includes('OFERTA') || title.includes('DESCUENTO')) return title;
        if (title.includes('LIMITADO') || title.includes('EXCLUSIVO')) return title;
        return `¡${title} - OFERTA ESPECIAL!`;
    }

    optimizeDescription(description) {
        if (description.includes('calidad') || description.includes('premium')) return description;
        return `${description} Calidad premium garantizada.`;
    }

    optimizeCTA(cta) {
        const actionWords = ['COMPRAR', 'VER', 'EXPLORAR', 'CONTACTAR'];
        const hasAction = actionWords.some(word => cta.toUpperCase().includes(word));
        
        if (hasAction) return cta;
        return `COMPRAR ${cta}`;
    }

    refreshSuggestions() {
        this.showLoadingState();
        setTimeout(() => {
            this.generateAISuggestions(
                document.getElementById('aiProductType').value,
                document.getElementById('aiTargetAudience').value,
                document.getElementById('aiCampaignGoal').value,
                document.getElementById('aiTone').value,
                document.getElementById('aiKeywords').value
            );
            this.hideLoadingState();
            this.showNotification('Sugerencias actualizadas', 'success');
        }, 1000);
    }

    showLoadingState() {
        const generateBtn = document.getElementById('generateAIContent');
        if (generateBtn) {
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
            generateBtn.disabled = true;
        }
    }

    hideLoadingState() {
        const generateBtn = document.getElementById('generateAIContent');
        if (generateBtn) {
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Contenido IA';
            generateBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        if (window.heroManager) {
            window.heroManager.showNotification(message, type);
        }
    }
}

// Initialize AI Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar servicio de IA con seguridad
    if (window.AIService && window.SecurityMiddleware) {
        // Crear middleware de seguridad
        window.secureAIService = new SecurityMiddleware(window.AIService);
        
        // Reemplazar el servicio original con el seguro
        window.AIService = window.secureAIService;
        
        console.log('Servicio de IA inicializado con medidas de seguridad');
    }

    // Inicializar asistente de IA
    if (document.getElementById('ai-assistant-tab')) {
        window.aiAssistant = new AIAssistant();
    }

    // Verificar estado de la API
    if (window.AIConfig) {
        const configStatus = window.AIConfig.validateConfig();
        console.log('Estado de configuración de IA:', configStatus ? 'Válida' : 'Inválida');
    }
});

// Export for global access
window.AIAssistant = AIAssistant; 