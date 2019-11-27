const express = require("express");
const next = require("next");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");

// 커스텀서버를 위해 node환경과 똑같이 불러와준다. env도 마찬가지

const dev = process.env.NODE_ENV !== "production";
const prod = process.env.NODE_ENV === "production";
const app = next({ dev }); // express로 next 돌리기,  option에 dev모드넣어줬다
const handle = app.getRequestHandler(); // 요청처리기

dotenv.config();

app.prepare().then(() => {
  // 준비되면
  const server = express();

  server.use(morgan("dev"));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser(process.env.COOKIE_SECRET));
  server.use(
    expressSession({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
        secure: false
      }
    })
  );

  server.get("/hashtag/:tag", (req, res) => {
    return app.render(req, res, "/hashtag", { tag: req.params.tag });
  });

  server.get("/user/:id", (req, res) => {
    return app.render(req, res, "/user", { id: req.params.id });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });
  server.listen(3000, () => {
    console.log("next+express running on 3000");
  });
});