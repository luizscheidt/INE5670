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
  `CREATE TABLE IF NOT EXISTS "cartao"
          ("num" TEXT PRIMARY KEY NOT NULL UNIQUE, "cpf" INT NOT NULL UNIQUE)`,
  [],
  (err) => {
    if (err) {
      console.log("ERRO: não foi possível criar tabela.");
      throw err;
    }
  }
);

app.post("/pagamento/:cpf", (req, res, _) => {
  console.log(parseInt(req.params.cpf, 10));
  db.get(
    `
    SELECT "num"
      FROM "cartao"
     WHERE "cpf" = ?
     LIMIT 1
     `,
    [parseInt(req.params.cpf, 10)],
    (err, result) => {
      if (err) {
        console.log("Error: " + err);
        res.status(500).send("Erro ao realizar pagamento.");
      } else {
        console.log(
          `Pagamento de R$: ${req.body.valor} no cartão: ${result.num}`
        );
        res
          .status(200)
          .send(`Pagamento de R$: ${req.body.valor} no cartão: ${result.num}`);
      }
    }
  );
});

app.post("/pagamento", (req, res, next) => {
  db.run(
    `INSERT INTO "cartao"("num", "cpf")
     VALUES (?, ?)`,
    [req.body.num, req.body.cpf],
    (err) => {
      if (err) {
        console.log("Error: " + err);
        res.status(500).send("Erro ao cadastrar cartão.");
      } else {
        console.log("Cartão cadastrado com sucesso!");
        res.status(200).send("Cartão cadastrado com sucesso!");
      }
    }
  );
});

app.get("/pagamento", (req, res, next) => {
  db.all(
    `SELECT *
       FROM "cartao"`,
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

app.get("/pagamento/:num", (req, res, next) => {
  db.get(
    `SELECT *
       FROM "cartao"
      WHERE "num" = ?`,
    req.params.cpf,
    (err, result) => {
      if (err) {
        console.log("Erro: " + err);
        res.status(500).send("Erro ao obter dados.");
      } else if (result == null) {
        console.log("Cartao não encontrado.");
        res.status(404).send("Cartao não encontrado.");
      } else {
        res.status(200).json(result);
      }
    }
  );
});

app.patch("/pagamento/:num", (req, res, next) => {
  db.run(
    `UPDATE "cartao"
        SET "cpf" = COALESCE(?, "cpf"),
      WHERE "num" = ?`,
    [req.body.cpf, parseInt(req.params.num)],
    function (err) {
      if (err) {
        console.log(err);
        res.status(500).send("Erro ao alterar dados.");
      } else if (this.changes == 0) {
        console.log("Cartao não encontrado.");
        res.status(404).send("Cartao não encontrado.");
      } else {
        res.status(200).send("Cartao alterado com sucesso!");
      }
    }
  );
});

app.delete("/pagamento/:cpf", (req, res, next) => {
  db.run(
    `DELETE FROM "cartao" WHERE "num" = ?`,
    req.params.num,
    function (err) {
      if (err) {
        res.status(500).send("Erro ao remover Cartao.");
      } else if (this.changes === 0) {
        console.log("Cartao não encontrado.");
        res.status(404).send("Cartao não encontrado.");
      } else {
        res.status(200).send("Cartao removido com sucesso!");
      }
    }
  );
});

let porta = 8084;
app.listen(porta, () => {
  console.log("Serviço de pagamento em execução: http://127.0.0.1:" + porta);
});
