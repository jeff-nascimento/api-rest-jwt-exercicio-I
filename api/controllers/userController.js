const {
  create,
  findAll,
  findById,
  update,
  remove,
} = require("../services/userService.js");

//create (POST /users)

const createUser = async (req, res) => {
  const body = req.body ?? {};

  const { name, email, password } = body;
  try {
    const newUser = await create({ name, email, password });

    const result = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    return res.status(201).send(result);
  } catch (error) {
    return res.status(400).send({ message: error.message });
    // Uso 400 para não diferenciar erros de cadastro e evitar expor
    // se o e-mail informado já pertence a um usuário.
  }
};

//findAll (GET /users)

const findAllUsers = async (req, res) => {
  try {
    const users = await findAll();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

//findById (GET /users/:id):

const findUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await findById(id);

    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

//update (PUT /users/:id)

const updateUser = async (req, res) => {
  const { id } = req.params;

  const body = req.body ?? {};

  const { name, email } = body;

  try {
    const user = await update({ id, name, email });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

//remove (DELETE /users/:id)

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await remove(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

module.exports = {
  createUser,
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser,
};
