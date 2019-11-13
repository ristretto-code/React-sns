const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local"); // passport에 대해서 node교과서 확인하자
const bcrypt = require("bcrypt");
const db = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy( // 로그인 전략설계(strategy)
      {
        usernameField: "userId", // req.body에 있는 속성이름
        passwordField: "password"
      },
      async (userId, password, done) => {
        try {
          const user = await db.User.findOne({
            where: { userId } // 1. 아이디가 존재하는지 확인
          });
          if (!user) {
            return done(null, false, { reason: "아이디가 존재하지 않습니다" }); // 존재하지않으면 돌려보내기
            //done(첫번째: 서버에러가 나면 인수로 1을 넣어줌, 두번째: 성공했을때, 세번째: 로직에서 에러라서 강제종료해야 될때)
          }
          const result = await bcrypt.compare(password, user.password); // 2. 아이디 있을때, 비동기로 비밀번호 비교 첫째인자는 프론트, 두째인자는 db 패스워드

          if (result) {
            // 비밀번호가 일치하므로 compare가 true반환
            return done(null, user); // 3. 성공했으니 두번째인수쓰기
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
