const jwt = require("jsonwebtoken");
const { denegateeAccess, permissonDenegate } = require("../helpers/http");
const { JWT_SECRET } = process.env;

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return permissonDenegate(res, "Acceso denegado. Token no proporcionado.");
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return denegateeAccess(res, "Token no válido.");
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
