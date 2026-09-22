//role é o papél que determinado usuário tem, ex: Jefferson: admin, Lorena: user, etc

const database = require("../models");

module.exports = (allowedRoles) => {
  return async (req, res, next) => {
    const userId = req.userId;

    //espera database porque findOne é assíncrono, pesquisa de database(index do models onde tem todas as models)
    //pega de models usuários, e encontra um
    const user = await database.users.findOne({
      //onde o id desse usuário seja igual ao id que está no req.userId
      where: {
        id: userId,
      },
      //include aqui está para pegar exatamente as informações que precisamos
      include: [
        //abre um objeto para separar apenas as que queremos
        {
          //model: database.roles -> pega o model roles porque é nele que tem os papéis de cada usuário, então precisa
          //chegar nele
          model: database.roles,
          //as é users_roles que é o as que foi colocado no caminho de interação de users -> roles, porque usa o de roles
          //se o model foi pedido de roles, porque lá no database.users estamos buscando nela, então ela que tem que dar
          //o 'caminho' de como chegar em roles
          as: "users_roles",
          //attributes é o que vamos querer pegar desse usuário, então queremos seu id e seu nome
          attributes: ["id", "name"],
        },
      ],
    });
  };
};
