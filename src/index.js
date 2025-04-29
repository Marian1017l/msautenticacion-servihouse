const express = require('express');
const app = express();
const routes = require('./Routes/routes.js');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectionDB = require("./database/dbConnection"); //Importamos la funcion que nos permite conectarnos a la base de datos

const { swaggerUi, swaggerDocs } = require('./middlewares/swagger.js');

app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

connectionDB(); 