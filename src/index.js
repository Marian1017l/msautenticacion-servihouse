const express = require('express');
const app = express();
const routes = require('./Routes/routes.js');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectionDB = require("./database/dbConnection"); //Importamos la funcion que nos permite conectarnos a la base de datos


const { swaggerUi, swaggerDocs } = require('./middlewares/swagger.js');

app.use(cors({
  origin: '*', // Permite cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const PORT = process.env.PORT || 8001;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

connectionDB(); 