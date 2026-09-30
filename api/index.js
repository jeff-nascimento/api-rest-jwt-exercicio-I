const dotenv = require("dotenv");
const express = require("express");
const routes = require("./routes");
dotenv.config();

const app = express();

app.use(express.json());

routes(app);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});

module.exports = app;
