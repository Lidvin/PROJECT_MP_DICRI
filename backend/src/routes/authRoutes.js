const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioLogin
 *               - contrasenia
 *             properties:
 *               usuarioLogin:
 *                 type: string
 *                 example: admin
 *               contrasenia:
 *                 type: string
 *                 example: Admin123*
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login exitoso
 *                 token:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     idUsuario:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     usuarioLogin:
 *                       type: string
 *                     rol:
 *                       type: string
 *       400:
 *         description: Credenciales inválidas
 */
router.post('/login', authController.login);

module.exports = router;
