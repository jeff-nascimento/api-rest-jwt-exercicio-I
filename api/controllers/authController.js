const { login } = require("../services/authService.js");

//POST /auth/login

//authservice precisa receber um objeto contendo email e senha, mas antes disso precisa de uma verificação pra
//que email e senha não venha undefined, que não seja outra coisa se não string e que não seja vazio
const authController = async (req, res) => {
  const body = req.body ?? {};

  const { email, password } = body;

  if (!email || !password) {
    return res.status(400).send({ message: "Campos obrigatórios." });
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).send({ message: "Valores dos campos inválidos." });
  }

  if (email.trim() === "" || password.trim() === "") {
    return res.status(400).send({ message: "Os campos não podem ser vazios." });
  }

  try {
    const authResult = await login({ email, password });

    return res.status(200).send(authResult);
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};
