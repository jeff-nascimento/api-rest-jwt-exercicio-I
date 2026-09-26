const database = require("../models");

const create = async (dto) => {
  const name = dto.name;
  const description = dto.description;

  const permission = await database.permissions.findOne({
    where: {
      name,
    },
  });

  if (permission) {
    throw new Error("Permissão já cadastrada.");
  }

  try {
    const newPermission = await database.permissions.create({
      name,
      description,
    });

    return newPermission;
  } catch (error) {
    throw new Error("Erro interno do servidor.");
  }
};

const finAll = async () => {
  const permissions = await database.permissions.findAll({
    include: [
      {
        model: database.user,
        as: "permissions_users",
        attributes: ["id", "name"],
      },
      {
        model: database.roles,
        as: "permissions_roles",
        attributes: ["id", "name"],
      },
    ],
  });

  return permissions;
};
