const jwt = require('jsonwebtoken');

const protect = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso no autorizado, token no encontrado.' });
      }

      const token = authHeader.replace('Bearer ', '').trim();

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      
      // Asignar el usuario decodificado a req.user
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acceso denegado, no tienes permisos suficientes.' });
      }

      next();
    } catch (error) {
      console.error('Error al verificar el token:', error.message);
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
  };
};

module.exports = protect;