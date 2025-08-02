const express = require('express');
const knex = require('knex')(require('../knexfile'));
const protect = require('../middleware/auth');
const { parseBody } = require('../middleware/parseBody');
const logger = require('../utils/logger');

const router = express.Router();

// Obtener información completa de la municipalidad (público)
router.get('/', async (req, res) => {
  logger.startOperation('Obtener información municipalidad', {}, 'Municipalidad');
  
  try {
    const municipalidad = await knex('municipalidad').first();
    
    if (!municipalidad) {
      logger.warn('Información de municipalidad no encontrada en base de datos', 'Municipalidad');
      return res.status(404).json({ message: 'Información de municipalidad no encontrada.' });
    }

    // Obtener redes sociales
    const redes_sociales = await knex('redes_sociales')
      .where('municipalidad_id', municipalidad.id)
      .where('activo', true);

    // Obtener servicios
    const servicios = await knex('servicios')
      .where('municipalidad_id', municipalidad.id)
      .where('activo', true)
      .orderBy('orden');

    // Combinar toda la información
    const response = {
      ...municipalidad,
      redes_sociales,
      servicios
    };

    logger.endOperation('Obtener información municipalidad', { 
      nombre: municipalidad.nombre,
      redes: redes_sociales.length,
      servicios: servicios.length
    }, 'Municipalidad');

    res.status(200).json(response);
  } catch (err) {
    logger.operationError('Obtener información municipalidad', err, 'Municipalidad');
    res.status(500).json({ error: 'Error obteniendo información de municipalidad.', details: err.message });
  }
});

// Actualizar información básica de la municipalidad (solo admin)
router.put('/:id', protect(['admin']), parseBody(), async (req, res) => {
  const { id } = req.params;
  const { nombre, slogan, direccion, telefono, email, horarios_atencion } = req.body;
  
  logger.startOperation('Actualizar información municipalidad', { id }, 'Municipalidad');

  try {
    const municipalidad = await knex('municipalidad').where('id', id).first();
    if (!municipalidad) {
      logger.warn(`Intento de actualizar municipalidad inexistente ID: ${id}`, 'Municipalidad');
      return res.status(404).json({ message: 'Municipalidad no encontrada.' });
    }

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (slogan) updateData.slogan = slogan;
    if (direccion) updateData.direccion = direccion;
    if (telefono) updateData.telefono = telefono;
    if (email) updateData.email = email;
    if (horarios_atencion) updateData.horarios_atencion = horarios_atencion;
    updateData.updated_at = knex.fn.now();

    await knex('municipalidad').where('id', id).update(updateData);

    logger.endOperation('Actualizar información municipalidad', { id, cambios: Object.keys(updateData) }, 'Municipalidad');
    logger.info(`Información de municipalidad ID ${id} actualizada. Campos modificados: ${Object.keys(updateData).join(', ')}`, 'Municipalidad');
    
    res.status(200).json({ message: 'Información de municipalidad actualizada exitosamente' });
  } catch (err) {
    logger.operationError('Actualizar información municipalidad', err, 'Municipalidad');
    res.status(500).json({ error: 'Error actualizando información de municipalidad.', details: err.message });
  }
});

module.exports = router;
