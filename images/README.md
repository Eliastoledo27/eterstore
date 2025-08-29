# Imágenes Optimizadas - Éter Store

Este directorio contiene todas las imágenes optimizadas para la tienda Éter Store, diseñadas para máxima calidad visual y rendimiento web.

## 📁 Estructura de Directorios

```
images/
├── hero/
│   └── hero-shoes.svg          # Imagen principal de la sección hero
├── products/
│   ├── running-shoes.svg       # Zapatillas Running Pro
│   ├── leather-boots.svg       # Botas de Cuero Premium
│   ├── summer-sandals.svg      # Sandalias de Verano
│   ├── formal-oxford.svg       # Zapatos Formales Oxford
│   ├── urban-sneakers.svg      # Tenis Urbanos
│   ├── classic-moccasins.svg   # Mocasines Clásicos
│   ├── training-shoes.svg      # Zapatillas de Entrenamiento
│   └── winter-boots.svg        # Botines de Invierno
└── README.md                   # Este archivo
```

## 🎨 Especificaciones de Diseño

### Paleta de Colores
- **Dorado Principal**: #d4af37
- **Dorado Secundario**: #b8941f
- **Negro Principal**: #1a1a1a
- **Negro Secundario**: #2d2d2d

### Formatos Utilizados
- **SVG**: Para todas las imágenes de productos y hero
- **Ventajas**: Escalables, ligeras, nítidas en cualquier resolución

## ⚡ Optimizaciones Implementadas

### 1. Lazy Loading
- Todas las imágenes de productos usan `loading="lazy"`
- La imagen hero usa `loading="eager"` para carga prioritaria
- Intersection Observer para carga inteligente

### 2. Preload de Imágenes Críticas
- La imagen hero se precarga para mejor rendimiento
- Optimización de Core Web Vitals

### 3. Responsive Design
- Imágenes adaptativas para diferentes tamaños de pantalla
- Breakpoints optimizados para móvil, tablet y desktop

### 4. Accesibilidad
- Atributos `alt` descriptivos para cada imagen
- Soporte para lectores de pantalla
- Contraste adecuado en elementos visuales

## 🚀 Mejores Prácticas Aplicadas

### Optimización de Rendimiento
- **Tamaño de archivo**: SVG optimizados para web
- **Compresión**: Sin pérdida de calidad
- **Caché**: Headers apropiados para caché del navegador

### Experiencia de Usuario
- **Transiciones suaves**: Animaciones de carga y hover
- **Fallbacks**: Manejo de errores de carga
- **Loading states**: Indicadores visuales de carga

### SEO
- **Nombres descriptivos**: Archivos con nombres significativos
- **Alt text**: Descripciones relevantes para motores de búsqueda
- **Estructura semántica**: Uso apropiado de elementos HTML

## 📱 Responsive Breakpoints

### Desktop (1200px+)
- Imágenes hero: 800x600px
- Imágenes productos: 400x300px

### Tablet (768px - 1199px)
- Imágenes hero: 600x450px
- Imágenes productos: 300x225px

### Mobile (< 768px)
- Imágenes hero: 400x300px
- Imágenes productos: 250x188px

## 🔧 Configuración Técnica

### Atributos HTML
```html
<!-- Imagen hero (crítica) -->
<img src="images/hero/hero-shoes.svg" alt="Éter Store - Calzados Premium" loading="eager">

<!-- Imagen producto (lazy loading) -->
<img src="images/products/running-shoes.svg" alt="Zapatillas Running Pro" loading="lazy">
```

### CSS Optimizaciones
```css
/* Optimización de imágenes */
img {
    max-width: 100%;
    height: auto;
    display: block;
}

/* Lazy loading */
img[loading="lazy"] {
    opacity: 0;
    transition: opacity 0.3s ease;
}

img[loading="lazy"].loaded {
    opacity: 1;
}
```

## 📊 Métricas de Rendimiento

### Tamaños de Archivo
- **Hero SVG**: ~8KB
- **Productos SVG**: ~3-5KB cada uno
- **Total**: ~40KB para todas las imágenes

### Tiempos de Carga Estimados
- **3G lento**: ~2-3 segundos
- **4G**: ~0.5-1 segundo
- **WiFi**: ~0.1-0.3 segundos

## 🛠️ Mantenimiento

### Agregar Nuevas Imágenes
1. Crear SVG optimizado con la paleta de colores de la marca
2. Agregar a la carpeta correspondiente
3. Actualizar el archivo `js/products.js`
4. Probar en diferentes dispositivos

### Optimización Continua
- Monitorear métricas de rendimiento
- Actualizar imágenes según feedback de usuarios
- Mantener consistencia visual en toda la tienda

## 📈 Monitoreo

### Herramientas Recomendadas
- **Google PageSpeed Insights**: Para métricas de rendimiento
- **Lighthouse**: Para auditorías completas
- **WebPageTest**: Para análisis detallado de carga

### Métricas a Monitorear
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FID (First Input Delay)**: < 100ms

---

**Éter Store** - Imágenes optimizadas para una experiencia premium
*Calidad visual sin comprometer el rendimiento* 