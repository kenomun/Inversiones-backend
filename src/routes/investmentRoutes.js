const express = require("express");
const route = express.Router();
const investmentController = require("../controller/investmentController");
const authMiddleware = require("../middleware/authMiddleware");

route.post("/investment/:projectId", authMiddleware, investmentController.createInvestment);

module.exports = route;
