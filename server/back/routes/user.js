const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require("../models");
const router = express.Router();

//API는 다른 서비스가 내 서비스의 기능을 실행할수 있게 열어둔 창구
router.get("/", (req, res) => {});

router.post("/", async (req, res, next) => {
  // POST /api/user 회원가입
  try {
    const exUser = await db.User.findOne({
      where: {
        userId: req.body.userId
      }
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // salt는 10~13 사이로
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword
    });
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // 에러 처리를 여기서
    return next(e);
  }
});

router.get("/:id", (req, res) => {
  // :id를 가져오려면 req.params.id로
});
router.post("/logout", (req, res) => {}); // 록아웃

router.post("/login", (req, res, next) => {
  // POST api/user/login
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // 서버에러
      console.error(err);
      return next(err); //넥스트로 보내버리기
    }
    if (info) {
      // 로직에러
      return res.status(401).send(info.reason); // done에 있는 reason객체 보내주기
    }
    return req.login(user, loginErr => {
      //로그인 성공
      if (loginErr) {
        //혹시라도 로그인에러나면
        return next(loginErr);
      }
      const filteredUser = Object.assign({}, user); // user객체 복사해서
      delete filteredUser.password; // 비밀번호만 지우고 front로 보내주기
      return res.json(filteredUser); // 사용자정보 보내기
    });
  });
}); // 로그인

router.get("/:id/follow", (req, res) => {}); // 남의 정보 가져오는것

router.post("/:id/flollow", (req, res) => {}); // 팔로우 하기

router.delete("/:id/follow", (req, res) => {}); // 팔로우 취소

router.delete("/:id/follower", (req, res) => {}); // 팔로워 지우기

router.get("/:id/posts", (req, res) => {}); // 남의 포스트 가져오는것

module.exports = router;
