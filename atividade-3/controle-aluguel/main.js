const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sqlite3 = require("sqlite3");

const axios = require("axios");

var db = new sqlite3.Database("dados/dados.db", (err) => {
  if (err) {
    console.log("ERRO: não foi possível conectar ao SQLite.");
    throw err;
  }
  console.log("Conectado à base de dados!");
});

db.run(
  `CREATE TABLE IF NOT EXISTS "aluguel"
        ("serial" TEXT NOT NULL, "cpf" INTEGER NOT NULL,
        "inicio" INTEGER NOT NULL, "final" INTEGER NOT NULL)`,
  [],
  (err) => {
    if (err) {
      console.log("ERRO: não foi possível criar tabela.");
      throw err;
    }
  }
);

app.get("/aluguel/", (req, res, next) => {
  db.all(
    `SELECT *
       FROM "aluguel"`,
    (err, result) => {
      if (err) {
        console.log("Erro: " + err);
        res.status(500).send("Erro ao obter dados.");
      } else {
        res.status(200).json(result);
      }
    }
  );
});

app.post("/aluguel/inicia", async (req, res, next) => {
  let ts = Math.round(new Date().getTime() / 1000);
  let serial = req.body.serial;

  if (!serial) {
    console.log("Serial patinete inválido: ", serial);
    res.status(400).send("Serial patinete inválido");
    return;
  }

  let err;
  await axios({
    method: "get",
    url: "http://127.0.0.1:8000/patinete/" + serial,
  })
    .then((resp) => {
      switch (resp.data.status) {
        case 1:
          res.status(403).send("Patinete já alugado.");
          err = true;
          return;
        case 2:
          res.status(403).send("Patinete inoperante.");
          err = true;
          return;
      }
    })
    .catch(() => {
      res.status(404).send("Patinete não encontrado");
      err = true;
      return;
    });

  if (err) return;

  db.run(
    `INSERT INTO "aluguel"("serial", "cpf", "inicio", "final")
     VALUES (?, ?, ?, ?)`,
    [serial, req.body.cpf, ts, 0],
    async (err) => {
      if (err) {
        console.log("Error: " + err);
        res.status(500).send("Erro ao iniciar aluguel.");
        return;
      } else {
        await axios({
          method: "patch",
          url: "http://127.0.0.1:8000/patinete/" + serial,
          data: { status: 1 },
        }).catch((err) => {
          console.log("Error", err);
          res.status(500).send("Erro ao alugar patinete");
        });
        await axios({
          method: "patch",
          url: "http://127.0.0.1:8000/controle-patinete/" + serial,
          data: { bloquear: true },
        })
          .then(() => {
            res.status(200).send("Aluguel iniciado!");
          })
          .catch((err) => {
            console.log("Error", err);
            res.status(500).send("Erro ao destravar patinete");
          });
      }
    }
  );
});

app.post("/aluguel/encerra", async (req, res, next) => {
  let ts = Math.round(new Date().getTime() / 1000);

  let serial = req.body.serial;

  if (!serial) {
    console.log("Serial patinete inválido: ", serial);
    res.status(400).send("Serial patinete inválido");
    return;
  }

  await axios({
    method: "patch",
    url: "http://127.0.0.1:8000/patinete/" + serial,
    data: { status: 0 },
  }).catch((err) => {
    console.log("Error", err);
    res.status(500).send("Erro ao encerrar aluguel");
  });

  await axios({
    method: "patch",
    url: "http://127.0.0.1:8000/controle-patinete/" + serial,
    data: { desbloquear: true },
  })
    .then(() => {
      res.status(200).send("Aluguel encerrado!");
    })
    .catch((err) => {
      console.log("Error", err);
      res.status(500).send("Erro ao destravar patinete");
    });

  db.run(
    `
    UPDATE "aluguel"
       SET "final" = ?
     WHERE "final" = 0
       AND "cpf" = ?
       AND "serial" = ?
  `,
    [ts, req.body.cpf, req.body.serial],
    (err) => {
      if (err) {
        console.log("Error: " + err);
        res.status(500).send("Erro ao encerrar aluguel.");
      } else {
        console.log("Aluguel iniciado!");
        res.status(200).send("Aluguel encerrado!");
      }
    }
  );
});

let porta = 8082;
app.listen(porta, () => {
  console.log("Controle de alguéis em execução: http://127.0.0.1:" + porta);
});
