const passport = require("passport");
const db = require("../models");
const local = require("./local");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 서버쪽에 [{id:3, cookie:'as3fd'}] 해서 쿠키는 프론트로 보냄. 저 배열만 서버에 저장. 가벼운 객체로 바꿔서 서버쪽 메모리최소화
    return done(null, user.id); // 프론트에서 cookie를 보내면 서버에선 cookie속 값을 쓸수없기때문에 밑에서 deserialize해서 쓴다.
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        where: { id }
      });
      return done(null, user); // deserial해서 req.user에 저장된다.
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });
  local();
};
