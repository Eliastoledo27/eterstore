# Guía del Panel de Administración - Éter Store

## 🔐 Acceso al Panel

### Credenciales de Acceso
- **URL**: `admin.html`
- **Usuario**: `admin`
- **Contraseña**: `eterstore2024`

### Acceso Rápido
- Desde la página principal: Haz clic en el ícono de engranaje (⚙️) en la barra de navegación
- Desde el footer: Enlace "Panel de Administración"

## 📊 Dashboard Principal

### Estadísticas en Tiempo Real
- **Total Productos**: Número total de productos en el catálogo
- **Pedidos Pendientes**: Pedidos que requieren atención
- **Ventas del Mes**: Total de ventas del mes actual
- **Clientes Nuevos**: Nuevos clientes del mes actual

### Secciones Informativas
- **Últimos Pedidos**: Los 5 pedidos más recientes con estado
- **Productos con Bajo Stock**: Productos con stock ≤ 5 unidades

## 🛍️ Gestión de Productos

### Vista de Productos
La tabla muestra:
- **ID**: Identificador único del producto
- **Imagen**: Vista previa de la imagen del producto
- **Nombre y Descripción**: Información básica del producto
- **Categoría**: Badge con la categoría del producto
- **Precio**: Precio mayorista del producto
- **Stock**: Indicador visual del stock disponible
- **Rating**: Estrellas y número de reseñas
- **Acciones**: Botones para editar y eliminar

### Agregar Nuevo Producto
1. Haz clic en "Agregar Producto"
2. Completa todos los campos requeridos:
   - **Nombre**: Nombre del producto
   - **Categoría**: Selecciona la categoría apropiada
   - **Descripción**: Descripción detallada del producto
   - **Precio**: Precio mayorista (sin decimales)
   - **Stock**: Cantidad disponible
   - **Imagen**: URL de la imagen del producto
   - **Rating**: Calificación de 0 a 5
   - **Reseñas**: Número de reseñas
3. Haz clic en "Guardar Producto"

### Editar Producto
1. Haz clic en el botón de editar (✏️) en la fila del producto
2. Modifica los campos necesarios
3. Haz clic en "Guardar Producto"

### Eliminar Producto
1. Haz clic en el botón de eliminar (🗑️) en la fila del producto
2. Confirma la eliminación
3. El producto se eliminará permanentemente

### Categorías Disponibles
- **Deportivo**: Zapatillas y calzado deportivo
- **Casual**: Calzado informal y cómodo
- **Formal**: Zapatos elegantes y de vestir
- **Verano**: Sandalias y calzado de verano
- **Invierno**: Botas y calzado de invierno
- **Urbano**: Calzado urbano y moderno

## 📋 Gestión de Pedidos

### Vista de Pedidos
La tabla muestra:
- **ID**: Identificador único del pedido
- **Cliente**: Nombre del cliente
- **Productos**: Número de productos en el pedido
- **Total**: Precio final del pedido
- **Estado**: Badge con el estado actual
- **Fecha**: Fecha de creación del pedido
- **Acciones**: Ver detalles y cambiar estado

### Estados de Pedidos
- **Pendiente**: Pedido recibido, pendiente de confirmación
- **Confirmado**: Pedido confirmado por el administrador
- **Enviado**: Pedido enviado al cliente
- **Entregado**: Pedido entregado exitosamente
- **Cancelado**: Pedido cancelado

### Cambiar Estado
1. Haz clic en el botón de editar estado
2. El estado cambiará automáticamente al siguiente en la secuencia
3. Se mostrará una notificación de confirmación

### Ver Detalles del Pedido
1. Haz clic en el botón de ver detalles (👁️)
2. Se abrirá un modal con información completa:
   - Datos del cliente
   - Información de entrega
   - Lista detallada de productos
   - Precios mayoristas y finales

### Filtrar Pedidos
- Usa el selector "Todos los Estados" para filtrar por estado
- Selecciona "Todos los Estados" para ver todos los pedidos

## 🎨 Gestión de Contenido

### Sección Hero
Personaliza la sección principal de la página:
- **Título Principal**: Título destacado de la página
- **Subtítulo**: Descripción del mensaje principal
- **Botones de Acción**: Texto y enlaces de los botones
- **Imagen Hero**: URL de la imagen principal

### Información de Contacto
- **Teléfono**: Número de teléfono de contacto
- **Email**: Dirección de correo electrónico
- **Dirección**: Dirección del showroom

### Sección Nosotros
- **Título**: Título de la sección "Quiénes Somos"
- **Descripción**: Texto descriptivo de la empresa

### Redes Sociales
- **Facebook**: URL del perfil de Facebook
- **Instagram**: URL del perfil de Instagram
- **WhatsApp**: Número de WhatsApp

## 🔄 Sincronización en Tiempo Real

### Cambios Automáticos
- Los cambios realizados en el panel se reflejan inmediatamente en la página principal
- Los productos agregados, editados o eliminados se actualizan automáticamente
- El contenido modificado se aplica instantáneamente

### Almacenamiento Local
- Todos los datos se guardan en el navegador (localStorage)
- Los cambios persisten entre sesiones
- No se requiere conexión a internet para funcionar

## 🎯 Funcionalidades Avanzadas

### Notificaciones
- **Éxito**: Operaciones completadas correctamente
- **Error**: Errores en las operaciones
- **Información**: Mensajes informativos

### Validación de Datos
- Campos requeridos marcados con asterisco (*)
- Validación de formatos de email y teléfono
- Prevención de datos duplicados

### Responsive Design
- Panel optimizado para dispositivos móviles
- Navegación adaptativa
- Tablas con scroll horizontal en pantallas pequeñas

## 🔧 Configuración Avanzada

### Personalización de Colores
Los colores del panel siguen la paleta de la tienda:
- **Dorado Principal**: #d4af37
- **Dorado Secundario**: #b8941f
- **Negro Principal**: #1a1a1a
- **Negro Secundario**: #2d2d2d

### Configuración de WhatsApp
Para cambiar el número de WhatsApp:
1. Edita el archivo `js/cart.js`
2. Busca la línea: `const whatsappNumber = '+54 223 123 4567';`
3. Cambia el número por el deseado

### Backup de Datos
Los datos se almacenan en:
- **Productos**: `eterStore_products`
- **Pedidos**: `eterStore_orders`
- **Contenido Hero**: `eterStore_hero`
- **Contenido Tienda**: `eterStore_content`

## 🚨 Solución de Problemas

### Problemas Comunes

#### No puedo acceder al panel
- Verifica las credenciales: usuario `admin`, contraseña `eterstore2024`
- Asegúrate de que el archivo `admin.html` esté en la misma carpeta que `index.html`

#### Los cambios no se reflejan
- Recarga la página principal después de hacer cambios
- Verifica que no haya errores en la consola del navegador
- Asegúrate de que localStorage esté habilitado

#### Los productos no se cargan
- Verifica que el archivo `js/products.js` esté incluido
- Comprueba que no haya errores de JavaScript
- Intenta limpiar el localStorage y recargar

#### Problemas de diseño
- Verifica que todos los archivos CSS estén cargados
- Comprueba la compatibilidad del navegador
- Asegúrate de que las fuentes estén disponibles

### Contacto de Soporte
- **Email**: info@eterstore.com
- **WhatsApp**: +54 223 123 4567

## 📈 Mejores Prácticas

### Gestión de Productos
- Mantén las descripciones claras y atractivas
- Usa imágenes de alta calidad
- Actualiza regularmente el stock
- Organiza los productos por categorías

### Gestión de Pedidos
- Revisa los pedidos pendientes diariamente
- Actualiza el estado de los pedidos regularmente
- Mantén comunicación con los clientes
- Documenta cualquier problema o cancelación

### Contenido
- Mantén la información de contacto actualizada
- Revisa y actualiza el contenido regularmente
- Asegúrate de que los enlaces funcionen correctamente
- Mantén la coherencia en el tono y estilo

---

**Éter Store** - Panel de Administración 🛍️
*Gestiona tu tienda de manera eficiente y profesional* 