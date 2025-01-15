const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOk, error404, badRequest, internalError } = require("../helpers/http");

const addFundsToWallet = async (req, res) => {
  const userId = req.params.userId;
  const amount = req.body.amount;

  // Validar los datos de entrada

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    return badRequest(res, "El ID del usuario no tiene un formato válido.");
  }

  if (!userId || !amount || amount <= 0) {
    return error404(res, "Datos inválidos o monto incorrecto.");
  }

  try {
    // Obtener el usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return error404(res, "Usuario no encontrado.");
    }

    // Actualizar el saldo de la billetera
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        wallet: user.wallet + amount,
      },
    });

    // Registrar la transacción en el historial
    await prisma.investmentHistory.create({
      data: {
        userId,
        action: "addFunds",
        amount,
        profitLoss: 0, // No hay ganancia o pérdida en recargas
        walletBalance: updatedUser.wallet, // El saldo actualizado
      },
    });

    return sendOk(res, "Fondos añadidos correctamente.", updatedUser);
  } catch (error) {
    return internalError(res, "Ocurrió un error al procesar la transacción.");
  }
};

module.exports = {
  addFundsToWallet,
};
