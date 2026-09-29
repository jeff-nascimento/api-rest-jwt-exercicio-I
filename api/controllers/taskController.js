const {
  create,
  findAll,
  findAllByUser,
  findById,
  update,
  remove,
} = require("../services/taskService");
const { userHasRoleService } = require("../services/userHasRole.js");

//(POST /tasks)

const createTask = async (req, res) => {
  const body = req.body ?? {};

  const { title, description } = body;

  const userId = req.userId;

  if (!title) {
    return res.status(400).send({ message: "Campos obrigatórios." });
  }
  if (typeof title !== "string") {
    return res.status(400).send({ message: "Valores dos campos inválidos." });
  }

  if (title.trim() === "") {
    return res.status(400).send({ message: "Os campos não podem ser vazios." });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).send({
      message: "Valores dos campos inválidos.",
    });
  }

  try {
    const newTask = await create({ title, description, userId });
    return res.status(201).send(newTask);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

//GET /tasks)

const list = async (req, res) => {
  const userId = req.userId;

  try {
    const isAdmin = await userHasRoleService(userId, "Admin");

    if (isAdmin) {
      const tasks = await findAll();
      return res.status(200).send(tasks);
    } else {
      const tasks = await findAllByUser(userId);
      return res.status(200).send(tasks);
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

//GET /tasks/:id)

const findTaskById = async (req, res) => {
  const userId = req.userId;

  const { id } = req.params;

  try {
    const isAdmin = await userHasRoleService(userId, "Admin");

    const task = await findById(id, userId, isAdmin);

    return res.status(200).send(task);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

//PUT /tasks/:id)

const updateTask = async (req, res) => {
  const body = req.body ?? {};

  const { title, description } = body;

  const userId = req.userId;

  const { id } = req.params;

  if (!title) {
    return res.status(400).send({ message: "Campos obrigatórios." });
  }
  if (typeof title !== "string") {
    return res.status(400).send({ message: "Valores dos campos inválidos." });
  }

  if (title.trim() === "") {
    return res.status(400).send({ message: "Os campos não podem ser vazios." });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).send({
      message: "Valores dos campos inválidos.",
    });
  }

  try {
    const isAdmin = await userHasRoleService(userId, "Admin");

    const task = await update(id, title, description, userId, isAdmin);
    return res.status(200).send(task);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

//DELETE /tasks/:id)
const deleteTask = async (req, res) => {
  const userId = req.userId;

  const { id } = req.params;

  try {
    const isAdmin = await userHasRoleService(userId, "Admin");

    await remove(id, userId, isAdmin);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

module.exports = { createTask, list, findTaskById, updateTask, deleteTask };
