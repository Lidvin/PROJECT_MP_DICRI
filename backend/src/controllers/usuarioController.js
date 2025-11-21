
const usuarioService = require('../services/usuarioService');
const { executeStoredProcedure } = require('../utils/dbHelper');

const crearUsuario = async (req, res, next) => {
  try {
    const { nombreCompleto, usuarioLogin, contrasenia, correo, idRol } = req.body;
    const idAdmin = req.user.idUsuario;

    if (!nombreCompleto || !usuarioLogin || !contrasenia || !idRol) {
      return res.status(400).json({
        ok: false,
        message: 'Nombre completo, usuarioLogin, contraseña e idRol son obligatorios'
      });
    }

    const idUsuario = await usuarioService.crearUsuario({
      nombreCompleto,
      usuarioLogin,
      contrasenia,
      correo,
      idRol
    });

    await executeStoredProcedure('usp_Auditoria_Registrar', {
      IdUsuario: idAdmin,
      Accion: `Creación de usuario ${usuarioLogin}`,
      TablaAfectada: 'Usuarios',
      IdRegistroAfectado: idUsuario
    });

    res.status(201).json({
      ok: true,
      message: 'Usuario creado correctamente',
      idUsuario
    });
  } catch (error) {
    next(error);
  }
};

const actualizarUsuario = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const { nombreCompleto, correo, idRol, activo } = req.body;
    const idAdmin = req.user.idUsuario;

    if (!nombreCompleto || !idRol || typeof activo !== 'boolean') {
      return res.status(400).json({
        ok: false,
        message: 'nombreCompleto, idRol y activo son obligatorios'
      });
    }

    await usuarioService.actualizarUsuario({
      idUsuario: parseInt(idUsuario, 10),
      nombreCompleto,
      correo,
      idRol,
      activo
    });

    await executeStoredProcedure('usp_Auditoria_Registrar', {
      IdUsuario: idAdmin,
      Accion: `Actualización de usuario ID=${idUsuario}`,
      TablaAfectada: 'Usuarios',
      IdRegistroAfectado: idUsuario
    });

    res.json({
      ok: true,
      message: 'Usuario actualizado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

const obtenerUsuario = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;

    const usuario = await usuarioService.obtenerUsuarioPorId(parseInt(idUsuario, 10));

    if (!usuario) {
      return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    }

    res.json({ ok: true, data: usuario });
  } catch (error) {
    next(error);
  }
};

const listarUsuarios = async (req, res, next) => {
  try {
    const { idRol, activo } = req.query;

    const usuarios = await usuarioService.listarUsuarios({
      idRol: idRol ? parseInt(idRol, 10) : null,
      activo: activo !== undefined ? activo === 'true' : undefined
    });

    res.json({ ok: true, data: usuarios });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearUsuario,
  actualizarUsuario,
  obtenerUsuario,
  listarUsuarios
};

