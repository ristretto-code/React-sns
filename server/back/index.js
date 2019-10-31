const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");

const db = require("./models");
const userAPIRouter = require("./routes/user");
const postAPIRouter = require("./routes/post");
const postsAPIRouter = require("./routes/posts");

dotenv.config();
const app = express(); // express 서버생성

db.sequelize.sync(); // 테이블생성

app.use(morgan("dev"));
// morgan은 요청 로그 남기는것
app.use(cors({}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secrt: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false // https를 쓸때 true로
    }
  })
);
app.use(passport.initialize()); // express가 완료된후에 passport를 사용해야함
app.use(passport.session());

app.use(express.json());
//app.use는 req와 res사이에 미들웨어를 넣어주는것
app.use(express.urlencoded({ extended: true }));
//urlencoded는 req.body에 넣어주는 용도

app.use("/api/user", userAPIRouter);
// router 미들웨어를 use사용해서 붙임. 앞에 주소는 어떨때 미들웨어를 써줄지 적어논것 기본값은 '/'이다.
app.use("/api/post", postAPIRouter);
app.use("/api/posts", postsAPIRouter);

app.listen(8080, () => {
  console.log("server is running on http://localhost:8080 ▶◁▶◁▶");
});
