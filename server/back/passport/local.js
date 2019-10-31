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
            where: { userId }
          });
          if (!user) {
            return done(null, false, { reason: "아이디가 존재하지 않습니다" });
          }
        } catch (e) {
          console.error(e);
          return done(e);
        }
      }
    )
  );
};
