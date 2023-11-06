const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/cadastro", (req, res, next) => {
  res.status(200).send();
});

let porta = 8080;
app.listen(porta, () => {
  console.log("Serviço de cadastro em execução: http://127.0.0.1:" + porta);
});
