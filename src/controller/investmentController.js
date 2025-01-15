const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOk, error404, badRequest, internalError } = require("../helpers/http");

const createInvestment = async (req, res) => {
  const projectId = req.params.projectId;
  const { userId, amount } = req.body;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(projectId) || !uuidRegex.test(userId)) {
    return badRequest(res, "El ID de usuario o del proyecto no tiene un formato válido.");
  }

  if (!amount || amount <= 0) {
    return badRequest(res, "El monto de inversión debe ser mayor a 0.");
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) throw new Error("El proyecto no existe.");
      if (project.status !== "open") throw new Error("El proyecto no está disponible para inversiones.");
      if (amount < project.minInvestment) throw new Error(`El monto mínimo de inversión es ${project.minInvestment}.`);
      if (project.capacity - project.raisedAmount < amount) throw new Error("El monto excede la capacidad restante del proyecto.");

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.wallet < amount) throw new Error("Saldo insuficiente en la billetera del usuario.");

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { wallet: user.wallet - amount },
      });

      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { raisedAmount: project.raisedAmount + amount },
      });

      const investment = await prisma.investment.create({
        data: { amount, userId, projectId },
      });

      await prisma.investmentHistory.create({
        data: {
          userId,
          projectId,
          action: "investment",
          amount,
          profitLoss: 0,
          walletBalance: updatedUser.wallet,
          returnType: project.returnType,
        },
      });

      return { investment, updatedProject };
    });

    return sendOk(res, "Inversión creada exitosamente.", result);
  } catch (error) {
    console.error(error);
    return internalError(res, error.message || "Hubo un error al procesar la inversión.");
  }
};
// Listar inversiones activas
const getActiveInvestments = async (req, res) => {
  try {
    const investments = await prisma.investment.findMany({
      where: {
        project: { status: "open" },
      },
      include: {
        project: {
          select: { title: true, returnType: true, raisedAmount: true, capacity: true },
        },
        user: {
          select: { name: true },
        },
      },
    });

    if (!investments.length) {
      return error404(res, "No hay inversiones activas en este momento.");
    }

    return sendOk(res, "Inversiones activas obtenidas exitosamente.", investments);
  } catch (error) {
    console.error(error);
    return internalError(res, "Hubo un error al obtener las inversiones activas.");
  }
};

//Listar detalles una de inversion por su Id
const getInvestmentById = async (req, res) => {
  const investmentId = req.params.investmentId;
  console.log("ID: ", investmentId);

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(investmentId)) {
    return badRequest(res, "El ID de la inversión no tiene un formato válido.");
  }

  try {
    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
      include: {
        project: { select: { title: true, returnType: true, raisedAmount: true, capacity: true } },
        user: { select: { name: true, email: true } },
      },
    });

    if (!investment) {
      return error404(res, "No se encontró la inversión.");
    }

    return sendOk(res, "Detalles de la inversión obtenidos exitosamente.", investment);
  } catch (error) {
    console.error(error);
    return internalError(res, "Hubo un error al obtener los detalles de la inversión.");
  }
};

//Listar inversiones por categoria
const getInvestmentsByCategory = async (req, res) => {
  const categoryId = req.params.categoryId;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(categoryId)) {
    return badRequest(res, "El ID de la categoría no tiene un formato válido.");
  }

  try {
    const investments = await prisma.investment.findMany({
      where: { project: { categoryId: categoryId } },
      include: {
        project: {
          select: {
            title: true,
            returnType: true,
            category: { select: { name: true } },
          },
        },
        user: { select: { name: true } },
      },
    });

    if (!investments.length) {
      return error404(res, "No se encontraron inversiones para esta categoría.");
    }

    return sendOk(res, "Inversiones por categoría obtenidas exitosamente.", investments);
  } catch (error) {
    console.error(error);
    return internalError(res, "Hubo un error al obtener las inversiones por categoría.");
  }
};

// Listar inversiones de usuario por su id
const getUserInvestmentsByUserId = async (req, res) => {
  const userId = req.params.userId;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    return badRequest(res, "El ID de usuario o del proyecto no tiene un formato válido.");
  }

  try {
    const investments = await prisma.investment.findMany({
      where: { userId: userId },
      include: {
        project: {
          select: { title: true, returnType: true },
        },
      },
    });
    console.log(investments);
    if (!investments.length) {
      return error404(res, "No se encontraron inversiones para este usuario.");
    }

    return sendOk(res, "Inversiones obtenidas exitosamente.", investments);
  } catch (error) {
    console.error(error);
    return internalError(res, "Hubo un error al obtener las inversiones.");
  }
};

// Retirarse de una inversión
const withdrawInvestment = async (req, res) => {
  console.log("API");
  const investmentId = req.params.investmentId;
  const { amountToWithdraw } = req.body; // Monto de retiro proporcionado por el frontend
  const userId = req.user.id; // ID del usuario extraído del token JWT

  try {
    // Validar formato del ID de inversión
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(investmentId)) {
      return badRequest(res, "El ID de la inversión no tiene un formato válido.");
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Buscar la inversión y el usuario asociado a ella
      const investment = await prisma.investment.findUnique({
        where: { id: investmentId },
        include: {
          project: true,
          user: true,
        },
      });

      if (!investment) {
        throw new Error("Inversión no encontrada.");
      }

      // Validar que el usuario autenticado sea el mismo que el que hizo la inversión
      if (investment.userId !== userId) {
        throw new Error("No tienes permiso para retirar esta inversión.");
      }

      const { amount, user, project } = investment;

      // Verificar que el monto a retirar no sea mayor al monto invertido
      if (amountToWithdraw <= 0 || amountToWithdraw > amount) {
        throw new Error("El monto a retirar es inválido.");
      }

      let profitLoss = 0;

      // Calcular la ganancia o pérdida según el tipo de retorno
      if (project.returnType === "fixed") {
        // Ganancia fija
        profitLoss = amountToWithdraw * (project.fixedReturn / 100);
      } else if (project.returnType === "variable") {
        // Ganancia/pérdida variable (simulada)
        const profitLossRate = (Math.random() * 50 - 20) / 100; // Simulando entre -20% y +30%
        profitLoss = amountToWithdraw * profitLossRate;
      }

      // Actualizar la billetera del usuario con el monto retirado + ganancia/pérdida
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { wallet: user.wallet + amountToWithdraw + profitLoss },
      });

      // Actualizar el proyecto (reduciendo el monto recaudado)
      await prisma.project.update({
        where: { id: project.id },
        data: { raisedAmount: project.raisedAmount - amountToWithdraw },
      });

      // Si la inversión es parcialmente retirada, actualizamos el monto invertido
      if (amountToWithdraw < amount) {
        await prisma.investment.update({
          where: { id: investmentId },
          data: { amount: amount - amountToWithdraw },
        });
      } else {
        // Si el retiro es total, eliminamos la inversión
        await prisma.investment.delete({
          where: { id: investmentId },
        });
      }

      // Registrar la acción en el historial
      await prisma.investmentHistory.create({
        data: {
          userId: user.id,
          projectId: project.id,
          action: "withdrawal",
          amount: amountToWithdraw,
          profitLoss: profitLoss,
          walletBalance: updatedUser.wallet,
          returnType: project.returnType,
        },
      });

      return { user: updatedUser, project };
    });

    return sendOk(res, "Inversión retirada con éxito.", result);
  } catch (error) {
    console.error(error);
    return internalError(res, error.message || "Hubo un error al retirar la inversión.");
  }
};

module.exports = {
  createInvestment,
  getActiveInvestments,
  getInvestmentById,
  getInvestmentsByCategory,
  getUserInvestmentsByUserId,
  withdrawInvestment,
};
