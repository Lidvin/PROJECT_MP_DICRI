# start-complete.ps1 - Levanta TODO el proyecto automáticamente

Write-Host "=== LEVANTANDO PROYECTO COMPLETO ===" -ForegroundColor Green

# Paso 1: Limpiar
Write-Host "`n1. Limpiando contenedores anteriores..." -ForegroundColor Yellow
docker-compose down

# Paso 2: Levantar solo BD
Write-Host "`n2. Iniciando base de datos..." -ForegroundColor Yellow
docker-compose up db -d

# Paso 3: Esperar
Write-Host "`n3. Esperando a que SQL Server este listo (30 segundos)..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# Paso 4: Verificar que BD está corriendo
Write-Host "`n4. Verificando estado de la base de datos..." -ForegroundColor Cyan
$dbStatus = docker ps --filter "name=mp_dicri_db" --format "table {{.Names}}" | Select-String "mp_dicri_db"

if (-not $dbStatus) {
    Write-Host "ERROR: La base de datos no se inicio correctamente" -ForegroundColor Red
    docker-compose logs db
    exit 1
}

Write-Host "OK - Base de datos ejecutandose" -ForegroundColor Green

# Paso 5: Inicializar BD (Estructura)
Write-Host "`n5. Inicializando estructura de la base de datos..." -ForegroundColor Cyan
docker run -it --rm `
    --network project_mp_dicri_default `
    -v "$(Get-Location)\db:/mnt" `
    mcr.microsoft.com/mssql-tools `
    /opt/mssql-tools/bin/sqlcmd -S mp_dicri_db -U sa -P "SoyMP2025!" -i /mnt/script.sql

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Fallo la inicializacion de la estructura de la BD" -ForegroundColor Red
    exit 1
}

Write-Host "OK - Estructura de base de datos creada" -ForegroundColor Green

# Paso 6: Cargar datos iniciales
Write-Host "`n6. Cargando datos iniciales..." -ForegroundColor Cyan

# Verificar que el archivo init_data.sql existe
$initDataPath = "db\init_data.sql"
if (-not (Test-Path $initDataPath)) {
    Write-Host "ERROR: No se encuentra el archivo $initDataPath" -ForegroundColor Red
    Write-Host "Asegurate de crear el archivo init_data.sql en la carpeta db" -ForegroundColor Yellow
    exit 1
}

docker run -it --rm `
    --network project_mp_dicri_default `
    -v "$(Get-Location)\db:/mnt" `
    mcr.microsoft.com/mssql-tools `
    /opt/mssql-tools/bin/sqlcmd -S mp_dicri_db -U sa -P "SoyMP2025!" -i /mnt/init_data.sql

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Fallo la carga de datos iniciales" -ForegroundColor Red
    exit 1
}

Write-Host "OK - Datos iniciales cargados" -ForegroundColor Green

# Paso 7: Verificar datos cargados
Write-Host "`n7. Verificando datos cargados..." -ForegroundColor Cyan

$checkData = docker run --rm `
    --network project_mp_dicri_default `
    mcr.microsoft.com/mssql-tools `
    /opt/mssql-tools/bin/sqlcmd -S mp_dicri_db -U sa -P "SoyMP2025!" `
    -Q "USE MP_DICRI; 
        SELECT 'Roles: ' + CAST(COUNT(*) as varchar) FROM Roles;
        SELECT 'Estados: ' + CAST(COUNT(*) as varchar) FROM EstadosExpediente;
        SELECT 'Usuarios: ' + CAST(COUNT(*) as varchar) FROM Usuarios;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK - Verificacion de datos completada" -ForegroundColor Green
    Write-Host $checkData -ForegroundColor White
} else {
    Write-Host "ADVERTENCIA: No se pudo verificar los datos cargados" -ForegroundColor Yellow
}

# Paso 8: Levantar el resto de servicios
Write-Host "`n8. Iniciando API y Frontend..." -ForegroundColor Yellow
docker-compose up -d

# Paso 9: Verificar todo
Write-Host "`n9. Verificando todos los servicios..." -ForegroundColor Cyan
Start-Sleep -Seconds 10
docker-compose ps

Write-Host "`n=== PROYECTO LEVANTADO EXITOSAMENTE ===" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend API: http://localhost:4000" -ForegroundColor White
Write-Host "SQL Server: localhost:1433" -ForegroundColor White
Write-Host "Usuario admin: admin / Contraseña: la que configuraste" -ForegroundColor White

Write-Host "`nPara ver logs en tiempo real ejecuta: docker-compose logs -f" -ForegroundColor Yellow