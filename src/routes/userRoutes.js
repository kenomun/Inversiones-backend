const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/verifyRole");

/**
 * @swagger
 * /users:
 *   post:
 *     summary: "Registrar un nuevo usuario"
 *     description: "Crea un nuevo usuario con contraseña cifrada y asigna un rol"
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - roleId
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               roleId:
 *                 type: string
 *     responses:
 *       201:
 *         description: "Usuario creado con éxito"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 roleId:
 *                   type: string
 *       400:
 *         description: "Datos requeridos faltantes o incorrectos"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: "Error al crear el usuario"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post(
  "/users",
  authMiddleware,
  verifyRole(["superAdmin"]),
  userController.registerUser
);

module.exports = router;
