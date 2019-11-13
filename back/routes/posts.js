const express = require("express");
const db = require("../models");
const router = express.Router();

router.get("/", async (req, res, next) => {
  //api/posts 게시글 가져오기
  try {
    const posts = await db.Post.findAll({
      include: [
        {
          model: db.User, //작성자 같이 가져오기
          attributes: ["id", "nickname"]
        }
      ],
      order: [["createdAt", "DESC"]] // DESC는 내림차순, ASC는 오름차순
    });
    res.json(posts);
  } catch (e) {
    console.log(e);
    next(e);
  }
}); // 게시글들 가져오기

module.exports = router;
