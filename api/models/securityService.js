const { findById } = require("../services/userService.js");
const database = require("../models");
const { Op } = require("sequelize");

const securityService = async (dto) => {
  const user = await findById(dto.userId);

  const roles = await database.roles.findAll({
    where: {
      name: {
        [Op.in]: dto.roles,
      },
    },
    attributes: ["id", "name"],
  });

  if (dto.roles.length !== roles.length) {
    throw new Error("Requisição de roles incorreta.");
  }

  const userRoles = user.users_roles;

  await user.removeUsers_roles(userRoles);

  const permissions = await database.permissions.findAll({
    where: {
      name: {
        [Op.in]: dto.permissions,
      },
    },
    attributes: ["id", "name"],
  });

  if (dto.permissions.length !== permissions.length) {
    throw new Error("Requisição de permissão incorreta.");
  }
};
