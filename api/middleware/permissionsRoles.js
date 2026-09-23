//esse arquivo não vai olhar para se o usuário possui uma das roles permitidas isso é papel de permissões
//e sim olhar as permissões que chegam indiretamente pelas roles que o usuário possui

const database = require("../models");

const { Op } = require("sequelize");

const permissionsRoles = (allowedPermissions) => {
  return async (req, res, next) => {
    const userId = req.userId;

    const user = database.users.findOne({
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

    //como mapeou todas as roles existentes de cada usuário, agora pega o id dessas roles e deixa salvo para usar abaixo

    const roleIds = user.users_roles.map((role) => role.id);

    if (roleIds.length === 0) {
      return res.status(401).send("Usuário não possui role.");
    }

    //essa função vai procurar todos os registros dentro de roles, porque em roles? porque agora vai usar a
    //interação de papel e o que a pessoa pode fazer com esse papel, então vai da interação de role e permissoes
    const roles = database.roles.findAll({
      //como queremos todos os registros de todos os tipos de permissões não podemos apenas colocar um id
      //ele não achará todos os casos, para isso devemos usar o operado Op do sequelize, que serve para diversas
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

    if (!roles) {
      return res.status(401).send("Permissão não encontrada para essa ação.");
    }
  };
};
