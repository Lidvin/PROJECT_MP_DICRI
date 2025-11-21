
const authService = require('../services/authService');

const login = async (req, res, next) => {
  try {
    const { usuarioLogin, contrasenia } = req.body;

    if (!usuarioLogin || !contrasenia) {
      return res.status(400).json({ ok: false, message: 'Usuario y contraseña son obligatorios' });
    }

    const data = await authService.login(usuarioLogin, contrasenia);

    res.json({
      ok: true,
      message: 'Login exitoso',
      ...data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login
};

