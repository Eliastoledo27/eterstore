# Guía de Gestión de Sesiones - Éter Store

## Implementación de "Mantener Sesión Iniciada"

### Características Implementadas

#### 1. Checkbox "Mantener sesión iniciada"
- **Ubicación**: Formulario de login en `admin.html`
- **Funcionalidad**: Permite al usuario elegir entre sesión estándar (24h) o extendida (30 días)
- **Diseño**: Checkbox personalizado con estilos modernos y accesibles

#### 2. Sistema de Tokens Seguros
- **Session Token**: Almacenado en `sessionStorage` (memoria)
- **Refresh Token**: Almacenado en cookie segura (solo para sesiones extendidas)
- **Generación**: Tokens únicos de 64 caracteres usando `crypto.getRandomValues()`

#### 3. Configuración de Seguridad
```javascript
const SESSION_CONFIG = {
    DEFAULT_DURATION: 24 * 60 * 60 * 1000, // 24 horas
    REMEMBER_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 días
    TOKEN_REFRESH_THRESHOLD: 60 * 60 * 1000 // 1 hora antes de expirar
};
```

### Implementación Técnica

#### Almacenamiento Seguro de Tokens

**Session Token (Access Token)**:
- Almacenado en `sessionStorage` (memoria)
- Se elimina automáticamente al cerrar la pestaña/navegador
- Protegido contra ataques XSS

**Refresh Token**:
- Almacenado en cookie con atributos de seguridad:
  - `HttpOnly`: Impide acceso desde JavaScript
  - `Secure`: Solo se envía por HTTPS (cuando esté disponible)
  - `SameSite=Strict`: Previene ataques CSRF
  - `Path=/`: Limitado al dominio actual

#### Funciones Principales

```javascript
// Generar tokens de sesión
function generateSessionTokens(rememberSession = false)

// Validar sesión actual
function validateSession()

// Limpiar sesión
function clearSession()

// Monitoreo de sesión
function startSessionMonitoring()

// Manejo de expiración
function handleSessionExpiration()
```

### Flujo de Autenticación

1. **Login Inicial**:
   - Usuario ingresa credenciales
   - Marca/desmarca "Mantener sesión iniciada"
   - Se generan tokens únicos
   - Refresh token se almacena en cookie (solo si rememberSession = true)

2. **Validación de Sesión**:
   - Verificación cada 5 minutos
   - Renovación automática de tokens cuando sea necesario
   - Limpieza automática al expirar

3. **Notificaciones de Expiración**:
   - Advertencia a los 30 minutos restantes
   - Alerta crítica a los 5 minutos restantes
   - Cierre automático al expirar

### Características de Seguridad

#### Protección contra Ataques

1. **XSS (Cross-Site Scripting)**:
   - Session tokens en memoria (sessionStorage)
   - Refresh tokens en cookies HttpOnly

2. **CSRF (Cross-Site Request Forgery)**:
   - Cookies con SameSite=Strict
   - Tokens únicos por sesión

3. **Session Hijacking**:
   - Tokens de 64 caracteres aleatorios
   - Renovación automática de tokens
   - Expiración configurable

#### Compatibilidad

- **Sesiones Anteriores**: Migración automática del sistema anterior
- **Navegadores**: Compatible con navegadores modernos
- **HTTPS**: Soporte automático cuando esté disponible

### Interfaz de Usuario

#### Elementos Visuales

1. **Checkbox Personalizado**:
   - Diseño moderno con animaciones
   - Texto explicativo sobre duración
   - Accesibilidad completa (ARIA labels)

2. **Información de Sesión**:
   - Mostrada en el header del dashboard
   - Tipo de sesión (estándar/extendida)
   - Tiempo restante en tiempo real

3. **Notificaciones**:
   - Mensajes informativos sobre duración
   - Advertencias de expiración
   - Confirmaciones de acciones

### Configuración y Personalización

#### Duración de Sesiones

```javascript
// Modificar en SESSION_CONFIG
DEFAULT_DURATION: 24 * 60 * 60 * 1000, // Sesión estándar
REMEMBER_DURATION: 30 * 24 * 60 * 60 * 1000, // Sesión extendida
```

#### Intervalos de Verificación

```javascript
// En startSessionMonitoring()
const sessionCheckInterval = setInterval(() => {
    // Verificación principal cada 5 minutos
}, 5 * 60 * 1000);

const expirationCheckInterval = setInterval(() => {
    // Verificación de expiración cada minuto
}, 60 * 1000);
```

### Mejores Prácticas Implementadas

1. **Seguridad**:
   - Tokens únicos y aleatorios
   - Almacenamiento seguro según tipo de token
   - Renovación automática

2. **Experiencia de Usuario**:
   - Notificaciones claras sobre duración
   - Advertencias de expiración
   - Limpieza automática de formularios

3. **Mantenibilidad**:
   - Código modular y reutilizable
   - Configuración centralizada
   - Logs de errores detallados

### Consideraciones de Privacidad

- **Cookies**: Solo se utilizan para refresh tokens cuando es necesario
- **Datos Personales**: No se almacenan datos sensibles en tokens
- **Limpieza**: Eliminación automática al cerrar sesión
- **Consentimiento**: Opción explícita del usuario para sesión extendida

### Monitoreo y Debugging

#### Logs de Desarrollo

```javascript
// Habilitar en desarrollo
console.log('Sesión creada:', sessionData);
console.log('Token renovado:', newTokens);
console.log('Sesión expirada:', error);
```

#### Métricas de Sesión

- Duración promedio de sesiones
- Tasa de renovación de tokens
- Frecuencia de expiraciones
- Uso de "Mantener sesión iniciada"

### Futuras Mejoras

1. **Autenticación Multi-Factor**:
   - Integración con 2FA
   - Tokens de backup

2. **Gestión de Dispositivos**:
   - Lista de dispositivos activos
   - Revocación de sesiones específicas

3. **Analytics de Seguridad**:
   - Detección de patrones sospechosos
   - Alertas de seguridad

4. **Integración con Backend**:
   - Validación en servidor
   - Blacklist de tokens
   - Auditoría de sesiones

---

**Nota**: Esta implementación cumple con los estándares de seguridad web modernos y proporciona una experiencia de usuario fluida y segura.



