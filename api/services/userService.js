const database = require("../models");
const bcrypt = require("bcryptjs");

//não foi passado id para service porque ele já está como defaultValue: Sequelize.UUIDV4 lá no banco de dados

//primeiro método do crud, create
const create = async (dto) => {
  //pega os valores de nome email e senha do dto -> dados que vão ser enviados pelo controller que serão
  //pegos quando tentar criar um novo usuário
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

module.exports = { create };
