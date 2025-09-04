/**
 * Sistema de Sincronización en Tiempo Real
 * Sincroniza cambios entre admin.html y productos.html
 */

class SyncManager {
    constructor() {
        this.isAdmin = window.location.pathname.includes('admin.html');
        this.isCatalog = window.location.pathname.includes('productos.html') || window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
        this.lastSyncTime = Date.now();
        this.syncInterval = null;

        this.init();
    }

    init() {
        this.setupStorageListener();
        this.setupCustomEventListeners();
        this.startPeriodicSync();

        console.log(`SyncManager initialized for ${this.isAdmin ? 'admin' : 'catalog'} page`);
    }

    // ===== STORAGE SYNCHRONIZATION =====

    setupStorageListener() {
        // Escuchar cambios en localStorage desde otras pestañas/ventanas
        window.addEventListener('storage', (e) => {
            if (e.key === 'eterStore_products' && e.newValue !== e.oldValue) {
                this.handleProductsChange(JSON.parse(e.newValue || '[]'));
            }
        });
    }

    setupCustomEventListeners() {
        // Escuchar eventos personalizados en la misma pestaña
        window.addEventListener('productsUpdated', (e) => {
            this.handleProductsChange(e.detail);
        });

        // Escuchar eventos de sincronización
        window.addEventListener('syncRequested', () => {
            this.performSync();
        });
    }

    handleProductsChange(newProducts) {
        console.log('Products changed, syncing...', newProducts.length, 'products');

        if (this.isCatalog) {
            this.updateCatalogView(newProducts);
        }

        this.lastSyncTime = Date.now();
        this.showSyncNotification('Catálogo actualizado automáticamente', 'success');
    }

    // ===== CATALOG VIEW UPDATES =====

    updateCatalogView(products) {
        try {
            // Actualizar ProductManager si existe
            if (window.ProductManager) {
                window.ProductManager.products = products;

                // Re-renderizar productos si la función existe
                if (typeof window.ProductManager.renderProducts === 'function') {
                    window.ProductManager.renderProducts(products);
                }

                // Actualizar contadores si las funciones existen
                if (typeof window.ProductManager.updateProductCounters === 'function') {
                    window.ProductManager.updateProductCounters();
                }
            }

            // Actualizar filtros si existen productos filtrados
            this.updateFiltersAfterSync();

            // Actualizar estadísticas en dashboard si estamos en index.html
            this.updateDashboardStats(products);

            console.log('Catalog view updated successfully');

        } catch (error) {
            console.error('Error updating catalog view:', error);
            this.showSyncNotification('Error al actualizar vista del catálogo', 'error');
        }
    }

    updateFiltersAfterSync() {
        // Si hay filtros activos, re-aplicarlos
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortFilter = document.getElementById('sortFilter');
        const searchFilter = document.getElementById('searchFilter');

        if (categoryFilter?.value || priceFilter?.value || sortFilter?.value || searchFilter?.value) {
            // Disparar evento de filtrado si existe la función
            if (window.ProductManager && typeof window.ProductManager.applyFilters === 'function') {
                setTimeout(() => window.ProductManager.applyFilters(), 100);
            }
        }
    }

    updateDashboardStats(products) {
        if (!products || !Array.isArray(products)) return;

        const stats = {
            total: products.length,
            lowStock: products.filter(p => p.stock <= 5 && p.stock > 0).length,
            outOfStock: products.filter(p => p.stock === 0).length,
            premium: products.filter(p => p.price > 35000).length
        };

        // Actualizar elementos de estadísticas si existen
        this.updateStatElement('totalProducts', stats.total);
        this.updateStatElement('lowStockProducts', stats.lowStock);
        this.updateStatElement('outOfStockProducts', stats.outOfStock);
        this.updateStatElement('premiumProducts', stats.premium);
    }

    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            // Animar el cambio de valor
            element.style.transition = 'all 0.3s ease';
            element.style.transform = 'scale(1.1)';
            element.textContent = value;

            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 300);
        }
    }

    // ===== PERIODIC SYNC =====

    startPeriodicSync() {
        // Sincronizar cada 30 segundos para detectar cambios externos
        this.syncInterval = setInterval(() => {
            this.checkForUpdates();
        }, 30000);
    }

    checkForUpdates() {
        const stored = localStorage.getItem('eterStore_products');
        if (!stored) return;

        try {
            const storedProducts = JSON.parse(stored);
            const lastModified = Math.max(...storedProducts.map(p =>
                new Date(p.dateModified || p.dateCreated || 0).getTime()
            ));

            if (lastModified > this.lastSyncTime) {
                console.log('External changes detected, syncing...');
                this.handleProductsChange(storedProducts);
            }
        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }

    performSync() {
        const products = this.getCurrentProducts();
        if (products) {
            this.handleProductsChange(products);
        }
    }

    getCurrentProducts() {
        const stored = localStorage.getItem('eterStore_products');
        return stored ? JSON.parse(stored) : null;
    }

    // ===== SYNC STATUS MANAGEMENT =====

    showSyncStatus(status, message) {
        const statusElement = this.createOrUpdateSyncStatus();

        statusElement.className = `sync-status ${status}`;
        statusElement.innerHTML = `
            <i class="fas fa-${this.getSyncIcon(status)}"></i>
            <span>${message}</span>
        `;

        // Auto-hide success messages
        if (status === 'synced') {
            setTimeout(() => {
                statusElement.style.opacity = '0';
                setTimeout(() => statusElement.remove(), 300);
            }, 3000);
        }
    }

    createOrUpdateSyncStatus() {
        let statusElement = document.getElementById('syncStatus');

        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'syncStatus';
            statusElement.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 1000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(statusElement);
        }

        return statusElement;
    }

    getSyncIcon(status) {
        const icons = {
            synced: 'check-circle',
            syncing: 'sync fa-spin',
            error: 'exclamation-triangle'
        };
        return icons[status] || 'info-circle';
    }

    showSyncNotification(message, type = 'info') {
        // Solo mostrar notificaciones importantes para no saturar
        if (type === 'error' || (type === 'success' && this.isAdmin)) {
            this.createNotification(message, type);
        }
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `sync-notification sync-notification-${type}`;
        notification.innerHTML = `
            <div class="sync-notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Estilos inline para evitar dependencias
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-size: 14px;
            font-weight: 500;
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

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || '#17a2b8';
    }

    // ===== CONFLICT RESOLUTION =====

    resolveConflicts(localProducts, remoteProducts) {
        // Estrategia simple: el más reciente gana
        const mergedProducts = [];
        const localMap = new Map(localProducts.map(p => [p.id, p]));
        const remoteMap = new Map(remoteProducts.map(p => [p.id, p]));

        // Obtener todos los IDs únicos
        const allIds = new Set([...localMap.keys(), ...remoteMap.keys()]);

        allIds.forEach(id => {
            const localProduct = localMap.get(id);
            const remoteProduct = remoteMap.get(id);

            if (!localProduct) {
                // Solo existe remotamente
                mergedProducts.push(remoteProduct);
            } else if (!remoteProduct) {
                // Solo existe localmente
                mergedProducts.push(localProduct);
            } else {
                // Existe en ambos, usar el más reciente
                const localTime = new Date(localProduct.dateModified || localProduct.dateCreated || 0).getTime();
                const remoteTime = new Date(remoteProduct.dateModified || remoteProduct.dateCreated || 0).getTime();

                mergedProducts.push(remoteTime > localTime ? remoteProduct : localProduct);
            }
        });

        return mergedProducts;
    }

    // ===== MANUAL SYNC TRIGGERS =====

    forcSync() {
        console.log('Force sync requested');
        this.showSyncStatus('syncing', 'Sincronizando...');

        setTimeout(() => {
            this.performSync();
            this.showSyncStatus('synced', 'Sincronización completada');
        }, 1000);
    }

    // ===== CLEANUP =====

    destroy() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        // Remover event listeners
        window.removeEventListener('storage', this.handleStorageChange);
        window.removeEventListener('productsUpdated', this.handleProductsChange);
        window.removeEventListener('syncRequested', this.performSync);

        // Remover elementos de UI
        const syncStatus = document.getElementById('syncStatus');
        if (syncStatus) {
            syncStatus.remove();
        }
    }
}

// ===== UTILITY FUNCTIONS =====

// Función para disparar sincronización manual desde cualquier parte
window.requestSync = function() {
    window.dispatchEvent(new CustomEvent('syncRequested'));
};

// Función para forzar sincronización completa
window.forceSync = function() {
    if (window.syncManager) {
        window.syncManager.forcSync();
    }
};

// Función para verificar estado de sincronización
window.getSyncStatus = function() {
    return window.syncManager ? {
        lastSync: window.syncManager.lastSyncTime,
        isActive: !!window.syncManager.syncInterval
    } : null;
};

// ===== INITIALIZATION =====

let syncManager;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el sincronizador
    syncManager = new SyncManager();
    window.syncManager = syncManager;

    // Agregar botón de sincronización manual si estamos en admin
    if (syncManager.isAdmin) {
        addManualSyncButton();
    }
});

function addManualSyncButton() {
    const syncButton = document.getElementById('syncProductsBtn');
    if (syncButton) {
        syncButton.addEventListener('click', () => {
            window.forceSync();
        });
    }
}

// Cleanup al cerrar la página
window.addEventListener('beforeunload', () => {
    if (syncManager) {
        syncManager.destroy();
    }
});

// Exportar para uso como módulo si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SyncManager;
}
