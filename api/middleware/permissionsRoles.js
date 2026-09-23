//este middleware não verifica se o usuário possui uma das roles permitidas.
//isso seria responsabilidade de um middleware de roles.

//aqui, o objetivo é verificar se o usuário possui determinada permissão diretamente ou indiretamente
// através das roles que ele possui.

const database = require("../models");

const { Op } = require("sequelize");

const permissionsRoles = (allowedPermissions) => {
  return async (req, res, next) => {
    const userId = req.userId;

    const user = await database.users.findOne({
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

    //como mapeou todas as roles existentes do usuário com id procurado,
    // agora pega o id dessas roles e deixa salvo para usar abaixo

    const roleIds = user.users_roles.map((role) => role.id);

    if (roleIds.length === 0) {
      return res.status(401).send("Usuário não possui role.");
    }

    //essa função vai procurar todos os registros de roles do usuário procurado,
    // porque em roles? porque agora vai usar a
    //interação de papel e o que a pessoa pode fazer com esse papel, então vai da interação de role e permissoes
    const roles = await database.roles.findAll({
      //como o usuário pode possuir mais de uma role, não podemos pesquisar apenas por um ID.
      //o Op.in permite verificar se o ID da role está contido no array roleIds,
      //retornando todas as roles que pertencem ao usuário.
      //para isso devemos usar o operado Op do sequelize, que serve para diversas
      //coisas, verificar se é menor que, maior que, igual, entre, etc. Um desses usos é para verificar se
      //está dentro (in), nesse caso dentro do roleIds, ou seja, vai verificar se o id que queremos está contido
      //dentro de um dos ids selecionados anteriormente
      where: {
        id: { [Op.in]: roleIds },
      },
      //depois do where é a hora de pegar o caminho da interação dos dois, precisa do model de permissões porque
      //nele que está o que cada um pode fazer, porém é de roles para ele porque precisa primeiro carregar os
      //papeis de cada um
      include: [
        {
          model: database.permissions,
          as: "roles_permissions",
          attributes: ["id", "name"],
        },
      ],
    });

    //percorre as roles do usuário e verifica se alguma delas possui uma permissão permitida.
    //para cada role, o map() transforma os objetos de permissão em seus respectivos nomes.
    //depois, o some() interno verifica se algum desses nomes está presente em allowedPermissions(requisição do user).
    //se alguma role possuir uma das permissões permitidas, o some() externo retorna true.
    const hasPermission = roles.some((role) =>
      role.roles_permissions
        .map((permission) => permission.name)
        .some((name) => allowedPermissions.includes(name)),
    );

    if (!hasPermission) {
      return res.status(401).send("Usuário não possui permissão para a ação.");
    }

    next();
  };
};

module.exports = permissionsRoles;
