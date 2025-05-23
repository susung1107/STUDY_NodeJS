const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const User = require("../models/user");
const bcrypt = require("bcrypt");
module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
        passReqToCallback: false,
      },
      async (email, password, done) => {
        // done(서버시래, 성공유저, 로직실패) , done이 호출되면 controller/auth.js로 이동
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );
};
