// ===== ANALYTICS.JS - Funcionalidades específicas para Analytics =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Analytics Panel...');

    // Ocultar pantalla de carga después de 1.5 segundos
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
        }
    }, 1500);

    // Establecer usuario por defecto
    updateUserName('Analytics Manager');

    // Inicializar todas las funcionalidades
    initializeAnalytics();
    initializeNavigation();
    initializeNotifications();
    initializeCharts();
    initializeEventListeners();

    console.log('✅ Analytics Panel inicializado correctamente');
});

// ===== FUNCIONALIDADES PRINCIPALES =====

function initializeAnalytics() {
    console.log('📊 Inicializando funcionalidades de Analytics...');

    // Cargar datos iniciales
    loadAnalyticsData();

    // Configurar selectores de período
    setupPeriodSelectors();

    // Configurar exportación
    setupExportFunctionality();
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

    // Búsqueda
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

function initializeCharts() {
    console.log('📈 Inicializando gráficos...');

    // Simular gráfico de ventas (en un entorno real se usaría Chart.js)
    const salesChart = document.getElementById('salesChart');
    if (salesChart) {
        createSalesChart(salesChart);
    }
}

function initializeEventListeners() {
    console.log('🎧 Configurando event listeners...');

    // Selector de período
    const analyticsPeriod = document.getElementById('analyticsPeriod');
    if (analyticsPeriod) {
        analyticsPeriod.addEventListener('change', function() {
            updateAnalyticsData(this.value);
        });
    }

    // Botón de exportación
    const exportBtn = document.getElementById('exportAnalyticsBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportAnalyticsReport();
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

// ===== FUNCIONES DE ANALYTICS =====

function loadAnalyticsData() {
    console.log('📊 Cargando datos de analytics...');

    // Simular carga de datos
    setTimeout(() => {
        updateConversionMetrics();
        updateProductRanking();
        updateSalesDistribution();
    }, 1000);
}

function setupPeriodSelectors() {
    console.log('📅 Configurando selectores de período...');

    const periodSelect = document.getElementById('analyticsPeriod');
    if (periodSelect) {
        // Agregar eventos adicionales si es necesario
        periodSelect.addEventListener('change', function() {
            const selectedPeriod = this.value;
            console.log(`Período seleccionado: ${selectedPeriod} días`);

            // Simular actualización de datos
            showNotification(`Actualizando datos para los últimos ${selectedPeriod} días...`, 'info');

            setTimeout(() => {
                updateAnalyticsData(selectedPeriod);
            }, 500);
        });
    }
}

function setupExportFunctionality() {
    console.log('📤 Configurando funcionalidad de exportación...');

    const exportBtn = document.getElementById('exportAnalyticsBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportAnalyticsReport();
        });
    }
}

function updateAnalyticsData(period) {
    console.log(`🔄 Actualizando datos para período: ${period} días`);

    // Simular actualización de datos
    const conversionItems = document.querySelectorAll('.conversion-item');
    conversionItems.forEach((item, index) => {
        const valueElement = item.querySelector('.conversion-value');
        const changeElement = item.querySelector('.conversion-change');

        if (valueElement && changeElement) {
            // Simular nuevos valores basados en el período
            const baseValues = [12450, 1234, 9.9];
            const baseChanges = [8.2, 12.5, 3.8];

            const multiplier = period / 30; // Factor basado en el período
            const newValue = Math.round(baseValues[index] * multiplier);
            const newChange = (baseChanges[index] * multiplier).toFixed(1);

            valueElement.textContent = newValue.toLocaleString();
            changeElement.textContent = `+${newChange}%`;
        }
    });

    showNotification('Datos actualizados correctamente', 'success');
}

function updateConversionMetrics() {
    console.log('📈 Actualizando métricas de conversión...');

    // Simular animación de números
    const conversionValues = document.querySelectorAll('.conversion-value');
    conversionValues.forEach((element, index) => {
        const finalValue = element.textContent;
        animateNumber(element, 0, parseInt(finalValue.replace(/,/g, '')), 1000);
    });
}

function updateProductRanking() {
    console.log('🏆 Actualizando ranking de productos...');

    // Simular animación de barras de progreso
    const barFills = document.querySelectorAll('.bar-fill');
    barFills.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';

        setTimeout(() => {
            bar.style.width = targetWidth;
        }, index * 200);
    });
}

function updateSalesDistribution() {
    console.log('📊 Actualizando distribución de ventas...');

    // Simular actualización de distribución
    const distributionItems = document.querySelectorAll('.distribution-item');
    distributionItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';

        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function createSalesChart(canvas) {
    console.log('📊 Creando gráfico de ventas...');

    // Simular gráfico (en un entorno real se usaría Chart.js)
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Dibujar gráfico simple
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(50, 150, 60, 50);
    ctx.fillRect(120, 120, 60, 80);
    ctx.fillRect(190, 100, 60, 100);
    ctx.fillRect(260, 80, 60, 120);
    ctx.fillRect(330, 130, 60, 70);

    // Agregar texto
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Ventas por Día', width/2, height - 10);
}

function performSearch(query) {
    console.log(`🔍 Realizando búsqueda: ${query}`);

    if (query.trim()) {
        showNotification(`Buscando: "${query}"`, 'info');

        // Simular búsqueda
        setTimeout(() => {
            showNotification(`Se encontraron 5 resultados para "${query}"`, 'success');
        }, 1000);
    } else {
        showNotification('Por favor ingresa un término de búsqueda', 'warning');
    }
}

function exportAnalyticsReport() {
    console.log('📤 Exportando reporte de analytics...');

    showNotification('Generando reporte...', 'info');

    // Simular generación de reporte
    setTimeout(() => {
        const reportData = {
            period: document.getElementById('analyticsPeriod')?.value || '30',
            date: new Date().toISOString(),
            metrics: {
                visits: '12,450',
                orders: '1,234',
                conversion: '9.9%'
            }
        };

        // Crear archivo de descarga
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-report-${reportData.date.split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);

        showNotification('Reporte exportado correctamente', 'success');
    }, 2000);
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

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const startValue = start;
    const endValue = end;

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = Math.round(startValue + (endValue - startValue) * progress);
        element.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }

    requestAnimationFrame(updateNumber);
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

// Función global para actualizar datos en tiempo real
window.refreshAnalyticsData = function() {
    console.log('🔄 Actualizando datos de analytics...');
    showNotification('Actualizando datos...', 'info');

    setTimeout(() => {
        loadAnalyticsData();
        showNotification('Datos actualizados correctamente', 'success');
    }, 1500);
};

// Función global para exportar datos
window.exportData = function(format = 'json') {
    console.log(`📤 Exportando datos en formato: ${format}`);

    const formats = {
        json: 'application/json',
        csv: 'text/csv',
        pdf: 'application/pdf'
    };

    showNotification(`Exportando en formato ${format.toUpperCase()}...`, 'info');

    setTimeout(() => {
        showNotification(`Archivo exportado en formato ${format.toUpperCase()}`, 'success');
    }, 2000);
};

// ===== EVENTOS DE TECLADO =====

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K para búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Ctrl/Cmd + E para exportar
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportAnalyticsReport();
    }

    // Ctrl/Cmd + R para refrescar
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        window.refreshAnalyticsData();
    }
});

// ===== FUNCIONES DE DEBUG =====

// Función para mostrar información de debug
window.debugAnalytics = function() {
    console.log('🐛 Información de debug de Analytics:');
    console.log('- Período seleccionado:', document.getElementById('analyticsPeriod')?.value);
    console.log('- Elementos de conversión:', document.querySelectorAll('.conversion-item').length);
    console.log('- Elementos de ranking:', document.querySelectorAll('.ranking-item').length);
    console.log('- Elementos de distribución:', document.querySelectorAll('.distribution-item').length);
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

console.log('📊 Analytics.js cargado correctamente');



