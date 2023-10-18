const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sqlite3 = require("sqlite3");

var db = new sqlite3.Database("./dados/dados.db", (err) => {
  if (err) {
    console.log("ERRO: não foi possível conectar ao SQLite.");
    throw err;
  }
  console.log("Conectado ao SQLite!");
});

db.run(
  `CREATE TABLE IF NOT EXISTS "cadastro"
        ("nome" TEXT NOT NULL, "email" TEXT NOT NULL,
        "cpf" INTEGER PRIMARY KEY NOT NULL UNIQUE, "fone" TEXT NOT NULL)`,
  [],
  (err) => {
    if (err) {
      console.log("ERRO: não foi possível criar tabela.");
      throw err;
    }
  }
);

app.post("/cadastro", (req, res, next) => {
  db.run(
    `INSERT INTO "cadastro"("nome", "email", "cpf", "fone")
     VALUES (?, ?, ?, ?)`,
    [req.body.nome, req.body.email, req.body.cpf, req.body.fone],
    (err) => {
      if (err) {
        console.log("Error: " + err);
        res.status(500).send("Erro ao cadastrar cliente.");
      } else {
        console.log("Cliente cadastrado com sucesso!");
        res.status(200).send("Cliente cadastrado com sucesso!");
      }
    }
  );
});

app.get("/cadastro", (req, res, next) => {
  db.all(
    `SELECT *
       FROM "cadastro"`,
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

app.get("/cadastro/:cpf", (req, res, next) => {
  db.get(
    `SELECT *
       FROM "cadastro"
      WHERE "cpf" = ?`,
    req.params.cpf,
    (err, result) => {
      if (err) {
        console.log("Erro: " + err);
        res.status(500).send("Erro ao obter dados.");
      } else if (result == null) {
        console.log("Cliente não encontrado.");
        res.status(404).send("Cliente não encontrado.");
      } else {
        res.status(200).json(result);
      }
    }
  );
});

app.patch("/cadastro/:cpf", (req, res, next) => {
  db.run(
    `UPDATE "cadastro"
        SET "nome" = COALESCE(?, "nome"),
            "email" = COALESCE(?, "email"),
            "fone" = COALESCE(?, "fone")
      WHERE "cpf" = ?`,
    [
      req.body.nome,
      req.body.email,
      req.body.fone,
      parseInt(req.params.cpf, 10),
    ],
    function (err) {
      if (err) {
        console.log(err);
        res.status(500).send("Erro ao alterar dados.");
      } else if (this.changes == 0) {
        console.log("Cliente não encontrado.");
        res.status(404).send("Cliente não encontrado.");
      } else {
        res.status(200).send("Cliente alterado com sucesso!");
      }
    }
  );
});

app.delete("/cadastro/:cpf", (req, res, next) => {
  db.run(
    `DELETE FROM "cadastro" WHERE "cpf" = ?`,
    req.params.cpf,
    function (err) {
      if (err) {
        res.status(500).send("Erro ao remover cliente.");
      } else if (this.changes === 0) {
        console.log("Cliente não encontrado.");
        res.status(404).send("Cliente não encontrado.");
      } else {
        res.status(200).send("Cliente removido com sucesso!");
      }
    }
  );
});

let porta = 8080;
app.listen(porta, () => {
  console.log("Serviço de usuários em execução: http://127.0.0.1:" + porta);
});
