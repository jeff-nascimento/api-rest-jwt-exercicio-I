//PUT /users/:id/acl

const { aclService } = require("../services/securityService");

const aclController = async (req, res) => {
  const { id } = req.params;

  const body = req.body ?? {};

  const { roles, permissions } = body;

  //verifica se o roles e o permission são array e verifica para cada indice no array roles e permissions se
  //o tipo é string
  const rolesValid =
    Array.isArray(roles) && roles.every((role) => typeof role === "string");
  const permissionsValid =
    Array.isArray(permissions) &&
    permissions.every((permission) => typeof permission === "string");

  if (!rolesValid || !permissionsValid) {
    return res.status(400).send({
      message: "Formato de dados inválido.",
    });
  }

  try {
    //lembrando que aclservice atualiza os dados das permissões, então após a verificação passa os valores novos
    //que serao usados para aclservice
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
