
const expedienteService = require('../services/expedienteService');
const { executeStoredProcedure } = require('../utils/dbHelper');

const crearExpediente = async (req, res, next) => {
  try {
    const { numeroExpediente, titulo, descripcion } = req.body;
    const idTecnicoRegistro = req.user.idUsuario; 

    if (!numeroExpediente || !titulo) {
      return res.status(400).json({ ok: false, message: 'Número de expediente y título son obligatorios' });
    }

    const idExp = await expedienteService.crearExpediente({
      numeroExpediente,
      titulo,
      descripcion,
      idTecnicoRegistro
    });

    
    await executeStoredProcedure('usp_Auditoria_Registrar', {
      IdUsuario: idTecnicoRegistro,
      Accion: `Creación de expediente ${numeroExpediente}`,
      TablaAfectada: 'Expedientes',
      IdRegistroAfectado: idExp
    });

    res.status(201).json({
      ok: true,
      message: 'Expediente creado correctamente',
      idExpediente: idExp
    });
  } catch (error) {
    next(error);
  }
};

const listarExpedientes = async (req, res, next) => {
  try {
    const { fechaInicio, fechaFin, idEstadoExpediente, idTecnico } = req.query;

    const expedientes = await expedienteService.listarExpedientes({
      fechaInicio,
      fechaFin,
      idEstadoExpediente: idEstadoExpediente ? parseInt(idEstadoExpediente, 10) : null,
      idTecnico: idTecnico ? parseInt(idTecnico, 10) : null
    });

    res.json({
      ok: true,
      data: expedientes
    });
  } catch (error) {
    next(error);
  }
};

const cambiarEstado = async (req, res, next) => {
  try {
    const { idExpediente } = req.params;
    const { idEstadoNuevo, justificacion } = req.body;
    const usuario = req.user; 

    if (!idEstadoNuevo) {
      return res.status(400).json({ ok: false, message: 'El idEstadoNuevo es obligatorio' });
    }

    
    const expediente = await expedienteService.obtenerPorId(parseInt(idExpediente));
    if (!expediente) {
      return res.status(404).json({ ok: false, message: 'Expediente no encontrado' });
    }

    const estadoActual = expediente.IdEstadoExpediente;
    const tecnicoRegistro = expediente.IdTecnicoRegistro;

    
    const ID_REGISTRADO = 1;
    const ID_EN_REVISION = 2;
    const ID_APROBADO = 3;
    const ID_RECHAZADO = 4;

    

    
    if (usuario.rol === 'TECNICO') {
      
      if (
        estadoActual !== ID_RECHAZADO ||
        parseInt(idEstadoNuevo) !== ID_REGISTRADO ||
        tecnicoRegistro !== usuario.idUsuario
      ) {
        return res.status(403).json({
          ok: false,
          message: 'No autorizado para cambiar el estado de este expediente'
        });
      }
    }

    
    
    
    if (usuario.rol === 'COORDINADOR' || usuario.rol === 'ADMIN') {
      
    }

    
    await expedienteService.cambiarEstadoExpediente({
      idExpediente: parseInt(idExpediente),
      idEstadoNuevo: parseInt(idEstadoNuevo),
      idUsuarioAccion: usuario.idUsuario,
      justificacion
    });

    
    await executeStoredProcedure('usp_Auditoria_Registrar', {
      IdUsuario: usuario.idUsuario,
      Accion: `Cambio de estado expediente ID=${idExpediente} a estado=${idEstadoNuevo}`,
      TablaAfectada: 'Expedientes',
      IdRegistroAfectado: idExpediente
    });

    return res.json({
      ok: true,
      message: 'Estado del expediente actualizado correctamente'
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  crearExpediente,
  listarExpedientes,
  cambiarEstado
};

