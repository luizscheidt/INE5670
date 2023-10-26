const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.patch("/controle-patinete", (req, res, next) => {
  if (req.body.bloquear) {
    console.log("Patinete bloqueado: " + req.body.serial);
  } else if (req.body.desbloquear) {
    console.log("Patinete desbloqueado: " + req.body.serial);
  }
  res.status(200).send();
});

let porta = 8083;
app.listen(porta, () => {
  console.log("Controle de patinetes em execução: http://127.0.0.1:" + porta);
});
