const { Router } = require("express");
const { assign } = require("../controllers/aclController.js");
const roles = require("../middleware/roles.js");
const authenticated = require("../middleware/authenticated.js");

const router = Router();

router.use(authenticated);

router.use(roles(["Admin"]));

router.put("/users/:id/acl", assign);

module.exports = router;
