const { findById } = require("./userService.js");
const database = require("../models/index.js");
const { Op } = require("sequelize");

//esse arquivo vai ser responsável por liberar o acesso de acordo com o cargo e a permissão, ele faz a ponte entre
//roles e permissions

const securityService = async (dto) => {
  //chama user de userService porque ele já faz a validação do usuário
  const user = await findById(dto.userId);

  //security service vai receber 3 coisas como parâmetro, userId, uma lista de roles e uma lista de permissões
  //então para buscar na lista de permissões no where precisamos do op.in porque não tem como buscar várias dentro
  //de where sem ele
  const roles = await database.roles.findAll({
    where: {
      name: {
        [Op.in]: dto.roles,
      },
    },
    attributes: ["id", "name"],
  });

  //pode acontecer da requisição vir mais roles do que possui no banco, no banco temos owner e admin, mas vamos supor
  //que roles venha com 3, owner, admin e superowner, daria erro porque está tentando buscar algo que não existe
  //portanto colocamos um if que se o tamanho da lista for maior que o tamanho da lista de roles encontrada da erro
  if (dto.roles.length !== roles.length) {
    throw new Error("Requisição de roles incorreta.");
  }

  //aqui é a mesma coisa que se tivesse feito getUsers_roles, porque user aqui retorna os dados encontrados então
  //só salvar isso em uma variável para poder usar em baixo
  const userRoles = user.users_roles;

  //para adicionar as requisições precisamos remover a que está para não correr risco de bug de permissões misturadas
  //ai usa removeUsers_roles que também já vem no sequelize quando criamos os relacionamentos, ele vem implícito
  //olhe na documentação do sequelize para saber todos
  //passa userRoles dentro dele porque esvazia tudo que foi encontrado
  await user.removeUsers_roles(userRoles);

  //ai depois de remover tem que adicionar as roles novamente no relacionamento, essas roles adicionadas são as
  //que foram encontradas pela pesquisa em roles
  await user.addUsers_roles(roles);

  //permissions segue o mesmo raciocínio de roles
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

  const userPermissions = user.user_permissions;

  await user.removeUser_permissions(userPermissions);

  await user.addUser_permissions(permissions);

  //no final deve pegar o usuário de novo, porém agora o usuário foi atualizado com os dados acima, e ele vai
  //receber apenas as roles e permissões que foram colocadas nele nesse arquivo
  const updatedUser = await findById(dto.userId);

  return updatedUser;
};

module.exports = securityService;
