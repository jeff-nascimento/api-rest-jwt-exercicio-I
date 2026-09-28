const { findById } = require("./userService.js");
const userHasRole = async (userId, roleName) => {
  const user = await findById(userId);

  const hasRole = user.users_roles.some((role) => role.name === roleName);

  return hasRole;
};

module.exports = { userHasRoleService: userHasRole };
