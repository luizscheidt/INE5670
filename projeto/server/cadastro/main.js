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
    for (const [key, info] of Object.entries(data.info)) {
      if (!data.keys.includes(key)) {
        info.blocked = true;
      }
    }

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

// Remove permissão de acesso de usuários
// Dados esperados:
// {
//   cpfs: [cpf1, cpf2, cpf3]
// }
app.post("/cadastro/block", async (req, res, next) => {
  let { cpfs } = req.body;

  readKeys((err, data) => {
    if (err) {
      console.log("Err", err);
      return res.status(500).send();
    } else {
      let keysToBlock = [];
      for (const [key, info] of Object.entries(data.info)) {
        if (cpfs.includes(info.cpf)) {
          keysToBlock.push(key);
        }
      }

      let keys = [];
      for (let i = 0; i < data.keys.length; i++) {
        let key = data.keys[i];
        if (!keysToBlock.includes(key)) {
          keys.push(key);
        }
      }
      data.keys = keys;

      writeKeys(data, () => {});
    }
  });

  return res.status(200).send();
});

// Concede permissão de acesso de usuários
// Dados esperados:
// {
//   cpfs: [cpf1, cpf2, cpf3]
// }
app.post("/cadastro/unblock", async (req, res, next) => {
  let { cpfs } = req.body;

  readKeys((err, data) => {
    if (err) {
      console.log("Err", err);
      return res.status(500).send();
    } else {
      let keysToUnblock = [];
      for (const [key, info] of Object.entries(data.info)) {
        if (cpfs.includes(info.cpf)) {
          keysToUnblock.push(key);
        }
      }
      for (let i = 0; i < keysToUnblock.length; i++) {
        if (!data.keys.includes(keysToUnblock[i])) {
          data.keys.push(keysToUnblock[i]);
        }
      }
      writeKeys(data, () => {});
    }
  });

  return res.status(200).send();
});

let porta = 8080;
app.listen(porta, () => {
  console.log("Serviço de cadastro em execução: http://127.0.0.1:" + porta);
});
