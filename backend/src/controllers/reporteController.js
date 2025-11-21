
const reporteService = require('../services/reporteService');

const getExpedientesPorRango = async (req, res, next) => {
  try {
    const { fechaInicio, fechaFin, idEstadoExpediente } = req.query;

    const data = await reporteService.reporteExpedientesPorRango({
      fechaInicio,
      fechaFin,
      idEstadoExpediente: idEstadoExpediente ? parseInt(idEstadoExpediente, 10) : null
    });

    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

const getResumenEstados = async (req, res, next) => {
  try {
    const data = await reporteService.reporteResumenEstados();
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpedientesPorRango,
  getResumenEstados
};

