
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, message: 'No autenticado' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 
      
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(decoded.rol)) {
        return res.status(403).json({ ok: false, message: 'No autorizado' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
    }
  };
};

module.exports = {
  authMiddleware
};

