const { Router } = require("express");

const authenticated = require("../middleware/authenticated.js");

const {
  createTask,
  list,
  findTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController.js");
const permissionsRoles = require("../middleware/permissionsRoles.js");

const router = Router();

router.use(authenticated);

router.post("/tasks", permissionsRoles(["create-task"]), createTask);
router.get("/tasks", permissionsRoles(["list-task"]), list);
router.get("/tasks/:id", permissionsRoles(["list-task"]), findTaskById);
router.put("/tasks/:id", permissionsRoles(["edit-task"]), updateTask);
router.delete("/tasks/:id", permissionsRoles(["delete-task"]), deleteTask);

module.exports = router;
