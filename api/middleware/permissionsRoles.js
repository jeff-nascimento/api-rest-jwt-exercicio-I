//esse arquivo não vai olhar para se o usuário possui uma das roles permitidas isso é papel de permissões
//e sim olhar as permissões que chegam indiretamente pelas roles que o usuário possui

const database = require("../models");

const permissionsRoles = (allowedPermissions) => {
  return async (req, res, next) => {
    const userId = req.userId;

    const user = database.users.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: database.roles,
          as: "users_roles",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!user) {
      return res.status(401).send("Usuário não encontrado.");
    }
  };
};
