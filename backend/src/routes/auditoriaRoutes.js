const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const auditoriaController = require('../controllers/auditoriaController');

/**
 * @swagger
 * tags:
 *   name: Auditoria
 *   description: Consulta de registros de auditoría (solo ADMIN)
 */

/**
 * @swagger
 * /api/auditoria:
 *   get:
 *     summary: Listar registros de auditoría con filtros opcionales
 *     tags: [Auditoria]
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
 *         name: idUsuario
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *       - in: query
 *         name: tablaAfectada
 *         schema:
 *           type: string
 *         description: Nombre de la tabla afectada (Expedientes, Indicios, Usuarios, etc.)
 *     responses:
 *       200:
 *         description: Lista de registros de auditoría
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get(
  '/',
  authMiddleware(['ADMIN']),
  auditoriaController.listar
);

module.exports = router;
