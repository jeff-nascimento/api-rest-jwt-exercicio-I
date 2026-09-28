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
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
      {
        model: database.permissions,
        as: "user_permissions",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],
  });

  return users;
};

const findById = async (id) => {
  const user = await database.users.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: database.roles,
        as: "users_roles",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
      {
        model: database.permissions,
        as: "user_permissions",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],
  });

  if (!user) {
    throw new Error("Não há usuário com esse ID.");
  }

  return user;
};

const update = async (dto) => {
  //chama uma uma instancia de findById porque ai não precisa procurar um usuário e validar de novo, somente usa
  //o que ele já fez, passando o dto.id que vai ser pego pelo controller
  const user = await findById(dto.id);

  //esse fica diferente, coloca um try cath porque ele não tem como fazer verificação se não for em try catch

  try {
    //salva o nome do usuário como o novo nome digitado, faz isso com email também
    user.name = dto.name;
    user.email = dto.email;
    //depois usa o método do sequelize para salvar a alteração no banco de dados, tem que colocar await porque é
    //assíncrona
    await user.save();

    return user;
  } catch (error) {
    throw new Error("Erro ao atualizar usuário.");
  }
};

const remove = async (id) => {
  const user = await findById(id);

  try {
    //usa o método destroy do sequelize que serve para detalar uma coluna da tabela, usa no user porque já
    //selecionou o id dele, porque não precisa passar um id nesse usuário, porque quer retirar todas as
    //informações dele, e como é só ele não corre o risco de tirar mais coisa que deve
    await user.destroy();
  } catch (error) {
    throw new Error("Erro ao deletar usuário.");
  }
};

module.exports = { create, findAll, findById, update, remove };
