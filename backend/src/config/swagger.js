
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API MP DICRI - Expedientes e Indicios',
    version: '1.0.0',
    description: 'Documentación de la API para gestión de expedientes, indicios, usuarios y auditoría'
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Servidor local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: [
    './src/routes/*.js' 
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

