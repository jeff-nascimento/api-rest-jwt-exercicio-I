const {
  create,
  findAll,
  findById,
  update,
  remove,
} = require("../services/roleService.js");

//POST /roles):

const createRole = async (req, res) => {
  const body = req.body ?? {};

  const { name, description } = body;

  if (!name) {
    return res.status(400).send({ message: "Campos obrigatórios." });
  }
  if (typeof name !== "string") {
    return res.status(400).send({ message: "Valores dos campos inválidos." });
  }

  if (name.trim() === "") {
    return res.status(400).send({ message: "Os campos não podem ser vazios." });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).send({
      message: "Valores dos campos inválidos.",
    });
  }

  try {
    const newRole = await create({ name, description });

    return res.status(201).send(newRole);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

//GET /roles)

const findAllRoles = async (req, res) => {
  try {
    const roles = await findAll();

    return res.status(200).send(roles);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//GET /roles/:id)

const findRoleById = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await findById(id);

    return res.status(200).send(role);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

//PUT /roles/:id)

const updateRole = async (req, res) => {
  const { id } = req.params;

  const body = req.body ?? {};

  const { name, description } = body;

  if (!name) {
    return res.status(400).send({ message: "Campos obrigatórios." });
  }
  if (typeof name !== "string") {
    return res.status(400).send({ message: "Valores dos campos inválidos." });
  }

  if (name.trim() === "") {
    return res.status(400).send({ message: "Os campos não podem ser vazios." });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).send({
      message: "Valores dos campos inválidos.",
    });
  }

  try {
    const role = await update({ id, name, description });
    return res.status(200).send(role);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

//DELETE /roles/:id)

const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    await remove(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

module.exports = {
  createRole,
  findAllRoles,
  findRoleById,
  updateRole,
  deleteRole,
};
