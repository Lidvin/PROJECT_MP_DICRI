
const auditoriaService = require('../services/auditoriaService');

const listar = async (req, res, next) => {
  try {
    const { fechaInicio, fechaFin, idUsuario, tablaAfectada } = req.query;

    const data = await auditoriaService.listarAuditoria({
      fechaInicio,
      fechaFin,
      idUsuario: idUsuario ? parseInt(idUsuario, 10) : null,
      tablaAfectada
    });

    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listar
};

