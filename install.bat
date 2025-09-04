@echo off
echo ========================================
echo    ETER STORE - INSTALACION AUTOMATICA
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no esta instalado.
    echo.
    echo Por favor, instala Node.js desde: https://nodejs.org/
    echo Descarga la version LTS y ejecuta el instalador.
    echo.
    echo Despues de instalar Node.js, ejecuta este script nuevamente.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado:
node --version
npm --version
echo.

echo Instalando dependencias de desarrollo...
npm install

if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias.
    echo Verifica tu conexion a internet e intenta nuevamente.
    pause
    exit /b 1
)

echo.
echo ✅ ¡Instalacion completada exitosamente!
echo.
echo ========================================
echo           COMANDOS DISPONIBLES
echo ========================================
echo.
echo npm start          - Iniciar servidor de desarrollo
echo npm run admin      - Abrir panel de administracion
echo npm run productos  - Abrir pagina de productos
echo.
echo ========================================
echo.
echo ¿Deseas iniciar el servidor ahora? (S/N)
set /p choice=
if /i "%choice%"=="S" (
    echo.
    echo Iniciando servidor en http://localhost:3000...
    npm start
) else (
    echo.
    echo Para iniciar el servidor mas tarde, ejecuta: npm start
    echo.
)

pause