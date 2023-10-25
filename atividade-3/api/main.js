const httpProxy = require("express-http-proxy");
const express = require("express");
const app = express();
var logger = require("morgan");

app.use(logger("dev"));

function selectProxyHost(req) {
  if (req.path.startsWith("/cadastro")) return "http://127.0.0.1:8080/";
  else if (req.path.startsWith("/patinete")) return "http://127.0.0.1:8081/";
  else return null;
}

app.use((req, res, next) => {
  var proxyHost = selectProxyHost(req);
  if (proxyHost == null) res.status(404).send("Not found!");
  else httpProxy(proxyHost)(req, res, next);
});

app.listen(8000, () => {
  console.log("API rodando em http://127.0.0.1:8000");
});
