module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      content: {
        type: DataTypes.TEXT, // 매우긴글
        allowNull: false
      }
    },
    {
      charset: "utf8mb4", // 한글+이모티콘(mb4)
      collate: "utf8mb4_general_ci"
    }
  );

  Post.associate = db => {
    db.Post.belongsTo(db.User); // belongsTo는 userid 같은 컬럼을 만든다
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // 같은 테이블끼리 관계를 맺으면 Retweetid 컬럼이 생긴다.
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // 다대다 관계
  };

  return Post;
};
