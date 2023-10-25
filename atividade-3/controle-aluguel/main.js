const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sqlite3 = require("sqlite3");

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

app.post("/aluguel/inicia", (req, res, next) => {
  let ts = Math.round(new Date().getTime() / 1000);

  db.run(
    `INSERT INTO "aluguel"("serial", "cpf", "inicio", "final")
     VALUES (?, ?, ?, ?)`,
    [req.body.serial, req.body.cpf, ts, 0],
    (err) => {
      if (err) {
        console.log("Error: " + err);
        res.status(500).send("Erro ao iniciar aluguel.");
      } else {
        console.log("Aluguel iniciado!");
        res.status(200).send("Aluguel iniciado!");
      }
    }
  );
});

app.post("/aluguel/encerra", (req, res, next) => {
  let ts = Math.round(new Date().getTime() / 1000);

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
