const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { sendOk, badRequest, internalError } = require("../helpers/http");

const registerUser = async (req, res) => {
  const { name, email, password, roleId } = req.body;

  // Validación de campos requeridos
  if (!name || !email || !password || !roleId) {
    return badRequest(res, "Faltan datos requeridos");
  }

  // Validación de la contraseña (mínimo 8 caracteres)
  if (password.length < 8) {
    return badRequest(res, "La contraseña debe tener al menos 8 caracteres");
  }

  try {
    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return badRequest(res, "El correo electrónico ya está registrado");
    }

    // Verificar si el roleId es válido
    const roleExists = await prisma.role.findUnique({
      where: { id: roleId },
    });
    if (!roleExists) {
      return badRequest(res, "El rol proporcionado no es válido");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
      },
    });
    return sendOk(res, "Usuario creado correctamente", user);
  } catch (error) {
    return internalError(res, "Error al crear usuario");
  }
};

module.exports = {
  registerUser,
};
