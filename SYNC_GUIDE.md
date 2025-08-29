# Guía de Sincronización en Tiempo Real - Éter Store

## 🔄 Sistema de Sincronización

### Descripción General
El sistema de sincronización permite que los cambios realizados en el panel de administración se reflejen inmediatamente en la página principal, sin necesidad de recargar la página.

### Componentes del Sistema

#### 1. **Eventos Personalizados**
- `heroContentUpdated`: Se dispara cuando se actualiza el contenido hero
- `storeContentUpdated`: Se dispara cuando se actualiza el contenido de la tienda
- `productsUpdated`: Se dispara cuando se modifican los productos

#### 2. **Almacenamiento Local**
- `eterStore_hero`: Contenido de la sección hero
- `eterStore_content`: Contenido general de la tienda
- `eterStore_products`: Lista de productos
- `eterStore_orders`: Pedidos realizados

#### 3. **Listeners de Sincronización**
- **Storage Event**: Escucha cambios en localStorage entre pestañas
- **Custom Events**: Escucha eventos personalizados en la misma pestaña
- **Focus Event**: Sincroniza al volver a la pestaña

## 🛠️ Funcionamiento Técnico

### Flujo de Sincronización

1. **Usuario hace cambios en el panel de administración**
2. **Se guarda en localStorage**
3. **Se dispara evento personalizado**
4. **La página principal escucha el evento**
5. **Se actualiza el contenido inmediatamente**

### Código de Implementación

#### Panel de Administración (admin.js)
```javascript
// Al guardar contenido hero
localStorage.setItem('eterStore_hero', JSON.stringify(heroContent));
window.dispatchEvent(new CustomEvent('heroContentUpdated', {
    detail: heroContent
}));
```

#### Página Principal (main.js)
```javascript
// Escuchar eventos de sincronización
window.addEventListener('heroContentUpdated', function(e) {
    loadHeroContent();
});
```

## 📋 Contenido Sincronizable

### Sección Hero
- **Título principal**: `.hero-title`
- **Subtítulo**: `.hero-subtitle`
- **Botón principal**: `.hero-buttons .btn-primary`
- **Botón secundario**: `.hero-buttons .btn-secondary`
- **Imagen**: `.hero-image img`

### Información de Contacto
- **Teléfono**: `.contact-info .contact-item:nth-child(2) p`
- **Email**: `.contact-info .contact-item:nth-child(3) p`
- **Dirección**: `.contact-info .contact-item:nth-child(1) p`

### Sección "Nosotros"
- **Título**: `.about-text h2`
- **Descripción**: `.about-text p:first-of-type`

### Redes Sociales
- **Facebook**: `.social-links a:first-child`
- **Instagram**: `.social-links a:nth-child(2)`
- **WhatsApp**: `.social-links a:last-child`

### Productos
- **Lista completa**: Se actualiza automáticamente
- **Stock**: Se refleja en tiempo real
- **Precios**: Se actualizan inmediatamente

## 🧪 Pruebas de Sincronización

### Botón de Prueba
En el panel de administración, sección Hero, hay un botón "Probar Sincronización" que:

1. **Cambia temporalmente** el contenido hero
2. **Muestra una notificación** de confirmación
3. **Restaura automáticamente** el contenido original después de 5 segundos

### Verificación Manual
1. Abre el panel de administración en una pestaña
2. Abre la página principal en otra pestaña
3. Haz cambios en el panel
4. Verifica que se reflejen inmediatamente en la página principal

## 🔧 Solución de Problemas

### Problemas Comunes

#### Los cambios no se reflejan
**Causa**: Eventos no se están disparando correctamente
**Solución**: 
- Verifica que no haya errores en la consola
- Asegúrate de que los archivos JS estén cargados
- Comprueba que localStorage esté habilitado

#### Sincronización lenta
**Causa**: Múltiples eventos se disparan simultáneamente
**Solución**:
- Los eventos están optimizados para evitar conflictos
- Cada cambio se procesa de forma independiente

#### Contenido no se actualiza
**Causa**: Selectores CSS incorrectos
**Solución**:
- Verifica que las clases CSS coincidan
- Comprueba la estructura del HTML
- Usa el botón de prueba para verificar

### Debugging

#### Verificar Eventos
```javascript
// En la consola del navegador
window.addEventListener('heroContentUpdated', function(e) {
    console.log('Evento hero recibido:', e.detail);
});
```

#### Verificar localStorage
```javascript
// En la consola del navegador
console.log('Hero content:', localStorage.getItem('eterStore_hero'));
console.log('Store content:', localStorage.getItem('eterStore_content'));
```

#### Verificar Selectores
```javascript
// En la consola del navegador
console.log('Hero title:', document.querySelector('.hero-title'));
console.log('About title:', document.querySelector('.about-text h2'));
```

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Funcionalidades Requeridas
- ✅ localStorage
- ✅ CustomEvent
- ✅ addEventListener
- ✅ querySelector

## 🚀 Optimizaciones

### Performance
- **Eventos optimizados**: Solo se disparan cuando es necesario
- **Selectores eficientes**: Uso de selectores CSS específicos
- **Debouncing**: Evita múltiples actualizaciones simultáneas

### Memoria
- **Cleanup automático**: Los listeners se limpian correctamente
- **Sin memory leaks**: Eventos se remueven cuando es necesario

### UX
- **Actualizaciones suaves**: Sin parpadeos o saltos
- **Feedback visual**: Notificaciones de confirmación
- **Fallback**: Funciona sin JavaScript (con recarga)

## 📚 Referencias

### Eventos del Sistema
- [CustomEvent MDN](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
- [localStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Storage Event MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)

### Mejores Prácticas
- **Separación de responsabilidades**: Cada componente maneja su propia sincronización
- **Eventos desacoplados**: Los componentes no dependen directamente entre sí
- **Fallback graceful**: El sistema funciona incluso si falla la sincronización

---

**Éter Store** - Sincronización en Tiempo Real 🔄
*Mantén tu tienda actualizada automáticamente* 