const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOk, badRequest, internalError } = require("../helpers/http");
