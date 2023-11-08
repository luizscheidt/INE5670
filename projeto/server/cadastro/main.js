const express = require("express");
const fs = require("fs");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const KEYS_PATH = "./dados/keys.json";

const readKeys = (cb) => {
  fs.readFile(KEYS_PATH, (err, data) => cb(err, JSON.parse(data)));
};

const writeKeys = (data, cb) => {
  fs.writeFile(KEYS_PATH, JSON.stringify(data, undefined, 2), () => cb());
};

// Lista todos os dados de cadastro
app.get("/cadastro", async (req, res, next) => {
  readKeys((err, data) => {
    if (err) {
      console.log("Error: ", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(data);
    }
  });
});

// Adiciona novo cadastro
// Formato dados esperado:
// {
//   "key": <chave>,
//   "name": <nome>,
//   "cpf": <cpf>
// }
app.post("/cadastro", async (req, res, next) => {
  let { key, name, cpf } = req.body;
  if (!(key && name && cpf)) {
    return res.status(400).send('Required keys: "key", "name", and "cpf"');
  }

  cpf = parseInt(cpf, 10);
  if (!cpf) {
    return res.status(400).send('Invalid value for "cpf"');
  }
  readKeys((err, json) => {
    if (err) {
      console.log("Error: ", err);
      return res.status(500).send("Internal Server Error");
    } else {
      if (!json.keys.includes(key)) {
        json.keys.push(key);
      }

      json.info[cpf] = {
        name,
        cpf,
      };

      writeKeys(json, () => {
        return res.status(200).send();
      });
    }
  });
});

let porta = 8080;
app.listen(porta, () => {
  console.log("Serviço de cadastro em execução: http://127.0.0.1:" + porta);
});
