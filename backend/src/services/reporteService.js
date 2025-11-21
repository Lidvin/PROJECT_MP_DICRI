
const { executeStoredProcedure } = require('../utils/dbHelper');

const reporteExpedientesPorRango = async ({ fechaInicio, fechaFin, idEstadoExpediente }) => {
  const result = await executeStoredProcedure('usp_Reporte_ExpedientesPorRango', {
    FechaInicio: fechaInicio || null,
    FechaFin: fechaFin || null,
    IdEstadoExpediente: idEstadoExpediente || null
  });

  return result.recordset;
};

const reporteResumenEstados = async () => {
  const result = await executeStoredProcedure('usp_Reporte_ResumenEstados', {});
  return result.recordset;
};

module.exports = {
  reporteExpedientesPorRango,
  reporteResumenEstados
};

