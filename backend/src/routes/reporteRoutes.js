const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const reporteController = require('../controllers/reporteController');

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Reportes de expedientes
 */

/**
 * @swagger
 * /api/reportes/expedientes-rango:
 *   get:
 *     summary: Reporte de expedientes por rango de fechas y estado
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha fin (YYYY-MM-DD)
 *       - in: query
 *         name: idEstadoExpediente
 *         schema:
 *           type: integer
 *         description: ID del estado del expediente
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get(
  '/expedientes-rango',
  authMiddleware(['COORDINADOR', 'ADMIN']),
  reporteController.getExpedientesPorRango
);

/**
 * @swagger
 * /api/reportes/resumen-estados:
 *   get:
 *     summary: Resumen de cantidad de expedientes por estado
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen de estados
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get(
  '/resumen-estados',
  authMiddleware(['COORDINADOR', 'ADMIN']),
  reporteController.getResumenEstados
);

module.exports = router;
