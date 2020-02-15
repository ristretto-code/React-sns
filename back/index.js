const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");
const hpp = require("hpp");
const helmet = require("helmet");
const passport = require("passport"); // 매번 현재 로그인확인 하는것을 자동화하기 위해 passport사용
const passportConfig = require("./passport");
const db = require("./models");
const userAPIRouter = require("./routes/user");
const postAPIRouter = require("./routes/post");
const postsAPIRouter = require("./routes/posts");
const hashtagAPIRouter = require("./routes/hashtag");
const prod = process.env.NODE_ENV === "production";

dotenv.config(); // .env 실행
const app = express(); // express 서버생성

db.sequelize.sync(); // 테이블생성
passportConfig(); // 로그인

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan("combined"));
  app.use(cors({ origin: /reactsns\.net$/, credentials: true }));
  // app.options("/", cors({ origin: /reactsns\.net$/, credentials: true }));
} else {
  app.use(morgan("dev"));
  // morgan은 요청 로그남겨준다
  app.use(
    cors({
      origin: true, // localhost:3000 써도됨. 쿠키교환하기 위해 "요청과 같게"
      credentials: true //쿠키교환
    })
  );
}

app.use("/", express.static("uploads")); // '/'는 프론트에서 접근하는 주소, uploads는 서버에서 접근하는 이미지주소
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // 프론트에서 서버로 로그인정보를 쿠키로 보내면 쿠키파서가 분석후
app.use(
  expressSession({
    // 쿠키분석후 express.session이 id:1 발견. 그 후에 담긴 쿠키를 desialize함. deserial한 값이 req.body에 담김
    resave: false, // 꼭 넣어줘야함
    saveUninitialized: false, // 꼭 넣어줘야함
    secret: process.env.COOKIE_SECRET, // 쿠키 암호화키. 소스코드를 보호하기위해 dotenv로 .env파일 사용
    cookie: {
      httpOnly: true, // js로 쿠키접근 못하게함 해킹방지
      secure: prod, // https를 쓸때 true로
      domain: prod && ".reactsns.net"
    },
    name: "myfriend"
  })
);
//app.use는 req와 res사이에 미들웨어를 넣어주는것
//urlencoded는 req.body에 넣어주는 용도

app.use(passport.initialize()); // express가 완료된후에 passport를 사용해야함. passport 미들웨어
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("server is running ▣");
});
app.use("/api/user", userAPIRouter);
// router 미들웨어를 use사용해서 붙임. 앞에 주소는 어떨때 미들웨어를 써줄지 적어논것 기본값은 '/'이다.
app.use("/api/post", postAPIRouter);
app.use("/api/posts", postsAPIRouter);
app.use("/api/hashtag", hashtagAPIRouter);

app.listen(
  process.env.NODE_ENV === "production" ? process.env.PORT : 8080,
  () => {
    console.log(`server is running on ${process.env.PORT} ▶◁▶◁`);
  }
);
