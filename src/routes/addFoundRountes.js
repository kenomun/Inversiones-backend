const express = require("express");
const route = express.Router();
const addFoundController = require("../controller/addFoundController");
const authMiddleware = require("../middleware/authMiddleware");

route.post("/addFound/:userId", authMiddleware, addFoundController.addFundsToWallet);

module.exports = route;
