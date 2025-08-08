const express = require('express');
const knex = require('knex')(require('../knexfile'));
const protect = require('../middleware/auth');
const { parseBody } = require('../middleware/parseBody');
const logger = require('../utils/logger');

const router = express.Router();

// Obtener todas las obras (público)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, estado, activa = true } = req.query;
  const offset = (page - 1) * limit;
  
  logger.startOperation('Obtener obras', { page, limit, estado, activa }, 'Obras');

  try {
    let query = knex('obras').where('activa', activa === 'false' ? false : Boolean(activa));
    
    if (estado) {
      query = query.where('estado', estado);
    }

    const total = await query.clone().count('* as total').first();
    const totalPages = Math.ceil(total.total / limit);

    const obras = await query
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    logger.endOperation('Obtener obras', { 
      count: obras.length, 
      total: parseInt(total.total), 
      page, 
      totalPages 
    }, 'Obras');

    res.status(200).json({
      obras,
      pagination: {
        total: parseInt(total.total),
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    logger.operationError('Obtener obras', err, 'Obras');
    res.status(500).json({ error: 'Error obteniendo obras.', details: err.message });
  }
});

// Obtener obra por ID (público)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Obtener obra por ID', { id }, 'Obras');

  try {
    const obra = await knex('obras').where('id', id).first();

    if (!obra) {
      logger.warn(`Obra con ID ${id} no encontrada`, 'Obras');
      return res.status(404).json({ message: 'Obra no encontrada.' });
    }

    logger.endOperation('Obtener obra por ID', { titulo: obra.titulo }, 'Obras');
    res.status(200).json({ obra });
  } catch (err) {
    logger.operationError('Obtener obra por ID', err, 'Obras');
    res.status(500).json({ error: 'Error obteniendo la obra.', details: err.message });
  }
});

// Crear nueva obra (solo admin)
router.post('/', protect(['admin']), parseBody('imagen'), async (req, res) => {
  try {
    const { titulo, descripcion, ubicacion, fecha_inicio, fecha_fin, presupuesto, estado, activa } = req.body;
    
    logger.startOperation('Crear obra', { titulo, ubicacion }, 'Obras');
    
    if (!titulo) {
      logger.warn('Intento de crear obra sin título', 'Obras');
      return res.status(400).json({ message: 'El título es requerido.' });
    }

    // Construir URL de imagen si se subió archivo
    let imagen_url = null;
    if (req.file) {
      imagen_url = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
      logger.info(`Imagen adjunta a obra: ${imagen_url}`, 'Obras');
    }

    const [obraId] = await knex('obras').insert({
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

    logger.endOperation('Crear obra', { id: obraId, titulo }, 'Obras');
    logger.info(`Nueva obra creada: "${titulo}" (ID: ${obraId})`, 'Obras');

    res.status(201).json({ 
      message: 'Obra creada exitosamente', 
      obraId,
      imagen_url 
    });
  } catch (err) {
    logger.operationError('Crear obra', err, 'Obras');
    res.status(500).json({ error: 'Error creando la obra.', details: err.message });
  }
});

// Actualizar obra (solo admin)
router.put('/:id', protect(['admin']), parseBody('imagen'), async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Actualizar obra', { id }, 'Obras');
  
  try {
    const obra = await knex('obras').where('id', id).first();
    if (!obra) {
      logger.warn(`Intento de actualizar obra inexistente ID: ${id}`, 'Obras');
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
      logger.info(`Nueva imagen para obra ID ${id}: ${updateData.imagen_url}`, 'Obras');
    }
    
    updateData.updated_at = knex.fn.now();

    await knex('obras').where('id', id).update(updateData);

    logger.endOperation('Actualizar obra', { id, cambios: Object.keys(updateData) }, 'Obras');
    logger.info(`Obra ID ${id} actualizada. Campos modificados: ${Object.keys(updateData).join(', ')}`, 'Obras');

    res.status(200).json({ 
      message: 'Obra actualizada exitosamente',
      imagen_url: updateData.imagen_url || obra.imagen_url
    });
  } catch (err) {
    logger.operationError('Actualizar obra', err, 'Obras');
    res.status(500).json({ error: 'Error actualizando la obra.', details: err.message });
  }
});

// Eliminar obra (solo admin)
router.delete('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params;

  logger.startOperation('Eliminar obra', { id }, 'Obras');

  try {
    const obra = await knex('obras').where('id', id).first();
    if (!obra) {
      logger.warn(`Intento de eliminar obra inexistente ID: ${id}`, 'Obras');
      return res.status(404).json({ message: 'Obra no encontrada.' });
    }

    await knex('obras').where('id', id).del();
    
    logger.endOperation('Eliminar obra', { id, titulo: obra.titulo }, 'Obras');
    logger.info(`Obra ID ${id} "${obra.titulo}" eliminada`, 'Obras');
    
    res.status(200).json({ message: 'Obra eliminada exitosamente.' });
  } catch (err) {
    logger.operationError('Eliminar obra', err, 'Obras');
    res.status(500).json({ error: 'Error eliminando la obra.', details: err.message });
  }
});

module.exports = router;
