const express = require('express');
const knex = require('knex')(require('../knexfile'));
const protect = require('../middleware/auth');
const { parseBody } = require('../middleware/parseBody');
const logger = require('../utils/logger');

const router = express.Router();

// Obtener todos los servicios (público)
router.get('/', async (req, res) => {
  logger.startOperation('Obtener servicios', {}, 'Servicios');
  
  try {
    const servicios = await knex('servicios')
      .select('*')
      .where('activo', true)
      .orderBy('orden');

    logger.endOperation('Obtener servicios', { count: servicios.length }, 'Servicios');
    res.status(200).json(servicios);
  } catch (err) {
    logger.operationError('Obtener servicios', err, 'Servicios');
    res.status(500).json({ error: 'Error obteniendo servicios.', details: err.message });
  }
});

// Obtener servicio por ID (público)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  logger.startOperation('Obtener servicio por ID', { id }, 'Servicios');

  try {
    const servicio = await knex('servicios').where('id', id).first();

    if (!servicio) {
      logger.warn(`Servicio con ID ${id} no encontrado`, 'Servicios');
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    logger.endOperation('Obtener servicio por ID', { nombre: servicio.nombre }, 'Servicios');
    res.status(200).json({ servicio });
  } catch (err) {
    logger.operationError('Obtener servicio por ID', err, 'Servicios');
    res.status(500).json({ error: 'Error obteniendo el servicio.', details: err.message });
  }
});

// Crear nuevo servicio - ACEPTA JSON Y FORM-DATA
router.post('/', protect(['admin']), parseBody(), async (req, res) => {
  const { municipalidad_id, nombre, descripcion, icono, activo, orden } = req.body;
  logger.startOperation('Crear servicio', { nombre, municipalidad_id }, 'Servicios');

  try {
    const [servicioId] = await knex('servicios').insert({
      municipalidad_id,
      nombre,
      descripcion,
      icono,
      activo: activo !== undefined ? activo : true,
      orden: orden || 0,
      created_at: knex.fn.now()
    });

    logger.endOperation('Crear servicio', { id: servicioId, nombre }, 'Servicios');
    logger.info(`Nuevo servicio creado: "${nombre}" (ID: ${servicioId})`, 'Servicios');
    
    res.status(201).json({ message: 'Servicio creado exitosamente', servicioId });
  } catch (err) {
    logger.operationError('Crear servicio', err, 'Servicios');
    res.status(500).json({ error: 'Error creando el servicio.', details: err.message });
  }
});

// Actualizar servicio - ACEPTA JSON Y FORM-DATA
router.put('/:id', protect(['admin']), parseBody(), async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, icono, activo, orden } = req.body;
  
  logger.startOperation('Actualizar servicio', { id }, 'Servicios');

  try {
    const servicio = await knex('servicios').where('id', id).first();
    if (!servicio) {
      logger.warn(`Intento de actualizar servicio inexistente ID: ${id}`, 'Servicios');
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (descripcion) updateData.descripcion = descripcion;
    if (icono) updateData.icono = icono;
    if (activo !== undefined) updateData.activo = activo;
    if (orden !== undefined) updateData.orden = orden;

    await knex('servicios').where('id', id).update(updateData);

    logger.endOperation('Actualizar servicio', { id, cambios: Object.keys(updateData) }, 'Servicios');
    logger.info(`Servicio ID ${id} actualizado. Campos modificados: ${Object.keys(updateData).join(', ')}`, 'Servicios');
    
    res.status(200).json({ message: 'Servicio actualizado exitosamente' });
  } catch (err) {
    logger.operationError('Actualizar servicio', err, 'Servicios');
    res.status(500).json({ error: 'Error actualizando el servicio.', details: err.message });
  }
});

// Eliminar servicio (solo admin)
router.delete('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Eliminar servicio', { id }, 'Servicios');

  try {
    const servicio = await knex('servicios').where('id', id).first();
    if (!servicio) {
      logger.warn(`Intento de eliminar servicio inexistente ID: ${id}`, 'Servicios');
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    await knex('servicios').where('id', id).del();
    
    logger.endOperation('Eliminar servicio', { id, nombre: servicio.nombre }, 'Servicios');
    logger.info(`Servicio ID ${id} "${servicio.nombre}" eliminado`, 'Servicios');
    
    res.status(200).json({ message: 'Servicio eliminado exitosamente.' });
  } catch (err) {
    logger.operationError('Eliminar servicio', err, 'Servicios');
    res.status(500).json({ error: 'Error eliminando el servicio.', details: err.message });
  }
});

module.exports = router;
