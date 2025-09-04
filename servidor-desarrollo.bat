@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 ÉTER STORE - SERVIDOR DE DESARROLLO    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Verificar si Node.js está instalado
echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Node.js detectado
    goto :nodejs_server
) else (
    echo ❌ Node.js no encontrado
    echo.
    echo 📋 Opciones disponibles:
    echo    1. Instalar Node.js (recomendado)
    echo    2. Usar servidor Python (si está disponible)
    echo    3. Usar servidor PHP (si está disponible)
    echo    4. Abrir con navegador (modo básico)
    echo.
    set /p choice="Selecciona una opción (1-4): "
    
    if "%choice%"=="1" goto :install_nodejs
    if "%choice%"=="2" goto :python_server
    if "%choice%"=="3" goto :php_server
    if "%choice%"=="4" goto :browser_mode
    
    echo ❌ Opción inválida
    pause
    exit /b 1
)

:nodejs_server
echo.
echo 🚀 Iniciando servidor Node.js...
echo 📍 URL: http://localhost:3000
echo 🔄 Presiona Ctrl+C para detener
echo.

:: Verificar si live-server está instalado
npx live-server --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Usando live-server (con recarga automática)
    npx live-server --port=3000 --open=/index.html
) else (
    echo ⚠️  live-server no encontrado, usando http-server básico
    npx http-server -p 3000 -o
)
goto :end

:install_nodejs
echo.
echo 📥 Abriendo página de descarga de Node.js...
start https://nodejs.org/es/download/
echo.
echo 📋 Instrucciones:
echo    1. Descarga Node.js LTS desde la página que se abrió
echo    2. Instala Node.js con las opciones por defecto
echo    3. Reinicia este script después de la instalación
echo.
pause
exit /b 0

:python_server
echo.
echo 🔍 Verificando Python...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Python detectado
    echo 🚀 Iniciando servidor Python...
    echo 📍 URL: http://localhost:8000
    echo 🔄 Presiona Ctrl+C para detener
    echo.
    start http://localhost:8000
    python -m http.server 8000
) else (
    echo ❌ Python no encontrado
    echo 📥 Abriendo página de descarga de Python...
    start https://www.python.org/downloads/
    echo.
    echo 📋 Instala Python y reinicia este script
    pause
)
goto :end

:php_server
echo.
echo 🔍 Verificando PHP...
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ PHP detectado
    echo 🚀 Iniciando servidor PHP...
    echo 📍 URL: http://localhost:8080
    echo 🔄 Presiona Ctrl+C para detener
    echo.
    start http://localhost:8080
    php -S localhost:8080
) else (
    echo ❌ PHP no encontrado
    echo 📥 Considera instalar XAMPP o PHP standalone
    start https://www.apachefriends.org/es/index.html
    echo.
    pause
)
goto :end

:browser_mode
echo.
echo 🌐 Abriendo en modo navegador básico...
echo ⚠️  Nota: Sin servidor local, algunas funciones pueden no funcionar
echo 💡 Recomendación: Instala Node.js para mejor experiencia
echo.
start index.html
echo.
echo 📋 Alternativas recomendadas:
echo    • Visual Studio Code con extensión "Live Server"
echo    • XAMPP para servidor local completo
echo    • Node.js para desarrollo web moderno
echo.
pause
goto :end

:end
echo.
echo 👋 ¡Gracias por usar Éter Store!
echo 📧 Soporte: dev@eterstore.com
echo.
pause