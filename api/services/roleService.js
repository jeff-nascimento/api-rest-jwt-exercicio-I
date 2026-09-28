const database = require("../models");

const create = async (dto) => {
  const name = dto.name;
  const description = dto.description;

  const role = await database.roles.findOne({
    where: {
      name,
    },
  });

  //única diferença desse arquivo para o de userService é que ele verifica se já tem uma role com o mesmo nome
  //para que elas não venham duplicadas
  if (role) {
    throw new Error("Role com nome mesmo nome cadastrado.");
  }

  try {
    const newRole = await database.roles.create({
      name,
      description,
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
      {
        model: database.permissions,
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
      id,
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
      {
        model: database.permissions,
        as: "roles_permissions",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],
  });

  if (!role) {
    throw new Error("Não há role com esse ID.");
  }

  return role;
};

const update = async (dto) => {
  const role = await findById(dto.id);

  try {
    role.name = dto.name;
    role.description = dto.description;

    await role.save();

    return role;
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

module.exports = { create, findAll, findById, update, remove };
