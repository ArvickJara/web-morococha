const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorio si no existe
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// Middleware para manejar ambos formatos
const parseBody = (fileField = null) => {
  return (req, res, next) => {
    const contentType = req.headers['content-type'];
    
    if (contentType && contentType.includes('multipart/form-data')) {
      // Es form-data, usar multer
      const uploadHandler = fileField ? upload.single(fileField) : upload.none();
      uploadHandler(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: 'Error procesando archivo', details: err.message });
        }
        // Convertir strings a booleans para form-data
        if (req.body.destacada) req.body.destacada = req.body.destacada === 'true';
        if (req.body.activa) req.body.activa = req.body.activa === 'true';
        if (req.body.activo) req.body.activo = req.body.activo === 'true';
        next();
      });
    } else {
      // Es JSON, continuar normal
      next();
    }
  };
};

module.exports = { parseBody, upload };
