require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const pool = require('./db');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/admin', adminRoutes);
app.use('/services', serviceRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Banco conectado ✅', res.rows[0]);
  } catch (err) {
    console.error('Erro ao conectar no banco:', err);
  }
})();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});