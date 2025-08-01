// routes/index.js

const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();
logger.info('Iniciando registro de rutas API', 'Routes');

// Rutas de usuarios
const usuariosRoutes = require('./usuarios');
router.use('/usuarios', usuariosRoutes);
logger.info('Rutas de usuarios registradas', 'Routes');

// Rutas de municipalidad
const municipalidadRoutes = require('./municipalidad');
router.use('/municipalidad', municipalidadRoutes);
logger.info('Rutas de municipalidad registradas', 'Routes');

// Rutas de noticias
const noticiasRoutes = require('./noticias');
router.use('/noticias', noticiasRoutes);
logger.info('Rutas de noticias registradas', 'Routes');

// Rutas de redes sociales
const redesSocialesRoutes = require('./redes-sociales');
router.use('/redes-sociales', redesSocialesRoutes);
logger.info('Rutas de redes sociales registradas', 'Routes');

// Rutas de servicios
const serviciosRoutes = require('./servicios');
router.use('/servicios', serviciosRoutes);
logger.info('Rutas de servicios registradas', 'Routes');

// Comentar rutas de upload ya que está integrado en noticias
// const uploadRoutes = require('./upload');
// router.use('/upload', uploadRoutes);

logger.info('Todas las rutas API registradas correctamente', 'Routes');
module.exports = router;