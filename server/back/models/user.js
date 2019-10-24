module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User", // 테이블명이 자동으로 users가 됨. Post면 posts이렇게
    {
      nickname: {
        type: DataTypes.STRING(20), // 20글자 이하
        allowNull: false // 필수
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true // 고유값
      },
      password: {
        type: DataTypes.STRING(100), // 100글자 이하
        allowNull: false
      }
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci" // 한글이 저장됨
    }
  );

  User.associate = db => {
    db.User.hasMany(db.Post, { as: "Posts" }); // 밑에 Post와 구분이 안되므로 as로 이름붙여주기
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); // 다대다 관계
    db.User.belongsToMany(db.User, { through: "Follow", as: "Followers" }); // as로 구분해주기
    db.User.belongsToMany(db.User, { through: "Follow", as: "Following" });
  };
  return User;
};
