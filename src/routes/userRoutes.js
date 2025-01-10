const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/verifyRole");

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Registrar un nuevo usuario
 *     description: Permite registrar un nuevo usuario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 example: juan.perez@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               roleId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - name
 *               - email
 *               - password
 *               - roleId
 *     responses:
 *       200:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario creado correctamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Juan Pérez
 *                     email:
 *                       type: string
 *                       example: juan.perez@example.com
 *                     roleId:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Solicitud incorrecta (faltan datos o datos inválidos)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Faltan datos requeridos
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear usuario
 */
router.post("/users", userController.registerUser);

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtiene todos los usuarios registrados
 *     description: Devuelve una lista de todos los usuarios. Requiere autenticación y roles específicos.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuarios encontrados correctamente.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         example: john.doe@example.com
 *                       role:
 *                         type: string
 *                         example: Admin
 *       404:
 *         description: No se encontraron usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se han encontrado usuarios.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al buscar todos los usuarios.
 */
router.get("/users", authMiddleware, verifyRole(["superAdmin", "Admin"]), userController.getAllUsers);

/**
 * @swagger
 * /usersActive:
 *   get:
 *     summary: Obtener todos los usuarios activos
 *     description: Devuelve una lista de todos los usuarios activos en el sistema, incluyendo información básica y el rol asociado.
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios activos encontrada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuarios activos encontrados correctamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "9b93f79c-d9e0-42f7-8d33-5e3176ec9b34"
 *                       name:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       email:
 *                         type: string
 *                         example: "juan.perez@example.com"
 *                       password:
 *                         type: string
 *                         example: "$2b$10$3Q9f1eW23d9mYzO5l5rVbO"
 *                       wallet:
 *                         type: number
 *                         example: 100.50
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-08T14:35:22.000Z"
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       role:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "1"
 *                           name:
 *                             type: string
 *                             example: "Administrador"
 *       404:
 *         description: No se han encontrado usuarios activos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No se han encontrado usuarios activos."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al buscar todos los usuarios activos"
 */
router.get("/usersActive", authMiddleware, userController.getAllUserActive);

/**
 * @swagger
 * /usersInactive:
 *   get:
 *     summary: Obtener todos los usuarios inactivos
 *     description: Devuelve una lista de todos los usuarios inactivos en el sistema, incluyendo información básica y el rol asociado.
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios inactivos encontrada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuarios inactivos encontrados correctamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "9b93f79c-d9e0-42f7-8d33-5e3176ec9b34"
 *                       name:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       email:
 *                         type: string
 *                         example: "juan.perez@example.com"
 *                       password:
 *                         type: string
 *                         example: "$2b$10$3Q9f1eW23d9mYzO5l5rVbO"
 *                       wallet:
 *                         type: number
 *                         example: 0.00
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-08T14:35:22.000Z"
 *                       isActive:
 *                         type: boolean
 *                         example: false
 *                       role:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "2"
 *                           name:
 *                             type: string
 *                             example: "Usuario"
 *       404:
 *         description: No se han encontrado usuarios inactivos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No se han encontrado usuarios inactivos."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al buscar todos los usuarios inactivos"
 */

router.get("/usersInactive", authMiddleware, userController.getAllUserInactive);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     description: Devuelve la información de un usuario específico utilizando su ID.
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "9b93f79c-d9e0-42f7-8d33-5e3176ec9b34"
 *         description: ID del usuario que se desea obtener.
 *     responses:
 *       200:
 *         description: Usuario encontrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario encontrado."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "9b93f79c-d9e0-42f7-8d33-5e3176ec9b34"
 *                     name:
 *                       type: string
 *                       example: "Juan Pérez"
 *                     email:
 *                       type: string
 *                       example: "juan.perez@example.com"
 *                     password:
 *                       type: string
 *                       example: "$2b$10$3Q9f1eW23d9mYzO5l5rVbO"
 *                     wallet:
 *                       type: number
 *                       example: 100.50
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "2"
 *                         name:
 *                           type: string
 *                           example: "Administrador"
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor."
 */
router.get("/user/:userId", authMiddleware, userController.getUserById);

/**
 * @swagger
 * /user/{userId}:
 *   put:
 *     summary: Actualizar un usuario por su ID
 *     description: Permite actualizar uno o más campos de un usuario específico por su ID.
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "9b93f79c-d9e0-42f7-8d33-5e3176ec9b34"
 *         description: ID del usuario que se desea actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "MiContraseñaSegura123"
 *               roleId:
 *                 type: string
 *                 example: "2"
 *               wallet:
 *                 type: number
 *                 example: 150.75
 *             description: Campos a actualizar. Se puede enviar uno o más campos.
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado correctamente."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "9b93f79c-d9e0-42f7-8d33-5e3176ec9b34"
 *                     name:
 *                       type: string
 *                       example: "Juan Pérez"
 *                     email:
 *                       type: string
 *                       example: "juan.perez@example.com"
 *                     wallet:
 *                       type: number
 *                       example: 150.75
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     roleId:
 *                       type: string
 *                       example: "2"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-10T12:00:00Z"
 *       400:
 *         description: Solicitud inválida (por ejemplo, campos incorrectos o faltantes).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Debe proporcionar al menos un campo para actualizar."
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor."
 */
router.put("/user/:userId", authMiddleware, userController.updateUserById);

/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     summary: Marcar un usuario como inactivo
 *     description: Marca un usuario como inactivo en lugar de eliminarlo físicamente de la base de datos.
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "99b5362b-17fc-422e-b7e5-6978e881c7d1"
 *         description: ID del usuario que se desea marcar como inactivo.
 *     responses:
 *       200:
 *         description: Usuario marcado como inactivo correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario marcado como inactivo correctamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "99b5362b-17fc-422e-b7e5-6978e881c7d1"
 *                     name:
 *                       type: string
 *                       example: "Juan Pérez"
 *                     email:
 *                       type: string
 *                       example: "juan.perez@example.com"
 *                     isActive:
 *                       type: boolean
 *                       example: false
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-10T12:00:00Z"
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor."
 */
router.delete("/user/:userId", authMiddleware, userController.deleteUser);

module.exports = router;
