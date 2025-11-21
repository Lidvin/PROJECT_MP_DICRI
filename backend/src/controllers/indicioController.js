
const indicioService = require('../services/indicioService');
const { executeStoredProcedure } = require('../utils/dbHelper');

const crearIndicio = async (req, res, next) => {
  try {
    const { idExpediente, descripcion, color, tamano, peso, unidadPeso, ubicacion } = req.body;
    const idTecnicoRegistro = req.user.idUsuario;

    if (!idExpediente || !descripcion) {
      return res.status(400).json({
        ok: false,
        message: 'idExpediente y descripción son obligatorios'
      });
    }

    const idIndicio = await indicioService.crearIndicio({
      idExpediente,
      descripcion,
      color,
      tamano,
      peso,
      unidadPeso,
      ubicacion,
      idTecnicoRegistro
    });

    await executeStoredProcedure('usp_Auditoria_Registrar', {
      IdUsuario: idTecnicoRegistro,
      Accion: `Creación de indicio para expediente ID=${idExpediente}`,
      TablaAfectada: 'Indicios',
      IdRegistroAfectado: idIndicio
    });

    res.status(201).json({
      ok: true,
      message: 'Indicio creado correctamente',
      idIndicio
    });
  } catch (error) {
    next(error);
  }
};

const actualizarIndicio = async (req, res, next) => {
  try {
    const { idIndicio } = req.params;
    const { descripcion, color, tamano, peso, unidadPeso, ubicacion, activo } = req.body;
    const idUsuarioAccion = req.user.idUsuario;

    if (!descripcion || typeof activo !== 'boolean') {
      return res.status(400).json({
        ok: false,
        message: 'descripcion y activo son obligatorios'
      });
    }

    await indicioService.actualizarIndicio({
      idIndicio: parseInt(idIndicio, 10),
      descripcion,
      color,
      tamano,
      peso,
      unidadPeso,
      ubicacion,
      activo
    });

    await executeStoredProcedure('usp_Auditoria_Registrar', {
      IdUsuario: idUsuarioAccion,
      Accion: `Actualización de indicio ID=${idIndicio}`,
      TablaAfectada: 'Indicios',
      IdRegistroAfectado: idIndicio
    });

    res.json({
      ok: true,
      message: 'Indicio actualizado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

const listarPorExpediente = async (req, res, next) => {
  try {
    const { idExpediente } = req.params;

    const indicios = await indicioService.listarPorExpediente(parseInt(idExpediente, 10));

    res.json({
      ok: true,
      data: indicios
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearIndicio,
  actualizarIndicio,
  listarPorExpediente
};

