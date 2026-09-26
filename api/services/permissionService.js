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

const findAll = async () => {
  const permissions = await database.permissions.findAll({
    include: [
      {
        model: database.users,
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

const findById = async (id) => {
  const permission = await database.permissions.findOne({
    where: {
      id,
    },
    include: [
      {
        model: database.users,
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

  if (!permission) {
    throw new Error("Não há permissões para esse ID.");
  }

  return permission;
};

const update = async (dto) => {
  const permission = await findById(dto.id);

  try {
    permission.name = dto.name;
    permission.description = dto.description;

    await permission.save();
  } catch (error) {
    throw new Error("Erro interno do servidor.");
  }
};
