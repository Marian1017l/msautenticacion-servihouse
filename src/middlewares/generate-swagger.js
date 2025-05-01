const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const doc = {
  info: {
    title: 'MSAuthentication',
    description: 'Documentación de la API de autenticación para ServiHouse',
  },
  host: `localhost:${process.env.PORT || 3000}`,
  basePath: '/api/auth',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['src/Routes/routes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);