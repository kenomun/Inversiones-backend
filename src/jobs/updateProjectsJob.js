const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // Ajusta el path a tu cliente de Prisma

// Programar el job para que se ejecute diariamente a la medianoche
cron.schedule("* * * * *", async () => {
  console.log("Iniciando job de actualización de proyectos...");
  try {
    const currentDate = new Date();

    // Encontrar proyectos abiertos cuyo `endDate` haya pasado
    const projectsToClose = await prisma.project.findMany({
      where: {
        status: "open",
        endDate: { lt: currentDate }, // endDate menor a la fecha actual
      },
    });

    if (projectsToClose.length > 0) {
      // Actualizar el estado de los proyectos encontrados a "closed"
      await prisma.project.updateMany({
        where: {
          id: { in: projectsToClose.map((project) => project.id) },
        },
        data: {
          status: "closed",
          updatedAt: new Date(),
        },
      });

      console.log(`Se han actualizado ${projectsToClose.length} proyectos a estado 'closed'.`);
    } else {
      console.log("No hay proyectos para cerrar en este momento.");
    }
  } catch (error) {
    console.error("Error al actualizar proyectos:", error);
  }
});
