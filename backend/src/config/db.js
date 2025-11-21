
const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  options: {
    encrypt: false,       
    trustServerCertificate: true
  }
};

let pool;

const getConnection = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(dbConfig);
      console.log('✅ Conectado a SQL Server');
    }
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar a SQL Server:', error.message);
    throw error;
  }
};

module.exports = {
  sql,
  getConnection
};

