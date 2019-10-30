const express = require("express");
const bcrypt = require("bcrypt");
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

router.post("/login", (req, res) => {}); // 로그인

router.get("/:id/follow", (req, res) => {}); // 남의 정보 가져오는것

router.post("/:id/flollow", (req, res) => {}); // 팔로우 하기

router.delete("/:id/follow", (req, res) => {}); // 팔로우 취소

router.delete("/:id/follower", (req, res) => {}); // 팔로워 지우기

router.get("/:id/posts", (req, res) => {}); // 남의 포스트 가져오는것

module.exports = router;
