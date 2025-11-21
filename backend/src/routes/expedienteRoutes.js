const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const expedienteController = require('../controllers/expedienteController');

/**
 * @swagger
 * tags:
 *   name: Expedientes
 *   description: Gestión de expedientes
 */

/**
 * @swagger
 * /api/expedientes:
 *   post:
 *     summary: Crear un nuevo expediente
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroExpediente
 *               - titulo
 *             properties:
 *               numeroExpediente:
 *                 type: string
 *                 example: DICRI-2025-0001
 *               titulo:
 *                 type: string
 *                 example: Homicidio zona 6
 *               descripcion:
 *                 type: string
 *                 example: Caso de prueba creado por técnico 1
 *     responses:
 *       201:
 *         description: Expediente creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.post(
  '/',
  authMiddleware(['TECNICO', 'ADMIN']),
  expedienteController.crearExpediente
);

/**
 * @swagger
 * /api/expedientes:
 *   get:
 *     summary: Listar expedientes con filtros opcionales
 *     tags: [Expedientes]
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
 *       - in: query
 *         name: idTecnico
 *         schema:
 *           type: integer
 *         description: ID del técnico que registró
 *     responses:
 *       200:
 *         description: Lista de expedientes
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get(
  '/',
  authMiddleware(['TECNICO', 'COORDINADOR', 'ADMIN']),
  expedienteController.listarExpedientes
);

/**
 * @swagger
 * /api/expedientes/{idExpediente}/estado:
 *   put:
 *     summary: Cambiar el estado de un expediente
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idExpediente
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idEstadoNuevo
 *             properties:
 *               idEstadoNuevo:
 *                 type: integer
 *                 example: 3
 *               justificacion:
 *                 type: string
 *                 example: No cumple con los requisitos
 *     responses:
 *       200:
 *         description: Estado del expediente actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */

router.put(
  '/:idExpediente/estado',
  authMiddleware(['TECNICO', 'COORDINADOR', 'ADMIN']),
  expedienteController.cambiarEstado
);

module.exports = router;
