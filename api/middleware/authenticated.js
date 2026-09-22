//esse arquivo é responsável por permitir a entrada ou não, ele vai somente dar a autorização para o usuário

const { verify } = require("jsonwebtoken"); // importa a função usada para verificar a validade do token

const jwtSecret = require("../config/jwtSecret.js"); //token criado pelo dev para assinar

module.exports = async (req, res, next) => {
  const token = req.headers.authorization; //pega token do cabeçalho

  if (!token) {
    //se não existe token retorna erro
    return res.status(401).send("Token de acesso não identificado.");
  }

  //token vem no formato Bearer 123, schema deu o nome para a primeira parte e accesstoken para a segunda
  //token.split(' ') separa onde tem espaço
  const [schema, accessToken] = token.split(" ");

  //se schema não tiver valor de bearer e accesstoken não existir mostra um erro
  if (schema !== "Bearer" || !accessToken) {
    return res.status(401).send("Formato de token inválido.");
  }

  try {
    //salva o resultado de verify numa variável, porque ele além de comparar se os dois tokens são iguais ainda
    //fica com o resultado do payload dele (os valores dentro dele)
    const tokenData = verify(accessToken, jwtSecret.secret);

    //salva os valores de id e email que tem no payload de tokendata dentro de req, dando um nome de userID e userEmail
    req.userId = tokenData.id;
    req.userEmail = tokenData.email;

    next();
  } catch (error) {
    return res.status(401).send("Token de acesso não autorizado.");
  }
};
