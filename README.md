# Éter Store - Plataforma de Calzados para Revendedores

Una plataforma completa de e-commerce diseñada específicamente para revendedores de calzados, con funcionalidades avanzadas de gestión de inventario, cálculo de márgenes de ganancia e integración con WhatsApp.

## 🚀 Características Principales

### 1. Catálogo Online para Revendedores
- **Sección exclusiva de productos** de calzado optimizada para distribuidores
- **Selección obligatoria de talla** al agregar productos al carrito
- **Campo de margen de ganancia** personalizable por producto
- **Cálculo automático de precios** (mayorista, ganancia, precio final)

### 2. Panel de Administración Completo
- **Dashboard independiente** con estadísticas en tiempo real
- **Acceso seguro** con credenciales predeterminadas
- **Gestión de contenido** de la sección Hero
- **Administración de inventario** de productos
- **Gestión de pedidos** con estados personalizables
- **Edición de contenido** general de la tienda

### 3. Carrito de Compras Avanzado
- **Resumen detallado** con precios mayoristas y finales
- **Cálculo automático** de ganancias del revendedor
- **Gestión de tallas** y cantidades
- **Interfaz optimizada** para revendedores

### 4. Proceso de Pedido Integrado con WhatsApp
- **Formulario completo** con datos del cliente
- **Selección de método de entrega** (envío o recoger en showroom)
- **Rango horario disponible** para entrega
- **Métodos de pago** (efectivo/transferencia)
- **Envío automático** por WhatsApp con resumen completo

## 📋 Estructura del Proyecto

```
Tienda Éter/
├── index.html              # Página principal de la tienda
├── admin.html              # Panel de administración
├── js/
│   ├── main.js             # Funcionalidades principales
│   ├── products.js         # Gestión de productos
│   ├── cart.js             # Carrito de compras
│   └── admin.js            # Panel de administración
├── styles/
│   ├── main.css            # Estilos principales
│   ├── responsive.css      # Diseño responsivo
│   └── admin.css           # Estilos del panel admin
└── images/
    ├── hero/               # Imágenes de la sección hero
    └── products/           # Imágenes de productos
```

## 🔧 Instalación y Configuración

### Requisitos
- Navegador web moderno
- Servidor web local (opcional, para desarrollo)

### Instalación
1. Clona o descarga el proyecto
2. Abre `index.html` en tu navegador
3. Para el panel de administración, accede a `admin.html`

### Credenciales de Administración
- **Usuario:** `admin`
- **Contraseña:** `eterstore2024`

## 🛍️ Funcionalidades del Catálogo

### Para Revendedores
1. **Navegación por productos** con filtros por categoría
2. **Selección de talla** obligatoria (36-45)
3. **Configuración de margen de ganancia** (0-100%)
4. **Vista previa de precios** (mayorista y final)
5. **Carrito persistente** con localStorage

### Gestión de Productos
- Información completa: nombre, descripción, precio, stock
- Categorías: deportivo, casual, formal, verano, invierno, urbano
- Sistema de rating y reseñas
- Control de inventario en tiempo real

## 🛒 Carrito de Compras

### Características Especiales
- **Identificación única** por producto-talla
- **Cálculo automático** de precios mayoristas y finales
- **Resumen detallado** con ganancias del revendedor
- **Gestión de cantidades** con validación de stock

### Flujo de Compra
1. Seleccionar producto y talla
2. Configurar margen de ganancia
3. Agregar al carrito
4. Revisar resumen de precios
5. Completar formulario de cliente
6. Envío automático por WhatsApp

## 📱 Integración con WhatsApp

### Mensaje Automático
El sistema genera un mensaje completo que incluye:
- **Datos del cliente** (nombre, teléfono, dirección)
- **Información de entrega** (método, horario)
- **Lista detallada de productos** con tallas y precios
- **Resumen financiero** (mayorista, ganancia, final)
- **ID único del pedido** y fecha

### Formato del Mensaje
```
🛍️ NUEVO PEDIDO - ÉTER STORE

📋 Detalles del Cliente:
• Nombre: [Cliente]
• Teléfono: [Teléfono]
• Dirección: [Dirección]

🚚 Información de Entrega:
• Método: [Envío/Showroom]
• Horario: [Rango horario]
• Pago: [Efectivo/Transferencia]

📦 Productos:
• [Producto] (Talla [X]) - Cantidad: [X] - Precio: [€X.XX]

💰 Resumen de Precios:
• Precio Mayorista: [€X.XX]
• Ganancia del Revendedor: [€X.XX]
• Precio Final al Cliente: [€X.XX]

🆔 ID del Pedido: [XXXXX]
📅 Fecha: [DD/MM/YYYY]
```

## 🔐 Panel de Administración

### Dashboard
- **Estadísticas en tiempo real**:
  - Total de productos
  - Pedidos pendientes
  - Ventas del mes
  - Clientes nuevos
- **Últimos pedidos** con estado
- **Productos con bajo stock**

### Gestión de Contenido
- **Sección Hero**: título, subtítulo, botones, imagen
- **Información de contacto**: teléfono, email, dirección
- **Sección Nosotros**: título y descripción
- **Redes sociales**: Facebook, Instagram, WhatsApp

### Gestión de Productos
- **CRUD completo** de productos
- **Control de inventario** en tiempo real
- **Categorización** y organización
- **Gestión de imágenes** y descripciones

### Gestión de Pedidos
- **Vista de todos los pedidos** con filtros
- **Estados personalizables**: pendiente, confirmado, enviado, entregado, cancelado
- **Detalles completos** de cada pedido
- **Historial** de cambios de estado

## 🎨 Diseño y UX

### Características de Diseño
- **Interfaz moderna** y profesional
- **Diseño responsivo** para todos los dispositivos
- **Paleta de colores** elegante (dorado y negro)
- **Tipografías** premium (Playfair Display + Inter)
- **Animaciones suaves** y transiciones

### Experiencia de Usuario
- **Navegación intuitiva** y clara
- **Feedback visual** para todas las acciones
- **Validación de formularios** en tiempo real
- **Notificaciones** informativas
- **Carga optimizada** de imágenes

## 🔧 Personalización

### Configuración de Productos
- Agregar/editar productos desde el panel admin
- Configurar categorías y precios
- Gestionar stock y disponibilidad
- Subir imágenes personalizadas

### Configuración de Contenido
- Personalizar sección hero
- Editar información de contacto
- Modificar descripción de la empresa
- Configurar enlaces de redes sociales

### Configuración de WhatsApp
- Cambiar número de WhatsApp en `js/cart.js`
- Personalizar formato del mensaje
- Agregar información adicional al pedido

## 📊 Almacenamiento de Datos

### localStorage
- **Productos**: `eterStore_products`
- **Pedidos**: `eterStore_orders`
- **Contenido Hero**: `eterStore_hero`
- **Contenido Tienda**: `eterStore_content`
- **Sesión Admin**: `eterStore_admin_logged_in`

### Estructura de Datos
```javascript
// Producto
{
  id: number,
  name: string,
  description: string,
  price: number,
  image: string,
  category: string,
  stock: number,
  rating: number,
  reviews: number
}

// Pedido
{
  id: number,
  items: Array,
  wholesaleTotal: number,
  finalTotal: number,
  customer: Object,
  date: string,
  status: string
}
```

## 🚀 Funcionalidades Futuras

### Mejoras Planificadas
- **Sistema de usuarios** con perfiles de revendedor
- **Historial de pedidos** por revendedor
- **Dashboard personalizado** por usuario
- **Sistema de notificaciones** push
- **Integración con más plataformas** de mensajería
- **Sistema de cupones** y descuentos
- **Reportes avanzados** de ventas
- **API REST** para integraciones externas

## 📞 Soporte

### Contacto
- **Email**: info@eterstore.com
- **WhatsApp**: +54 223 123 4567
- **Showroom**: Zona Jara y Berutti, Mar del Plata

### Documentación Técnica
- **Código comentado** para fácil mantenimiento
- **Estructura modular** para escalabilidad
- **Estándares web** modernos
- **Compatibilidad** con navegadores actuales

## 📄 Licencia

Este proyecto está desarrollado para Éter Store. Todos los derechos reservados.

---

**Éter Store** - Calzados Premium para Revendedores 🛍️ 