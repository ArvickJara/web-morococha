const express = require('express');
const knex = require('knex')(require('../knexfile'));
const protect = require('../middleware/auth');
const { parseBody, upload } = require('../middleware/parseBody');
const logger = require('../utils/logger');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configuración específica para múltiples archivos
const configMultipleFiles = multer({
  storage: upload.storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB límite por archivo
  },
  fileFilter: function (req, file, cb) {
    // Permitir PDF, DOC, DOCX, XLS, XLSX, además de imágenes
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
                             'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                             'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      logger.debug(`Archivo válido: ${file.originalname} (${file.mimetype})`, 'Convocatorias');
      cb(null, true);
    } else {
      logger.warn(`Archivo rechazado: ${file.originalname} (${file.mimetype}) - Tipo no permitido`, 'Convocatorias');
      cb(new Error('Solo se permiten archivos de imagen, PDF, Word y Excel.'));
    }
  }
}).array('archivos', 10); // Máximo 10 archivos

// Obtener todas las convocatorias (público)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, tipo_id, estado, activa = true } = req.query;
  const offset = (page - 1) * limit;
  
  logger.startOperation('Obtener convocatorias', { page, limit, tipo_id, estado, activa }, 'Convocatorias');

  try {
    let query = knex('convocatorias')
      .where('activa', activa === 'false' ? false : Boolean(activa));
    
    if (tipo_id) {
      query = query.where('tipo_id', tipo_id);
    }
    
    if (estado) {
      query = query.where('estado', estado);
    }

    const total = await query.clone().count('* as total').first();
    const totalPages = Math.ceil(total.total / limit);

    const convocatorias = await query
      .select('convocatorias.*', 'convocatoria_tipos.nombre as tipo_nombre')
      .leftJoin('convocatoria_tipos', 'convocatorias.tipo_id', 'convocatoria_tipos.id')
      .orderBy('convocatorias.fecha_inicio', 'desc')
      .limit(limit)
      .offset(offset);

    logger.endOperation('Obtener convocatorias', { 
      count: convocatorias.length, 
      total: parseInt(total.total), 
      page, 
      totalPages 
    }, 'Convocatorias');

    res.status(200).json({
      convocatorias,
      pagination: {
        total: parseInt(total.total),
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    logger.operationError('Obtener convocatorias', err, 'Convocatorias');
    res.status(500).json({ error: 'Error obteniendo convocatorias.', details: err.message });
  }
});

// Obtener una convocatoria por ID con sus archivos (público)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Obtener convocatoria por ID', { id }, 'Convocatorias');

  try {
    const convocatoria = await knex('convocatorias')
      .select('convocatorias.*', 'convocatoria_tipos.nombre as tipo_nombre')
      .leftJoin('convocatoria_tipos', 'convocatorias.tipo_id', 'convocatoria_tipos.id')
      .where('convocatorias.id', id)
      .first();

    if (!convocatoria) {
      logger.warn(`Convocatoria con ID ${id} no encontrada`, 'Convocatorias');
      return res.status(404).json({ message: 'Convocatoria no encontrada.' });
    }

    // Obtener los archivos asociados a esta convocatoria
    const archivos = await knex('convocatoria_archivos')
      .where('convocatoria_id', id)
      .orderBy([
        { column: 'tipo_archivo' },
        { column: 'orden' }
      ]);

    // Agrupar archivos por tipo
    const archivosPorTipo = {
      bases: archivos.filter(a => a.tipo_archivo === 'bases'),
      resultado_curricular: archivos.filter(a => a.tipo_archivo === 'resultado_curricular'),
      resultado_entrevista: archivos.filter(a => a.tipo_archivo === 'resultado_entrevista'),
      resultado_final: archivos.filter(a => a.tipo_archivo === 'resultado_final'),
      comunicado: archivos.filter(a => a.tipo_archivo === 'comunicado')
    };

    logger.endOperation('Obtener convocatoria por ID', { 
      nombre: convocatoria.nombre_proceso,
      archivos: archivos.length
    }, 'Convocatorias');
    
    res.status(200).json({ 
      convocatoria,
      archivos: archivosPorTipo
    });
  } catch (err) {
    logger.operationError('Obtener convocatoria por ID', err, 'Convocatorias');
    res.status(500).json({ error: 'Error obteniendo la convocatoria.', details: err.message });
  }
});

// Crear nueva convocatoria (solo admin)
router.post('/', protect(['admin']), parseBody(), async (req, res) => {
  try {
    const { 
      tipo_id, 
      nombre_proceso, 
      descripcion, 
      fecha_inicio, 
      fecha_fin, 
      estado, 
      activa 
    } = req.body;
    
    logger.startOperation('Crear convocatoria', { nombre_proceso, tipo_id }, 'Convocatorias');
    
    if (!nombre_proceso || !tipo_id || !fecha_inicio) {
      logger.warn('Intento de crear convocatoria con datos incompletos', 'Convocatorias');
      return res.status(400).json({ message: 'Tipo, nombre del proceso y fecha de inicio son requeridos.' });
    }

    // Verificar que el tipo existe
    const tipoExiste = await knex('convocatoria_tipos').where('id', tipo_id).first();
    if (!tipoExiste) {
      logger.warn(`Intento de crear convocatoria con tipo inexistente ID: ${tipo_id}`, 'Convocatorias');
      return res.status(400).json({ message: 'El tipo de convocatoria seleccionado no existe.' });
    }

    const [convocatoriaId] = await knex('convocatorias').insert({
      tipo_id,
      nombre_proceso,
      descripcion: descripcion || null,
      fecha_inicio,
      fecha_fin: fecha_fin || null,
      estado: estado || 'borrador',
      activa: activa !== undefined ? (activa === 'true' || activa === true) : true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    });

    logger.endOperation('Crear convocatoria', { id: convocatoriaId, nombre_proceso }, 'Convocatorias');
    logger.info(`Nueva convocatoria creada: "${nombre_proceso}" (ID: ${convocatoriaId})`, 'Convocatorias');

    res.status(201).json({ 
      message: 'Convocatoria creada exitosamente', 
      convocatoriaId
    });
  } catch (err) {
    logger.operationError('Crear convocatoria', err, 'Convocatorias');
    res.status(500).json({ error: 'Error creando la convocatoria.', details: err.message });
  }
});

// Actualizar convocatoria (solo admin)
router.put('/:id', protect(['admin']), parseBody(), async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Actualizar convocatoria', { id }, 'Convocatorias');
  
  try {
    const convocatoria = await knex('convocatorias').where('id', id).first();
    if (!convocatoria) {
      logger.warn(`Intento de actualizar convocatoria inexistente ID: ${id}`, 'Convocatorias');
      return res.status(404).json({ message: 'Convocatoria no encontrada.' });
    }

    const { 
      tipo_id, 
      nombre_proceso, 
      descripcion, 
      fecha_inicio, 
      fecha_fin, 
      estado, 
      activa 
    } = req.body;

    const updateData = {};
    if (tipo_id) {
      // Verificar que el tipo existe
      const tipoExiste = await knex('convocatoria_tipos').where('id', tipo_id).first();
      if (!tipoExiste) {
        logger.warn(`Intento de actualizar convocatoria con tipo inexistente ID: ${tipo_id}`, 'Convocatorias');
        return res.status(400).json({ message: 'El tipo de convocatoria seleccionado no existe.' });
      }
      updateData.tipo_id = tipo_id;
    }
    
    if (nombre_proceso) updateData.nombre_proceso = nombre_proceso;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (fecha_inicio) updateData.fecha_inicio = fecha_inicio;
    if (fecha_fin !== undefined) updateData.fecha_fin = fecha_fin;
    if (estado) updateData.estado = estado;
    if (activa !== undefined) updateData.activa = activa === 'true' || activa === true;
    
    updateData.updated_at = knex.fn.now();

    await knex('convocatorias').where('id', id).update(updateData);

    logger.endOperation('Actualizar convocatoria', { id, cambios: Object.keys(updateData) }, 'Convocatorias');
    logger.info(`Convocatoria ID ${id} actualizada. Campos modificados: ${Object.keys(updateData).join(', ')}`, 'Convocatorias');

    res.status(200).json({ message: 'Convocatoria actualizada exitosamente' });
  } catch (err) {
    logger.operationError('Actualizar convocatoria', err, 'Convocatorias');
    res.status(500).json({ error: 'Error actualizando la convocatoria.', details: err.message });
  }
});

// Eliminar convocatoria (solo admin)
router.delete('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params;

  logger.startOperation('Eliminar convocatoria', { id }, 'Convocatorias');

  try {
    const convocatoria = await knex('convocatorias').where('id', id).first();
    if (!convocatoria) {
      logger.warn(`Intento de eliminar convocatoria inexistente ID: ${id}`, 'Convocatorias');
      return res.status(404).json({ message: 'Convocatoria no encontrada.' });
    }

    // Obtener los archivos para eliminarlos físicamente después
    const archivos = await knex('convocatoria_archivos').where('convocatoria_id', id);

    // Iniciar transacción para eliminar registros de BD
    await knex.transaction(async (trx) => {
      // Eliminar primero los archivos de la BD
      await trx('convocatoria_archivos').where('convocatoria_id', id).del();
      
      // Eliminar la convocatoria
      await trx('convocatorias').where('id', id).del();
    });
    
    // Intentar eliminar archivos físicos si existen
    archivos.forEach(archivo => {
      try {
        // Obtener la ruta local del archivo a partir de la URL
        const fileUrl = archivo.archivo_url;
        const filename = path.basename(fileUrl);
        const filePath = path.join(__dirname, '../public/uploads', filename);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          logger.info(`Archivo físico eliminado: ${filePath}`, 'Convocatorias');
        }
      } catch (fileErr) {
        // Log error pero no interrumpir el proceso
        logger.warn(`No se pudo eliminar archivo físico: ${archivo.archivo_url} - ${fileErr.message}`, 'Convocatorias');
      }
    });
    
    logger.endOperation('Eliminar convocatoria', { id, nombre: convocatoria.nombre_proceso }, 'Convocatorias');
    logger.info(`Convocatoria ID ${id} "${convocatoria.nombre_proceso}" eliminada`, 'Convocatorias');
    
    res.status(200).json({ message: 'Convocatoria eliminada exitosamente.' });
  } catch (err) {
    logger.operationError('Eliminar convocatoria', err, 'Convocatorias');
    res.status(500).json({ error: 'Error eliminando la convocatoria.', details: err.message });
  }
});

// Subir archivos para una convocatoria (solo admin)
router.post('/:id/archivos', protect(['admin']), async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Subir archivos de convocatoria', { convocatoriaId: id }, 'Convocatorias');
  
  try {
    // Verificar que la convocatoria existe
    const convocatoria = await knex('convocatorias').where('id', id).first();
    if (!convocatoria) {
      logger.warn(`Intento de subir archivos a convocatoria inexistente ID: ${id}`, 'Convocatorias');
      return res.status(404).json({ message: 'Convocatoria no encontrada.' });
    }
    
    // Procesar los archivos
    configMultipleFiles(req, res, async function(err) {
      if (err) {
        logger.error(`Error procesando archivos para convocatoria ID ${id}: ${err.message}`, 'Convocatorias');
        return res.status(400).json({ error: 'Error procesando archivos', details: err.message });
      }
      
      // Validar que se enviaron archivos
      if (!req.files || req.files.length === 0) {
        logger.warn(`Intento de subir archivos a convocatoria ID ${id} sin enviar archivos`, 'Convocatorias');
        return res.status(400).json({ message: 'No se enviaron archivos.' });
      }
      
      // Validar tipo de archivo
      const tipoArchivo = req.body.tipo_archivo;
      const tiposPermitidos = ['bases', 'resultado_curricular', 'resultado_entrevista', 'resultado_final', 'comunicado'];
      
      if (!tipoArchivo || !tiposPermitidos.includes(tipoArchivo)) {
        logger.warn(`Tipo de archivo inválido para convocatoria ID ${id}: ${tipoArchivo}`, 'Convocatorias');
        return res.status(400).json({ message: 'Tipo de archivo inválido.' });
      }
      
      // Nombre del archivo para el frontend
      const nombre = req.body.nombre || getTipoArchivoNombre(tipoArchivo);
      
      // Procesar los archivos subidos
      const archivosGuardados = [];
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const archivoUrl = `${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`;
        
        // Guardar referencia en la base de datos
        const [archivoId] = await knex('convocatoria_archivos').insert({
          convocatoria_id: id,
          tipo_archivo: tipoArchivo,
          nombre: nombre + (req.files.length > 1 ? ` (${i+1})` : ''),
          archivo_url: archivoUrl,
          orden: i,
          created_at: knex.fn.now()
        });
        
        archivosGuardados.push({
          id: archivoId,
          nombre: nombre + (req.files.length > 1 ? ` (${i+1})` : ''),
          archivo_url: archivoUrl,
          tipo_archivo: tipoArchivo
        });
        
        logger.info(`Archivo subido para convocatoria ID ${id}: ${file.filename} (${file.size} bytes)`, 'Convocatorias');
      }
      
      logger.endOperation('Subir archivos de convocatoria', { 
        convocatoriaId: id, 
        cantidad: archivosGuardados.length,
        tipo: tipoArchivo
      }, 'Convocatorias');
      
      res.status(201).json({ 
        message: 'Archivos subidos exitosamente', 
        archivos: archivosGuardados 
      });
    });
  } catch (err) {
    logger.operationError('Subir archivos de convocatoria', err, 'Convocatorias');
    res.status(500).json({ error: 'Error subiendo archivos.', details: err.message });
  }
});

// Eliminar un archivo específico (solo admin)
router.delete('/:convocatoriaId/archivos/:archivoId', protect(['admin']), async (req, res) => {
  const { convocatoriaId, archivoId } = req.params;
  
  logger.startOperation('Eliminar archivo de convocatoria', { convocatoriaId, archivoId }, 'Convocatorias');
  
  try {
    // Verificar que el archivo existe y pertenece a esta convocatoria
    const archivo = await knex('convocatoria_archivos')
      .where({
        'id': archivoId,
        'convocatoria_id': convocatoriaId
      })
      .first();
      
    if (!archivo) {
      logger.warn(`Intento de eliminar archivo inexistente ID: ${archivoId} de convocatoria ID: ${convocatoriaId}`, 'Convocatorias');
      return res.status(404).json({ message: 'Archivo no encontrado.' });
    }
    
    // Eliminar de la base de datos
    await knex('convocatoria_archivos').where('id', archivoId).del();
    
    // Intentar eliminar archivo físico si existe
    try {
      // Obtener la ruta local del archivo a partir de la URL
      const fileUrl = archivo.archivo_url;
      const filename = path.basename(fileUrl);
      const filePath = path.join(__dirname, '../public/uploads', filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`Archivo físico eliminado: ${filePath}`, 'Convocatorias');
      }
    } catch (fileErr) {
      // Log error pero no interrumpir el proceso
      logger.warn(`No se pudo eliminar archivo físico: ${archivo.archivo_url} - ${fileErr.message}`, 'Convocatorias');
    }
    
    logger.endOperation('Eliminar archivo de convocatoria', { 
      convocatoriaId, 
      archivoId, 
      tipoArchivo: archivo.tipo_archivo 
    }, 'Convocatorias');
    
    res.status(200).json({ message: 'Archivo eliminado exitosamente.' });
  } catch (err) {
    logger.operationError('Eliminar archivo de convocatoria', err, 'Convocatorias');
    res.status(500).json({ error: 'Error eliminando el archivo.', details: err.message });
  }
});

// Función para obtener nombres predeterminados por tipo de archivo
function getTipoArchivoNombre(tipo) {
  const nombres = {
    'bases': 'Bases del proceso',
    'resultado_curricular': 'Resultado evaluación curricular',
    'resultado_entrevista': 'Resultado de entrevista',
    'resultado_final': 'Resultado final',
    'comunicado': 'Comunicado'
  };
  
  return nombres[tipo] || 'Archivo de convocatoria';
}

module.exports = router;
