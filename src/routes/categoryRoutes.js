const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/verifyRole");

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     description: Permite crear una nueva categoría con un nombre y descripción.
 *     tags:
 *       - Categorías
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Datos para crear una nueva categoría
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Nombre de la categoría
 *               example: "Tecnología"
 *             description:
 *               type: string
 *               description: Descripción de la categoría
 *               example: "Categoría relacionada con la tecnología y sus avances."
 *           required:
 *             - name
 *             - description
 *     responses:
 *       200:
 *         description: Categoría creada con éxito
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Categoría creada con éxito"
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID único de la categoría
 *                   example: "a23f7e0c-1b44-4872-bcd8-447c8a73bc74"
 *                 name:
 *                   type: string
 *                   description: Nombre de la categoría
 *                   example: "Tecnología"
 *                 description:
 *                   type: string
 *                   description: Descripción de la categoría
 *                   example: "Categoría relacionada con la tecnología y sus avances."
 *       400:
 *         description: Petición incorrecta, faltan datos o categoría ya registrada
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "La categoría ya está registrada"
 *       500:
 *         description: Error interno del servidor
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Ha ocurrido un error con el servidor."
 */
router.post("/categories", authMiddleware, verifyRole(["superAdmin", "Admin"]), categoryController.createCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     description: Obtiene todas las categorías registradas en el sistema.
 *     tags:
 *       - Categorías
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Categorías obtenidas con éxito
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID de la categoría
 *                 example: "a23f7e0c-1b44-4872-bcd8-447c8a73bc74"
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *                 example: "Tecnología"
 *               description:
 *                 type: string
 *                 description: Descripción de la categoría
 *                 example: "Categoría relacionada con la tecnología."
 *       404:
 *         description: No se han encontrado categorías
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "No se han encontrado categorías."
 *       500:
 *         description: Error interno del servidor
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Ha ocurrido un error con el servidor."
 */
router.get("/categories", authMiddleware, categoryController.getAllCategories);
/**
 * @swagger
 * /categories/{categoryId}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     description: Obtiene una categoría específica usando su ID.
 *     tags:
 *       - Categorías
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         description: ID de la categoría
 *         required: true
 *         schema:
 *           type: string
 *           example: "a23f7e0c-1b44-4872-bcd8-447c8a73bc74"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Categoría obtenida con éxito
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: ID de la categoría
 *               example: "a23f7e0c-1b44-4872-bcd8-447c8a73bc74"
 *             name:
 *               type: string
 *               description: Nombre de la categoría
 *               example: "Tecnología"
 *             description:
 *               type: string
 *               description: Descripción de la categoría
 *               example: "Categoría relacionada con la tecnología."
 *       400:
 *         description: El ID de la categoría no tiene un formato válido
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "El ID de la categoría no tiene un formato válido."
 *       404:
 *         description: Categoría no encontrada
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "No se han encontrado categorías."
 *       500:
 *         description: Error interno del servidor
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Ha ocurrido un error con el servidor."
 */
router.get("/category/:categoryId", authMiddleware, categoryController.getCategoryById);

/**
 * @swagger
 * /category/{categoryId}:
 *   put:
 *     summary: Actualizar una categoría por ID
 *     description: Actualiza el nombre y/o la descripción de una categoría específica utilizando su ID.
 *     tags:
 *       - Categorías
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         description: ID de la categoría que se va a actualizar
 *         required: true
 *         schema:
 *           type: string
 *           example: "a23f7e0c-1b44-4872-bcd8-447c8a73bc74"
 *       - name: name
 *         in: body
 *         description: Nuevo nombre de la categoría (opcional)
 *         required: false
 *         schema:
 *           type: string
 *           example: "Tecnología Avanzada"
 *       - name: description
 *         in: body
 *         description: Nueva descripción de la categoría (opcional)
 *         required: false
 *         schema:
 *           type: string
 *           example: "Categoría actualizada con los últimos avances tecnológicos."
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Categoría actualizada con éxito
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: ID de la categoría
 *               example: "a23f7e0c-1b44-4872-bcd8-447c8a73bc74"
 *             name:
 *               type: string
 *               description: Nombre de la categoría
 *               example: "Tecnología Avanzada"
 *             description:
 *               type: string
 *               description: Descripción de la categoría
 *               example: "Categoría actualizada con los últimos avances tecnológicos."
 *       400:
 *         description: Datos inválidos o faltantes
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Debe enviar al menos un dato para actualizar (nombre o descripción)."
 *       404:
 *         description: Categoría no encontrada
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Categoría no encontrada"
 *       500:
 *         description: Error interno del servidor
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Ha ocurrido un error con el servidor."
 */
router.put("/category/:categoryId", authMiddleware, verifyRole(["superAdmin", "Admin"]), categoryController.updateCategory);

/**
 * @swagger
 * /category/{categoryId}:
 *   delete:
 *     summary: Eliminar una categoría por ID
 *     description: Elimina una categoría específica usando su ID.
 *     tags:
 *       - Categorías
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         description: ID de la categoría que se va a eliminar
 *         required: true
 *         schema:
 *           type: string
 *           example: "a23f7e0c-1b44-4872-bcd8-447c8a73bc74"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Categoría eliminada con éxito
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Categoría eliminada con éxito."
 *       400:
 *         description: ID de categoría inválido o formato incorrecto
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "El ID de la categoría no tiene un formato válido."
 *       404:
 *         description: Categoría no encontrada
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Categoría no encontrada."
 *       500:
 *         description: Error interno del servidor
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Ha ocurrido un error con el servidor."
 */
router.delete("/category/:categoryId", authMiddleware, verifyRole(["superAdmin", "Admin"]), categoryController.deletcategory);

module.exports = router;
