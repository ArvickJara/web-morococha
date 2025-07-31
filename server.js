// server.js

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Cargar rutas con manejo de errores específico
try {
    console.log('Cargando rutas...');
    const routes = require('./routes');
    app.use('/api', routes);
    console.log('Rutas cargadas exitosamente');
} catch (error) {
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
        console.error('Error conectando a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`API disponible en: http://localhost:${PORT}/api`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`El puerto ${PORT} está en uso.`);
    } else {
        console.error(`Error al iniciar el servidor: ${err.message}`);
    }
});