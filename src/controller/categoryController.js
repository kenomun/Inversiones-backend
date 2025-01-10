const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOk, badRequest, internalError, error404 } = require("../helpers/http");

//Crear categoria
const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    if (!name || !description) {
      return badRequest(res, "Faltan datos requeridos");
    }
    const existingCategoy = await prisma.category.findUnique({
      where: { name },
    });
    if (existingCategoy) {
      return badRequest(res, "La cateogria ya está registrada");
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return sendOk(res, "Categoria creada con exito", category);
  } catch (error) {
    return internalError(res, "A ocurrido un error con el servidor.");
  }
};

// Buscar todos los usuarios
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    if (categories.length === 0) {
      return error404(res, "No se han encontrado categorias.");
    }

    return sendOk(res, "Categoria creada con exito", categories);
  } catch (error) {
    return internalError(res, "A ocurrido un error con el servidor.");
  }
};

// Buscar categoria por ID
const getCategoryById = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(categoryId)) {
      return badRequest(res, "El ID de la categoría no tiene un formato válido.");
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    if (!category) {
      return error404(res, "No se han encontrado categorias.");
    }

    return sendOk(res, "Categoria creada con exito", category);
  } catch (error) {
    return internalError(res, "A ocurrido un error con el servidor.");
  }
};

//Actualizar categorias
const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  const categoryId = req.params.categoryId;

  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(categoryId)) {
      return badRequest(res, "El ID de la categoría no tiene un formato válido.");
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return error404(res, "Categoría no encontrada");
    }

    // Verificar si al menos uno de los campos está presente
    if (!name && !description) {
      return badRequest(res, "Debe enviar al menos un dato para actualizar (nombre o descripción).");
    }

    // Crear un objeto `updateData` con solo los campos que han sido enviados
    const updateData = {};

    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }

    // Realizar la actualización
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
    });

    // Responder con éxito
    return sendOk(res, "Categoría actualizada con éxito", updatedCategory);
  } catch (error) {
    return internalError(res, "Ha ocurrido un error con el servidor.");
  }
};

// Eliminar categoria
const deletcategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(categoryId)) {
      return badRequest(res, "El ID de la categoría no tiene un formato válido.");
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return error404(res, "Categoría no encontrada");
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return sendOk(res, "Categoria eliminada con exito");
  } catch (error) {
    return internalError(res, "A ocurrido un error con el servidor.");
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deletcategory,
};
