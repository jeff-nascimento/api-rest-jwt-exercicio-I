const database = require("../models");

//método create é quase igual ao user, única diferença é que trabalha com o model tasks
const create = async (dto) => {
  const title = dto.title;
  const description = dto.description;
  const userId = dto.userId;

  try {
    const createTask = await database.tasks.create({
      title,
      description,
      user_id: userId,
    });

    return createTask;
  } catch (error) {
    throw new Error("Erro interno do servidor.");
  }
};

//método um pocuo diferente, tem dois métodos para a mesma coisa, esse método aqui trás todas as tarefas, porém
//só aquelas que tem o id de usuário cadastrado nelas, serve para que um usuário possa ver apenas as tarefas
// que ele é dono
const findAllByUser = async (userId) => {
  const tasks = await database.tasks.findAll({
    where: {
      user_id: userId,
    },
    attributes: ["id", "title", "description", "completed"],
  });

  return tasks;
};

//essa função já é para o admin, ela vai pegar todas as tarefas de todos os usuários, o service vai ser responsável
//por chamar ela
const findAll = async () => {
  const tasks = await database.tasks.findAll({
    attributes: ["id", "title", "description", "completed", "user_id"],
  });

  return tasks;
};

//findbyid já tem uma lógica um pouco diferente, ele vai receber o userId e um bool de isAdmin
const findById = async (id, userId, isAdmin) => {
  //pega task normal
  const task = await database.tasks.findOne({
    where: {
      id: id,
    },
    attributes: ["id", "title", "description", "completed", "user_id"],
  });

  if (!task) {
    throw new Error("Tarefa não encontrada.");
  }

  //faz uma verificação para que um usuário comum não possa ver outras tarefas, verifica se não é admin e se o userid
  //da tarefa é diferente do userid da pessoa que faz a verificação, se for solta um erro de tarefa não encontrada
  //porque um erro assim? porque se colocasse algo mais direcionado falando que o usuário não tem um id que pode
  //fazer a requisição ele poderia tentar colocar outros ids até achar um que possa ver a tarefa
  if (!isAdmin && task.user_id !== userId) {
    throw new Error("Tarefa não encontrada.");
  }

  return task;
};

//update a remove seguem a mesma linha de raciocínio, para atualizar é igual em userService, porém fazem uma veri
//ficação de usuário para saber se ele pode ver a informação, mesma coisa de findById, verifica se não é admin e se
//ele tem id diferente ao id do dono da tarefa
const update = async (id, title, description, userId, isAdmin) => {
  const task = await findById(id, userId, isAdmin);

  try {
    task.title = title;
    task.description = description;

    await task.save();
  } catch (error) {
    throw new Error("Erro ao atualizar tarefa.");
  }
};

const remove = async (id, userId, isAdmin) => {
  const task = await findById(id, userId, isAdmin);

  try {
    await task.destroy();
  } catch (error) {
    throw new Error("Erro ao deletar tarefa.");
  }
};

module.exports = { create, findAllByUser, findAll, findById, update, remove };
