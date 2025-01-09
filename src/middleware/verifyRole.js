const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.name; // Extrae el rol del token
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Acceso denegado. No tienes el rol necesario." });
    }
    next(); // Si el rol es permitido, pasa al siguiente middleware o controlador
  };
};

module.exports = verifyRole;
