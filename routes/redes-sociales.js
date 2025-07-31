const express = require('express');
const knex = require('knex')(require('../knexfile'));
const protect = require('../middleware/auth');
const { parseBody } = require('../middleware/parseBody');

const router = express.Router();

// Obtener todas las redes sociales (público)
router.get('/', async (req, res) => {
  try {
    const redes = await knex('redes_sociales')
      .select('*')
      .where('activo', true)
      .orderBy('plataforma');

    res.status(200).json(redes);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo redes sociales.', details: err.message });
  }
});

// Obtener red social por ID (público)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const red = await knex('redes_sociales').where('id', id).first();

    if (!red) {
      return res.status(404).json({ message: 'Red social no encontrada.' });
    }

    res.status(200).json({ red });
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo la red social.', details: err.message });
  }
});

// Crear nueva red social (solo admin)
router.post('/', protect(['admin']), parseBody(), async (req, res) => {
  const { municipalidad_id, plataforma, url, activo } = req.body;

  try {
    const [redId] = await knex('redes_sociales').insert({
      municipalidad_id,
      plataforma,
      url,
      activo: activo !== undefined ? activo : true,
      created_at: knex.fn.now()
    });

    res.status(201).json({ message: 'Red social creada exitosamente', redId });
  } catch (err) {
    res.status(500).json({ error: 'Error creando la red social.', details: err.message });
  }
});

// Actualizar red social (solo admin)
router.put('/:id', protect(['admin']), parseBody(), async (req, res) => {
  const { id } = req.params;
  const { plataforma, url, activo } = req.body;

  try {
    const red = await knex('redes_sociales').where('id', id).first();
    if (!red) return res.status(404).json({ message: 'Red social no encontrada.' });

    const updateData = {};
    if (plataforma) updateData.plataforma = plataforma;
    if (url) updateData.url = url;
    if (activo !== undefined) updateData.activo = activo;

    await knex('redes_sociales').where('id', id).update(updateData);

    res.status(200).json({ message: 'Red social actualizada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando la red social.', details: err.message });
  }
});

// Eliminar red social (solo admin)
router.delete('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params;

  try {
    const red = await knex('redes_sociales').where('id', id).first();
    if (!red) return res.status(404).json({ message: 'Red social no encontrada.' });

    await knex('redes_sociales').where('id', id).del();
    res.status(200).json({ message: 'Red social eliminada exitosamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando la red social.', details: err.message });
  }
});

module.exports = router;
