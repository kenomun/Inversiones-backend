const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/verifyRole");

router.post("/categories", authMiddleware, verifyRole[("superAdmin", "Admin")], categoryController.createCategory);
router.get("/categories", authMiddleware, verifyRole[("superAdmin", "Admin")], categoryController.getAllcategory);
router.get("/category/:categoyId", authMiddleware, verifyRole[("superAdmin", "Admin")], categoryController.getCategoryById);
router.put("/category/:categoryId", authMiddleware, verifyRole[("superAdmin", "Admin")], categoryController.updateCategory);
router.delete("/category/:categoryId", authMiddleware, verifyRole[("superAdmin", "Admin")], categoryController.deleteCategory);
