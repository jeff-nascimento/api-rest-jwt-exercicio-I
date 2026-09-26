const database = require("../models");

const create = async (dto) => {
  const name = dto.name;
  const description = dto.description;

  const permission = database.permissions.findOne({
    where: {
      name,
    },
  });

  if (permission) {
    throw new Error("Permissão já cadastrada.");
  }

  try {
    const newPermission = database.permissions.create({
      name,
      description,
    });
  } catch (error) {
    throw new Error("Erro interno do servidor.");
  }
};
