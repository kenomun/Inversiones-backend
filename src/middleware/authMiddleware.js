const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env; // Cargar la clave secreta del .env

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extrae el token del header

  if (!token) {
    return res
      .status(403)
      .json({ error: "Acceso denegado. Token no proporcionado." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token no válido." });
    }

    req.user = decoded; // Si el token es válido, guarda el contenido en req.user
    next(); // Llama al siguiente middleware o controlador
  });
};

module.exports = verifyToken;
