const { Router } = require("express");
const {
  createPermission,
  findAllPermissions,
  findPermissionById,
  updatePermission,
  deletePermission,
} = require("../controllers/permissionController.js");
const roles = require("../middleware/roles.js");
const authenticated = require("../middleware/authenticated.js");

const router = Router();

router.use(authenticated);

router.use(roles(["Admin"]));

router.post("/permissions", createPermission);
router.get("/permissions", findAllPermissions);
router.get("/permissions/:id", findPermissionById);
router.put("/permissions/:id", updatePermission);
router.delete("/permissions/:id", deletePermission);

module.exports = router;
