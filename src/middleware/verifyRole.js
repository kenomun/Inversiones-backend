const { permissonDegate } = require("../helpers/http");

const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.name;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return permissonDegate(res, "Acceso denegado. No tienes el rol necesario.");
    }
    next();
  };
};

module.exports = verifyRole;
