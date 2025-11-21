
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { executeStoredProcedure } = require('../utils/dbHelper');
require('dotenv').config();

const login = async (usuarioLogin, contraseniaPlano) => {
  
  const result = await executeStoredProcedure('usp_Usuario_ObtenerPorLogin', {
    UsuarioLogin: usuarioLogin
  });

  if (result.recordset.length === 0) {
    const error = new Error('Usuario o contraseña incorrectos');
    error.statusCode = 400;
    throw error;
  }

  const user = result.recordset[0];

  
  const hashAlmacenado = Buffer.isBuffer(user.ContraseniaHash)
    ? user.ContraseniaHash.toString('utf8')
    : user.ContraseniaHash;

  const passwordValida = await bcrypt.compare(contraseniaPlano, hashAlmacenado);

  if (!passwordValida) {
    const error = new Error('Usuario o contraseña incorrectos');
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign(
    {
      idUsuario: user.IdUsuario,
      nombre: user.NombreCompleto,
      rol: user.NombreRol
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  
  await executeStoredProcedure('usp_Auditoria_Registrar', {
    IdUsuario: user.IdUsuario,
    Accion: 'Login exitoso',
    TablaAfectada: null,
    IdRegistroAfectado: null
  });

  return {
    token,
    usuario: {
      idUsuario: user.IdUsuario,
      nombre: user.NombreCompleto,
      usuarioLogin: user.UsuarioLogin,
      rol: user.NombreRol
    }
  };
};

module.exports = {
  login
};

