const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");

const { sequelize } = require("./models");

dotenv.config();
const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");

const passportConfig = require("./passport");

const app = express();
passportConfig();
app.set("port", process.env.PORT || 8002);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

sequelize
  .sync({ force: true }) // 개발 환경에서만 사용, 실제 서비스에서는 사용하면 안됨, 테이블 재생성
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
// 항상 세션 미들웨어 아래에 있어야 함
app.use(passport.initialize()); // req.user, req.login, req.logout, req.isAuthenticated 등을 사용할 수 있게 함
app.use(passport.session()); // connect.sid 라는 이름으로 세션 쿠키가 브라우저로 전송

app.use("/auth", authRouter);
app.use("/", indexRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
