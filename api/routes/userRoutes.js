const { Router } = require("express");
const {
  createUser,
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController.js");
const roles = require("../middleware/roles.js");
const authenticated = require("../middleware/authenticated.js");

const router = Router();

router.use(authenticated);

router.use(roles(["Admin"]));

router.post("/users", createUser);
router.get("/users", findAllUsers);
router.get("/users/:id", findUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
