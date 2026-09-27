const database = require("../models");
const { compare } = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const jwtSecret = require("../config/jwtSecret.js");

const authService = async (dto) => {
  const user = await database.users.findOne({
    where: {
      email: dto.email,
    },
    attributes: ["id", "email", "password"],
  });

  if (!user) {
    throw new Error("Erro campos de login inválidos.");
  }

  //compare vai pegar uma senha de texto e comparar com a senha em hash que temos no banco, ele vai pegar a senha
  //em texto e procurar informações da nossa própria senha no banco, se as informações baterem ele retorna true
  const verifyPassword = await compare(dto.password, user.password);

  if (!verifyPassword) {
    throw new Error("Erro campos de login inválidos.");
  }

  //payload criado para colocar no sign
  const payload = {
    id: user.id,
    email: user.email,
  };

  //sign é uma assinatura do desenvolvedor para confirmar se o código não foi modificado, ele recebe as informações
  //do usuário, a nossa chave de assinatura e o tempo que esse token permanece ativo, nesse caso 1 dia
  const token = jsonwebtoken.sign(payload, jwtSecret.secret, {
    expiresIn: "1d",
  });

  return { accesToken: token };
};

module.exports = { login: authService };
