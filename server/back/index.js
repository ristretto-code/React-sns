const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const db = require("./models");
const userAPIRouter = require("./routes/user");
const postAPIRouter = require("./routes/post");
const postsAPIRouter = require("./routes/posts");

const app = express(); // express 서버생성

db.sequelize.sync(); // 테이블생성

app.use(morgan("dev"));
// morgan은 요청 로그 남기는것
app.use(express.json());
//app.use는 req와 res사이에 미들웨어를 넣어주는것
app.use(express.urlencoded({ extended: true }));
//urlencoded는 req.body에 넣어주는 용도
app.use(cors());

app.use("/api/user", userAPIRouter);
// router 미들웨어를 use사용해서 붙임. 앞에 주소는 어떨때 미들웨어를 써줄지 적어논것 기본값은 '/'이다.
app.use("/api/post", postAPIRouter);
app.use("/api/posts", postsAPIRouter);

app.listen(8080, () => {
  console.log("server is running on http://localhost:8080 :)");
});
