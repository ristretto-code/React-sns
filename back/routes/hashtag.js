const express = require("express");
const db = require("../models");

const router = express.Router();

router.get("/:tag", async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      include: [
        {
          model: db.Hashtag,
          where: { name: decodeURIComponent(req.params.tag) }
        },
        {
          model: db.User,
          attributes: ["id", "nickname"]
        },
        {
          model: db.Image
        },
        {
          model: db.User,
          through: "Like",
          as: "Likers",
          attributes: ["id"]
        },
        {
          model: db.Post,
          as: "Retweet",
          include: [
            {
              model: db.User,
              attributes: ["id", "nickname"]
            },
            {
              model: db.Image
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]] // DESC는 내림차순, ASC는 오름차순
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
