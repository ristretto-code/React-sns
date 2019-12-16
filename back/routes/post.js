const express = require("express");
const multer = require("multer");
const db = require("../models");
const path = require("path");
const { isLoggedIn } = require("./middleware");

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    // 서버 하드에 저장
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext); // 예제.png ext===png base === 예제
      done(null, basename + new Date().valueOf() + ext); // 파일 이름 같을수있으니 시간넣기
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 } // 보안위해서 제한해주기
});

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content,
      UserId: req.user.id
    });
    if (hashtags) {
      const result = await Promise.all(
        // promise all로 각각 모두 저장
        hashtags.map(tag =>
          db.Hashtag.findOrCreate({
            // hastags 테이 블에서 찾아봐서 없으면 create
            where: { name: tag.slice(1).toLowerCase() } // 앞에 # 뗀다음 전부 소문자로 저장
          })
        )
      );
      await newPost.addHashtags(result.map(r => r[0])); //시퀄라이즈가 만들어준 "add"Hashtags.. remove get 이런것도 있어서 join쿼리안쓰고도 add로 해결가능
    }

    if (req.body.image) {
      // 이미지 주소를 여러개 올리면 배열로 온다
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(
          req.body.image.map(image => {
            return db.Image.create({ src: image });
          })
        );
        await newPost.addImages(images);
      } else {
        const image = await db.Image.create({ src: req.body.image });
        await newPost.addImage(image);
      }
    }
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id }, // post에 담긴 userid 검색
      include: [
        {
          model: db.User
        },
        {
          model: db.Image
        }
      ]
    });
    res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
}); // 게시글 작성 api/post

router.post("/images", upload.array("image"), (req, res) => {
  res.json(req.files.map(v => v.filename));
}); // 이미지올리기, formdata에서 받은 이름을 upload.함수('여기에 넣음')

router.get("/:id/comments", async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다");
    }
    const comments = await db.Comment.findAll({
      where: {
        PostId: req.params.id
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"]
        }
      ]
    });
    return res.json(comments);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});
router.post("/:id/comment", isLoggedIn, async (req, res, next) => {
  // POST /api/post/1000/comment
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다");
    }
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content
    });
    await post.addComment(newComment.id); //시퀄라이져에서 add랑 new넣어줌
    const comment = await db.Comment.findOne({
      // include사용하기 위해 새로 find
      where: {
        id: newComment.id
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"]
        }
      ]
    });
    return res.json(comment);
  } catch (e) {
    console.error(e);
    return next(e);
  }
}); // 이미지올리기

router.post("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    } // 혹시 모르니 일단 좋아요가 클릭된 포스트가 정말 존재하는 포스트인지 확인
    await post.addLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    await post.removeLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    await db.Post.destroy({
      where: { id: req.params.id }
    });
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"]
        },
        { model: db.Image }
      ]
    });
    if (!post) {
      res.status(401).send("페이지없음");
    }
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
