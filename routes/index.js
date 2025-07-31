// routes/index.js

const express = require('express');

const router = express.Router();

// Rutas de usuarios
const usuariosRoutes = require('./usuarios');
router.use('/usuarios', usuariosRoutes);

// Rutas de municipalidad
const municipalidadRoutes = require('./municipalidad');
router.use('/municipalidad', municipalidadRoutes);

// Rutas de noticias
const noticiasRoutes = require('./noticias');
router.use('/noticias', noticiasRoutes);

// Rutas de redes sociales
const redesSocialesRoutes = require('./redes-sociales');
router.use('/redes-sociales', redesSocialesRoutes);

// Rutas de servicios
const serviciosRoutes = require('./servicios');
router.use('/servicios', serviciosRoutes);

// Comentar rutas de upload ya que está integrado en noticias
// const uploadRoutes = require('./upload');
// router.use('/upload', uploadRoutes);

module.exports = router;