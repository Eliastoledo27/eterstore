// Funcionalidades principales de la tienda
// Lazy loading para imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                img.addEventListener('error', () => {
                    // Fallback para imágenes que no cargan
                    img.style.display = 'none';
                });
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Optimización de imágenes
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Agregar atributos de optimización
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Agregar atributos de accesibilidad
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', 'Imagen de producto');
        }
        
        // Prevenir layout shift
        img.style.aspectRatio = 'auto';
    });
}

// Función para precargar imágenes críticas
function preloadCriticalImages() {
    const criticalImages = [
        'images/hero/hero-shoes.svg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Funciones principales de Éter Store

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para formatear precios
function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(price);
}

// Variables globales para el sistema de alternancia hero
let heroSlides = [];
let heroConfig = {};
let currentSlideIndex = 0;
let heroAutoPlayInterval;

// Función para cargar contenido hero desde localStorage
function loadHeroContent() {
    const savedHero = localStorage.getItem('eterStore_hero');
    const savedHeroConfig = localStorage.getItem('eterStore_hero_config');
    const savedHeroSlides = localStorage.getItem('eterStore_hero_slides');
    
    // Cargar configuración
    if (savedHeroConfig) {
        heroConfig = JSON.parse(savedHeroConfig);
    }
    
    // Cargar slides
    if (savedHeroSlides) {
        heroSlides = JSON.parse(savedHeroSlides);
    }
    
    // Si hay configuración de alternancia, usar el sistema de slides
    if (heroConfig && heroConfig.mode && heroSlides.length > 0) {
        initHeroSlides();
    } else if (savedHero) {
        // Usar contenido hero tradicional
        const heroContent = JSON.parse(savedHero);
        
        // Actualizar título hero
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && heroContent.title) {
            heroTitle.textContent = heroContent.title;
        }
        
        // Actualizar subtítulo hero
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && heroContent.subtitle) {
            heroSubtitle.textContent = heroContent.subtitle;
        }
        
        // Actualizar botón principal
        const primaryButton = document.querySelector('.hero-cta');
        if (primaryButton && heroContent.primaryButtonText) {
            primaryButton.textContent = heroContent.primaryButtonText;
            if (heroContent.primaryButtonLink) {
                primaryButton.href = heroContent.primaryButtonLink;
            }
        }
        
        // Actualizar imagen hero
        const heroImage = document.querySelector('.hero-image img');
        if (heroImage && heroContent.image) {
            heroImage.src = heroContent.image;
            heroImage.alt = heroContent.title || 'Éter Store';
        }
    }
}

// Función para cargar contenido de la tienda desde localStorage
function loadStoreContent() {
    const savedContent = localStorage.getItem('eterStore_content');
    if (savedContent) {
        const storeContent = JSON.parse(savedContent);
        
        // Actualizar información de contacto
        const phoneElement = document.querySelector('.contact-info .contact-item:nth-child(2) p');
        if (phoneElement && storeContent.phone) {
            phoneElement.textContent = storeContent.phone;
        }
        
        const emailElement = document.querySelector('.contact-info .contact-item:nth-child(3) p');
        if (emailElement && storeContent.email) {
            emailElement.textContent = storeContent.email;
        }
        
        const addressElement = document.querySelector('.contact-info .contact-item:nth-child(1) p');
        if (addressElement && storeContent.address) {
            addressElement.textContent = storeContent.address;
        }
        
        // Actualizar sección "Nosotros"
        const aboutTitle = document.querySelector('.about-text h2');
        if (aboutTitle && storeContent.aboutTitle) {
            aboutTitle.textContent = storeContent.aboutTitle;
        }
        
        const aboutDescription = document.querySelector('.about-text p:first-of-type');
        if (aboutDescription && storeContent.aboutDescription) {
            aboutDescription.textContent = storeContent.aboutDescription;
        }
        
        // Actualizar enlaces de redes sociales
        const facebookLink = document.querySelector('.social-links a:first-child');
        if (facebookLink && storeContent.facebookUrl) {
            facebookLink.href = storeContent.facebookUrl;
        }
        
        const instagramLink = document.querySelector('.social-links a:nth-child(2)');
        if (instagramLink && storeContent.instagramUrl) {
            instagramLink.href = storeContent.instagramUrl;
        }
        
        const whatsappLink = document.querySelector('.social-links a:last-child');
        if (whatsappLink && storeContent.whatsappNumber) {
            whatsappLink.href = `https://wa.me/${storeContent.whatsappNumber.replace(/\D/g, '')}`;
        }
    }
}

// Función para sincronizar contenido
function syncContent() {
    loadHeroContent();
    loadStoreContent();
    loadStats();
}

// Función para cargar estadísticas
function loadStats() {
    // Cargar productos
    const savedProducts = localStorage.getItem('eterStore_products');
    if (savedProducts) {
        const products = JSON.parse(savedProducts);
        const totalProducts = products.length;
        const lowStockProducts = products.filter(p => p.stock <= 5).length;
        
        const totalProductsElement = document.getElementById('totalProducts');
        if (totalProductsElement) {
            totalProductsElement.textContent = totalProducts;
        }
        
        const lowStockElement = document.getElementById('lowStockProducts');
        if (lowStockElement) {
            lowStockElement.textContent = lowStockProducts;
        }
    }
    
    // Cargar pedidos
    const savedOrders = localStorage.getItem('eterStore_orders');
    if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const totalOrders = orders.length;
        const uniqueCustomers = new Set(orders.map(order => order.customer.customerPhone)).size;
        
        const totalOrdersElement = document.getElementById('totalOrders');
        if (totalOrdersElement) {
            totalOrdersElement.textContent = totalOrders;
        }
        
        const totalCustomersElement = document.getElementById('totalCustomers');
        if (totalCustomersElement) {
            totalCustomersElement.textContent = uniqueCustomers;
        }
    }
}

// Función para escuchar cambios en localStorage
function setupStorageListener() {
    window.addEventListener('storage', function(e) {
        if (e.key === 'eterStore_hero' || e.key === 'eterStore_content') {
            syncContent();
        }
    });
    
    // Escuchar eventos personalizados para sincronización inmediata
    window.addEventListener('heroContentUpdated', function(e) {
        loadHeroContent();
    });
    
    window.addEventListener('storeContentUpdated', function(e) {
        loadStoreContent();
    });
    
    window.addEventListener('productsUpdated', function(e) {
        if (window.ProductManager && window.ProductManager.syncProducts) {
            window.ProductManager.syncProducts();
        }
        loadStats();
    });
    
    // Escuchar nuevos pedidos
    window.addEventListener('newOrderCreated', function(e) {
        loadStats();
    });
}

// Función para inicializar la página
function initializePage() {
    // Cargar contenido inicial
    syncContent();
    
    // Configurar listener para cambios
    setupStorageListener();
    
    // Configurar listener para cambios en la misma pestaña
    window.addEventListener('focus', function() {
        syncContent();
    });
    
    // Inicializar sistema de alternancia hero si está configurado
    const savedHeroConfig = localStorage.getItem('eterStore_hero_config');
    const savedHeroSlides = localStorage.getItem('eterStore_hero_slides');
    
    if (savedHeroConfig && savedHeroSlides) {
        const config = JSON.parse(savedHeroConfig);
        const slides = JSON.parse(savedHeroSlides);
        
        if (config.mode && slides.length > 0) {
            heroConfig = config;
            heroSlides = slides;
            initHeroSlides();
        }
    }
}

// ===== SISTEMA DE ALTERNANCIA HERO =====

// Inicializar sistema de slides hero
function initHeroSlides() {
    const activeSlides = heroSlides.filter(slide => slide.active);
    
    if (activeSlides.length === 0) {
        console.warn('No hay slides activos para mostrar');
        return;
    }
    
    // Crear estructura de slides si no existe
    createHeroSlidesStructure();
    
    // Mostrar primer slide
    showSlide(0);
    
    // Iniciar auto-play si está configurado
    if (heroConfig.mode === 'automatic' && activeSlides.length > 1) {
        startHeroAutoPlay();
    }
    
    // Agregar controles de navegación
    addHeroNavigationControls();
}

// Crear estructura HTML para slides
function createHeroSlidesStructure() {
    const heroContainer = document.querySelector('.hero-container');
    if (!heroContainer) return;
    
    // Crear contenedor de slides
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'hero-slides-container';
    slidesContainer.id = 'heroSlidesContainer';
    
    // Crear slides
    const activeSlides = heroSlides.filter(slide => slide.active);
    activeSlides.forEach((slide, index) => {
        const slideElement = createSlideElement(slide, index);
        slidesContainer.appendChild(slideElement);
    });
    
    // Reemplazar contenido actual del hero
    const heroContent = heroContainer.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.display = 'none';
    }
    
    heroContainer.appendChild(slidesContainer);
    
    // Agregar indicadores
    addSlideIndicators(activeSlides.length);
}

// Crear elemento de slide individual
function createSlideElement(slide, index) {
    const slideElement = document.createElement('div');
    slideElement.className = `hero-slide ${index === 0 ? 'active' : ''}`;
    slideElement.dataset.slideIndex = index;
    
    slideElement.innerHTML = `
        <div class="hero-slide-content">
            <h1 class="hero-slide-title">${slide.title}</h1>
            <h2 class="hero-slide-subtitle">${slide.subtitle}</h2>
            <p class="hero-slide-description">${slide.description}</p>
            ${slide.price ? `<div class="hero-slide-price">${slide.price}</div>` : ''}
            ${slide.buttonText ? `<button class="btn btn-primary hero-slide-cta">${slide.buttonText}</button>` : ''}
        </div>
        <div class="hero-slide-image">
            <img src="${slide.image}" alt="${slide.title}" loading="eager">
        </div>
    `;
    
    return slideElement;
}

// Mostrar slide específico
function showSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.slide-indicator');
    
    if (slides.length === 0) return;
    
    // Ocultar todos los slides
    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.classList.add(heroConfig.transitionEffect || 'fade');
    });
    
    // Desactivar todos los indicadores
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Mostrar slide actual
    if (slides[index]) {
        slides[index].classList.add('active');
        slides[index].classList.remove(heroConfig.transitionEffect || 'fade');
    }
    
    // Activar indicador actual
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentSlideIndex = index;
}

// Siguiente slide
function nextSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(nextIndex);
}

// Slide anterior
function previousSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
}

// Iniciar auto-play
function startHeroAutoPlay() {
    if (heroAutoPlayInterval) {
        clearInterval(heroAutoPlayInterval);
    }
    
    const interval = (heroConfig.slideInterval || 5) * 1000;
    heroAutoPlayInterval = setInterval(() => {
        nextSlide();
    }, interval);
}

// Detener auto-play
function stopHeroAutoPlay() {
    if (heroAutoPlayInterval) {
        clearInterval(heroAutoPlayInterval);
        heroAutoPlayInterval = null;
    }
}

// Agregar controles de navegación
function addHeroNavigationControls() {
    const slidesContainer = document.getElementById('heroSlidesContainer');
    if (!slidesContainer) return;
    
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'hero-slide-controls';
    
    controlsContainer.innerHTML = `
        <button class="slide-control prev" onclick="previousSlide()">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button class="slide-control next" onclick="nextSlide()">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    slidesContainer.appendChild(controlsContainer);
}

// Agregar indicadores de slides
function addSlideIndicators(slideCount) {
    const slidesContainer = document.getElementById('heroSlidesContainer');
    if (!slidesContainer) return;
    
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'slide-indicators';
    
    for (let i = 0; i < slideCount; i++) {
        const indicator = document.createElement('button');
        indicator.className = `slide-indicator ${i === 0 ? 'active' : ''}`;
        indicator.onclick = () => showSlide(i);
        indicatorsContainer.appendChild(indicator);
    }
    
    slidesContainer.appendChild(indicatorsContainer);
}

// Manejar eventos de actualización desde el admin
function handleHeroUpdate(event) {
    const { slides, config } = event.detail;
    
    if (slides && config) {
        heroSlides = slides;
        heroConfig = config;
        
        // Reinicializar sistema de slides
        const slidesContainer = document.getElementById('heroSlidesContainer');
        if (slidesContainer) {
            slidesContainer.remove();
        }
        
        // Mostrar contenido hero tradicional si no hay slides activos
        const activeSlides = heroSlides.filter(slide => slide.active);
        if (activeSlides.length === 0) {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.display = 'block';
            }
            return;
        }
        
        initHeroSlides();
    }
}

// Algoritmo automático para contenido destacado
function generateAutomaticSlides() {
    // Obtener productos destacados (mejor rating, stock disponible)
    const featuredProducts = window.ProductManager?.products
        ?.filter(p => p.stock > 0 && p.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3) || [];
    
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

// Event listeners para el sistema de alternancia
document.addEventListener('DOMContentLoaded', function() {
    // Escuchar actualizaciones desde el admin
    window.addEventListener('heroSlidesUpdated', handleHeroUpdate);
    window.addEventListener('heroConfigUpdated', handleHeroUpdate);
    
    // Pausar auto-play al hacer hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopHeroAutoPlay);
        heroSection.addEventListener('mouseleave', () => {
            if (heroConfig.mode === 'automatic') {
                startHeroAutoPlay();
            }
        });
    }
    
    // Configurar filtros de productos
    setupProductFilters();
});

// Exportar funciones para uso global
window.HeroSlider = {
    initHeroSlides,
    showSlide,
    nextSlide,
    previousSlide,
    startHeroAutoPlay,
    stopHeroAutoPlay,
    generateAutomaticSlides
};

window.MainUtils = {
    showNotification,
    formatPrice,
    loadHeroContent,
    loadStoreContent,
    syncContent,
    initializePage,
    setupProductFilters,
    applyProductFilters
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    
    // Configurar botón del hero
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', function() {
            // Agregar el producto destacado (Nike Air Max 90) al carrito
            const featuredProduct = {
                id: 999,
                name: "Nike Air Max 90",
                price: 98000,
                image: "images/hero/hero-shoes.svg",
                stock: 10
            };
            
            if (window.cart) {
                window.cart.addItem(featuredProduct, 1, '42', 20);
                if (window.ProductManager && window.ProductManager.showNotification) {
                    window.ProductManager.showNotification('Nike Air Max 90 agregado al carrito', 'success');
                }
            }
        });
    }
});

// Inicializar navegación móvil
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Inicializar scroll suave
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Inicializar formulario de contacto
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Validar formulario
            if (!name || !email || !message) {
                showNotification('Por favor, completa todos los campos', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Simular envío
            showNotification('Enviando mensaje...', 'info');
            
            setTimeout(() => {
                showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                this.reset();
            }, 2000);
        });
    }
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Inicializar animaciones
function initAnimations() {
    // Animación de aparición al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animar
    const animateElements = document.querySelectorAll('.product-card, .feature, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Animación de contador del carrito
    animateCartCount();
}

// Animar contador del carrito
function animateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.addEventListener('DOMSubtreeModified', function() {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

// Inicializar sistema de rating de productos
function initProductRating() {
    // Agregar estilos CSS para las estrellas
    const style = document.createElement('style');
    style.textContent = `
        .product-rating {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }
        
        .stars {
            color: #ffc107;
        }
        
        .rating-text {
            color: #666;
            font-size: 0.9rem;
        }
        
        .stock-status {
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 1rem;
        }
        
        .in-stock {
            color: #28a745;
        }
        
        .out-of-stock {
            color: #dc3545;
        }
        
        .empty-cart {
            text-align: center;
            padding: 2rem;
            color: #666;
        }
        
        .empty-cart i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #17a2b8;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        }
        
        .notification-success {
            background: #28a745;
        }
        
        .notification-error {
            background: #dc3545;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    `;
    document.head.appendChild(style);
}

// Función para actualizar productos en tiempo real
function updateProductsDisplay() {
    if (window.ProductManager) {
        window.ProductManager.renderProducts();
    }
}

// Función para buscar productos
function searchProducts(query) {
    if (window.ProductManager) {
        const results = window.ProductManager.searchProducts(query);
        window.ProductManager.renderProducts(results);
    }
}

// Función para filtrar productos
function filterProducts(category) {
    if (window.ProductManager) {
        const results = window.ProductManager.filterProductsByCategory(category);
        window.ProductManager.renderProducts(results);
    }
}

// Función para ordenar productos
function sortProducts(sortBy, order) {
    if (window.ProductManager) {
        const results = window.ProductManager.sortProducts(window.ProductManager.products, sortBy, order);
        window.ProductManager.renderProducts(results);
    }
}

// Función para obtener productos destacados
function getFeaturedProducts() {
    if (window.ProductManager) {
        return window.ProductManager.getFeaturedProducts();
    }
    return [];
}

// Función para actualizar stock
function updateStock(productId, quantity) {
    if (window.ProductManager) {
        return window.ProductManager.updateProductStock(productId, quantity);
    }
    return 0;
}

// Función para verificar disponibilidad
function checkAvailability(productId, quantity) {
    if (window.ProductManager) {
        return window.ProductManager.checkProductAvailability(productId, quantity);
    }
    return false;
}

// Función para manejar errores
function handleError(error, context = '') {
    console.error(`Error en ${context}:`, error);
    showNotification(`Error: ${error.message || 'Algo salió mal'}`, 'error');
}

// Función para validar formularios
function validateForm(formData) {
    const errors = [];
    
    for (let [key, value] of formData.entries()) {
        if (!value || value.trim() === '') {
            errors.push(`El campo ${key} es requerido`);
        }
    }
    
    return errors;
}

// Función para limpiar formularios
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

// Función para mostrar/ocultar elementos
function toggleElement(elementId, show = true) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

// Función para agregar clases CSS
function addClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add(className);
    }
}

// Función para remover clases CSS
function removeClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove(className);
    }
}

// Función para obtener parámetros de URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Función para actualizar URL sin recargar
function updateUrl(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
        url.searchParams.set(key, params[key]);
    });
    window.history.pushState({}, '', url);
}

// Función para debounce
function debounce(func, wait) {
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

// Función para throttle
function throttle(func, limit) {
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
}

// Función para generar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para copiar al portapapeles
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copiado al portapapeles', 'success');
        }).catch(() => {
            showNotification('Error al copiar', 'error');
        });
    } else {
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copiado al portapapeles', 'success');
    }
}

// Función para descargar archivo
function downloadFile(content, filename, contentType = 'text/plain') {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Función para exportar datos
function exportData(data, filename = 'data.json') {
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, filename, 'application/json');
}

// Función para importar datos
function importData(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            callback(data);
        } catch (error) {
            handleError(error, 'importData');
        }
    };
    reader.readAsText(file);
}

// Función para guardar en localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        handleError(error, 'saveToStorage');
        return false;
    }
}

// Función para cargar desde localStorage
function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        handleError(error, 'loadFromStorage');
        return null;
    }
}

// Función para limpiar localStorage
function clearStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        handleError(error, 'clearStorage');
        return false;
    }
}

// ===== SISTEMA DE FILTRADO DE PRODUCTOS =====

// Configurar filtros de productos
function setupProductFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyProductFilters);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', applyProductFilters);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', applyProductFilters);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

// Aplicar filtros de productos
function applyProductFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (!window.ProductManager || !window.ProductManager.products) {
        return;
    }
    
    let filteredProducts = [...window.ProductManager.products];
    
    // Filtro por categoría
    if (categoryFilter && categoryFilter.value) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === categoryFilter.value
        );
    }
    
    // Filtro por precio
    if (priceFilter && priceFilter.value) {
        if (priceFilter.value === 'premium') {
            filteredProducts = filteredProducts.filter(product => 
                window.ProductManager.isPremiumProduct(product)
            );
        } else if (priceFilter.value === 'standard') {
            filteredProducts = filteredProducts.filter(product => 
                !window.ProductManager.isPremiumProduct(product)
            );
        }
    }
    
    // Ordenamiento
    if (sortFilter && sortFilter.value) {
        switch (sortFilter.value) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }
    
    // Renderizar productos filtrados
    if (window.ProductManager.renderProducts) {
        window.ProductManager.renderProducts(filteredProducts);
    }
    
    // Mostrar contador de resultados
    showFilterResults(filteredProducts.length);
}

// Limpiar todos los filtros
function clearAllFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) categoryFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (sortFilter) sortFilter.value = '';
    
    // Renderizar todos los productos
    if (window.ProductManager && window.ProductManager.renderProducts) {
        window.ProductManager.renderProducts(window.ProductManager.products);
    }
    
    // Ocultar contador de resultados
    hideFilterResults();
    
    showNotification('Filtros limpiados', 'info');
}

// Mostrar contador de resultados
function showFilterResults(count) {
    let resultsCounter = document.getElementById('filterResultsCounter');
    
    if (!resultsCounter) {
        resultsCounter = document.createElement('div');
        resultsCounter.id = 'filterResultsCounter';
        resultsCounter.className = 'filter-results-counter';
        
        const productsSection = document.querySelector('.products');
        if (productsSection) {
            const filtersContainer = productsSection.querySelector('.products-filters');
            if (filtersContainer) {
                filtersContainer.appendChild(resultsCounter);
            }
        }
    }
    
    resultsCounter.innerHTML = `
        <div class="results-info">
            <i class="fas fa-filter"></i>
            <span>Mostrando ${count} producto${count !== 1 ? 's' : ''}</span>
        </div>
    `;
    
    resultsCounter.style.display = 'block';
}

// Ocultar contador de resultados
function hideFilterResults() {
    const resultsCounter = document.getElementById('filterResultsCounter');
    if (resultsCounter) {
        resultsCounter.style.display = 'none';
    }
}

// Exportar funciones para uso global
window.AppUtils = {
    showNotification,
    updateProductsDisplay,
    searchProducts,
    filterProducts,
    sortProducts,
    getFeaturedProducts,
    updateStock,
    checkAvailability,
    formatPrice,
    handleError,
    validateForm,
    clearForm,
    toggleElement,
    addClass,
    removeClass,
    getUrlParameter,
    updateUrl,
    debounce,
    throttle,
    generateId,
    copyToClipboard,
    downloadFile,
    exportData,
    importData,
    saveToStorage,
    loadFromStorage,
    clearStorage
}; 

// ===== HERO SECTION FUNCTIONALITY =====

// Billboard Slider Functionality
class BillboardSlider {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 3;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoPlay();
        this.updateCountdown();
    }

    setupEventListeners() {
        // Previous button
        const prevBtn = document.getElementById('billboardPrev');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }

        // Next button
        const nextBtn = document.getElementById('billboardNext');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Dot navigation
        const dots = document.querySelectorAll('.control-dots .dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideNumber = parseInt(dot.dataset.slide);
                this.goToSlide(slideNumber);
            });
        });

        // Pause auto-play on hover
        const slider = document.getElementById('billboardSlider');
        if (slider) {
            slider.addEventListener('mouseenter', () => this.pauseAutoPlay());
            slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    goToSlide(slideNumber) {
        // Remove active class from current slide and dot
        const currentSlide = document.querySelector(`.billboard-slide[data-slide="${this.currentSlide}"]`);
        const currentDot = document.querySelector(`.dot[data-slide="${this.currentSlide}"]`);
        
        if (currentSlide) currentSlide.classList.remove('active');
        if (currentDot) currentDot.classList.remove('active');

        // Add active class to new slide and dot
        const newSlide = document.querySelector(`.billboard-slide[data-slide="${slideNumber}"]`);
        const newDot = document.querySelector(`.dot[data-slide="${slideNumber}"]`);
        
        if (newSlide) newSlide.classList.add('active');
        if (newDot) newDot.classList.add('active');

        this.currentSlide = slideNumber;
    }

    nextSlide() {
        const nextSlide = this.currentSlide === this.totalSlides ? 1 : this.currentSlide + 1;
        this.goToSlide(nextSlide);
    }

    prevSlide() {
        const prevSlide = this.currentSlide === 1 ? this.totalSlides : this.currentSlide - 1;
        this.goToSlide(prevSlide);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    updateCountdown() {
        // Set target date (24 hours from now)
        const targetDate = new Date();
        targetDate.setHours(targetDate.getHours() + 24);

        const countdownElement = document.getElementById('countdown1');
        if (!countdownElement) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                // Reset countdown
                targetDate.setHours(targetDate.getHours() + 24);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            const timeUnits = countdownElement.querySelectorAll('.time-unit');
            if (timeUnits.length >= 3) {
                timeUnits[0].textContent = days.toString().padStart(2, '0');
                timeUnits[1].textContent = hours.toString().padStart(2, '0');
                timeUnits[2].textContent = minutes.toString().padStart(2, '0');
            }
        };

        updateTimer();
        setInterval(updateTimer, 60000); // Update every minute
    }
}

// Featured Product Functionality
class FeaturedProduct {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFeaturedProduct();
    }

    setupEventListeners() {
        // Add to cart button
        const addToCartBtn = document.getElementById('featuredProductCTA');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.addToCart());
        }

        // View details button
        const viewDetailsBtn = document.getElementById('featuredProductDetails');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => this.viewDetails());
        }
    }

    loadFeaturedProduct() {
        // Get featured product from localStorage or use default
        const featuredProduct = this.getFeaturedProduct();
        
        // Update DOM elements
        this.updateProductDisplay(featuredProduct);
    }

    getFeaturedProduct() {
        const savedProduct = localStorage.getItem('eterStore_featured_product');
        if (savedProduct) {
            return JSON.parse(savedProduct);
        }

        // Default featured product
        return {
            id: 'featured-1',
            title: 'Zapatillas Running Pro',
            description: 'El calzado más vendido de la temporada. Tecnología de amortiguación avanzada para máximo rendimiento y comodidad.',
            price: 125000,
            image: 'images/products/running-shoes.svg',
            sales: 1247,
            rating: 4.9,
            reviews: 156,
            category: 'deportivo'
        };
    }

    updateProductDisplay(product) {
        // Update title
        const titleElement = document.getElementById('featuredProductTitle');
        if (titleElement) titleElement.textContent = product.title;

        // Update description
        const descElement = document.getElementById('featuredProductDescription');
        if (descElement) descElement.textContent = product.description;

        // Update price
        const priceElement = document.getElementById('featuredProductPrice');
        if (priceElement) priceElement.textContent = formatPrice(product.price);

        // Update image
        const imageElement = document.getElementById('featuredProductImage');
        if (imageElement) {
            imageElement.src = product.image;
            imageElement.alt = product.title;
        }

        // Update stats
        const salesElement = document.getElementById('featuredProductSales');
        if (salesElement) salesElement.textContent = product.sales.toLocaleString();

        const ratingElement = document.getElementById('featuredProductRating');
        if (ratingElement) ratingElement.textContent = product.rating;

        const reviewsElement = document.getElementById('featuredProductReviews');
        if (reviewsElement) reviewsElement.textContent = product.reviews;
    }

    addToCart() {
        const product = this.getFeaturedProduct();
        
        // Add to cart using existing cart functionality
        if (window.cart) {
            const success = window.cart.addItem(product, 1, '', 20);
            if (success) {
                this.showNotification('Producto agregado al carrito', 'success');
            }
        } else {
            this.showNotification('Error: Carrito no disponible', 'error');
        }
    }

    viewDetails() {
        const product = this.getFeaturedProduct();
        
        // Scroll to products section
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
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

// Hero Animation Controller
class HeroAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParallaxEffects();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe hero elements
        const heroElements = document.querySelectorAll('.hero-featured-product, .hero-premium-billboard, .hero-sidebar');
        heroElements.forEach(el => observer.observe(el));
    }

    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-element');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Initialize Hero functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Billboard Slider
    if (document.getElementById('billboardSlider')) {
        window.billboardSlider = new BillboardSlider();
    }

    // Initialize Featured Product
    if (document.getElementById('heroFeaturedProduct')) {
        window.featuredProduct = new FeaturedProduct();
    }

    // Initialize Hero Animations
    if (document.querySelector('.hero')) {
        window.heroAnimations = new HeroAnimations();
    }
});

// Export functions for global access
window.HeroManager = {
    BillboardSlider,
    FeaturedProduct,
    HeroAnimations
}; 

// ===== ABANDONED CART RECOVERY SYSTEM =====

// Sistema de recuperación de carritos abandonados simplificado
class AbandonedCartRecovery {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupRecoveryNotifications();
        this.checkForAbandonedCarts();
        this.isInitialized = true;
        
        console.log('Sistema de recuperación de carritos abandonados inicializado');
    }

    // Verificar carritos abandonados
    checkForAbandonedCarts() {
        try {
            const abandonedCarts = JSON.parse(localStorage.getItem('eterStore_abandoned_carts')) || [];
            const latestCart = abandonedCarts[abandonedCarts.length - 1];

            if (latestCart && latestCart.items && latestCart.items.length > 0 && !latestCart.recovered) {
                // Esperar 5 segundos antes de mostrar la notificación
                setTimeout(() => {
                    this.showRecoveryNotification(latestCart);
                }, 5000);
            }
        } catch (error) {
            console.error('Error verificando carritos abandonados:', error);
        }
    }

    // Mostrar notificación de recuperación
    showRecoveryNotification(abandonedCart) {
        try {
            if (!abandonedCart || !abandonedCart.items || abandonedCart.items.length === 0) {
                return;
            }

            const totalItems = abandonedCart.items.reduce((total, item) => total + (item.quantity || 1), 0);
            
            // Remover notificación existente si hay una
            const existingNotification = document.querySelector('.abandoned-cart-notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.className = 'abandoned-cart-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <div class="notification-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="notification-text">
                        <h4>¡No te vayas sin tus productos!</h4>
                        <p>Tienes ${totalItems} artículo(s) en tu carrito esperando por ti.</p>
                    </div>
                    <div class="notification-actions">
                        <button class="btn btn-primary btn-sm" onclick="window.abandonedCartRecovery.recoverCart()">
                            <i class="fas fa-undo"></i>
                            Recuperar Carrito
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="window.abandonedCartRecovery.dismissNotification()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(notification);

            // Mostrar con animación
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);

            // Auto-ocultar después de 15 segundos
            setTimeout(() => {
                this.dismissNotification();
            }, 15000);

        } catch (error) {
            console.error('Error mostrando notificación de recuperación:', error);
        }
    }

    // Recuperar carrito abandonado
    recoverCart() {
        try {
            const abandonedCarts = JSON.parse(localStorage.getItem('eterStore_abandoned_carts')) || [];
            const latestCart = abandonedCarts[abandonedCarts.length - 1];

            if (latestCart && latestCart.items && latestCart.items.length > 0) {
                // Restaurar items al carrito actual
                latestCart.items.forEach(item => {
                    if (window.cart) {
                        window.cart.addItem(item, item.quantity, item.size, item.profitMargin);
                    }
                });

                // Marcar como recuperado
                latestCart.recovered = true;
                this.updateAbandonedCart(abandonedCarts.length - 1, latestCart);

                // Mostrar carrito
                if (window.cart) {
                    window.cart.showCart();
                }

                // Mostrar notificación de éxito
                if (window.ProductManager && window.ProductManager.showNotification) {
                    window.ProductManager.showNotification('¡Carrito recuperado exitosamente!', 'success');
                }

                // Ocultar notificación
                this.dismissNotification();
                
                return true;
            } else {
                console.log('No hay carritos abandonados para recuperar');
                return false;
            }
        } catch (error) {
            console.error('Error recuperando carrito abandonado:', error);
            return false;
        }
    }

    // Ocultar notificación
    dismissNotification() {
        try {
            const notification = document.querySelector('.abandoned-cart-notification');
            if (notification) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        } catch (error) {
            console.error('Error ocultando notificación:', error);
        }
    }

    // Actualizar carrito abandonado
    updateAbandonedCart(index, updatedCart) {
        try {
            const abandonedCarts = JSON.parse(localStorage.getItem('eterStore_abandoned_carts')) || [];
            if (abandonedCarts[index]) {
                abandonedCarts[index] = updatedCart;
                localStorage.setItem('eterStore_abandoned_carts', JSON.stringify(abandonedCarts));
            }
        } catch (error) {
            console.error('Error actualizando carrito abandonado:', error);
        }
    }

    // Configurar notificaciones de recuperación
    setupRecoveryNotifications() {
        try {
            // Agregar estilos CSS para las notificaciones
            const style = document.createElement('style');
            style.textContent = `
                .abandoned-cart-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                }

                .abandoned-cart-notification.show {
                    transform: translateX(0);
                }

                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .notification-icon {
                    font-size: 24px;
                    color: #4ade80;
                }

                .notification-text h4 {
                    margin: 0 0 8px 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .notification-text p {
                    margin: 0;
                    font-size: 14px;
                    opacity: 0.9;
                }

                .notification-actions {
                    display: flex;
                    gap: 8px;
                }

                .btn-sm {
                    padding: 6px 12px;
                    font-size: 12px;
                    border-radius: 6px;
                }

                @media (max-width: 768px) {
                    .abandoned-cart-notification {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        } catch (error) {
            console.error('Error configurando notificaciones:', error);
        }
    }
}

// Inicializar sistema de recuperación de carritos abandonados
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que el carrito principal esté inicializado
    setTimeout(() => {
        window.abandonedCartRecovery = new AbandonedCartRecovery();
    }, 1000);
}); 