
const bcrypt = require('bcryptjs');
const { executeStoredProcedure } = require('../utils/dbHelper');

const crearUsuario = async ({ nombreCompleto, usuarioLogin, contrasenia, correo, idRol }) => {
  const hash = await bcrypt.hash(contrasenia, 10);

  const result = await executeStoredProcedure('usp_Usuario_Crear', {
    NombreCompleto: nombreCompleto,
    UsuarioLogin: usuarioLogin,
    ContraseniaHash: Buffer.from(hash, 'utf8'),
    Correo: correo || null,
    IdRol: idRol
  });

  const idUsuarioCreado = result.recordset[0]?.IdUsuarioCreado;
  return idUsuarioCreado;
};

const actualizarUsuario = async ({ idUsuario, nombreCompleto, correo, idRol, activo }) => {
  await executeStoredProcedure('usp_Usuario_Actualizar', {
    IdUsuario: idUsuario,
    NombreCompleto: nombreCompleto,
    Correo: correo || null,
    IdRol: idRol,
    Activo: activo
  });
};

const obtenerUsuarioPorId = async (idUsuario) => {
  const result = await executeStoredProcedure('usp_Usuario_ObtenerPorId', {
    IdUsuario: idUsuario
  });

  return result.recordset[0] || null;
};

const listarUsuarios = async ({ idRol, activo }) => {
  const result = await executeStoredProcedure('usp_Usuario_Listar', {
    IdRol: idRol || null,
    Activo: typeof activo === 'boolean' ? (activo ? 1 : 0) : null
  });

  return result.recordset;
};

module.exports = {
  crearUsuario,
  actualizarUsuario,
  obtenerUsuarioPorId,
  listarUsuarios
};

