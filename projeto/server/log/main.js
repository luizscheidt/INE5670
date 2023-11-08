const express = require("express");
const fs = require("fs");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const LOG_PATH = "./dados/log.json";

const readLog = (cb) => {
  fs.readFile(LOG_PATH, (err, data) => cb(err, JSON.parse(data)));
};

const writeLog = (data, cb) => {
  fs.writeFile(LOG_PATH, JSON.stringify(data, undefined, 2), () => cb());
};

app.get("/log", (req, res, next) => {
  readLog((err, log) => {
    if (err) {
      console.log("Err: ", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(log);
    }
  });
});

// Adiciona um novo registro no log
// Dados esperados:
// {
//   "key": <key>,
//   "ts": <ts>,
//   "success": 0 || 1
// }
app.post("/log", (req, res, next) => {
  let { key, ts, success } = req.body;
  if (!(key && ts)) {
    return res.status(500).send('Required keys: "key", "ts", "success"');
  }

  if (![0, 1].includes(success)) {
    return res.status(400).send('"success" key must be 0 or 1');
  }

  readLog((err, log) => {
    if (err) {
      console.log("Err: ", err);
      return res.status(500).send("Internal Server Error");
    } else {
      log[ts] = { key, success };
      writeLog(log, () => {
        return res.status(200).send();
      });
    }
  });
});

let porta = 8081;
app.listen(porta, () => {
  console.log("Serviço de log em execução: http://127.0.0.1:" + porta);
});
