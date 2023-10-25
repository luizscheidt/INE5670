const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sqlite3 = require("sqlite3");

const STATUS_PATINETE = [0, 1, 2]; // 0 = disponivel, 1 = alugado, 2 = nao operante

var db = new sqlite3.Database("dados/dados.db", (err) => {
  if (err) {
    console.log("ERRO: não foi possível conectar ao SQLite.");
    throw err;
  }
  console.log("Conectado à base de dados!");
});

db.run(
  `CREATE TABLE IF NOT EXISTS "patinete"
        ("lat" TEXT NOT NULL, "lng" TEXT NOT NULL,
        "serial" TEXT PRIMARY KEY NOT NULL UNIQUE, "status" INT NOT NULL)`,
  [],
  (err) => {
    if (err) {
      console.log("ERRO: não foi possível criar tabela.");
      throw err;
    }
  }
);

app.post("/patinete", (req, res, next) => {
  let status = parseInt(req.body.status, 10);

  if (!STATUS_PATINETE.includes(status)) {
    res
      .status(400)
      .send(
        "Status deve ser um número inteiro de 0 a 2. (0 = disponivel, 1 = alugado, 2 = não operante)"
      );
  }

  db.run(
    `INSERT INTO "patinete"("lat", "lng", "serial", "status")
     VALUES (?, ?, ?, ?)`,
    [
      req.body.lat,
      req.body.lng,
      req.body.serial,
      parseInt(req.body.status, 10),
    ],
    (err) => {
      if (err) {
        console.log("Error: " + err);
        res.status(500).send("Erro ao cadastrar patinete.");
      } else {
        console.log("Patinete cadastrado com sucesso!");
        res.status(200).send("Patinete cadastrado com sucesso!");
      }
    }
  );
});

app.get("/patinete", (req, res, next) => {
  db.all(
    `SELECT *
       FROM "patinete"`,
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

app.get("/patinete/:serial", (req, res, next) => {
  db.get(
    `SELECT *
       FROM "patinete"
      WHERE "serial" = ?`,
    req.params.serial,
    (err, result) => {
      if (err) {
        console.log("Erro: " + err);
        res.status(500).send("Erro ao obter dados.");
      } else if (result == null) {
        console.log("Patinete não encontrado.");
        res.status(404).send("Patinete não encontrado.");
      } else {
        res.status(200).json(result);
      }
    }
  );
});

app.patch("/patinete/:serial", (req, res, next) => {
  let status = null;
  if (req.body.status) {
    status = parseInt(req.body.status, 10);

    if (!STATUS_PATINETE.includes(status)) {
      res
        .status(400)
        .send(
          "Status deve ser um número inteiro de 0 a 2. (0 = disponivel, 1 = alugado, 2 = não operante"
        );
    }
  }

  db.run(
    `UPDATE "patinete"
        SET "lat" = COALESCE(?, "lat"),
            "lng" = COALESCE(?, "lng"),
            "status" = COALESCE(?, "status")
      WHERE "serial" = ?`,
    [req.body.lat, req.body.lng, status, req.params.serial],
    function (err) {
      if (err) {
        console.log(err);
        res.status(500).send("Erro ao alterar dados.");
      } else if (this.changes == 0) {
        console.log("Patinete não encontrado.");
        res.status(404).send("Patinete não encontrado.");
      } else {
        res.status(200).send("Patinete alterado com sucesso!");
      }
    }
  );
});

app.delete("/patinete/:serial", (req, res, next) => {
  db.run(
    `DELETE FROM "patinete" WHERE "serial" = ?`,
    req.params.serial,
    function (err) {
      if (err) {
        res.status(500).send("Erro ao remover patinete.");
      } else if (this.changes === 0) {
        console.log("Patinete não encontrado.");
        res.status(404).send("Patinete não encontrado.");
      } else {
        res.status(200).send("Patinete removido com sucesso!");
      }
    }
  );
});

let porta = 8081;
app.listen(porta, () => {
  console.log(
    "Serviço de cadastro de patinetes em execução: http://127.0.0.1:" + porta
  );
});
