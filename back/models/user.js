module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // 테이블명은 users
      nickname: {
        type: DataTypes.STRING(20), // 20글자 이하
        allowNull: false // 필수
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true // 고유한 값
      },
      password: {
        type: DataTypes.STRING(100), // 100글자 이하
        allowNull: false
      },
      profileColor: {
        type: DataTypes.STRING(10),
        allowNull: false
      }
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci" // 한글이 저장돼요
    }
  );

  User.associate = db => {
    // 테이블관계정의
    db.User.hasMany(db.Post, { as: "Posts" });
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    db.User.belongsToMany(db.User, {
      // 서로 belongs일 경우 userid가 두개 생기므로 foreignkey를 주기
      through: "Follow", // 두 db사이를 연결하는 테이블
      as: "Followers", // 자바스크립트 객체에서 구별하는 이름
      foreignKey: "followingId" // 실제 db에서 구별하는 id. 남의 테이블 id를 가리키기때문에 바꿔서 써준다
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings", // 자바스크립트 객체에서 사용할 이름
      foreignKey: "followerId" // db컬럼명에서 사용할 이름. 다대다관계에서만 필요
    });
  };

  return User;
};
