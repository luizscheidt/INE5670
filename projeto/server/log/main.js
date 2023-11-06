const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/log", (req, res, next) => {
  res.status(200).send();
});

let porta = 8081;
app.listen(porta, () => {
  console.log("Serviço de log em execução: http://127.0.0.1:" + porta);
});
