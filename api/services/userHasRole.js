const { findById } = require("./userService.js");
//arquivo responsável por receber o id do usuário e verificar se ele é admin, para executar funções
//retorna true ou false
const userHasRole = async (userId, roleName) => {
  const user = await findById(userId);

  const hasRole = user.users_roles.some((role) => role.name === roleName);

  return hasRole;
};

module.exports = { userHasRoleService: userHasRole };
