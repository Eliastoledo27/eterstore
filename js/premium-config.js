/**
 * Premium Catalog Configuration
 * Configuración optimizada para el catálogo premium de Éter Store
 */

const PremiumCatalogConfig = {
    // Configuración de animaciones
    animations: {
        duration: {
            fast: 150,
            normal: 250,
            slow: 350,
            bounce: 400
        },
        easing: {
            smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)'
        },
        delays: {
            stagger: 100,
            search: 300,
            filter: 500,
            load: 800
        }
    },

    // Configuración de breakpoints
    breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        large: 1200
    },

    // Configuración de filtros
    filters: {
        categories: [
            { value: 'deportivo', label: 'Deportivo', icon: 'fas fa-running' },
            { value: 'casual', label: 'Casual', icon: 'fas fa-tshirt' },
            { value: 'formal', label: 'Formal', icon: 'fas fa-user-tie' },
            { value: 'verano', label: 'Verano', icon: 'fas fa-sun' },
            { value: 'invierno', label: 'Invierno', icon: 'fas fa-snowflake' },
            { value: 'urbano', label: 'Urbano', icon: 'fas fa-city' }
        ],
        priceRanges: [
            { value: 'premium', label: 'Premium (+$35.000)', min: 35000 },
            { value: 'standard', label: 'Estándar (-$35.000)', max: 35000 }
        ],
        sortOptions: [
            { value: 'price-asc', label: 'Precio: Menor a Mayor' },
            { value: 'price-desc', label: 'Precio: Mayor a Menor' },
            { value: 'rating', label: 'Mejor Valorados' },
            { value: 'name', label: 'Nombre A-Z' }
        ]
    },

    // Configuración de rendimiento
    performance: {
        debounceDelay: 300,
        throttleDelay: 100,
        lazyLoadThreshold: 0.1,
        intersectionMargin: '0px 0px -50px 0px',
        maxParticles: 20,
        particleAnimationDuration: {
            min: 10,
            max: 20
        }
    },

    // Configuración de accesibilidad
    accessibility: {
        skipLinkText: 'Saltar al contenido principal',
        loadingText: 'Cargando productos...',
        noResultsText: 'No se encontraron productos',
        filterAppliedText: 'Filtros aplicados',
        viewChangedText: 'Vista cambiada',
        cartOpenedText: 'Carrito abierto',
        cartClosedText: 'Carrito cerrado'
    },

    // Configuración de colores
    colors: {
        primary: {
            main: '#d4af37',
            dark: '#b8941f',
            light: '#e6c866',
            gold: '#ffd700'
        },
        secondary: {
            main: '#2c3e50',
            light: '#34495e'
        },
        accent: {
            success: '#27ae60',
            warning: '#f39c12',
            error: '#e74c3c',
            info: '#3498db'
        },
        neutral: {
            white: '#ffffff',
            gray50: '#f8f9fa',
            gray100: '#f1f3f4',
            gray200: '#e8eaed',
            gray300: '#dadce0',
            gray400: '#bdc1c6',
            gray500: '#9aa0a6',
            gray600: '#80868b',
            gray700: '#5f6368',
            gray800: '#3c4043',
            gray900: '#202124',
            black: '#000000'
        }
    },

    // Configuración de tipografía
    typography: {
        fonts: {
            primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            display: "'Playfair Display', Georgia, serif",
            mono: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace"
        },
        sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '3.75rem',
            '7xl': '4.5rem'
        },
        weights: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800
        }
    },

    // Configuración de espaciado
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '0.75rem',
        base: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
        '5xl': '4rem',
        '6xl': '5rem',
        '7xl': '6rem',
        '8xl': '8rem'
    },

    // Configuración de sombras
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        gold: '0 0 20px rgba(212, 175, 55, 0.3)',
        glow: '0 0 30px rgba(212, 175, 55, 0.2)'
    },

    // Configuración de bordes
    borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px'
    },

    // Configuración de z-index
    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
        particles: 1080
    },

    // Configuración de transiciones
    transitions: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: '400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },

    // Configuración de iconos
    icons: {
        search: 'fas fa-search',
        filter: 'fas fa-filter',
        clear: 'fas fa-times',
        cart: 'fas fa-shopping-cart',
        crown: 'fas fa-crown',
        star: 'fas fa-star',
        heart: 'fas fa-heart',
        gem: 'fas fa-gem',
        shipping: 'fas fa-shipping-fast',
        shield: 'fas fa-shield-alt',
        chevronDown: 'fas fa-chevron-down',
        chevronUp: 'fas fa-chevron-up',
        grid: 'fas fa-th',
        list: 'fas fa-list',
        home: 'fas fa-home',
        products: 'fas fa-shoe-prints',
        about: 'fas fa-info-circle',
        contact: 'fas fa-envelope',
        admin: 'fas fa-cog',
        phone: 'fas fa-phone',
        map: 'fas fa-map-marker-alt',
        whatsapp: 'fab fa-whatsapp',
        facebook: 'fab fa-facebook',
        instagram: 'fab fa-instagram'
    },

    // Configuración de mensajes
    messages: {
        loading: {
            products: 'Cargando productos...',
            filters: 'Aplicando filtros...',
            search: 'Buscando...'
        },
        empty: {
            products: 'No se encontraron productos',
            cart: 'Tu carrito está vacío',
            search: 'No hay resultados para tu búsqueda'
        },
        success: {
            filterApplied: 'Filtros aplicados correctamente',
            productAdded: 'Producto agregado al carrito',
            searchCleared: 'Búsqueda limpiada'
        },
        error: {
            loadFailed: 'Error al cargar los productos',
            filterFailed: 'Error al aplicar filtros',
            searchFailed: 'Error en la búsqueda'
        }
    },

    // Configuración de validación
    validation: {
        search: {
            minLength: 2,
            maxLength: 100
        },
        price: {
            min: 0,
            max: 1000000
        },
        rating: {
            min: 0,
            max: 5
        }
    },

    // Configuración de cache
    cache: {
        filters: {
            key: 'eter_catalog_filters',
            ttl: 24 * 60 * 60 * 1000 // 24 horas
        },
        products: {
            key: 'eter_catalog_products',
            ttl: 60 * 60 * 1000 // 1 hora
        },
        search: {
            key: 'eter_catalog_search',
            ttl: 30 * 60 * 1000 // 30 minutos
        }
    },

    // Configuración de analytics
    analytics: {
        events: {
            pageView: 'catalog_page_view',
            productView: 'product_view',
            filterApplied: 'filter_applied',
            searchPerformed: 'search_performed',
            cartAdd: 'cart_add',
            viewToggle: 'view_toggle'
        },
        dimensions: {
            productCategory: 'product_category',
            productPrice: 'product_price',
            searchTerm: 'search_term',
            filterType: 'filter_type'
        }
    },

    // Configuración de SEO
    seo: {
        title: 'Catálogo Premium - Éter Store | Calzados de Excelencia',
        description: 'Descubre nuestra colección exclusiva de calzados premium. Elegancia, comodidad y calidad excepcional en cada paso.',
        keywords: 'calzados premium, zapatos de lujo, mar del plata, éter store, calzado elegante',
        ogImage: 'https://eterstore.com/images/hero/hero-shoes.svg',
        canonical: 'https://eterstore.com/productos'
    },

    // Configuración de contactos
    contact: {
        phone: '+54 223 502 5196',
        email: 'equiporeveter@gmail.com',
        whatsapp: 'https://wa.me/5492235025196',
        address: 'Zona Jara y Berutti, Mar del Plata',
        schedule: {
            weekdays: '9:00 - 18:00',
            saturday: '9:00 - 13:00',
            note: 'Visitas con cita previa'
        }
    },

    // Configuración de redes sociales
    social: {
        facebook: '#',
        instagram: '#',
        whatsapp: 'https://wa.me/5492235025196'
    },

    // Configuración de enlaces
    links: {
        home: 'index.html',
        products: 'productos.html',
        admin: 'admin.html',
        terms: 'terminos-condiciones.html',
        privacy: 'politica-privacidad.html'
    },

    // Configuración de desarrollo
    development: {
        debug: false,
        logLevel: 'info',
        enablePerformanceMonitoring: true,
        enableErrorTracking: true,
        enableAnalytics: true
    }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumCatalogConfig;
} else if (typeof window !== 'undefined') {
    window.PremiumCatalogConfig = PremiumCatalogConfig;
}

// Configuración de inicialización
const initializePremiumCatalog = () => {
    // Verificar si estamos en modo desarrollo
    if (PremiumCatalogConfig.development.debug) {
        console.log('🚀 Inicializando Catálogo Premium de Éter Store');
        console.log('📊 Configuración cargada:', PremiumCatalogConfig);
    }

    // Configurar monitoreo de rendimiento
    if (PremiumCatalogConfig.development.enablePerformanceMonitoring) {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`⚡ Página cargada en ${loadTime}ms`);
            });
        }
    }

    // Configurar tracking de errores
    if (PremiumCatalogConfig.development.enableErrorTracking) {
        window.addEventListener('error', (event) => {
            console.error('❌ Error detectado:', event.error);
        });
    }

    // Configurar analytics
    if (PremiumCatalogConfig.development.enableAnalytics) {
        // Aquí se configurarían los eventos de analytics
        console.log('📈 Analytics configurado');
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePremiumCatalog);
} else {
    initializePremiumCatalog();
}
