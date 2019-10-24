const express = require("express");
const db = require("./models");
const app = express(); // express 서버생성

db.sequelize.sync(); // 테이블생성

//API는 다른 서비스가 내 서비스의 기능을 실행할수 있게 열어둔 창구
app.get("/api/user", (req, res) => {});
app.post("/api/user", (req, res) => {});

app.get("/api/user/:id", (req, res) => {
  // :id를 가져오려면 req.params.id로
});

app.post("/api/user/logout", (req, res) => {});
app.post("/api/user/login", (req, res) => {});
app.get("/api/user/:id/follow", (req, res) => {});
app.post("/api/user/:id/flollow", (req, res) => {});
app.delete("/api/user/:id/follow", (req, res) => {});
app.delete("/api/user/:id/follower", (req, res) => {});
app.get("api/user/:id/posts", (req, res) => {});

app.get("api/post", (req, res) => {});
app.post("api/post", (req, res) => {});
app.post("/api/post", (req, res) => {});

app.listen(8080, () => {
  console.log("server is running on http://localhost:8080 :)");
});
