const { Router } = require("express");
const {
  createRole,
  findAllRoles,
  findRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/roleController.js");
const roles = require("../middleware/roles.js");
const authenticated = require("../middleware/authenticated.js");

const router = Router();

router.use(authenticated);

router.use(roles(["Admin"]));

router.post("/roles", createRole);
router.get("/roles", findAllRoles);
router.get("/roles/:id", findRoleById);
router.put("/roles/:id", updateRole);
router.delete("/roles/:id", deleteRole);

module.exports = router;
