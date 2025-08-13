const express = require('express');
const knex = require('knex')(require('../knexfile'));
const protect = require('../middleware/auth');
const { parseBody } = require('../middleware/parseBody');
const logger = require('../utils/logger');

const router = express.Router();

// Obtener todos los tipos de convocatorias (público)
router.get('/', async (req, res) => {
  const { activo = true } = req.query;
  
  logger.startOperation('Obtener tipos de convocatorias', { activo }, 'ConvocatoriaTipos');
  
  try {
    const tipos = await knex('convocatoria_tipos')
      .where('activo', activo === 'false' ? false : Boolean(activo))
      .orderBy('nombre');

    logger.endOperation('Obtener tipos de convocatorias', { count: tipos.length }, 'ConvocatoriaTipos');
    res.status(200).json(tipos);
  } catch (err) {
    logger.operationError('Obtener tipos de convocatorias', err, 'ConvocatoriaTipos');
    res.status(500).json({ error: 'Error obteniendo tipos de convocatorias.', details: err.message });
  }
});

// Obtener un tipo de convocatoria por ID (público)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Obtener tipo de convocatoria por ID', { id }, 'ConvocatoriaTipos');

  try {
    const tipo = await knex('convocatoria_tipos').where('id', id).first();

    if (!tipo) {
      logger.warn(`Tipo de convocatoria con ID ${id} no encontrado`, 'ConvocatoriaTipos');
      return res.status(404).json({ message: 'Tipo de convocatoria no encontrado.' });
    }

    logger.endOperation('Obtener tipo de convocatoria por ID', { nombre: tipo.nombre }, 'ConvocatoriaTipos');
    res.status(200).json({ tipo });
  } catch (err) {
    logger.operationError('Obtener tipo de convocatoria por ID', err, 'ConvocatoriaTipos');
    res.status(500).json({ error: 'Error obteniendo el tipo de convocatoria.', details: err.message });
  }
});

// Crear nuevo tipo de convocatoria (solo admin)
router.post('/', protect(['admin']), parseBody(), async (req, res) => {
  try {
    const { nombre, descripcion, activo } = req.body;
    
    logger.startOperation('Crear tipo de convocatoria', { nombre }, 'ConvocatoriaTipos');
    
    if (!nombre) {
      logger.warn('Intento de crear tipo de convocatoria sin nombre', 'ConvocatoriaTipos');
      return res.status(400).json({ message: 'El nombre es requerido.' });
    }

    const [tipoId] = await knex('convocatoria_tipos').insert({
      nombre,
      descripcion: descripcion || null,
      activo: activo !== undefined ? (activo === 'true' || activo === true) : true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    });

    logger.endOperation('Crear tipo de convocatoria', { id: tipoId, nombre }, 'ConvocatoriaTipos');
    logger.info(`Nuevo tipo de convocatoria creado: "${nombre}" (ID: ${tipoId})`, 'ConvocatoriaTipos');

    res.status(201).json({ 
      message: 'Tipo de convocatoria creado exitosamente', 
      tipoId
    });
  } catch (err) {
    logger.operationError('Crear tipo de convocatoria', err, 'ConvocatoriaTipos');
    res.status(500).json({ error: 'Error creando el tipo de convocatoria.', details: err.message });
  }
});

// Actualizar tipo de convocatoria (solo admin)
router.put('/:id', protect(['admin']), parseBody(), async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Actualizar tipo de convocatoria', { id }, 'ConvocatoriaTipos');
  
  try {
    const tipo = await knex('convocatoria_tipos').where('id', id).first();
    if (!tipo) {
      logger.warn(`Intento de actualizar tipo de convocatoria inexistente ID: ${id}`, 'ConvocatoriaTipos');
      return res.status(404).json({ message: 'Tipo de convocatoria no encontrado.' });
    }

    const { nombre, descripcion, activo } = req.body;

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (activo !== undefined) updateData.activo = activo === 'true' || activo === true;
    
    updateData.updated_at = knex.fn.now();

    await knex('convocatoria_tipos').where('id', id).update(updateData);

    logger.endOperation('Actualizar tipo de convocatoria', { id, cambios: Object.keys(updateData) }, 'ConvocatoriaTipos');
    logger.info(`Tipo de convocatoria ID ${id} actualizado. Campos modificados: ${Object.keys(updateData).join(', ')}`, 'ConvocatoriaTipos');

    res.status(200).json({ 
      message: 'Tipo de convocatoria actualizado exitosamente'
    });
  } catch (err) {
    logger.operationError('Actualizar tipo de convocatoria', err, 'ConvocatoriaTipos');
    res.status(500).json({ error: 'Error actualizando el tipo de convocatoria.', details: err.message });
  }
});

// Eliminar tipo de convocatoria (solo admin)
router.delete('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params;

  logger.startOperation('Eliminar tipo de convocatoria', { id }, 'ConvocatoriaTipos');

  try {
    const tipo = await knex('convocatoria_tipos').where('id', id).first();
    if (!tipo) {
      logger.warn(`Intento de eliminar tipo de convocatoria inexistente ID: ${id}`, 'ConvocatoriaTipos');
      return res.status(404).json({ message: 'Tipo de convocatoria no encontrado.' });
    }

    // Verificar si hay convocatorias asociadas a este tipo
    const convocatoriasCount = await knex('convocatorias').where('tipo_id', id).count('* as total').first();
    
    if (parseInt(convocatoriasCount.total) > 0) {
      logger.warn(`Intento de eliminar tipo de convocatoria ID: ${id} con convocatorias asociadas`, 'ConvocatoriaTipos');
      return res.status(400).json({ 
        message: 'No se puede eliminar este tipo de convocatoria porque tiene convocatorias asociadas.' 
      });
    }

    await knex('convocatoria_tipos').where('id', id).del();
    
    logger.endOperation('Eliminar tipo de convocatoria', { id, nombre: tipo.nombre }, 'ConvocatoriaTipos');
    logger.info(`Tipo de convocatoria ID ${id} "${tipo.nombre}" eliminado`, 'ConvocatoriaTipos');
    
    res.status(200).json({ message: 'Tipo de convocatoria eliminado exitosamente.' });
  } catch (err) {
    logger.operationError('Eliminar tipo de convocatoria', err, 'ConvocatoriaTipos');
    res.status(500).json({ error: 'Error eliminando el tipo de convocatoria.', details: err.message });
  }
});

module.exports = router;
