const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

const router = express.Router();

// Crear directorio si no existe
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  logger.info(`Creando directorio de uploads en: ${uploadDir}`, 'Upload');
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    logger.debug(`Almacenando archivo en: ${uploadDir}`, 'Upload');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = 'img-' + uniqueSuffix + path.extname(file.originalname);
    logger.debug(`Generando nombre de archivo: ${fileName} (Original: ${file.originalname})`, 'Upload');
    cb(null, fileName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      logger.debug(`Archivo válido: ${file.originalname} (${file.mimetype})`, 'Upload');
      cb(null, true);
    } else {
      logger.warn(`Archivo rechazado: ${file.originalname} (${file.mimetype}) - Solo se permiten imágenes`, 'Upload');
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

logger.info('Módulo de upload configurado correctamente', 'Upload');
module.exports = { router, upload };
