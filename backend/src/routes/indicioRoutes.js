const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const indicioController = require('../controllers/indicioController');

/**
 * @swagger
 * tags:
 *   name: Indicios
 *   description: Gestión de indicios asociados a expedientes
 */

/**
 * @swagger
 * /api/indicios:
 *   post:
 *     summary: Crear un nuevo indicio para un expediente
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idExpediente
 *               - descripcion
 *             properties:
 *               idExpediente:
 *                 type: integer
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: Cuchillo con manchas de sangre
 *               color:
 *                 type: string
 *                 example: Plateado
 *               tamano:
 *                 type: string
 *                 example: 20 cm
 *               peso:
 *                 type: number
 *                 example: 0.25
 *               unidadPeso:
 *                 type: string
 *                 example: kg
 *               ubicacion:
 *                 type: string
 *                 example: Mesa del comedor
 *     responses:
 *       201:
 *         description: Indicio creado correctamente
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
  indicioController.crearIndicio
);

/**
 * @swagger
 * /api/indicios/{idIndicio}:
 *   put:
 *     summary: Actualizar un indicio existente
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idIndicio
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del indicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *               - activo
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: Cuchillo actualizado
 *               color:
 *                 type: string
 *               tamano:
 *                 type: string
 *               peso:
 *                 type: number
 *               unidadPeso:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Indicio actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Indicio no encontrado
 */
router.put(
  '/:idIndicio',
  authMiddleware(['TECNICO', 'COORDINADOR', 'ADMIN']),
  indicioController.actualizarIndicio
);

/**
 * @swagger
 * /api/indicios/expediente/{idExpediente}:
 *   get:
 *     summary: Listar indicios de un expediente
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idExpediente
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *     responses:
 *       200:
 *         description: Lista de indicios del expediente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get(
  '/expediente/:idExpediente',
  authMiddleware(['TECNICO', 'COORDINADOR', 'ADMIN']),
  indicioController.listarPorExpediente
);

module.exports = router;
