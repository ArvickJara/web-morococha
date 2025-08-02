const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const router = express.Router();

// Verificar si knex se puede cargar correctamente
let knex;
try {
    knex = require('knex')(require('../knexfile'));
    logger.info('Knex para usuarios cargado correctamente', 'Usuarios');
    console.log('Knex para usuarios cargado correctamente');
} catch (error) {
    logger.error(`Error cargando knex en usuarios: ${error.message}`, 'Usuarios');
    console.error('Error cargando knex en usuarios:', error.message);
    throw error;
}

// Ruta de prueba simple
router.get('/test', (req, res) => {
    logger.debug('Prueba de ruta usuarios/test ejecutada', 'Usuarios');
    res.json({ message: 'Usuarios funcionando correctamente' });
});

// Login - ruta específica
router.post('/login', async (req, res) => {
  // Validar que req.body existe
  if (!req.body) {
    logger.warn('Intento de login sin datos', 'Usuarios');
    return res.status(400).json({ message: 'Datos requeridos no enviados.' });
  }

  const { email, password } = req.body;

  // Validar que email y password están presentes
  if (!email || !password) {
    logger.warn(`Intento de login con datos incompletos: ${email ? 'Email presente' : 'Email ausente'}, ${password ? 'Password presente' : 'Password ausente'}`, 'Usuarios');
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }

  logger.startOperation('Login de usuario', { email }, 'Usuarios');
  
  try {
    const usuario = await knex('usuarios').where('email', email).first();
    if (!usuario) {
      logger.warn(`Intento de login con email no registrado: ${email}`, 'Usuarios');
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      logger.warn(`Contraseña incorrecta para usuario: ${email}`, 'Usuarios');
      return res.status(400).json({ message: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '30d' }
    );

    logger.endOperation('Login de usuario', { userId: usuario.id, role: usuario.role }, 'Usuarios');
    logger.info(`Usuario ${email} (ID: ${usuario.id}) ha iniciado sesión exitosamente`, 'Usuarios');
    
    res.status(200).json({ message: 'Login exitoso', token, role: usuario.role });
  } catch (err) {
    logger.operationError('Login de usuario', err, 'Usuarios');
    res.status(500).json({ error: 'Error en el login.', details: err.message });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  logger.startOperation('Obtener lista de usuarios', {}, 'Usuarios');
  try {
    const usuarios = await knex('usuarios')
      .select('id', 'role', 'nombres', 'primer_apellido', 'segundo_apellido', 'dni', 'email', 'telefono', 'created_at')
      .orderBy('id', 'desc');

    logger.endOperation('Obtener lista de usuarios', { count: usuarios.length }, 'Usuarios');
    res.status(200).json(usuarios);
  } catch (err) {
    logger.operationError('Obtener lista de usuarios', err, 'Usuarios');
    res.status(500).json({ error: 'Error obteniendo usuarios.', details: err.message });
  }
});

// Crear nuevo usuario
router.post('/', async (req, res) => {
  const { role, nombres, primer_apellido, segundo_apellido, dni, email, telefono, password } = req.body;
  
  logger.startOperation('Crear usuario', { email, role, dni }, 'Usuarios');

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

    logger.endOperation('Crear usuario', { userId }, 'Usuarios');
    logger.info(`Nuevo usuario creado: ${email} (ID: ${userId}, Rol: ${role})`, 'Usuarios');
    
    res.status(201).json({ message: 'Usuario creado exitosamente', userId });
  } catch (err) {
    logger.operationError('Crear usuario', err, 'Usuarios');
    res.status(500).json({ error: 'Error creando el usuario.', details: err.message });
  }
});

// Rutas con parámetros al final
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Obtener usuario por ID', { id }, 'Usuarios');

  try {
    const usuario = await knex('usuarios')
      .select('id', 'role', 'nombres', 'primer_apellido', 'segundo_apellido', 'dni', 'email', 'telefono', 'created_at')
      .where('id', id)
      .first();

    if (!usuario) {
      logger.warn(`Usuario con ID ${id} no encontrado`, 'Usuarios');
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    logger.endOperation('Obtener usuario por ID', { encontrado: true }, 'Usuarios');
    res.status(200).json({ usuario });
  } catch (err) {
    logger.operationError('Obtener usuario por ID', err, 'Usuarios');
    res.status(500).json({ error: 'Error obteniendo el usuario.', details: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { role, nombres, primer_apellido, segundo_apellido, dni, email, telefono, password } = req.body;
  
  logger.startOperation('Actualizar usuario', { id, email }, 'Usuarios');

  try {
    const user = await knex('usuarios').where('id', id).first();
    if (!user) {
      logger.warn(`Intento de actualizar usuario inexistente ID: ${id}`, 'Usuarios');
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

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

    logger.endOperation('Actualizar usuario', { id, cambios: Object.keys(updateData) }, 'Usuarios');
    logger.info(`Usuario ID ${id} actualizado. Campos modificados: ${Object.keys(updateData).join(', ')}`, 'Usuarios');
    
    res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (err) {
    logger.operationError('Actualizar usuario', err, 'Usuarios');
    res.status(500).json({ error: 'Error actualizando el usuario.', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  logger.startOperation('Eliminar usuario', { id }, 'Usuarios');

  try {
    const user = await knex('usuarios').where('id', id).first();
    if (!user) {
      logger.warn(`Intento de eliminar usuario inexistente ID: ${id}`, 'Usuarios');
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    await knex('usuarios').where('id', id).del();
    
    logger.endOperation('Eliminar usuario', { id }, 'Usuarios');
    logger.info(`Usuario ID ${id} eliminado`, 'Usuarios');
    
    res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (err) {
    logger.operationError('Eliminar usuario', err, 'Usuarios');
    res.status(500).json({ error: 'Error eliminando el usuario.', details: err.message });
  }
});

console.log('Rutas de usuarios definidas correctamente');
logger.info('Rutas de usuarios definidas correctamente', 'Usuarios');
module.exports = router;
