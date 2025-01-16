const express = require("express");
const router = express.Router();
const projectController = require("../controller/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/verifyRole");

router.post("/projects", authMiddleware, verifyRole(["superAdmin", "Admin"]), projectController.createProject);
router.get("/projects", authMiddleware, projectController.getAllProjects);
router.get("/project/:projectId", authMiddleware, projectController.getProjectById);
router.put("/project/:projectId", authMiddleware, verifyRole(["superAdmin", "Admin"]), projectController.updateProject);
router.delete("/project/:projectId", authMiddleware, verifyRole(["superAdmin", "Admin"]), projectController.deleteProject);

module.exports = router;
