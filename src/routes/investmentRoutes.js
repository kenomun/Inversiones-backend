const express = require("express");
const route = express.Router();
const investmentController = require("../controller/investmentController");
const authMiddleware = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/verifyRole");

route.post("/investment/:projectId", authMiddleware, verifyRole(["superAdmin", "Admin"]), investmentController.createInvestment);
route.get("/investments/active", authMiddleware, investmentController.getActiveInvestments);
route.get("/investment/:investmentId", authMiddleware, investmentController.getInvestmentById);
route.get("/investments/category/:categoryId", authMiddleware, investmentController.getInvestmentsByCategory);
route.get("/investment/user/:userId", authMiddleware, investmentController.getUserInvestmentsByUserId);
route.post("/withdraw-investment/:investmentId", authMiddleware, investmentController.withdrawInvestment);
module.exports = route;
