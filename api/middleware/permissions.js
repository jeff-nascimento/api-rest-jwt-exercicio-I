//este arquivo vai decidir qual papel(role) pode fazer o que

//o funcionamento do código e até o que foi usado vai ser igual ao do roles, porém ele vai servir para
//verificar se o usuário da role pode fazer a ação, então é tudo ligado, porém cada um faz seu papel
//primeiro precisa validar um usuário, depois precisa ver quais são as roles que esse usuário possui
//então aí verifica se com a role que o usuário tem ele pode executar certa ação

const database = require("../models");

const permissions = (allowedPermissions) => {
  return async (req, res, next) => {
    const userId = req.userId;

    const user = await database.users.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: database.permissions,
          as: "user_permissions",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!user) {
      return res.status(401).send("Usuário não encontrado.");
    }

    const hasAllowedPermission = user.user_permissions
      .map((permission) => permission.name)
      .some((permissionName) => allowedPermissions.includes(permissionName));

    if (!hasAllowedPermission) {
      return res.status(401).send("Usuário não tem permissão para a ação.");
    }

    next();
  };
};

module.exports = permissions;
