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

module.exports = {
  createInvestment,
};
