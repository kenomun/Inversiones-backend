const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { sendOk, badRequest, internalError } = require("../helpers/http");

// Crear un nuevo usuario
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

// Buscar todos los usuarios.
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        wallet: true,
        createdAt: true,
        isActive: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (users.length === 0) {
      return error404(res, "No se han encontrado usuarios.");
    }

    return sendOk(res, "Usuarios encontrados correctamente", users);
  } catch (error) {
    return internalError(res, "Error al buscar todos los usuarios");
  }
};

// Buscar todos los usuarios activos.
const getAllUserActive = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        wallet: true,
        createdAt: true,
        isActive: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (users.length === 0) {
      return error404(res, "No se han encontrado usuarios activos.");
    }

    return sendOk(res, "Usuarios activos encontrados correctamente", users);
  } catch (error) {
    return internalError(res, "Error al buscar todos los usuarios activos");
  }
};

// Buscar todos los usuarios inactivos.
const getAllUserInactive = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: false },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        wallet: true,
        createdAt: true,
        isActive: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (users.length === 0) {
      return error404(res, "No se han encontrado usuarios inactivos.");
    }

    return sendOk(res, "Usuarios inactivos encontrados correctamente", users);
  } catch (error) {
    return internalError(res, "Error al buscar todos los usuarios inactivos");
  }
};

//Buscar Usuario por Id
const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        isActive: true,
        wallet: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (user.length === 0) {
      return error404(res, "Usuario encontrado.", user);
    }
    return sendOk(res, "Usuario encontrado.", user);
  } catch (error) {
    return internalError(res, "Error en el servidor.");
  }
};

// Actualizar usuario.}
const updateUserById = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validar si el cuerpo de la solicitud tiene al menos un campo para actualizar
    const { name, email, password, roleId, wallet } = req.body;
    if (!name && !email && !password && !roleId && wallet === undefined) {
      return badRequest(res, "Debe proporcionar al menos un campo para actualizar.");
    }

    // Verificar si el usuario existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return error404(res, "Usuario no encontrado.");
    }

    // Construir el objeto de actualización
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    if (roleId) {
      const roleExists = await prisma.role.findUnique({
        where: { id: roleId },
      });
      if (!roleExists) {
        return badRequest(res, "El rol proporcionado no es válido.");
      }
      updateData.roleId = roleId;
    }
    if (wallet !== undefined) {
      if (typeof wallet !== "number" || wallet < 0) {
        return badRequest(res, "El valor de wallet debe ser un número positivo.");
      }
      updateData.wallet = wallet;
    }

    // Actualizar el usuario en la base de datos
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return sendOk(res, "Usuario actualizado correctamente.", updatedUser);
  } catch (error) {
    console.error(error);
    return internalError(res, "Error en el servidor.");
  }
};

//Eliminar usuario
const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: "99b5362b-17fc-422e-b7e5-6978e881c7d1" },
    });
    console.log("USERID", user);

    if (!user) {
      return error404(res, "Usuario no encontrado");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    return sendOk(res, "Usuario marcado como inactivo correctamente", updatedUser);
  } catch (error) {
    return internalError(res, "Error en el servidor.");
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  getAllUserActive,
  getAllUserInactive,
  getUserById,
  updateUserById,
  deleteUser,
};
