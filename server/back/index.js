const express = require("express");
const db = require("./models");
const app = express(); // express 서버생성

db.sequelize.sync(); // 테이블생성

app.get("/", (req, res) => {
  res.send("Hello, server");
});

app.get("/about", (req, res) => {
  res.send("Hello, about");
});

app.listen(8080, () => {
  console.log("server is running on http://localhost:8080 :)");
});
