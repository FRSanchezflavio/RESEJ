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
const enlacesRoutes = require('./routes/enlacesCompartidos.routes');

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', // Vite (desarrollo)
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://localhost:5175', // Puerto actual
      'http://192.168.1.23:5175', // IP local
      'http://192.168.1.23:5174',
      'http://192.168.1.23:5173',
      process.env.FRONTEND_URL, // URL de producción desde .env
      process.env.CORS_ORIGIN, // Origen adicional desde .env
    ].filter(Boolean);

    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Origen bloqueado por CORS:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middlewares globales
app.use(helmet()); // Seguridad headers HTTP
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
app.use('/api/enlaces-compartidos', enlacesRoutes);

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
