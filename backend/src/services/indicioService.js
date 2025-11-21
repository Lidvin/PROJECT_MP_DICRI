
const { executeStoredProcedure } = require('../utils/dbHelper');

const crearIndicio = async ({
  idExpediente,
  descripcion,
  color,
  tamano,
  peso,
  unidadPeso,
  ubicacion,
  idTecnicoRegistro
}) => {
  const result = await executeStoredProcedure('usp_Indicio_Crear', {
    IdExpediente: idExpediente,
    Descripcion: descripcion,
    Color: color || null,
    Tamano: tamano || null,
    Peso: peso !== undefined ? peso : null,
    UnidadPeso: unidadPeso || null,
    Ubicacion: ubicacion || null,
    IdTecnicoRegistro: idTecnicoRegistro
  });

  const idIndicioCreado = result.recordset[0]?.IdIndicioCreado;
  return idIndicioCreado;
};

const actualizarIndicio = async ({
  idIndicio,
  descripcion,
  color,
  tamano,
  peso,
  unidadPeso,
  ubicacion,
  activo
}) => {
  await executeStoredProcedure('usp_Indicio_Actualizar', {
    IdIndicio: idIndicio,
    Descripcion: descripcion,
    Color: color || null,
    Tamano: tamano || null,
    Peso: peso !== undefined ? peso : null,
    UnidadPeso: unidadPeso || null,
    Ubicacion: ubicacion || null,
    Activo: activo
  });
};

const listarPorExpediente = async (idExpediente) => {
  const result = await executeStoredProcedure('usp_Indicio_ListarPorExpediente', {
    IdExpediente: idExpediente
  });

  return result.recordset;
};

module.exports = {
  crearIndicio,
  actualizarIndicio,
  listarPorExpediente
};

