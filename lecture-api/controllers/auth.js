const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcrypt");

exports.join = async (req, res, next) => {
  const { nick, email, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }

    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// POST /auth/login
exports.login = (req, res, next) => {
  // strategy에서 작성된 done이 호출되면 여기서 실행됨, 각 파라미터는 done에서 전달받은 파라미터
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      // 서버 실패
      console.error(authError);
      next(authError);
    }
    if (!user) {
      // 로직 실패
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      // 로그인 성공
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 확장 패턴
};

exports.logout = (req, res, next) => {
  req.logout(() => {
    res.redirect("/");
  });
};
