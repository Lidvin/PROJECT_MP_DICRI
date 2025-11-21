
const { executeStoredProcedure } = require('../utils/dbHelper');

const listarAuditoria = async ({ fechaInicio, fechaFin, idUsuario, tablaAfectada }) => {
  const result = await executeStoredProcedure('usp_Auditoria_Listar', {
    FechaInicio: fechaInicio || null,
    FechaFin: fechaFin || null,
    IdUsuario: idUsuario || null,
    TablaAfectada: tablaAfectada || null
  });

  return result.recordset;
};

module.exports = {
  listarAuditoria
};

