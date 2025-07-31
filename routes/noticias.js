const express = require('express');
const knex = require('knex')(require('../knexfile'));
const protect = require('../middleware/auth');
const { parseBody } = require('../middleware/parseBody');

const router = express.Router();

// Obtener todas las noticias (público)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, destacada, activa = true } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = knex('noticias').where('activa', activa);
    
    if (destacada !== undefined) {
      query = query.where('destacada', destacada);
    }

    const total = await query.clone().count('* as total').first();
    const totalPages = Math.ceil(total.total / limit);

    const noticias = await query
      .select('id', 'titulo', 'resumen', 'imagen_url', 'autor', 'destacada', 'fecha_publicacion', 'created_at')
      .orderBy('fecha_publicacion', 'desc')
      .limit(limit)
      .offset(offset);

    res.status(200).json({
      noticias,
      pagination: {
        total: parseInt(total.total),
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo noticias.', details: err.message });
  }
});

// Obtener una noticia por ID (público)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const noticia = await knex('noticias').where('id', id).where('activa', true).first();

    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada.' });
    }

    res.status(200).json({ noticia });
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo la noticia.', details: err.message });
  }
});

// Crear nueva noticia - ACEPTA JSON Y FORM-DATA
router.post('/', protect(['admin']), parseBody('imagen'), async (req, res) => {
  try {
    const { titulo, resumen, contenido, autor, destacada, fecha_publicacion } = req.body;
    
    if (!titulo) {
      return res.status(400).json({ message: 'El título es requerido.' });
    }

    // Construir URL de imagen si se subió archivo
    let imagen_url = null;
    if (req.file) {
      imagen_url = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
    }

    const [noticiaId] = await knex('noticias').insert({
      titulo,
      resumen: resumen || null,
      contenido: contenido || null,
      imagen_url,
      autor: autor || null,
      destacada: destacada || false,
      fecha_publicacion: fecha_publicacion || knex.fn.now(),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    });

    res.status(201).json({ 
      message: 'Noticia creada exitosamente', 
      noticiaId,
      imagen_url 
    });
  } catch (err) {
    res.status(500).json({ error: 'Error creando la noticia.', details: err.message });
  }
});

// Actualizar noticia - ACEPTA JSON Y FORM-DATA
router.put('/:id', protect(['admin']), parseBody('imagen'), async (req, res) => {
  const { id } = req.params;
  
  try {
    const noticia = await knex('noticias').where('id', id).first();
    if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada.' });

    // Extraer datos del form-data
    const { titulo, resumen, contenido, autor, destacada, activa, fecha_publicacion } = req.body;

    const updateData = {};
    if (titulo) updateData.titulo = titulo;
    if (resumen !== undefined) updateData.resumen = resumen;
    if (contenido !== undefined) updateData.contenido = contenido;
    if (autor !== undefined) updateData.autor = autor;
    if (destacada !== undefined) updateData.destacada = destacada === 'true' || destacada === true;
    if (activa !== undefined) updateData.activa = activa === 'true' || activa === true;
    if (fecha_publicacion) updateData.fecha_publicacion = fecha_publicacion;
    
    // Si se subió nueva imagen, actualizar URL
    if (req.file) {
      updateData.imagen_url = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
    }
    
    updateData.updated_at = knex.fn.now();

    await knex('noticias').where('id', id).update(updateData);

    res.status(200).json({ 
      message: 'Noticia actualizada exitosamente',
      imagen_url: updateData.imagen_url || noticia.imagen_url
    });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando la noticia.', details: err.message });
  }
});

// Eliminar noticia (solo admin)
router.delete('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params;

  try {
    const noticia = await knex('noticias').where('id', id).first();
    if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada.' });

    await knex('noticias').where('id', id).del();
    res.status(200).json({ message: 'Noticia eliminada exitosamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando la noticia.', details: err.message });
  }
});

module.exports = router;
