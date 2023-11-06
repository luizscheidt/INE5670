const httpProxy = require("express-http-proxy");
const express = require("express");
const app = express();
var logger = require("morgan");

app.use(logger("dev"));

function selectProxyHost(req) {
  if (req.path.startsWith("/cadastro")) {
    return "http://127.0.0.1:8080/";
  } else if (req.path.startsWith("/log")) {
    return "http://127.0.0.1:8081/";
  }
}

app.use((req, res, next) => {
  let proxyHost = selectProxyHost(req);
  if (!proxyHost) {
    res.status(404).send("Not found!");
  } else {
    httpProxy(proxyHost)(req, res, next);
  }
});

app.listen(8000, () => {
  console.log("API rodando em http://127.0.0.1:8000");
});
