const express = require('express');
const knex = require('knex')(require('../knexfile'));
const protect = require('../middleware/auth');
const { parseBody } = require('../middleware/parseBody');
const logger = require('../utils/logger');

const router = express.Router();

// Obtener todas las redes sociales (público)
router.get('/', async (req, res) => {
  logger.startOperation('Obtener redes sociales', {}, 'RedesSociales');
  
  try {
    const redes = await knex('redes_sociales')
      .select('*')
      .where('activo', true)
      .orderBy('plataforma');

    logger.endOperation('Obtener redes sociales', { count: redes.length }, 'RedesSociales');
    res.status(200).json(redes);
  } catch (err) {
    logger.operationError('Obtener redes sociales', err, 'RedesSociales');
    res.status(500).json({ error: 'Error obteniendo redes sociales.', details: err.message });
  }
});

// Obtener red social por ID (público)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Obtener red social por ID', { id }, 'RedesSociales');

  try {
    const red = await knex('redes_sociales').where('id', id).first();

    if (!red) {
      logger.warn(`Red social con ID ${id} no encontrada`, 'RedesSociales');
      return res.status(404).json({ message: 'Red social no encontrada.' });
    }

    logger.endOperation('Obtener red social por ID', { plataforma: red.plataforma }, 'RedesSociales');
    res.status(200).json({ red });
  } catch (err) {
    logger.operationError('Obtener red social por ID', err, 'RedesSociales');
    res.status(500).json({ error: 'Error obteniendo la red social.', details: err.message });
  }
});

// Crear nueva red social (solo admin)
router.post('/', protect(['admin']), parseBody(), async (req, res) => {
  const { municipalidad_id, plataforma, url, activo } = req.body;
  
  logger.startOperation('Crear red social', { plataforma, municipalidad_id }, 'RedesSociales');

  try {
    const [redId] = await knex('redes_sociales').insert({
      municipalidad_id,
      plataforma,
      url,
      activo: activo !== undefined ? activo : true,
      created_at: knex.fn.now()
    });

    logger.endOperation('Crear red social', { id: redId, plataforma }, 'RedesSociales');
    logger.info(`Nueva red social creada: "${plataforma}" (ID: ${redId})`, 'RedesSociales');
    
    res.status(201).json({ message: 'Red social creada exitosamente', redId });
  } catch (err) {
    logger.operationError('Crear red social', err, 'RedesSociales');
    res.status(500).json({ error: 'Error creando la red social.', details: err.message });
  }
});

// Actualizar red social (solo admin)
router.put('/:id', protect(['admin']), parseBody(), async (req, res) => {
  const { id } = req.params;
  const { plataforma, url, activo } = req.body;
  
  logger.startOperation('Actualizar red social', { id }, 'RedesSociales');

  try {
    const red = await knex('redes_sociales').where('id', id).first();
    if (!red) {
      logger.warn(`Intento de actualizar red social inexistente ID: ${id}`, 'RedesSociales');
      return res.status(404).json({ message: 'Red social no encontrada.' });
    }

    const updateData = {};
    if (plataforma) updateData.plataforma = plataforma;
    if (url) updateData.url = url;
    if (activo !== undefined) updateData.activo = activo;

    await knex('redes_sociales').where('id', id).update(updateData);

    logger.endOperation('Actualizar red social', { id, cambios: Object.keys(updateData) }, 'RedesSociales');
    logger.info(`Red social ID ${id} actualizada. Campos modificados: ${Object.keys(updateData).join(', ')}`, 'RedesSociales');
    
    res.status(200).json({ message: 'Red social actualizada exitosamente' });
  } catch (err) {
    logger.operationError('Actualizar red social', err, 'RedesSociales');
    res.status(500).json({ error: 'Error actualizando la red social.', details: err.message });
  }
});

// Eliminar red social (solo admin)
router.delete('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Eliminar red social', { id }, 'RedesSociales');

  try {
    const red = await knex('redes_sociales').where('id', id).first();
    if (!red) {
      logger.warn(`Intento de eliminar red social inexistente ID: ${id}`, 'RedesSociales');
      return res.status(404).json({ message: 'Red social no encontrada.' });
    }

    await knex('redes_sociales').where('id', id).del();
    
    logger.endOperation('Eliminar red social', { id, plataforma: red.plataforma }, 'RedesSociales');
    logger.info(`Red social ID ${id} "${red.plataforma}" eliminada`, 'RedesSociales');
    
    res.status(200).json({ message: 'Red social eliminada exitosamente.' });
  } catch (err) {
    logger.operationError('Eliminar red social', err, 'RedesSociales');
    res.status(500).json({ error: 'Error eliminando la red social.', details: err.message });
  }
});

module.exports = router;
