/**
 * Éter Store - Sistema de Carrito de Compras Completo
 * Versión 3.0 - Gestión completa de productos y pedidos
 */

class CompleteShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.subtotal = 0;
        this.profit = 0;
        this.isInitialized = false;
        this.isCartOpen = false;
        this.animationDuration = 300;
        
        // Configuración del carrito
        this.config = {
            maxItems: 50,
            maxQuantity: 10,
            defaultProfitMargin: 20,
            currency: 'ARS',
            locale: 'es-AR',
            whatsappNumber: '2235025196'
        };
        
        this.init();
    }

    /**
     * Inicialización del carrito
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            this.loadFromStorage();
            this.setupEventListeners();
            this.updateDisplay();
            this.isInitialized = true;
            
            console.log('🛒 Sistema de Carrito Completo inicializado con', this.items.length, 'productos');
        } catch (error) {
            console.error('❌ Error inicializando carrito:', error);
        }
    }

    /**
     * Cargar carrito desde localStorage
     */
    loadFromStorage() {
        try {
            const savedCart = localStorage.getItem('eterStore_complete_cart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                this.items = Array.isArray(parsedCart) ? parsedCart : [];
                
                // Validar estructura de items
                this.items = this.items.filter(item => 
                    item && item.id && item.name && typeof item.price === 'number'
                );
            }
        } catch (error) {
            console.error('❌ Error cargando carrito:', error);
                    this.items = [];
                }
            }

    /**
     * Guardar carrito en localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('eterStore_complete_cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('❌ Error guardando carrito:', error);
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Botón del carrito en header
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.toggleCart());
        }

        // Botón cerrar carrito
        const closeCartBtn = document.getElementById('closeCart');
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => this.closeCart());
        }

        // Botón vaciar carrito
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        // Botón finalizar compra
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }

        // Event listeners para checkout
        const checkoutForm = document.getElementById('checkoutForm');
        const closeCheckoutBtn = document.getElementById('closeCheckout');
        const backToCartBtn = document.getElementById('backToCart');

        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleCheckoutSubmit(e));
        }

        if (closeCheckoutBtn) {
            closeCheckoutBtn.addEventListener('click', () => this.closeCheckout());
        }

        if (backToCartBtn) {
            backToCartBtn.addEventListener('click', () => this.backToCart());
        }

        // Cerrar carrito al hacer clic fuera
        document.addEventListener('click', (e) => {
            const cartModal = document.getElementById('cartModal');
            if (cartModal && e.target === cartModal) {
                this.closeCart();
            }
        });

        // Cerrar carrito con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isCartOpen) {
                this.closeCart();
            }
        });

        // Mantener modal centrado al redimensionar ventana
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const cartModal = document.getElementById('cartModal');
                if (cartModal && cartModal.style.display === 'flex') {
                    this.centerModal(cartModal);
                }
            }, 100);
        });

        // Asegurar centrado después de que se cargue completamente
        window.addEventListener('load', () => {
            const cartModal = document.getElementById('cartModal');
            if (cartModal && cartModal.style.display === 'flex') {
                setTimeout(() => {
                    this.centerModal(cartModal);
                }, 50);
            }
        });
    }

    /**
     * Agregar producto al carrito con gestión completa
     */
    addItem(product, quantity = 1, size = '', profitMargin = null) {
        if (!product || !product.id) {
            this.showNotification('❌ Producto inválido', 'error');
            return false;
        }

        if (quantity <= 0 || quantity > this.config.maxQuantity) {
            this.showNotification(`❌ Cantidad inválida (máximo ${this.config.maxQuantity})`, 'error');
            return false;
        }

        try {
            const itemKey = this.getItemKey(product.id, size);
            const existingItem = this.items.find(item => this.getItemKey(item.id, item.size) === itemKey);
            
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > this.config.maxQuantity) {
                    this.showNotification(`❌ Cantidad máxima alcanzada (${this.config.maxQuantity})`, 'error');
                    return false;
                }
                existingItem.quantity = newQuantity;
            } else {
                if (this.items.length >= this.config.maxItems) {
                    this.showNotification(`❌ Carrito lleno (máximo ${this.config.maxItems} productos)`, 'error');
                    return false;
                }

                const margin = profitMargin || this.config.defaultProfitMargin;
                const newItem = {
                    id: product.id,
                    name: product.name,
                    description: product.description || '',
                    price: product.price,
                    image: product.image,
                    category: product.category || '',
                    quantity: quantity,
                    size: size,
                    profitMargin: margin,
                    wholesalePrice: product.price,
                    finalPrice: product.price * (1 + margin / 100),
                    addedAt: new Date().toISOString()
                };
                
                this.items.push(newItem);
            }
            
            this.saveToStorage();
            this.updateDisplay();
            this.showAddToCartAnimation();
            
            // Actualización optimizada del contador
            setTimeout(() => {
                this.updateCartCount();
            }, 100);
            
            this.showNotification(`✅ ${product.name} agregado al carrito`, 'success');
            return true;
        } catch (error) {
            console.error('❌ Error agregando producto:', error);
            this.showNotification('❌ Error agregando producto', 'error');
            return false;
        }
    }

    /**
     * Remover producto del carrito
     */
    removeItem(productId, size = '') {
        try {
            const itemKey = this.getItemKey(productId, size);
            const itemIndex = this.items.findIndex(item => this.getItemKey(item.id, item.size) === itemKey);
            
            if (itemIndex !== -1) {
                const removedItem = this.items[itemIndex];
                this.items.splice(itemIndex, 1);
                this.saveToStorage();
                this.updateDisplay();
                
                this.showNotification(`🗑️ ${removedItem.name} removido del carrito`, 'info');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error removiendo producto:', error);
            return false;
        }
    }

    /**
     * Actualizar cantidad de un producto
     */
    updateQuantity(productId, size, quantity) {
        try {
            const itemKey = this.getItemKey(productId, size);
            const item = this.items.find(item => this.getItemKey(item.id, item.size) === itemKey);
            
            if (item) {
                if (quantity <= 0) {
                    return this.removeItem(productId, size);
                } else if (quantity > this.config.maxQuantity) {
                    this.showNotification(`❌ Cantidad máxima: ${this.config.maxQuantity}`, 'error');
                    return false;
                } else {
                    item.quantity = quantity;
                    this.saveToStorage();
                    this.updateDisplay();
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('❌ Error actualizando cantidad:', error);
            return false;
        }
    }

    /**
     * Limpiar carrito
     */
    clearCart() {
        if (this.items.length === 0) {
            this.showNotification('🛒 El carrito ya está vacío', 'info');
            return;
        }

        // Mostrar confirmación
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            this.items = [];
            this.saveToStorage();
            this.updateDisplay();
            this.showNotification('🗑️ Carrito vaciado', 'info');
        }
    }

    /**
     * Calcular totales y subtotales
     */
    calculateTotals() {
        this.subtotal = this.items.reduce((total, item) => total + (item.wholesalePrice * item.quantity), 0);
        const finalTotal = this.items.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
        this.profit = finalTotal - this.subtotal;
        this.total = finalTotal;
    }

    /**
     * Actualizar display completo
     */
    updateDisplay() {
        this.calculateTotals();
        this.updateCartCount();
        this.renderCart();
        this.updateCartSummary();
    }

    /**
     * Actualizar contador del carrito
     */
    updateCartCount() {
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        
        // Actualizar contador en header
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = totalItems;
            
            // Usar clase 'show' para controlar visibilidad
            if (totalItems > 0) {
                cartCount.classList.add('show');
                // Forzar estilos como respaldo
                cartCount.style.display = 'flex';
                cartCount.style.visibility = 'visible';
                cartCount.style.opacity = '1';
                cartCount.style.transform = 'scale(1)';
            } else {
                cartCount.classList.remove('show');
                // Mantener estilos ocultos
                cartCount.style.opacity = '0';
                cartCount.style.transform = 'scale(0)';
                cartCount.style.visibility = 'hidden';
            }
            
            console.log('🛒 Contador actualizado:', totalItems, 'productos, clase show:', cartCount.classList.contains('show'));
        } else {
            console.warn('⚠️ No se encontró el elemento cartCount');
        }
        
        // Actualizar badge en modal
        const cartCountBadge = document.getElementById('cartCountBadge');
        if (cartCountBadge) {
            cartCountBadge.textContent = totalItems;
            if (totalItems > 0) {
                cartCountBadge.classList.add('show');
            } else {
                cartCountBadge.classList.remove('show');
            }
        }
    }

    /**
     * Renderizar carrito con gestión completa de productos
     */
    renderCart() {
            const cartItems = document.getElementById('cartItems');
            const cartEmpty = document.getElementById('cartEmpty');
            const cartSummary = document.getElementById('cartSummary');
            
            if (!cartItems) return;

            if (this.items.length === 0) {
            cartItems.style.display = 'none';
            if (cartEmpty) cartEmpty.style.display = 'flex';
                if (cartSummary) cartSummary.style.display = 'none';
                return;
            }

        // Mostrar items
                cartItems.style.display = 'block';
        cartItems.innerHTML = this.items.map(item => this.renderCartItem(item)).join('');
        
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';
    }

    /**
     * Renderizar item individual del carrito simplificado
     */
    renderCartItem(item) {
        const itemKey = this.getItemKey(item.id, item.size);
        const itemSubtotal = item.finalPrice * item.quantity;
        const wholesaleSubtotal = item.wholesalePrice * item.quantity;
        const profitAmount = itemSubtotal - wholesaleSubtotal;
        
        return `
            <div class="cart-item" data-item-key="${itemKey}">
                <div class="cart-item-image">
                    ${this.getProductImage(item.image, item.name)}
                </div>
                
                <div class="cart-item-content">
                    <div class="cart-item-header">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <button class="remove-item-btn" onclick="window.cart.removeItem(${item.id}, '${item.size}')" title="Remover producto">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="cart-item-details">
                        ${item.size ? `<span class="cart-item-size">Talla: ${item.size}</span>` : ''}
                        <div class="price-breakdown">
                            <div class="price-line">
                                <span class="price-label">Precio Mayorista:</span>
                                <span class="wholesale-price">${this.formatPrice(item.wholesalePrice)}</span>
                            </div>
                            <div class="price-line">
                                <span class="price-label">Margen de Ganancia:</span>
                                <span class="profit-amount">${this.formatPrice(profitAmount)}</span>
                            </div>
                            <div class="price-line total-line">
                                <span class="price-label">Precio Final:</span>
                                <span class="final-price">${this.formatPrice(item.finalPrice)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" onclick="window.cart.updateQuantity(${item.id}, '${item.size}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn plus" onclick="window.cart.updateQuantity(${item.id}, '${item.size}', ${item.quantity + 1})" ${item.quantity >= this.config.maxQuantity ? 'disabled' : ''}>
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="item-subtotal">
                            ${this.formatPrice(itemSubtotal)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Actualizar resumen del carrito simplificado
     */
    updateCartSummary() {
        const finalPriceEl = document.getElementById('finalPrice');
        const totalItemsEl = document.getElementById('totalItems');
        
        if (finalPriceEl) finalPriceEl.textContent = this.formatPrice(this.total);
        
        if (totalItemsEl) {
            const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
            totalItemsEl.textContent = totalItems;
        }
    }

    /**
     * Obtener imagen del producto
     */
    getProductImage(imageSrc, productName) {
        if (!imageSrc) {
            return '<i class="fas fa-shoe-prints"></i>';
        }
        
        if (imageSrc.includes('.svg') || imageSrc.includes('.jpg') || imageSrc.includes('.png')) {
                return `<img src="${imageSrc}" alt="${productName}" loading="lazy">`;
        } else if (imageSrc.startsWith('fas')) {
                return `<i class="${imageSrc}"></i>`;
            } else {
            return '<i class="fas fa-shoe-prints"></i>';
        }
    }

    /**
     * Formatear precio con separadores de miles y decimales argentinos
     */
    formatPrice(price) {
            if (typeof price !== 'number' || isNaN(price)) {
                return '$0';
            }
        
        // Formato argentino: $1.234.567 (sin decimales)
            return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price);
    }

    /**
     * Generar clave única para item
     */
    getItemKey(productId, size) {
        return `${productId}-${size}`;
    }

    /**
     * Centrar el modal en la pantalla
     */
    centerModal(modal) {
        try {
            const content = modal.querySelector('.cart-content');
            if (content) {
                // Asegurar que el contenido esté perfectamente centrado
                content.style.position = 'absolute';
                content.style.top = '50%';
                content.style.left = '50%';
                content.style.transform = 'translate(-50%, -50%) scale(0.85)';
                content.style.margin = '0';
                content.style.maxWidth = '950px';
                content.style.maxHeight = '90vh';
                content.style.width = '100%';
                
                // Forzar reflow para asegurar el centrado
                content.offsetHeight;
                
                // Verificar que el modal esté centrado
                this.verifyModalCentering(modal);
            }
        } catch (error) {
            console.error('Error centrando modal:', error);
        }
    }

    /**
     * Verificar que el modal esté centrado correctamente
     */
    verifyModalCentering(modal) {
        try {
            const content = modal.querySelector('.cart-content');
            if (content) {
                const rect = content.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                
                const centerX = windowWidth / 2;
                const centerY = windowHeight / 2;
                const contentCenterX = rect.left + rect.width / 2;
                const contentCenterY = rect.top + rect.height / 2;
                
                // Si no está centrado, ajustar
                if (Math.abs(centerX - contentCenterX) > 5 || Math.abs(centerY - contentCenterY) > 5) {
                    console.log('Ajustando centrado del modal...');
                    this.centerModal(modal);
                }
            }
        } catch (error) {
            console.error('Error verificando centrado:', error);
        }
    }

    /**
     * Abrir carrito
     */
    openCart() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.style.display = 'flex';
            setTimeout(() => {
                cartModal.classList.add('active');
            }, 10);
            this.isCartOpen = true;
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Cerrar carrito
     */
    closeCart() {
        const cartModal = document.getElementById('cartModal');
            if (cartModal) {
            cartModal.classList.remove('active');
            setTimeout(() => {
                cartModal.style.display = 'none';
            }, this.animationDuration);
            this.isCartOpen = false;
            document.body.style.overflow = '';
        }
    }

    /**
     * Alternar carrito
     */
    toggleCart() {
        if (this.isCartOpen) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }

    /**
     * Mostrar carrito
     */
    showCart() {
        try {
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                this.updateDisplay();
                cartModal.style.display = 'flex';
                
                // Centrar el modal perfectamente
                this.centerModal(cartModal);
                
                // Forzar reflow para asegurar que la animación funcione
                cartModal.offsetHeight;
                
                // Activar animación después de un pequeño delay
                setTimeout(() => {
                    cartModal.classList.add('active');
                }, 10);
                
                document.body.style.overflow = 'hidden';
                document.body.classList.add('modal-open');
            }
        } catch (error) {
            console.error('Error mostrando carrito:', error);
        }
    }

    /**
     * Ocultar carrito
     */
    hideCart() {
        try {
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.classList.remove('active');
                
                // Esperar a que termine la animación antes de ocultar
                setTimeout(() => {
                cartModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                    document.body.classList.remove('modal-open');
                }, 300);
            }
        } catch (error) {
            console.error('Error ocultando carrito:', error);
        }
    }

    /**
     * Animación de agregar al carrito
     */
    showAddToCartAnimation() {
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.classList.add('pulse');
            setTimeout(() => {
                cartBtn.classList.remove('pulse');
            }, 600);
        }
    }

    /**
     * Proceder al checkout
     */
    proceedToCheckout() {
            if (this.items.length === 0) {
            this.showNotification('❌ El carrito está vacío', 'error');
                return;
        }

        // Cerrar carrito
        this.closeCart();
        
        // Renderizar resumen del checkout
                this.renderCheckoutSummary();
        
        // Abrir modal de checkout
            const checkoutModal = document.getElementById('checkoutModal');
            if (checkoutModal) {
            checkoutModal.style.display = 'flex';
            setTimeout(() => {
                checkoutModal.classList.add('active');
            }, 10);
        }
    }

    /**
     * Renderizar resumen del checkout
     */
    renderCheckoutSummary() {
            const checkoutSummary = document.getElementById('checkoutSummary');
            if (!checkoutSummary) return;

        const productsList = this.items.map(item => `
            <div class="checkout-item">
                <div class="checkout-item-info">
                    <h5>${item.name}</h5>
                    <p>Talla: ${item.size || 'Única'} | Cantidad: ${item.quantity}</p>
                </div>
                <div class="checkout-item-price">
                    ${this.formatPrice(item.finalPrice * item.quantity)}
                </div>
                </div>
        `).join('');

        checkoutSummary.innerHTML = `
            <div class="checkout-items">
                ${productsList}
                        </div>
            <div class="checkout-total">
                <h4>Total a Pagar: ${this.formatPrice(this.total)}</h4>
                </div>
            `;
    }

    /**
     * Manejar envío del formulario de checkout inteligente
     */
    handleCheckoutSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const deliveryMethod = formData.get('deliveryMethod');
        const orderData = {
            customerName: formData.get('customerName')?.trim(),
            customerPhone: formData.get('customerPhone')?.trim(),
            customerAddress: deliveryMethod === 'shipping' ? formData.get('customerAddress')?.trim() : 'Retiro en Showroom - Zona Jara y Berutti, Mar del Plata',
            deliveryMethod: deliveryMethod,
            deliveryTime: formData.get('deliveryTime') || 'Horario flexible',
            paymentMethod: formData.get('paymentMethod')?.trim()
        };

        // Validar datos básicos
        if (!orderData.customerName || !orderData.customerPhone || !orderData.paymentMethod) {
            this.showNotification('❌ Por favor completa todos los campos obligatorios', 'error');
            return;
        }

        // Validar dirección solo si es envío a domicilio
        if (deliveryMethod === 'shipping' && !formData.get('customerAddress')?.trim()) {
            this.showNotification('❌ Por favor ingresa la dirección de entrega', 'error');
            return;
        }

        // Procesar orden
        this.processOrder(orderData)
            .then(order => {
                this.showNotification('✅ Pedido enviado exitosamente por WhatsApp', 'success');
                this.closeCheckout();
                e.target.reset();
                this.resetCheckoutSteps();
            })
            .catch(error => {
                this.showNotification(`❌ Error: ${error.message}`, 'error');
            });
    }

    /**
     * Cerrar checkout
     */
    closeCheckout() {
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.classList.remove('active');
            setTimeout(() => {
                checkoutModal.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Volver al carrito
     */
    backToCart() {
        this.closeCheckout();
        this.openCart();
    }

    /**
     * Generar mensaje de WhatsApp con formato exacto
     */
    generateWhatsAppMessage(orderData) {
        try {
            const orderId = `ETER-${Date.now()}`;
            const orderDate = new Date();
            const formattedDate = orderDate.toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Generar lista de productos con formato exacto
            const productsList = this.items.map((item, index) => {
                const productName = item.name;
                const size = item.size || 'Única';
                const quantity = item.quantity;
                const wholesalePrice = item.wholesalePrice.toLocaleString('es-AR');
                const finalPrice = item.finalPrice.toLocaleString('es-AR');
                const profitAmount = (item.finalPrice - item.wholesalePrice).toLocaleString('es-AR');
                
                return `• ${productName}  (Talla ${size}) x ${quantity}\n  ↳ Precio Mayorista: *$ ${wholesalePrice}*\n  ↳ Margen de Ganancia: *$ ${profitAmount}*\n  ↳ Precio Final: *$ ${finalPrice}*`;
            }).join('\n');

            // Calcular total del pedido
            const totalPedido = this.total.toLocaleString('es-AR');

            // Determinar método de entrega
            const deliveryMethodText = orderData.deliveryMethod === 'shipping' ? 'Envío a domicilio' : 'Retiro en showroom';
            
            // Crear el mensaje sin emojis para evitar problemas de codificación
            const message = [
                '*¡Nuevo Pedido Recibido!*',
                '-----------------------------------',
                '',
                '*DATOS DEL CLIENTE*',
                `• *Nombre:* ${orderData.customerName || 'No especificado'}`,
                `• *Teléfono:* ${orderData.customerPhone || 'No especificado'}`,
                `• *Dirección:* ${orderData.customerAddress || 'No especificado'}`,
                '',
                '*DETALLES DE ENTREGA*',
                `• *Método:* ${deliveryMethodText}`,
                `• *Horario:* ${orderData.deliveryTime || 'Horario flexible'}`,
                `• *Forma de pago:* ${orderData.paymentMethod || 'No especificado'}`,
                '',
                '*PRODUCTOS*',
                productsList,
                '',
                `*TOTAL A PAGAR:* *$ ${totalPedido}*`,
                '-----------------------------------',
                '',
                `*ID del pedido:* \`${orderId}\``,
                `*Fecha:* ${formattedDate} hs`,
                '',
                '*Éter Store*',
                'Mar del Plata',
                '',
                '¡Gracias por elegir *Éter Store*! Nos comunicaremos pronto para confirmar.'
            ].join('\n');

            return message;

        } catch (error) {
            console.error('Error generando mensaje de WhatsApp:', error);
            return 'Error generando mensaje de WhatsApp';
        }
    }

    /**
     * Enviar pedido por WhatsApp
     */
    sendToWhatsApp(orderData) {
        try {
            const message = this.generateWhatsAppMessage(orderData);
            
            if (!message || message.trim().length === 0) {
                throw new Error('Error generando el mensaje de WhatsApp');
            }

            // Crear un elemento temporal para copiar al portapapeles
            const textArea = document.createElement('textarea');
            textArea.value = message;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            // Mostrar notificación de que el mensaje se copió
            this.showNotification('✅ Mensaje copiado al portapapeles. Abriendo WhatsApp...', 'success');

            // Abrir WhatsApp Web con el mensaje del pedido
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${this.config.whatsappNumber}&text=${encodedMessage}`;
            
            const whatsappWindow = window.open(whatsappUrl, '_blank');
            
            if (!whatsappWindow) {
                throw new Error('No se pudo abrir WhatsApp. Verifica que no esté bloqueado por el navegador.');
            }

            localStorage.setItem('lastWhatsAppMessage', message);
            console.log('Pedido copiado al portapapeles y WhatsApp abierto');
            
            return true;

        } catch (error) {
            console.error('Error enviando pedido por WhatsApp:', error);
            this.showNotification('Error enviando pedido por WhatsApp: ' + error.message, 'error');
            return false;
        }
    }

    /**
     * Procesar orden completa
     */
    processOrder(orderData) {
        return new Promise((resolve, reject) => {
            try {
                // Validar que el carrito no esté vacío
                if (this.items.length === 0) {
                    reject(new Error('El carrito está vacío'));
                    return;
                }

                // Validar datos del cliente
                if (!orderData.customerName || !orderData.customerPhone) {
                    reject(new Error('Faltan datos obligatorios del cliente'));
                    return;
                }

                // Crear orden con ID único
                const orderId = `ETER-${Date.now()}`;
                const order = {
                    id: orderId,
                    items: [...this.items],
                    total: this.total,
                    subtotal: this.subtotal,
                    profit: this.profit,
                    customer: {
                        name: orderData.customerName,
                        phone: orderData.customerPhone,
                        address: orderData.customerAddress,
                        deliveryMethod: orderData.deliveryMethod,
                        deliveryTime: orderData.deliveryTime,
                        paymentMethod: orderData.paymentMethod
                    },
                    date: new Date().toISOString(),
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };

                // Guardar orden en localStorage
                this.saveOrder(order);

                // Enviar por WhatsApp
                const whatsappSent = this.sendToWhatsApp(orderData);

                if (whatsappSent) {
                    // Limpiar carrito automáticamente después del envío exitoso
                    this.items = [];
                    this.saveToStorage();
                    this.updateDisplay();
                    this.showNotification('✅ Pedido enviado exitosamente. Carrito vaciado.', 'success');
                    resolve(order);
                } else {
                    reject(new Error('Error enviando pedido por WhatsApp'));
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Guardar orden en localStorage
     */
    saveOrder(order) {
        try {
            const orders = JSON.parse(localStorage.getItem('eterStore_orders')) || [];
            orders.push(order);
            localStorage.setItem('eterStore_orders', JSON.stringify(orders));
            console.log('Orden guardada:', order.id);
    } catch (error) {
            console.error('Error guardando orden:', error);
        }
    }

    /**
     * Mostrar notificación
     */
    showNotification(message, type = 'info') {
        // Usar el sistema de notificaciones existente si está disponible
        if (window.ProductManager && window.ProductManager.showNotification) {
            window.ProductManager.showNotification(message, type);
        } else {
            // Notificación básica
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    /**
     * Obtener resumen del carrito
     */
    getCartSummary() {
        return {
            items: this.items,
            total: this.total,
            subtotal: this.subtotal,
            profit: this.profit,
            itemCount: this.items.reduce((total, item) => total + item.quantity, 0)
        };
    }

    /**
     * Exportar carrito
     */
    exportCart() {
        return {
            items: this.items,
            summary: this.getCartSummary(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Importar carrito
     */
    importCart(cartData) {
        if (cartData && cartData.items && Array.isArray(cartData.items)) {
            this.items = cartData.items;
            this.saveToStorage();
            this.updateDisplay();
            return true;
        }
        return false;
    }

    /**
     * Funciones para manejo de pasos del checkout
     */
    nextStep() {
        const deliveryStep = document.getElementById('deliveryStep');
        const customerStep = document.getElementById('customerStep');
        const addressGroup = document.getElementById('addressGroup');
        
        // Validar selección de método de entrega
        const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked');
        if (!deliveryMethod) {
            this.showNotification('❌ Por favor selecciona un método de entrega', 'error');
            return;
        }

        // Mostrar/ocultar campo de dirección según el método
        if (deliveryMethod.value === 'pickup') {
            addressGroup.style.display = 'none';
            document.getElementById('customerAddress').required = false;
        } else {
            addressGroup.style.display = 'block';
            document.getElementById('customerAddress').required = true;
        }

        // Cambiar al siguiente paso
        deliveryStep.classList.remove('active');
        customerStep.classList.add('active');
    }

    prevStep() {
        const deliveryStep = document.getElementById('deliveryStep');
        const customerStep = document.getElementById('customerStep');
        
        deliveryStep.classList.add('active');
        customerStep.classList.remove('active');
    }

    resetCheckoutSteps() {
        const deliveryStep = document.getElementById('deliveryStep');
        const customerStep = document.getElementById('customerStep');
        const addressGroup = document.getElementById('addressGroup');
        
        deliveryStep.classList.add('active');
        customerStep.classList.remove('active');
        addressGroup.style.display = 'block';
        document.getElementById('customerAddress').required = true;
    }
}

// Funciones globales para los botones del checkout
function nextStep() {
    if (window.cart) {
        window.cart.nextStep();
    }
}

function prevStep() {
    if (window.cart) {
        window.cart.prevStep();
    }
}

// Inicializar carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new CompleteShoppingCart();
    
    // Verificar que el contador se inicialice correctamente
    setTimeout(() => {
        if (window.cart) {
            window.cart.updateCartCount();
            console.log('🛒 Carrito inicializado y contador actualizado');
            
            // Forzar visibilidad del contador para testing
            const cartCount = document.getElementById('cartCount');
            if (cartCount) {
                console.log('🔍 Elemento cartCount encontrado:', cartCount);
                console.log('🔍 Estilos actuales:', {
                    display: cartCount.style.display,
                    visibility: cartCount.style.visibility,
                    opacity: cartCount.style.opacity,
                    textContent: cartCount.textContent
                });
            }
        }
    }, 1000);
});

// Exportar para uso global
window.CompleteShoppingCart = CompleteShoppingCart;