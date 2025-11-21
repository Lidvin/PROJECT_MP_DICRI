#!/bin/bash
# start-complete.sh - Levanta TODO el proyecto automáticamente en Linux

set -e

echo -e "\033[1;32m=== LEVANTANDO PROYECTO COMPLETO ===\033[0m"

# Paso 1: Limpiar
echo -e "\n\033[1;33m1. Limpiando contenedores anteriores...\033[0m"
docker-compose down

# Paso 2: Levantar solo BD
echo -e "\n\033[1;33m2. Iniciando base de datos...\033[0m"
docker-compose up db -d

# Paso 3: Esperar
echo -e "\n\033[1;36m3. Esperando a que SQL Server este listo (30 segundos)...\033[0m"
sleep 30

# Paso 4: Verificar que BD está corriendo
echo -e "\n\033[1;36m4. Verificando estado de la base de datos...\033[0m"
if docker ps --filter "name=mp_dicri_db" --format "table {{.Names}}" | grep -q "mp_dicri_db"; then
    echo -e "\033[1;32mOK - Base de datos ejecutandose\033[0m"
else
    echo -e "\033[1;31mERROR: La base de datos no se inicio correctamente\033[0m"
    docker-compose logs db
    exit 1
fi

# Paso 5: Inicializar BD (Estructura)
echo -e "\n\033[1;36m5. Inicializando estructura de la base de datos...\033[0m"
docker run -it --rm \
    --network project_mp_dicri_default \
    -v "$(pwd)/db:/mnt" \
    mcr.microsoft.com/mssql-tools \
    /opt/mssql-tools/bin/sqlcmd -S mp_dicri_db -U sa -P "SoyMP2025!" -i /mnt/script.sql

if [ $? -eq 0 ]; then
    echo -e "\033[1;32mOK - Estructura de base de datos creada\033[0m"
else
    echo -e "\033[1;31mERROR: Fallo la inicializacion de la estructura de la BD\033[0m"
    exit 1
fi

# Paso 6: Cargar datos iniciales
echo -e "\n\033[1;36m6. Cargando datos iniciales...\033[0m"

# Verificar que el archivo init_data.sql existe
INIT_DATA_PATH="db/init_data.sql"
if [ ! -f "$INIT_DATA_PATH" ]; then
    echo -e "\033[1;31mERROR: No se encuentra el archivo $INIT_DATA_PATH\033[0m"
    echo -e "\033[1;33mAsegurate de crear el archivo init_data.sql en la carpeta db\033[0m"
    exit 1
fi

docker run -it --rm \
    --network project_mp_dicri_default \
    -v "$(pwd)/db:/mnt" \
    mcr.microsoft.com/mssql-tools \
    /opt/mssql-tools/bin/sqlcmd -S mp_dicri_db -U sa -P "SoyMP2025!" -i /mnt/init_data.sql

if [ $? -eq 0 ]; then
    echo -e "\033[1;32mOK - Datos iniciales cargados\033[0m"
else
    echo -e "\033[1;31mERROR: Fallo la carga de datos iniciales\033[0m"
    exit 1
fi

# Paso 7: Verificar datos cargados
echo -e "\n\033[1;36m7. Verificando datos cargados...\033[0m"

CHECK_DATA=$(docker run --rm \
    --network project_mp_dicri_default \
    mcr.microsoft.com/mssql-tools \
    /opt/mssql-tools/bin/sqlcmd -S mp_dicri_db -U sa -P "SoyMP2025!" \
    -Q "USE MP_DICRI; 
        SELECT 'Roles: ' + CAST(COUNT(*) as varchar) FROM Roles;
        SELECT 'Estados: ' + CAST(COUNT(*) as varchar) FROM EstadosExpediente;
        SELECT 'Usuarios: ' + CAST(COUNT(*) as varchar) FROM Usuarios;" 2>/dev/null || echo "Error en verificacion")

if [ $? -eq 0 ]; then
    echo -e "\033[1;32mOK - Verificacion de datos completada\033[0m"
    echo -e "\033[1;37m$CHECK_DATA\033[0m"
else
    echo -e "\033[1;33mADVERTENCIA: No se pudo verificar los datos cargados\033[0m"
fi

# Paso 8: Levantar el resto de servicios
echo -e "\n\033[1;33m8. Iniciando API y Frontend...\033[0m"
docker-compose up -d

# Paso 9: Verificar todo
echo -e "\n\033[1;36m9. Verificando todos los servicios...\033[0m"
sleep 10
docker-compose ps

echo -e "\n\033[1;32m=== PROYECTO LEVANTADO EXITOSAMENTE ===\033[0m"
echo -e "\033[1;37mFrontend: http://localhost:5173\033[0m"
echo -e "\033[1;37mBackend API: http://localhost:4000\033[0m"
echo -e "\033[1;37mSQL Server: localhost:1433\033[0m"
echo -e "\033[1;37mUsuario admin: admin / Contraseña: la que configuraste\033[0m"

echo -e "\n\033[1;33mPara ver logs en tiempo real ejecuta: docker-compose logs -f\033[0m"