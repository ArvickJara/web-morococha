// server.js

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
const logger = require('./utils/logger');

const app = express();

logger.info('Iniciando aplicación web-morococha', 'Server');

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
logger.info(`CORS configurado con origen: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`, 'Server');

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Cargar rutas con manejo de errores específico
try {
    logger.startOperation('Carga de rutas API', {}, 'Server');
    console.log('Cargando rutas...');
    const routes = require('./routes');
    app.use('/api', routes);
    console.log('Rutas cargadas exitosamente');
    logger.endOperation('Carga de rutas API', { status: 'success' }, 'Server');
} catch (error) {
    logger.operationError('Carga de rutas API', error, 'Server');
    console.error('Error específico cargando rutas:', error.message);
    console.error('Stack completo:', error.stack);
    process.exit(1);
}

app.use(express.static(path.join(__dirname, 'fe-morococha', 'dist')));

// Comentar temporalmente el manejador catch-all que está causando el error
/*
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/public')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'fe-morococha', 'dist', 'index.html'));
});
*/

// Agregar un manejador 404 simple por ahora
app.use((req, res) => {
    logger.warn(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 'Server');
    if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'Ruta no encontrada' });
    } else {
        res.status(404).send('Página no encontrada');
    }
});

// Conexión a base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
});

db.connect((err) => {
    if (err) {
        logger.error(`Error conectando a la base de datos: ${err.message}`, 'Database');
        console.error('Error conectando a la base de datos: ' + err.stack);
        return;
    }
    logger.info('Conectado a la base de datos MySQL exitosamente', 'Database');
    console.log('Conectado a la base de datos MySQL');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Servidor iniciado en el puerto ${PORT}`, 'Server');
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`API disponible en: http://localhost:${PORT}/api`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        logger.error(`Error al iniciar servidor: El puerto ${PORT} está en uso`, 'Server');
        console.error(`El puerto ${PORT} está en uso.`);
    } else {
        logger.error(`Error al iniciar servidor: ${err.message}`, 'Server');
        console.error(`Error al iniciar el servidor: ${err.message}`);
    }
});