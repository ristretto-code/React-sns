const express = require("express");
const router = express.Router();
const db = require("../models");

router.post("/", async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content,
      Userid: req.user.id
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag =>
          db.Hashtag.findOrCreate({
            // hastags 테이블에서 찾아봐서 없으면 create
            where: { name: tag.slice(1).toLowerCase() } // 앞에 # 뗀다음 전부 소문자로 저장
          })
        )
      );
      console.log(result);
      await newPost.addHashtags(result.map(r => r[0])); //시퀄라이즈가 만들어준 addHashtags
    }
    res.json(newPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
}); // 게시글 작성 api/post
router.post("/images", (req, res) => {}); // 이미지올리기

module.exports = router;
