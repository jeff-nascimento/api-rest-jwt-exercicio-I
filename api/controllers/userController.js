const {
  create,
  findAll,
  findById,
  update,
  remove,
} = require("../services/userService.js");

//create (POST /users)

//vou comentar apenas user porque todos os outros user, role e permission seguem o mesmo padrão

const createUser = async (req, res) => {
  //deve validar o body, porque se tentar criar um usuário porém se os dados recebidos do body forem undefined
  //esse usuário vai dar erro typeError, para previnir usa ternário, req.body ou objeto vazio
  const body = req.body ?? {};

  //pega name, email e password do body, no service precisa de tudo isso para criar o arquivo
  const { name, email, password } = body;

  if (!name || !email) {
    return res.status(400).send({ message: "Campos obrigatórios." });
  }
  if (typeof name !== "string" || typeof email !== "string") {
    return res.status(400).send({ message: "Valores dos campos inválidos." });
  }

  if (name.trim() === "" || email.trim() === "") {
    return res.status(400).send({ message: "Os campos não podem ser vazios." });
  }

  try {
    //chama o método create de service, lembre-se ele é async então precisa do await aqui
    const newUser = await create({ name, email, password });

    //cria uma variável que tem as mesmas coisas que newUser porém sem a senha, porque quando cria assim ela
    //vem tanto com a senha quanto com o hash, então qualquer pessoa poderia pegar as informações da senha

    const result = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    //envia no return a nova variável que não contém a senha
    return res.status(201).send(result);
  } catch (error) {
    return res.status(400).send({ message: error.message });
    // Uso 400 para não diferenciar erros de cadastro e evitar expor
    // se o e-mail informado já pertence a um usuário.
  }
};

//findAll (GET /users)

//findAll do service não precisa receber parâmetro algum, por isso aqui mantém sem, apenas encontra todos e retorna
//os que encontrou
const findAllUsers = async (req, res) => {
  try {
    const users = await findAll();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//findById (GET /users/:id):

//findById segue quase o mesmo padrão de findAll, porém recebe id de params (params é da url, ou seja, ele vai
//pegar o id da url e pesquisar pelo usuário)
const findUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await findById(id);

    return res.status(200).send(user);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

//update (PUT /users/:id)

//update precisa de um objeto com 3 coisas, id, name e email, id porque vai selecionar o usuário pelo id dele,
//name e email que vai ser usado para atualizar
const updateUser = async (req, res) => {
  const { id } = req.params;

  const body = req.body ?? {};

  const { name, email } = body;

  if (!name || !email) {
    return res.status(400).send({ message: "Campos obrigatórios." });
  }
  if (typeof name !== "string" || typeof email !== "string") {
    return res.status(400).send({ message: "Valores dos campos inválidos." });
  }

  if (name.trim() === "" || email.trim() === "") {
    return res.status(400).send({ message: "Os campos não podem ser vazios." });
  }

  try {
    const user = await update({ id, name, email });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

//remove (DELETE /users/:id)

//remove não precisa retornar nada, porque ele vai apenas apagar, então não tem o que retornar mais
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
