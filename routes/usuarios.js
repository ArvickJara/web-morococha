const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Verificar si knex se puede cargar correctamente
let knex;
try {
    knex = require('knex')(require('../knexfile'));
    console.log('Knex para usuarios cargado correctamente');
} catch (error) {
    console.error('Error cargando knex en usuarios:', error.message);
    throw error;
}

// Ruta de prueba simple
router.get('/test', (req, res) => {
    res.json({ message: 'Usuarios funcionando correctamente' });
});

// Login - ruta específica
router.post('/login', async (req, res) => {
  // Validar que req.body existe
  if (!req.body) {
    return res.status(400).json({ message: 'Datos requeridos no enviados.' });
  }

  const { email, password } = req.body;

  // Validar que email y password están presentes
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }

  try {
    const usuario = await knex('usuarios').where('email', email).first();
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta.' });

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '30d' }
    );

    res.status(200).json({ message: 'Login exitoso', token, role: usuario.role });
  } catch (err) {
    res.status(500).json({ error: 'Error en el login.', details: err.message });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await knex('usuarios')
      .select('id', 'role', 'nombres', 'primer_apellido', 'segundo_apellido', 'dni', 'email', 'telefono', 'created_at')
      .orderBy('id', 'desc');

    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo usuarios.', details: err.message });
  }
});

// Crear nuevo usuario
router.post('/', async (req, res) => {
  const { role, nombres, primer_apellido, segundo_apellido, dni, email, telefono, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userId] = await knex('usuarios').insert({
      role,
      nombres,
      primer_apellido,
      segundo_apellido,
      dni,
      email,
      telefono,
      password: hashedPassword,
      created_at: knex.fn.now()
    });

    res.status(201).json({ message: 'Usuario creado exitosamente', userId });
  } catch (err) {
    res.status(500).json({ error: 'Error creando el usuario.', details: err.message });
  }
});

// Rutas con parámetros al final
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await knex('usuarios')
      .select('id', 'role', 'nombres', 'primer_apellido', 'segundo_apellido', 'dni', 'email', 'telefono', 'created_at')
      .where('id', id)
      .first();

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ usuario });
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo el usuario.', details: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { role, nombres, primer_apellido, segundo_apellido, dni, email, telefono, password } = req.body;

  try {
    const user = await knex('usuarios').where('id', id).first();
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const updateData = {};
    if (role) updateData.role = role;
    if (nombres) updateData.nombres = nombres;
    if (primer_apellido) updateData.primer_apellido = primer_apellido;
    if (segundo_apellido) updateData.segundo_apellido = segundo_apellido;
    if (dni) updateData.dni = dni;
    if (email) updateData.email = email;
    if (telefono) updateData.telefono = telefono;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    await knex('usuarios').where('id', id).update(updateData);

    res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando el usuario.', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await knex('usuarios').where('id', id).first();
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    await knex('usuarios').where('id', id).del();
    res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando el usuario.', details: err.message });
  }
});

console.log('Rutas de usuarios definidas correctamente');
module.exports = router;
