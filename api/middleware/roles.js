//role é o papel que determinado usuário tem, ex: Jefferson: admin, Lorena: user, etc

const database = require("../models");

const roles = (allowedRoles) => {
  return async (req, res, next) => {
    const userId = req.userId;

    //await espera a consulta findOne terminar, pois ela é uma operação assíncrona,
    //pesquisa de database(index do models onde tem todas as models) pega de models usuários, e encontra um
    const user = await database.users.findOne({
      //onde o id desse usuário seja igual ao id que está no req.userId
      where: {
        id: userId,
      },
      //include aqui está para pegar exatamente as informações que precisamos
      include: [
        //abre um objeto para separar apenas as que queremos
        {
          //model: database.roles -> pega o model roles porque é nele que tem os papéis de cada usuário
          //model indica qual model relacionado queremos incluir (roles).
          model: database.roles,
          //as é o alias da associação users → roles que foi definida no model users, por que usa o de roles
          //se o model foi pedido de roles? porque lá no database.users estamos buscando nela, então ela que tem que dar
          //o 'caminho' de como chegar em roles
          as: "users_roles",
          //attributes é o que vamos querer pegar da roles para comparar, então queremos seu id e seu nome (papel)
          attributes: ["id", "name"],
        },
      ],
    });

    //mesmo que para chegar a essa parte de roles tem que autenticar o token de acesso precaução nunca é de mais
    //aqui confirma se existe um usuário com essas especificações, se caso não mostra um erro
    if (!user) {
      return res.status(401).send("Usuário não encontrado.");
    }

    //O usuário possui alguma role cujo nome está na lista de roles permitidas?
    //entra no model user que foi pego acima, onde tem os dados que precisa, só que o lugar no model que guarda cada
    //role que o usuário tem fica na tabela conjunta de roles e usuários, então tem que entrar nela agora
    const hasAllowedRole = user.users_roles
      //mapeia essa tabela pegando cada role, como a role tem uma coluna de name pega o name dela
      .map((role) => role.name)
      //some retorna true ou false caso encontre algum registro ou não encontre
      //map() transforma cada objeto de role em seu name. Depois, some() testa cada um desses nomes para
      // verificar se ele está presente em allowedRoles.
      .some((roleName) => allowedRoles.includes(roleName));

    if (!hasAllowedRole) {
      return res.status(401).send("Nenhuma role para esse usuário.");
    }

    next();
  };
};

module.exports = roles;
