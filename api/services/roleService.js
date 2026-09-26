const database = require("../models");

const create = async (dto) => {
  const name = dto.name;
  const desciption = dto.desciption;

  const role = await database.roles.findOne({
    where: {
      name,
    },
  });

  if (role) {
    throw new Error("Há uma role com esse nome.");
  }

  try {
    const newRole = await database.roles.create({
      name,
      desciption,
    });
    return newRole;
  } catch (error) {
    throw new Error("Erro interno do servidor.");
  }
};

const findAll = async () => {
  const roles = await database.roles.findAll({
    include: [
      {
        model: database.users,
        as: "roles_users",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],

    include: [
      {
        model: database.users,
        as: "roles_permissions",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],
  });

  return roles;
};

const findById = async (id) => {
  const role = await database.roles.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: database.users,
        as: "roles_users",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],

    include: [
      {
        model: database.users,
        as: "roles_permissions",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],
  });

  return role;
};

const update = async (dto) => {
  const role = await findById(dto.id);

  try {
    role.name = dto.name;
    role.desciption = dto.desciption;

    await role.save();
  } catch (error) {
    throw new Error("Erro interno do servidor.");
  }
};

const remove = async (id) => {
  const role = await findById(id);

  try {
    await role.destroy();
  } catch (error) {
    throw new Error("Erro interno do servidor.");
  }
};
