const passport = require("passport");
const db = require("../models");
const local = require("./local");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // authenticate에서 성공한 req.login에서 id값만 빼서 쿠키로 만든다.

    // 사용자정보가 너무 많이때문에 sql에 자동으로 들어가는 id값과 나머지는 serial화해서 cookie에 넣는다.
    // 서버쪽에 [{id:3, cookie:'as3fd'}] 만들어서 쿠키는 프론트로 보냄. 저 배열만 서버에 저장. 가벼운 객체로 바꿔서 서버쪽 메모리최소화
    return done(null, user.id); // 프론트에서 cookie를 보내면 서버에선 cookie속 값을 쓸수없기때문에 밑에서 deserialize해서 쓴다.
  });
  passport.deserializeUser(async (id, done) => {
    // serial에서 만든 쿠기가 프론트에 갔다가 다시 백으로 오면 deserial해준다
    // 프론트에서 요청이 올때마다 deserial하는데, 아래로직은 db요청을 계속하므로 실무에선 db요청이 비싸기떄문에 캐싱
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
  local(); // 만들어둔 로그인 전략
};
