const database = require("../models");
const bcrypt = require("bcryptjs");

//não foi passado id para service porque ele já está como defaultValue: Sequelize.UUIDV4 lá no banco de dados

const create = async (dto) => {
  //pega os valores de nome email e senha do dto -> dados que vão ser enviados pelo controller
  const userName = dto.name;
  const userEmail = dto.email;
  const userPassword = dto.password;

  //esse aqui é para verificar se tem algum usuário com o mesmo email
  //pega o model users de database e tenta encontrar um onde o where de email aponta para userEmail
  const user = await database.users.findOne({
    where: {
      email: userEmail,
    },
  });

  //se tiver um usuário da um novo erro falando que já existe um usuário cadastrado
  if (user) {
    throw new Error("Usuário já cadastrado.");
  }

  try {
    //essa parte vai criar um hash da senha para poder proteger ela, chama a bibilhoteca bscript com o método
    //dela de hash, esse método precisa de dois parametros, a senha para criar o hash e o salt
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    //depois disso chama o método create nativo do sequelize para criar o usuário com os dados passados dentro do
    //objeto
    const createUser = await database.users.create({
      name: userName,
      email: userEmail,
      password: hashedPassword,
    });

    return createUser;
  } catch (error) {
    throw new Error("Erro interno do servidor.");
  }
};

const findAll = async () => {
  //find all não necessáriamente precisa ter um where, esse código é um exemplo disso, porque vai trazer todos os dados
  //de todos os usuários
  const users = await database.users.findAll({
    //coloca dois includes, para verificar nas duas tabelas, tanto na de roles quanto de permissions
    include: [
      {
        model: database.roles,
        as: "users_roles",
        //por que o through? porque through serve para fazer a interação entre as tabelas, ele sinaliza que vai
        //ter duas tabelas interagindo entre si, como essas tem, passando o attributes vazios sinaliza que
        //não vai trazer os valores desses attributes, poluindo o resultado da requisição
        through: {
          attributes: [],
        },
      },
      {
        model: database.permissions,
        as: "user_permissions",
        through: {
          attributes: [],
        },
      },
    ],
  });

  return users;
};

module.exports = { create, findAll };
