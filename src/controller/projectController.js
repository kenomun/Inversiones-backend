const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOk, badRequest, internalError, error404 } = require("../helpers/http");

//Crear proyecto
const createProject = async (req, res) => {
  const {
    title,
    description,
    capacity,
    minInvestment,
    duration,
    returnType,
    fixedReturn,
    categoryId,
    withdrawalFee, // Se agrega el nuevo campo de comisión por retiro
  } = req.body;

  try {
    // Validar que los campos requeridos estén presentes
    if (
      !title ||
      !description ||
      !capacity ||
      !minInvestment ||
      !duration ||
      !returnType ||
      !categoryId ||
      withdrawalFee == null // Validar que withdrawalFee esté presente
    ) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Validar que el withdrawalFee sea un valor numérico válido entre 0 y 100
    if (typeof withdrawalFee !== "number" || withdrawalFee < 0 || withdrawalFee > 100) {
      return res.status(400).json({ message: "La comisión por retiro debe ser un porcentaje entre 0 y 100" });
    }

    // Verificar si el proyecto ya existe
    const existingProject = await prisma.project.findUnique({
      where: { title },
    });
    if (existingProject) {
      return res.status(400).json({ message: "El proyecto ya está registrado" });
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

    // Calcular el endDate
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + duration); // Sumar duración en días

    // Crear el proyecto con el nuevo campo withdrawalFee y endDate
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
        withdrawalFee, // Incluir el valor de withdrawalFee
        endDate, // Agregar endDate calculado
      },
    });

    return sendOk(res, "Proyecto creado exitosamente.", project);
  } catch (error) {
    console.error(error);
    return internalError(res, "Ha ocurrido un error con el servidor.");
  }
};

//Lista todos los proyectos
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
        endDate: true,
        returnType: true,
        fixedReturn: true,
        withdrawalFee: true,
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
        endDate: true,
        returnType: true,
        fixedReturn: true,
        withdrawalFee: true,
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
  const { title, description, capacity, minInvestment, duration, returnType, fixedReturn, categoryId, status, withdrawalFee } = req.body;

  try {
    // Validar el formato del ID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(projectId)) {
      return badRequest(res, "El ID del proyecto no tiene un formato válido.");
    }

    // Buscar el proyecto existente
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return error404(res, "Proyecto no encontrado.");
    }

    // Validar que la capacidad no sea menor al monto ya recaudado
    if (capacity !== undefined && capacity < existingProject.raisedAmount) {
      return badRequest(res, `La capacidad no puede ser menor al monto ya recaudado (${existingProject.raisedAmount}).`);
    }

    // Validar el estado proporcionado
    const validStatuses = ["open", "closed", "completed"];
    if (status && !validStatuses.includes(status)) {
      return badRequest(res, `Estado inválido. Los estados permitidos son: ${validStatuses.join(", ")}.`);
    }

    // Validar withdrawalFee
    if (withdrawalFee !== undefined) {
      if (typeof withdrawalFee !== "number" || withdrawalFee < 0 || withdrawalFee > 100) {
        return badRequest(res, "La comisión por retiro debe ser un porcentaje entre 0 y 100.");
      }
    }

    // Actualizar el proyecto
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
        ...(withdrawalFee !== undefined && { withdrawalFee }), // Agregar el campo withdrawalFee
      },
    });

    // Recalcular el estado del proyecto si se actualizó la capacidad
    if (updatedProject.raisedAmount >= updatedProject.capacity) {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "closed" },
      });
    }

    // Respuesta exitosa
    return sendOk(res, "Proyecto actualizado con éxito.", updatedProject);
  } catch (error) {
    console.error(error);
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
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
