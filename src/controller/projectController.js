const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOk, badRequest, internalError, error404 } = require("../helpers/http");

//Crear proyecto
const createproject = async (req, res) => {
  const { title, description, capacity, minInvestment, duration, returnType, fixedReturn, categoryId } = req.body;
  try {
    if (!title || !description || !capacity || !minInvestment || !duration || !returnType || !categoryId) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const existingCategoy = await prisma.project.findUnique({
      where: { title },
    });
    if (existingCategoy) {
      return badRequest(res, "La proyecto ya está registrada");
    }

    // Validar tipo de retorno
    if (returnType === "fixed" && fixedReturn == null) {
      return res.status(400).json({ message: "Debe proporcionar 'fixedReturn' para proyectos fijos" });
    }

    if (!["fixed", "variable"].includes(returnType)) {
      return res.status(400).json({ message: "Tipo de retorno inválido" });
    }

    // Verificar si la categoría existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    // Crear el proyecto
    const project = await prisma.project.create({
      data: {
        title,
        description,
        capacity,
        minInvestment,
        duration,
        returnType,
        fixedReturn: returnType === "fixed" ? fixedReturn : null,
        categoryId,
      },
    });

    return sendOk(res, "proyecto creado exitosamente.", project);
  } catch (error) {
    return internalError(res, "A ocurrido un error con el servidor.");
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        title: true,
        description: true,
        capacity: true,
        minInvestment: true,
        duration: true,
        returnType: true,
        fixedReturn: true,
        status: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (projects.length === 0) {
      return error404(res, "No hay proyectos creados.");
    }

    return sendOk(res, "Projectos encontrados", projects);
  } catch (error) {
    return internalError(res, "A ocurrido un error con el servidor.");
  }
};

const getProjectById = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(projectId)) {
      return badRequest(res, "El ID del proyecto no tiene un formato válido.");
    }
    console.log(projectId);
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        title: true,
        description: true,
        capacity: true,
        minInvestment: true,
        duration: true,
        returnType: true,
        fixedReturn: true,
        status: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    console.log(project);
    if (project == null) {
      return error404(res, "El proyecto no existe.");
    }
    return sendOk(res, "Proyecto encontrado.", project);
  } catch (error) {
    return internalError(res, "A ocurrido un error con el servidor.");
  }
};

//Actualizar proyecto
const updateProject = async (req, res) => {
  const projectId = req.params.projectId;
  const { title, description, capacity, minInvestment, duration, returnType, fixedReturn, categoryId, status } = req.body;

  try {
    // Verificar que el ID esté presente
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(projectId)) {
      return badRequest(res, "El ID de la categoría no tiene un formato válido.");
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Proyecto no encontrado." });
    }
    // Actualizar solo los campos proporcionados
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(capacity && { capacity }),
        ...(minInvestment && { minInvestment }),
        ...(duration && { duration }),
        ...(returnType && { returnType }),
        ...(fixedReturn !== undefined && { fixedReturn }),
        ...(categoryId && { categoryId }),
        ...(status && { status }),
      },
    });
    // Respuesta exitosa
    return sendOk(res, "Proyecto actualizado con éxito.", updatedProject);
  } catch (error) {
    return internalError(res, "Ocurrió un error al actualizar el proyecto.");
  }
};

//Eliminar proyecto
const deleteProject = async (req, res) => {
  const ProjectId = req.params.projectId;

  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(ProjectId)) {
      return badRequest(res, "El ID de la categoría no tiene un formato válido.");
    }
    console.log(ProjectId);
    const project = await prisma.project.findUnique({
      where: { id: ProjectId },
    });

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado." });
    }

    // Marcar el proyecto como eliminado
    const updatedProject = await prisma.project.update({
      where: { id: ProjectId },
      data: {
        deletedAt: new Date(),
      },
    });

    return res.status(200).json({ message: "Proyecto eliminado exitosamente.", project: updatedProject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocurrio un error al eliminar el proyecto." });
  }
};

module.exports = {
  createproject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
