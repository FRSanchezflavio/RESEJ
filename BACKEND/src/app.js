const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const personasRoutes = require('./routes/personas.routes');
const registrosRoutes = require('./routes/registros.routes');
const archivosRoutes = require('./routes/archivos.routes');
const logsRoutes = require('./routes/logs.routes');

const app = express();

// Configuración de CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middlewares globales
app.use(helmet()); // Seguridad headers HTTP
app.use(cors(corsOptions)); // CORS
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL-encoded

// Logging HTTP (Morgan + Winston)
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: message => logger.info(message.trim()),
    },
  })
);

// Rate limiting general
app.use('/api', generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/personas', personasRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/archivos', archivosRoutes);
app.use('/api/logs', logsRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API RE.SE.J - Registro de Secuestros Judiciales',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

// Manejo de rutas no encontradas
app.use(notFoundHandler);

// Manejo centralizado de errores
app.use(errorHandler);

module.exports = app;
