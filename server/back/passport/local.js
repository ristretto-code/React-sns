const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const db = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "userId",
        passwordField: "password"
      },
      async (userId, password, done) => {
        try {
          const user = await db.User.findOne({
            where: { userId } // 아이디가 존재하는지 확인
          });
          if (!user) {
            return done(null, false, { reason: "아이디가 존재하지 않습니다" });
            //done(첫번째: 서버에러가 나면 인수로 1을 넣어줌, 두번째: 성공했을때, 세번째: 로직에서 에러라서 강제종료해야 될때)
          }
          const result = await bcrypt.compare(password, user.password); // 비밀번호 비교
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 일치하지 않습니다" });
        } catch (e) {
          console.error(e);
          return done(e);
        }
      }
    )
  );
};
