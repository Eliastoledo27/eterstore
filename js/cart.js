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
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Actualizar badge en modal
        const cartCountBadge = document.getElementById('cartCountBadge');
        if (cartCountBadge) {
            cartCountBadge.textContent = totalItems;
            cartCountBadge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
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
     * Renderizar item individual del carrito con subtotales
     */
    renderCartItem(item) {
        const itemKey = this.getItemKey(item.id, item.size);
        const itemSubtotal = item.finalPrice * item.quantity;
        
        return `
            <div class="cart-item" data-item-key="${itemKey}">
                <div class="cart-item-image">
                    ${this.getProductImage(item.image, item.name)}
                    ${item.stock <= 5 ? '<div class="low-stock-badge">Stock bajo</div>' : ''}
                </div>
                
                <div class="cart-item-content">
                    <div class="cart-item-header">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <button class="remove-item-btn" onclick="window.cart.removeItem(${item.id}, '${item.size}')" title="Remover producto">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="cart-item-details">
                        ${item.size ? `<span class="cart-item-size"><i class="fas fa-ruler"></i> Talla: ${item.size}</span>` : ''}
                        <span class="cart-item-category"><i class="fas fa-tag"></i> ${item.category}</span>
                    </div>
                    
                    <div class="cart-item-pricing">
                        <div class="price-row">
                            <span class="price-label">Precio unitario:</span>
                            <span class="price-amount unit-price">${this.formatPrice(item.finalPrice)}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-label">Cantidad:</span>
                            <span class="price-amount quantity">${item.quantity}</span>
                        </div>
                        ${this.items.length > 2 ? `
                        <div class="price-row subtotal">
                            <span class="price-label">Subtotal:</span>
                            <span class="price-amount item-subtotal">${this.formatPrice(itemSubtotal)}</span>
                        </div>
                        ` : ''}
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
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Actualizar resumen del carrito con totales
     */
    updateCartSummary() {
        const wholesaleTotalEl = document.getElementById('wholesaleTotal');
        const resellerProfitEl = document.getElementById('resellerProfit');
        const finalPriceEl = document.getElementById('finalPrice');
        const itemCountEl = document.getElementById('itemCount');

        if (wholesaleTotalEl) wholesaleTotalEl.textContent = this.formatPrice(this.subtotal);
        if (resellerProfitEl) resellerProfitEl.textContent = this.formatPrice(this.profit);
        if (finalPriceEl) finalPriceEl.textContent = this.formatPrice(this.total);
        
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        if (itemCountEl) itemCountEl.textContent = `${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}`;
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
     * Manejar envío del formulario de checkout
     */
    handleCheckoutSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const orderData = {
            customerName: formData.get('customerName')?.trim(),
            customerPhone: formData.get('customerPhone')?.trim(),
            customerAddress: formData.get('customerAddress')?.trim()
        };

        // Validar datos
        if (!orderData.customerName || !orderData.customerPhone || !orderData.customerAddress) {
            this.showNotification('❌ Por favor completa todos los campos obligatorios', 'error');
            return;
        }

        // Procesar orden
        this.processOrder(orderData)
            .then(order => {
                this.showNotification('✅ Pedido enviado exitosamente por WhatsApp', 'success');
                this.closeCheckout();
                e.target.reset();
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
                const unitPrice = this.formatPrice(item.finalPrice);
                
                // Formato exacto: • ${producto_1} (${talla_1}) x ${cantidad_1}
                //                   ↳ *$ ${precio_unitario_1}*
                return `• ${productName} (${size}) x ${quantity}\n  ↳ *$ ${unitPrice}*`;
            }).join('\n');

            // Calcular total del pedido con formato exacto
            const totalPedido = this.formatPrice(this.total);

            // Formato exacto según especificación
            return `✨ *¡Nuevo Pedido Recibido!* ✨
-----------------------------------
👤 *DATOS DEL CLIENTE*
• *Nombre:* ${orderData.customerName || 'No especificado'}
• *Teléfono:* ${orderData.customerPhone || 'No especificado'}
• *Dirección:* ${orderData.customerAddress || 'No especificado'}

🚚 *DETALLES DE ENTREGA*
• *Método:* Envío a domicilio
• *Horario:* Tarde (15:00)
• *Forma de pago:* Efectivo

🛍️ *PRODUCTOS*
${productsList}

💳 *TOTAL A PAGAR:* *$ ${totalPedido}*
-----------------------------------

📄 *ID del pedido:* \`${orderId}\`
🗓️ *Fecha:* ${formattedDate}
📍 *Éter Store*
Mar del Plata

¡Gracias por elegir *Éter Store*! Nos comunicaremos pronto para confirmar.`;

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

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${this.config.whatsappNumber}?text=${encodedMessage}`;
            
            const whatsappWindow = window.open(whatsappUrl, '_blank');
            
            if (!whatsappWindow) {
                throw new Error('No se pudo abrir WhatsApp. Verifica que no esté bloqueado por el navegador.');
            }

            localStorage.setItem('lastWhatsAppMessage', message);
            console.log('Pedido enviado por WhatsApp');
            
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
                if (!orderData.customerName || !orderData.customerPhone || !orderData.customerAddress) {
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
                        email: orderData.customerEmail || '',
                        address: orderData.customerAddress
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
                    // Limpiar carrito
                    this.clearCart();
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
}

// Inicializar carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new CompleteShoppingCart();
});

// Exportar para uso global
window.CompleteShoppingCart = CompleteShoppingCart; 