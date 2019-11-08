const express = require("express");
const router = express.Router();
const db = require("../models");

router.post("/", async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    console.log("-------hashtags-------");
    console.log(hashtags);
    console.log("-------hashtags-------");
    const newPost = await db.Post.create({
      content: req.body.content,
      Userid: req.user.id
    });
    console.log("-------newPost-------");
    console.log(newPost);
    console.log("-------newPost-------");
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
      console.log("-------result-------");
      console.log(result);
      console.log("-------result-------");
      await newPost.addHashtags(result.map(r => r[0])); //시퀄라이즈가 만들어준 "add"Hashtags.. remove get 이런것도 있어서 join쿼리안쓰고도 add로 해결가능
    }
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id }, // post에 담긴 userid 검색
      include: [
        {
          model: db.User
        }
      ]
    });
    res.json(newPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
}); // 게시글 작성 api/post
router.post("/images", (req, res) => {}); // 이미지올리기

module.exports = router;
