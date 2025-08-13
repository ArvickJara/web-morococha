const express = require('express');
const knex = require('knex')(require('../knexfile'));
const protect = require('../middleware/auth');
const { parseBody } = require('../middleware/parseBody');
const logger = require('../utils/logger');

const router = express.Router();

// Obtener todas las proyectos (público)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, estado, activa = true } = req.query;
  const offset = (page - 1) * limit;
  
  logger.startOperation('Obtener proyectos', { page, limit, estado, activa }, 'Proyectos');

  try {
    let query = knex('proyectos').where('activa', activa === 'false' ? false : Boolean(activa));
    
    if (estado) {
      query = query.where('estado', estado);
    }

    const total = await query.clone().count('* as total').first();
    const totalPages = Math.ceil(total.total / limit);

    const proyectos = await query
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    logger.endOperation('Obtener proyectos', { 
      count: proyectos.length, 
      total: parseInt(total.total), 
      page, 
      totalPages 
    }, 'Proyectos');

    res.status(200).json({
      proyectos,
      pagination: {
        total: parseInt(total.total),
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    logger.operationError('Obtener proyectos', err, 'Proyectos');
    res.status(500).json({ error: 'Error obteniendo proyectos.', details: err.message });
  }
});

// Obtener obra por ID (público)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Obtener obra por ID', { id }, 'Proyectos');

  try {
    const obra = await knex('proyectos').where('id', id).first();

    if (!obra) {
      logger.warn(`Obra con ID ${id} no encontrada`, 'Proyectos');
      return res.status(404).json({ message: 'Obra no encontrada.' });
    }

    logger.endOperation('Obtener obra por ID', { titulo: obra.titulo }, 'Proyectos');
    res.status(200).json({ obra });
  } catch (err) {
    logger.operationError('Obtener obra por ID', err, 'Proyectos');
    res.status(500).json({ error: 'Error obteniendo la obra.', details: err.message });
  }
});

// Crear nueva obra (solo admin)
router.post('/', protect(['admin']), parseBody('imagen'), async (req, res) => {
  try {
    const { titulo, descripcion, ubicacion, fecha_inicio, fecha_fin, presupuesto, estado, activa } = req.body;
    
    logger.startOperation('Crear obra', { titulo, ubicacion }, 'Proyectos');
    
    if (!titulo) {
      logger.warn('Intento de crear obra sin título', 'Proyectos');
      return res.status(400).json({ message: 'El título es requerido.' });
    }

    // Construir URL de imagen si se subió archivo
    let imagen_url = null;
    if (req.file) {
      imagen_url = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
      logger.info(`Imagen adjunta a obra: ${imagen_url}`, 'Proyectos');
    }

    const [obraId] = await knex('proyectos').insert({
      titulo,
      descripcion: descripcion || null,
      ubicacion: ubicacion || null,
      fecha_inicio: fecha_inicio || null,
      fecha_fin: fecha_fin || null,
      presupuesto: presupuesto || null,
      estado: estado || 'planificacion',
      imagen_url,
      activa: activa !== undefined ? (activa === 'true' || activa === true) : true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    });

    logger.endOperation('Crear obra', { id: obraId, titulo }, 'Proyectos');
    logger.info(`Nueva obra creada: "${titulo}" (ID: ${obraId})`, 'Proyectos');

    res.status(201).json({ 
      message: 'Obra creada exitosamente', 
      obraId,
      imagen_url 
    });
  } catch (err) {
    logger.operationError('Crear obra', err, 'Proyectos');
    res.status(500).json({ error: 'Error creando la obra.', details: err.message });
  }
});

// Actualizar obra (solo admin)
router.put('/:id', protect(['admin']), parseBody('imagen'), async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Actualizar obra', { id }, 'Proyectos');
  
  try {
    const obra = await knex('proyectos').where('id', id).first();
    if (!obra) {
      logger.warn(`Intento de actualizar obra inexistente ID: ${id}`, 'Proyectos');
      return res.status(404).json({ message: 'Obra no encontrada.' });
    }

    const { titulo, descripcion, ubicacion, fecha_inicio, fecha_fin, presupuesto, estado, activa } = req.body;

    const updateData = {};
    if (titulo) updateData.titulo = titulo;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (ubicacion !== undefined) updateData.ubicacion = ubicacion;
    if (fecha_inicio !== undefined) updateData.fecha_inicio = fecha_inicio;
    if (fecha_fin !== undefined) updateData.fecha_fin = fecha_fin;
    if (presupuesto !== undefined) updateData.presupuesto = presupuesto;
    if (estado) updateData.estado = estado;
    if (activa !== undefined) updateData.activa = activa === 'true' || activa === true;
    
    // Si se subió nueva imagen, actualizar URL
    if (req.file) {
      updateData.imagen_url = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
      logger.info(`Nueva imagen para obra ID ${id}: ${updateData.imagen_url}`, 'Proyectos');
    }
    
    updateData.updated_at = knex.fn.now();

    await knex('proyectos').where('id', id).update(updateData);

    logger.endOperation('Actualizar obra', { id, cambios: Object.keys(updateData) }, 'Proyectos');
    logger.info(`Obra ID ${id} actualizada. Campos modificados: ${Object.keys(updateData).join(', ')}`, 'Proyectos');

    res.status(200).json({ 
      message: 'Obra actualizada exitosamente',
      imagen_url: updateData.imagen_url || obra.imagen_url
    });
  } catch (err) {
    logger.operationError('Actualizar obra', err, 'Proyectos');
    res.status(500).json({ error: 'Error actualizando la obra.', details: err.message });
  }
});

// Eliminar obra (solo admin)
router.delete('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params;

  logger.startOperation('Eliminar obra', { id }, 'Proyectos');

  try {
    const obra = await knex('proyectos').where('id', id).first();
    if (!obra) {
      logger.warn(`Intento de eliminar obra inexistente ID: ${id}`, 'Proyectos');
      return res.status(404).json({ message: 'Obra no encontrada.' });
    }

    await knex('proyectos').where('id', id).del();
    
    logger.endOperation('Eliminar obra', { id, titulo: obra.titulo }, 'Proyectos');
    logger.info(`Obra ID ${id} "${obra.titulo}" eliminada`, 'Proyectos');
    
    res.status(200).json({ message: 'Obra eliminada exitosamente.' });
  } catch (err) {
    logger.operationError('Eliminar obra', err, 'Proyectos');
    res.status(500).json({ error: 'Error eliminando la obra.', details: err.message });
  }
});

module.exports = router;
