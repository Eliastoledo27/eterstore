/**
 * Premium Catalog JavaScript
 * Funcionalidad avanzada y optimizada para productos.html
 */

class PremiumCatalog {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeAnimations();
        this.setupIntersectionObserver();
    }

    initializeElements() {
        // Core elements
        this.filtersToggle = document.getElementById('filtersToggle');
        this.filtersContent = document.getElementById('filtersContent');
        this.searchInput = document.getElementById('searchFilter');
        this.searchClear = document.getElementById('searchClear');
        this.viewGrid = document.getElementById('viewGrid');
        this.viewList = document.getElementById('viewList');
        this.productsGrid = document.getElementById('productsGrid');
        this.backToTop = document.getElementById('backToTop');
        this.cartToggle = document.getElementById('cartToggle');
        this.cartSidebar = document.getElementById('cartSidebar');
        this.cartOverlay = document.getElementById('cartOverlay');
        this.cartClose = document.getElementById('cartClose');

        // Filter elements
        this.categoryFilter = document.getElementById('categoryFilter');
        this.priceFilter = document.getElementById('priceFilter');
        this.sortFilter = document.getElementById('sortFilter');
        this.clearFilters = document.getElementById('clearFilters');
        this.applyFilters = document.getElementById('applyFilters');

        // Results elements
        this.resultsCount = document.getElementById('resultsCount');
        this.resultsLoading = document.getElementById('resultsLoading');
        this.noResults = document.getElementById('noResults');
        this.loadingContainer = document.getElementById('loadingContainer');
    }

    bindEvents() {
        // Filter toggle
        if (this.filtersToggle && this.filtersContent) {
            this.filtersToggle.addEventListener('click', () => this.toggleFilters());
        }

        // Search functionality
        if (this.searchInput && this.searchClear) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
            this.searchClear.addEventListener('click', () => this.clearSearch());
        }

        // View toggles
        if (this.viewGrid && this.viewList && this.productsGrid) {
            this.viewGrid.addEventListener('click', () => this.switchToGrid());
            this.viewList.addEventListener('click', () => this.switchToList());
        }

        // Back to top
        if (this.backToTop) {
            window.addEventListener('scroll', () => this.handleScroll());
            this.backToTop.addEventListener('click', () => this.scrollToTop());
        }

        // Cart functionality
        if (this.cartToggle && this.cartSidebar && this.cartOverlay) {
            this.cartToggle.addEventListener('click', () => this.openCart());
            this.cartOverlay.addEventListener('click', () => this.closeCart());
        }

        if (this.cartClose) {
            this.cartClose.addEventListener('click', () => this.closeCart());
        }

        // Filter functionality
        if (this.clearFilters) {
            this.clearFilters.addEventListener('click', () => this.clearAllFilters());
        }

        if (this.applyFilters) {
            this.applyFilters.addEventListener('click', () => this.applyAllFilters());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    toggleFilters() {
        const isExpanded = this.filtersToggle.getAttribute('aria-expanded') === 'true';
        this.filtersToggle.setAttribute('aria-expanded', !isExpanded);

        if (isExpanded) {
            this.filtersContent.style.maxHeight = '0';
            this.filtersContent.classList.add('collapsed');
        } else {
            this.filtersContent.style.maxHeight = this.filtersContent.scrollHeight + 'px';
            this.filtersContent.classList.remove('collapsed');
        }
    }

    handleSearch(event) {
        const query = event.target.value.trim();

        if (query.length > 0) {
            this.searchClear.style.opacity = '1';
            this.searchClear.style.pointerEvents = 'auto';
        } else {
            this.searchClear.style.opacity = '0';
            this.searchClear.style.pointerEvents = 'none';
        }

        // Debounce search
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    clearSearch() {
        this.searchInput.value = '';
        this.searchInput.focus();
        this.searchClear.style.opacity = '0';
        this.searchClear.style.pointerEvents = 'none';
        this.performSearch('');
    }

    performSearch(query) {
        // Show loading state
        this.showLoading();

        // Simulate search delay for better UX
        setTimeout(() => {
            // Here you would typically filter products based on query
            // For now, we'll just hide loading
            this.hideLoading();
        }, 500);
    }

    switchToGrid() {
        this.productsGrid.style.opacity = '0';
        setTimeout(() => {
            this.productsGrid.className = 'products-grid';
            this.productsGrid.style.opacity = '1';
        }, 150);

        this.viewGrid.setAttribute('aria-pressed', 'true');
        this.viewList.setAttribute('aria-pressed', 'false');
    }

    switchToList() {
        this.productsGrid.style.opacity = '0';
        setTimeout(() => {
            this.productsGrid.className = 'products-grid products-list';
            this.productsGrid.style.opacity = '1';
        }, 150);

        this.viewList.setAttribute('aria-pressed', 'true');
        this.viewGrid.setAttribute('aria-pressed', 'false');
    }

    handleScroll() {
        if (window.pageYOffset > 300) {
            this.backToTop.setAttribute('aria-hidden', 'false');
            this.backToTop.classList.add('visible');
        } else {
            this.backToTop.setAttribute('aria-hidden', 'true');
            this.backToTop.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    openCart() {
        this.cartSidebar.classList.add('active');
        this.cartOverlay.classList.add('active');
        this.cartToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        this.cartSidebar.classList.remove('active');
        this.cartOverlay.classList.remove('active');
        this.cartToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    clearAllFilters() {
        if (this.categoryFilter) this.categoryFilter.value = '';
        if (this.priceFilter) this.priceFilter.value = '';
        if (this.sortFilter) this.sortFilter.value = '';
        if (this.searchInput) this.searchInput.value = '';

        this.clearSearch();
        this.updateResultsCount('Mostrando todos los productos');
    }

    applyAllFilters() {
        // Show loading state
        this.showLoading();

        // Simulate filter application
        setTimeout(() => {
            this.hideLoading();
            this.updateResultsCount('Filtros aplicados');
        }, 800);
    }

    showLoading() {
        if (this.resultsLoading) {
            this.resultsLoading.setAttribute('aria-hidden', 'false');
        }
        if (this.loadingContainer) {
            this.loadingContainer.setAttribute('aria-hidden', 'false');
        }
    }

    hideLoading() {
        if (this.resultsLoading) {
            this.resultsLoading.setAttribute('aria-hidden', 'true');
        }
        if (this.loadingContainer) {
            this.loadingContainer.setAttribute('aria-hidden', 'true');
        }
    }

    updateResultsCount(text) {
        if (this.resultsCount) {
            this.resultsCount.textContent = text;
        }
    }

    handleKeyboard(event) {
        // ESC key closes cart
        if (event.key === 'Escape' && this.cartSidebar.classList.contains('active')) {
            this.closeCart();
        }

        // Enter key on search input
        if (event.key === 'Enter' && event.target === this.searchInput) {
            this.performSearch(this.searchInput.value.trim());
        }
    }

    initializeAnimations() {
        // Initialize particle effects
        this.initializeParticleEffects();

        // Initialize smooth scroll for anchor links
        this.initializeSmoothScroll();

        // Initialize lazy loading for images
        this.initializeLazyLoading();
    }

    initializeParticleEffects() {
        const particlesContainer = document.querySelector('.catalog-hero-particles');
        if (particlesContainer) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }
    }

    initializeSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements for animation
            const animatedElements = document.querySelectorAll('.filters-container, .products-grid, .cta-section');
            animatedElements.forEach(el => observer.observe(el));
        }
    }
}

// Performance optimization utilities
class PerformanceOptimizer {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
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
}

// Enhanced product rendering with animations
class ProductRenderer {
    static renderProducts(products, animate = false) {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        container.innerHTML = '';

        products.forEach((product, index) => {
            const productElement = this.createProductElement(product);

            if (animate) {
                productElement.style.opacity = '0';
                productElement.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    productElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    productElement.style.opacity = '1';
                    productElement.style.transform = 'translateY(0)';
                }, index * 100);
            }

            container.appendChild(productElement);
        });
    }

    static createProductElement(product) {
        const element = document.createElement('div');
        element.className = 'product-card';
        element.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-overlay">
                    <button class="btn btn-primary btn-sm" onclick="addToCart('${product.id}')">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al Carrito
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toLocaleString()}</div>
                <div class="product-rating">
                    ${this.generateStars(product.rating)}
                    <span class="rating-count">(${product.reviews} reseñas)</span>
                </div>
            </div>
        `;
        return element;
    }

    static generateStars(rating) {
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize premium catalog
    const catalog = new PremiumCatalog();

    // Initialize products with smooth loading
    if (window.ProductManager && window.ProductManager.renderProducts) {
        setTimeout(() => {
            window.ProductManager.renderProducts(window.ProductManager.products, true);
        }, 100);
    }

    // Add global functions for product interactions
    window.addToCart = function(productId) {
        // Add to cart functionality
        console.log('Adding product to cart:', productId);
        // Implement cart functionality here
    };

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PremiumCatalog, PerformanceOptimizer, ProductRenderer };
}
