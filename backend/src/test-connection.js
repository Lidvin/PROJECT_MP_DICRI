
require('dotenv').config();
const sql = require('mssql');

const config = {
    server: 'localhost',
    port: 1433,
    database: 'MP_DICRI',
    user: 'sa',
    password: '5218',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 15000
    }
};

async function testConnection() {
    console.log('🔍 Probando conexión a MSSQLSERVER...');
    console.log('Servidor: localhost:1433');
    
    try {
        const pool = await sql.connect(config);
        console.log('✅ CONEXIÓN EXITOSA a MSSQLSERVER!');
        
        
        const result = await pool.request().query(`
            SELECT 
                @@SERVERNAME as server_name,
                @@VERSION as version,
                DB_NAME() as current_database
        `);
        
        console.log('📊 Información del servidor:');
        console.log('- Servidor:', result.recordset[0].server_name);
        console.log('- Base de datos actual:', result.recordset[0].current_database);
        
        await pool.close();
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.log('\n💡 Soluciones:');
        console.log('1. Verificar que la contraseña de "sa" es correcta');
        console.log('2. Verificar que SQL Server acepte autenticación SQL');
        console.log('3. Probar con 127.0.0.1 en lugar de localhost');
    }
}

testConnection();
