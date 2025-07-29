const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const app = express();

app.use(cors());
app.use(express.json());

const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas separadas por rol
const clienteRoutes = require('./routes/clienteRoutes');
const adminRoutes = require('./routes/adminRoutes');
const logisticaController = require('./controllers/logisticaController');
const monitorController = require('./controllers/monitorController');

app.use('/api', clienteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', logisticaController);
app.use('/api', monitorController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}/api-docs`;
  console.log(`\nServidor escuchando en puerto ${PORT}`);
  console.log(`Swagger disponible en: ${url}\n`);
}); 