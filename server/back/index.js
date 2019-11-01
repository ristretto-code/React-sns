const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport"); // 매번 현재 로그인확인 하는것을 자동화하기 위해 passport사용

const passportConfig = require("./passport");
const db = require("./models");
const userAPIRouter = require("./routes/user");
const postAPIRouter = require("./routes/post");
const postsAPIRouter = require("./routes/posts");

dotenv.config(); // .env 실행
const app = express(); // express 서버생성

db.sequelize.sync(); // 테이블생성
passportConfig(); // 로그인

app.use(morgan("dev"));
// morgan은 요청 로그 남기는것
app.use(cors({}));
app.use(cookieParser(process.env.COOKIE_SECRET)); // 프론트에서 서버로 로그인정보를 쿠키로 보내면 쿠키파서가 분석후
app.use(
  expressSession({
    // 쿠키분석후 express.session이 id:1 발견. 그 후에 담긴 쿠키를 desialize함. deserial한 값이 req.body에 담김
    resave: false, // 꼭 넣어줘야함
    saveUninitialized: false, // 꼭 넣어줘야함
    secret: process.env.COOKIE_SECRET, // 쿠키 암호화키. 소스코드를 보호하기위해 dotenv로 .env파일 사용
    cookie: {
      httpOnly: true, // js로 쿠키접근 못하게함 해킹방지
      secure: false // https를 쓸때 true로
    }
  })
);
app.use(passport.initialize()); // express가 완료된후에 passport를 사용해야함. passport 미들웨어
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
