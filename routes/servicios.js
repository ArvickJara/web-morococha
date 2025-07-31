const express = require('express');
const knex = require('knex')(require('../knexfile'));
const protect = require('../middleware/auth');
const { parseBody } = require('../middleware/parseBody');

const router = express.Router();

// Obtener todos los servicios (público)
router.get('/', async (req, res) => {
  try {
    const servicios = await knex('servicios')
      .select('*')
      .where('activo', true)
      .orderBy('orden');

    res.status(200).json(servicios);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo servicios.', details: err.message });
  }
});

// Obtener servicio por ID (público)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const servicio = await knex('servicios').where('id', id).first();

    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    res.status(200).json({ servicio });
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo el servicio.', details: err.message });
  }
});

// Crear nuevo servicio - ACEPTA JSON Y FORM-DATA
router.post('/', protect(['admin']), parseBody(), async (req, res) => {
  const { municipalidad_id, nombre, descripcion, icono, activo, orden } = req.body;

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

    res.status(201).json({ message: 'Servicio creado exitosamente', servicioId });
  } catch (err) {
    res.status(500).json({ error: 'Error creando el servicio.', details: err.message });
  }
});

// Actualizar servicio - ACEPTA JSON Y FORM-DATA
router.put('/:id', protect(['admin']), parseBody(), async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, icono, activo, orden } = req.body;

  try {
    const servicio = await knex('servicios').where('id', id).first();
    if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado.' });

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (descripcion) updateData.descripcion = descripcion;
    if (icono) updateData.icono = icono;
    if (activo !== undefined) updateData.activo = activo;
    if (orden !== undefined) updateData.orden = orden;

    await knex('servicios').where('id', id).update(updateData);

    res.status(200).json({ message: 'Servicio actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando el servicio.', details: err.message });
  }
});

// Eliminar servicio (solo admin)
router.delete('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params;

  try {
    const servicio = await knex('servicios').where('id', id).first();
    if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado.' });

    await knex('servicios').where('id', id).del();
    res.status(200).json({ message: 'Servicio eliminado exitosamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando el servicio.', details: err.message });
  }
});

module.exports = router;
