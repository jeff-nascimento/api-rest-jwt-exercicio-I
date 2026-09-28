const {
  create,
  findAll,
  findById,
  update,
  remove,
} = require("../services/permissionService.js");

const createPermission = async (req, res) => {
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

  if (description) {
    if (typeof description !== "string") {
      return res.status(400).send({ message: "Valores dos campos inválidos." });
    }
  }

  try {
    const newPermission = await create({ name, description });

    return res.status(201).send(newPermission);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const findAllPermissions = async (req, res) => {
  try {
    const permissions = await findAll();
    return res.status(200).send(permissions);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const findPermissionById = async (req, res) => {
  const { id } = req.params;

  try {
    const permission = await findById(id);
    return res.status(200).send(permission);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

const updatePermission = async (req, res) => {
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

  if (description) {
    if (typeof description !== "string") {
      return res.status(400).send({ message: "Valores dos campos inválidos." });
    }
  }
  try {
    const permission = await update({ id, name, description });

    return res.status(200).send(permission);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

const deletePermission = async (req, res) => {
  const { id } = req.params;
  try {
    await remove(id);

    return res.status(204).send();
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

module.exports = {
  createPermission,
  findAllPermissions,
  findPermissionById,
  updatePermission,
  deletePermission,
};
