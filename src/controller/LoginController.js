const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION } = process.env; // Cargar la clave secreta y expiración

// Función para generar un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role }, // Payload del token
    JWT_SECRET, // Clave secreta
    { expiresIn: JWT_EXPIRATION } // Expiración del token
  );
};

// Función para iniciar sesión y generar el token
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Aquí debes verificar el usuario en la base de datos y comparar la contraseña
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    // Generar un JWT para el usuario
    const token = generateToken(user);

    res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor." });
  }
};

module.exports = { login };
