# Guía de Importación XML - Éter Store

## Descripción

Esta funcionalidad permite importar catálogos de productos en formato XML directamente desde el panel de administración de Éter Store. Los productos importados se integran automáticamente en el sistema y se muestran tanto en `admin.html` como en `productos.html`.

## Características

- ✅ **Botón de importación integrado**: Ubicado en la sección de productos del panel de administración
- ✅ **Compatibilidad con múltiples formatos**: Soporta diferentes estructuras de XML
- ✅ **Validación automática**: Verifica que el archivo XML sea válido antes de procesar
- ✅ **Sincronización en tiempo real**: Los productos se actualizan automáticamente en todas las páginas
- ✅ **Manejo de duplicados**: Actualiza productos existentes o agrega nuevos según corresponda
- ✅ **Notificaciones informativas**: Muestra el resultado de la importación con detalles

## Uso

### 1. Acceder al Panel de Administración

1. Navega a `admin.html`
2. Inicia sesión con las credenciales de administrador
3. Ve a la sección "Productos"

### 2. Importar Catálogo XML

1. Busca el botón verde **"Importar XML"** en la parte superior derecha
2. Haz clic en el botón para abrir el selector de archivos
3. Selecciona tu archivo XML con el catálogo
4. El sistema procesará automáticamente el archivo

### 3. Verificar Importación

- Los productos importados aparecerán inmediatamente en la tabla de productos
- Recibirás una notificación con el número de productos agregados/actualizados
- Los productos se mostrarán automáticamente en `productos.html`

## Formato XML Soportado

### Estructura Básica

```xml
<?xml version="1.0" encoding="UTF-8"?>
<catalogo>
    <nombre>Nombre del Catálogo</nombre>
    <fecha>2024-12-19T10:30:00Z</fecha>
    <productos>
        <producto>
            <nombre>Nombre del Producto</nombre>
            <talle>42</talle>
            <precio>125000</precio>
            <categoria>deportivo</categoria>
            <imagen>ruta/a/imagen.svg</imagen>
            <descripcion>Descripción del producto</descripcion>
            <stock>15</stock>
            <rating>4.8</rating>
            <reviews>89</reviews>
        </producto>
        <!-- Más productos... -->
    </productos>
</catalogo>
```

### Campos Obligatorios

- `nombre`: Nombre del producto
- `precio`: Precio en pesos argentinos (número)

### Campos Opcionales

- `talle`: Talla del producto
- `categoria`: Categoría (deportivo, casual, formal, verano, invierno, urbano)
- `imagen`: Ruta a la imagen del producto
- `descripcion`: Descripción detallada
- `stock`: Cantidad en stock (por defecto: 10)
- `rating`: Valoración de 0 a 5 (por defecto: 4.5)
- `reviews`: Número de reseñas (por defecto: 0)

### Formatos Alternativos Soportados

El sistema también acepta estas etiquetas alternativas:

- **Nombres**: `name`, `title`, `titulo`
- **Categorías**: `category`, `tipo`, `type`
- **Precios**: `price`, `cost`, `costo`
- **Descripciones**: `description`, `desc`
- **Imágenes**: `image`, `img`, `photo`
- **Tallas**: `talla`, `size`, `tamaño`
- **Stock**: `quantity`, `cantidad`
- **Valoraciones**: `valoracion`, `puntuacion`
- **Reseñas**: `reseñas`, `comentarios`

## Mapeo de Categorías

Las categorías del XML se mapean automáticamente a las categorías del sistema:

- `ropa` → `casual`
- `accesorios` → `casual`
- `calzado` → `casual`
- `deportivo` → `deportivo`
- `formal` → `formal`
- `casual` → `casual`
- `verano` → `verano`
- `invierno` → `invierno`
- `urbano` → `urbano`
- `otros` → `casual`

## Archivo de Ejemplo

Se incluye un archivo `ejemplo-catalogo-eter.xml` que muestra la estructura correcta y puede usarse para pruebas.

## Funcionalidades Adicionales

### Exportación XML

También puedes exportar el catálogo actual a formato XML usando el botón **"Exportar"** en el panel de administración.

### Manejo de Duplicados

- Si un producto con el mismo nombre ya existe, se actualizará con los nuevos datos
- Si es un producto nuevo, se agregará al catálogo
- Se mantiene un registro de cuántos productos fueron agregados vs. actualizados

### Validación de Datos

- Se valida que cada producto tenga al menos nombre y precio
- Los precios se convierten automáticamente a números
- Las valoraciones se limitan entre 0 y 5
- Se generan automáticamente slugs SEO para cada producto

## Solución de Problemas

### Error: "Error al parsear el archivo XML"

- Verifica que el archivo tenga una estructura XML válida
- Asegúrate de que todas las etiquetas estén correctamente cerradas
- Revisa que no haya caracteres especiales sin codificar

### Error: "No se encontraron productos válidos"

- Verifica que existan etiquetas `<producto>` en el XML
- Asegúrate de que cada producto tenga al menos `nombre` y `precio`
- Revisa que los nombres de las etiquetas coincidan con los soportados

### Los productos no aparecen en productos.html

- Los productos se sincronizan automáticamente
- Recarga la página `productos.html` si es necesario
- Verifica que no haya errores en la consola del navegador

## Notas Técnicas

- Los productos importados se marcan como "Nuevo Lanzamiento" automáticamente
- Se genera un ID único para cada producto importado
- Los datos se almacenan en localStorage para persistencia
- La sincronización funciona entre todas las pestañas abiertas

## Compatibilidad

Esta funcionalidad es compatible con:
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Archivos XML de cualquier tamaño (dentro de límites razonables)
- Múltiples formatos de estructura XML
- Integración completa con el sistema existente de Éter Store



