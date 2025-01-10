const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { denegateeAccess, internalError } = require("../helpers/http");
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

// Función para generar un token JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// Función para iniciar sesión y generar el token
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return denegateeAccess(res, "Credenciales incorrectas.");
    }

    // Generar un JWT para el usuario
    const token = generateToken(user);

    res.json({ token });
  } catch (error) {
    return internalError(res, "Error en el servidor.");
  }
};

module.exports = { login };
