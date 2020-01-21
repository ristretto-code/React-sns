const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require("../models");
const router = express.Router();
const { isLoggedIn } = require("./middleware");

//API는 다른 서비스가 내 서비스의 기능을 실행할수 있게 열어둔 창구
router.get("/", isLoggedIn, async (req, res, next) => {
  // 쿠키 로그인정보 불러오기
  try {
    const user = Object.assign({}, req.user.toJSON());
    delete user.password;
    return res.json(user);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post("/", async (req, res, next) => {
  // POST /api/user 회원가입
  try {
    const profileColor = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    const exUser = await db.User.findOne({
      where: { userId: req.body.userId }
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    if (req.body.userId.length < 1 || req.body.userId.length >= 20) {
      return res.status(403).send("1-20 글자 사이의 아이디를 사용하세요");
    }
    if (req.body.nickname.length < 1 || req.body.nickname.length >= 20) {
      return res.status(403).send("1-20 글자 사이의 닉네임을 사용하세요");
    }
    if (req.body.password.length < 1) {
      return res.status(403).send("1자 이상의 패스워드를 사용하세요");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // salt는 10~13 사이로
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
      profileColor: profileColor
    });
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // 에러 처리를 여기서
    return next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    // 남의 정보 가져오기
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
      include: [
        {
          model: db.Post,
          as: "Posts",
          attributes: ["id"]
        },
        {
          model: db.User,
          as: "Followings",
          attributes: ["id"]
        },
        {
          model: db.User,
          as: "Followers",
          attributes: ["id"]
        }
      ],
      attributes: ["id", "nickname", "profileColor"]
    });
    const jsonUser = user.toJSON();
    jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0; // 개인정보보호위함
    jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
    jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
    res.json(jsonUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("logout 성공");
}); // 로그아웃

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err); //넥스트로 보내버리기
    }
    if (info) {
      return res.status(401).send(info.reason); // done에 있는 reason객체 보내주기
    }
    return req.login(user, async loginErr => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const fullUser = await db.User.findOne({
          where: { id: user.id },
          include: [
            {
              model: db.Post,
              as: "Posts",
              attributes: ["id"]
            },
            {
              model: db.User,
              as: "Followings",
              attributes: ["id"]
            },
            {
              model: db.User,
              as: "Followers",
              attributes: ["id"]
            }
          ],
          attributes: ["id", "nickname", "userId", "profileColor"]
        });
        return res.json(fullUser);
      } catch (e) {
        next(e);
        console.error(e);
      }
    });
  })(req, res, next);
}); // 로그인

router.get("/:id/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0
        //프론트에서 me가 null이면 서버로 0을 보내고 서버에서 받은 req.params.id가 0이면 req.user(로그인한 내 아이디)로 판단한다
      }
    });
    const followers = await user.getFollowings({
      attributes: ["id", "nickname", "profileColor"],
      limit: parseInt(req.query.limit, 10),
      offset: parseInt(req.query.offset, 10)
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e);
  }
}); // 내 팔로잉 정보 가져오기

router.get("/:id/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0
      }
    });
    const followers = await user.getFollowers({
      attributes: ["id", "nickname", "profileColor"],
      limit: parseInt(req.query.limit, 10),
      offset: parseInt(req.query.offset, 10)
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e);
  }
}); // 내 팔로워 정보 가져오기

router.delete("/:id/follower", isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id }
    });
    await me.removeFollower(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id }
    }); // req.user 와 같은데 req.user 시퀄객체 아니고 일반객체 일때가 있어서 다시조회해서 가져오기
    await me.addFollowing(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
}); // 팔로우 하기

router.delete("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id }
    });
    await me.removeFollowing(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
}); // 팔로우 취소

router.get("/:id/posts", async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      where: {
        UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname", "profileColor"]
        },
        {
          model: db.Image
        },
        {
          model: db.User,
          through: "Like",
          as: "Likers",
          attributes: ["id"]
        }
      ],
      order: [["createdAt", "DESC"]] // DESC는 내림차순, ASC는 오름차순
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
}); // 남의 포스트 가져오는것

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await db.User.update(
      {
        nickname: req.body.nickname
      },
      {
        where: { id: req.user.id }
      }
    );
    res.send(req.body.nickname);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
