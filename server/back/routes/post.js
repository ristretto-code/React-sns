const express = require("express");
const router = express.Router();
const db = require("../models");

router.post("/", async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag =>
          db.Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() }
          })
        )
      );
      console.log(result);
      await newPost.addHashtags(result.map(r => r[0]));
    }
    res.json(newPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
}); // 게시글 작성 api/post
router.post("/images", (req, res) => {}); // 이미지올리기

module.exports = router;
