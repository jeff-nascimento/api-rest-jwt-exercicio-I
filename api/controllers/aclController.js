//PUT /users/:id/acl

const { aclService } = require("../services/securityService");

const aclController = async (req, res) => {
  const { id } = req.params;

  const body = req.body ?? {};

  const { roles, permissions } = body;

  const rolesValid =
    Array.isArray(roles) && roles.every((role) => typeof role === "string");
  const permissionsValid =
    Array.isArray(permissions) &&
    permissions.every((permission) => typeof permission === "string");

  if (!rolesValid || !permissionsValid) {
    return res.status(400).send("Formato de dados inválido.");
  }

  try {
    const updatedUser = await aclService({
      userId: id,
      roles,
      permissions,
    });
    return res.status(200).send(updatedUser);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

module.exports = {
  assign: aclController,
};
