module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    "Hashtag", // 테이블명주고
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false
      }
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci"
    }
  );

  Hashtag.associate = db => {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
  };

  return Hashtag;
};