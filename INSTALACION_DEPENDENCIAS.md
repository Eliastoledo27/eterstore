# 📦 Guía de Instalación de Dependencias - Éter Store

## 🎯 Resumen del Proyecto

**Éter Store** es una aplicación web frontend desarrollada con tecnologías nativas (HTML5, CSS3, JavaScript ES6+) que utiliza dependencias externas vía CDN y requiere herramientas de desarrollo para un entorno óptimo.

## 📋 Dependencias del Proyecto

### 🌐 Dependencias CDN (Ya incluidas)

Estas dependencias se cargan automáticamente desde CDN en los archivos HTML:

#### **Font Awesome 6.0.0**
- **URL**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`
- **Propósito**: Iconos para la interfaz de usuario
- **Archivos que lo usan**: `index.html`, `admin.html`, `productos.html`

#### **Google Fonts**
- **URL**: `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap`
- **Fuentes**: Playfair Display, Inter
- **Propósito**: Tipografías premium para el diseño
- **Archivos que lo usan**: `index.html`, `admin.html`

#### **Gemini AI API**
- **URL**: `https://generativelanguage.googleapis.com/v1beta/models`
- **Propósito**: Funcionalidad de asistente AI en el panel de administración
- **Archivos que lo usan**: `js/ai-service.js`, `js/ai-config.js`

### 🛠️ Dependencias de Desarrollo (Requeridas)

Para un entorno de desarrollo óptimo, necesitas instalar:

## 🚀 Instalación Paso a Paso

### **Paso 1: Instalar Node.js**

1. **Descargar Node.js**:
   - Visita: https://nodejs.org/
   - Descarga la versión LTS (recomendada)
   - Ejecuta el instalador y sigue las instrucciones

2. **Verificar instalación**:
   ```bash
   node --version
   npm --version
   ```

### **Paso 2: Instalar Dependencias de Desarrollo**

```bash
# Navegar al directorio del proyecto
cd "d:\Tienda Éter"

# Instalar dependencias
npm install
```

### **Paso 3: Configurar Variables de Entorno (Opcional)**

Para la funcionalidad AI, crea un archivo `.env` (opcional):

```env
# API Key para Gemini AI (opcional - se puede configurar en el admin)
GEMINI_API_KEY=tu_api_key_aqui

# Configuración de seguridad
MAX_REQUESTS_PER_MINUTE=50
BLOCK_DURATION=300000
```

## 🎮 Comandos Disponibles

Una vez instaladas las dependencias:

```bash
# Iniciar servidor de desarrollo
npm start
# o
npm run dev

# Abrir directamente el panel de administración
npm run admin

# Abrir página de productos
npm run productos

# Verificar código con ESLint
npm run lint

# Formatear código con Prettier
npm run format
```

## 🌐 Alternativas Sin Node.js

Si no puedes instalar Node.js, puedes usar:

### **Opción 1: Python (si está disponible)**
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

### **Opción 2: Extensión Live Server (VS Code)**
1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

### **Opción 3: Servidor Web Local**
Cualquier servidor web que pueda servir archivos estáticos:
- XAMPP
- WAMP
- MAMP
- IIS

## 📁 Estructura del Proyecto

```
Éter Store/
├── 📄 index.html              # Página principal
├── 📄 admin.html              # Panel de administración
├── 📄 productos.html          # Página de productos
├── 📄 package.json            # Configuración de dependencias
├── 📁 js/                     # Scripts JavaScript
│   ├── main.js               # Funcionalidad principal
│   ├── products.js           # Gestión de productos
│   ├── cart.js               # Sistema de carrito
│   ├── admin.js              # Panel de administración
│   ├── ai-service.js         # Servicio de AI
│   ├── ai-config.js          # Configuración de AI
│   └── security.js           # Seguridad
├── 📁 styles/                 # Hojas de estilo
│   ├── main.css              # Estilos principales
│   ├── admin.css             # Estilos del admin
│   └── responsive.css        # Diseño responsivo
├── 📁 images/                 # Recursos gráficos
└── 📁 docs/                   # Documentación
```

## ✅ Verificación de Instalación

Para verificar que todo está funcionando correctamente:

1. **Ejecutar el servidor**:
   ```bash
   npm start
   ```

2. **Abrir en el navegador**:
   - Página principal: `http://localhost:3000`
   - Panel admin: `http://localhost:3000/admin.html`
   - Productos: `http://localhost:3000/productos.html`

3. **Verificar funcionalidades**:
   - ✅ Navegación entre páginas
   - ✅ Carrito de compras
   - ✅ Panel de administración
   - ✅ Gestión de productos
   - ✅ Responsive design

## 🔧 Solución de Problemas

### **Error: 'npm' no se reconoce**
- **Solución**: Instalar Node.js desde https://nodejs.org/
- **Verificar**: Reiniciar terminal después de la instalación

### **Error: Puerto 3000 en uso**
```bash
# Usar puerto diferente
npx live-server --port=8080
```

### **Error: CORS al cargar archivos**
- **Causa**: Abrir archivos HTML directamente en el navegador
- **Solución**: Usar servidor local (npm start)

### **Problemas con CDN**
- **Verificar**: Conexión a internet
- **Alternativa**: Descargar dependencias localmente si es necesario

## 📞 Soporte

Si encuentras problemas durante la instalación:

- **Email**: soporte@eterstore.com
- **Teléfono**: +54 223 502 5196
- **Documentación**: Revisa los archivos `.md` en el proyecto

## 🔄 Actualizaciones

Para mantener las dependencias actualizadas:

```bash
# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias
npm update

# Auditar seguridad
npm audit
npm audit fix
```

---

**✨ ¡Éter Store está listo para funcionar!**

*Última actualización: Enero 2025*