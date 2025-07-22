// server.js

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

// Añadir logging para API
app.use('/api', (req, res, next) => {
    console.log(`API Request: ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api', routes);

app.use(express.static(path.join(__dirname, 'fe-morococha', 'dist')));

// Mejorar manejador de rutas frontend para SPA
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/public')) {
        return next();
    }
    console.log('Frontend request:', req.path);
    res.sendFile(path.join(__dirname, 'fe-morococha', 'dist', 'index.html'));
});

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
    console.log(`Servidor backend y frontend corriendo en el puerto ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`El puerto ${PORT} está en uso. Por favor, intenta con otro puerto.`);
    } else {
        console.error(`Error al iniciar el servidor: ${err.message}`);
    }
});