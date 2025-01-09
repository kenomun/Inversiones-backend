const express = require("express");
const router = express.Router();

const loginController = require("../controller/LoginController");

// Ruta para iniciar sesión y generar el JWT
router.get("/login", loginController.login);

module.exports = router;
