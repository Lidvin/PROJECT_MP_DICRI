const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const usuarioController = require('../controllers/usuarioController');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios (solo ADMIN)
 */

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreCompleto
 *               - usuarioLogin
 *               - contrasenia
 *               - idRol
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *                 example: Técnico 1
 *               usuarioLogin:
 *                 type: string
 *                 example: tecnico1
 *               contrasenia:
 *                 type: string
 *                 example: Tec123*
 *               correo:
 *                 type: string
 *                 example: tecnico1@dicri.local
 *               idRol:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.post('/', authMiddleware(['ADMIN']), usuarioController.crearUsuario);

/**
 * @swagger
 * /api/usuarios/{idUsuario}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreCompleto
 *               - idRol
 *               - activo
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *                 example: Técnico 1 actualizado
 *               correo:
 *                 type: string
 *                 example: tecnico1@dicri.local
 *               idRol:
 *                 type: integer
 *                 example: 2
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:idUsuario', authMiddleware(['ADMIN']), usuarioController.actualizarUsuario);

/**
 * @swagger
 * /api/usuarios/{idUsuario}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:idUsuario', authMiddleware(['ADMIN']), usuarioController.obtenerUsuario);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar usuarios con filtros opcionales
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idRol
 *         schema:
 *           type: integer
 *         description: ID del rol
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por activo (true/false)
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/', authMiddleware(['ADMIN']), usuarioController.listarUsuarios);

module.exports = router;
