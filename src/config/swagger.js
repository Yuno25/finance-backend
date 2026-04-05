const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Data Processing API',
      version: '1.0.0',
      description: 'Backend API for Finance Dashboard with Role Based Access Control'
    },
    servers: [
       {
    url: 'https://finance-backend-a964.onrender.com',
    description: 'Production Server'
  },
  {
    url: 'http://localhost:5000',
    description: 'Local Development Server'
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
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);