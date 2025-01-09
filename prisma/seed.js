const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Verificar si ya existen roles antes de crearlos
  const existingRoles = await prisma.role.findMany();
  if (existingRoles.length === 0) {
    // Crear roles
    await prisma.role.createMany({
      data: [{ name: "superAdmin" }, { name: "admin" }, { name: "user" }],
    });
    console.log("Roles creados exitosamente.");
  } else {
    console.log("Los roles ya existen.");
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
