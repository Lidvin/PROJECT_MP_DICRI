
const { executeStoredProcedure } = require('../utils/dbHelper');


const crearExpediente = async ({ numeroExpediente, titulo, descripcion, idTecnicoRegistro }) => {
  const result = await executeStoredProcedure('usp_Expediente_Crear', {
    NumeroExpediente: numeroExpediente,
    Titulo: titulo,
    Descripcion: descripcion || null,
    IdTecnicoRegistro: idTecnicoRegistro
  });

  
  const row = result.recordset && result.recordset[0];
  return row ? row.IdExpedienteCreado  : null;
};


const listarExpedientes = async ({ fechaInicio, fechaFin, idEstadoExpediente, idTecnico }) => {
  const result = await executeStoredProcedure('usp_Expediente_Listar', {
    FechaInicio: fechaInicio || null,
    FechaFin: fechaFin || null,
    IdEstadoExpediente: idEstadoExpediente || null,
    IdTecnico: idTecnico || null
  });

  return result.recordset || [];
};


const cambiarEstadoExpediente = async ({ idExpediente, idEstadoNuevo, idUsuarioAccion, justificacion }) => {
  await executeStoredProcedure('usp_Expediente_CambiarEstado', {
    IdExpediente: idExpediente,
    IdEstadoNuevo: idEstadoNuevo,
    IdUsuarioAccion: idUsuarioAccion,
    Justificacion: justificacion || null
  });
};


const obtenerPorId = async (idExpediente) => {
  const result = await executeStoredProcedure('usp_Expediente_ObtenerPorId', {
    IdExpediente: idExpediente
  });

  
  
  return result.recordset && result.recordset[0] ? result.recordset[0] : null;
};

module.exports = {
  crearExpediente,
  listarExpedientes,
  cambiarEstadoExpediente,
  obtenerPorId,     
};

