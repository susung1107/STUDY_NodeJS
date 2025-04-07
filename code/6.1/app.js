const dotenv = require("dotenv");
dotenv.config();

const express = require("express"); // http를 사용하고 있는거와 동일하다
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const multer = require("multer");

const app = express();

// 서버에 속성을 지정함: port 번호를 지정함.
app.set("port", process.env.PORT || 3000);

// 미들웨어 설정
app.use(morgan("dev"));
app.use("/", express.static(__dirname, "public"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json()); // json data를 파싱해서 req.body에 넣어줌
app.use(express.urlencoded({ extended: true })); // true면 qs, false면 querystring 모듈 사용
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
    },
  })
);
app.use(multer().array());

// 모든 요청에 실행되는 미들웨어
app.use((req, res, next) => {
  req.body; // json 파싱
  req.session; // 세션 정보, 개인마다 세션 정보가 있음(개인 마다 고유한 저장소임)
  // req.session.id = 'hello'; 방금 요청을 보낸 사람의 세션 정보를 저장할 수 있다.
  console.log("모든 요청에 실행됩니다.");
  next();
});

// html 서빙이라고 표현함
app.get("/", (req, res) => {
  // index.html 파일을 보내거나 JSON 응답 중 하나만 선택
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", (req, res) => {
  res.send("Hello Express");
});

app.get("/category/javascript", (req, res) => {
  res.send("자바스크립트 카테고리 페이지");
});

// 와일드카드 라우터라고 표현
app.get("/category/:name", (req, res) => {
  res.send("카테고리 페이지");
});

app.get("/about", (req, res) => {
  res.send("Hello Express");
});

// 와일드 카드나 범위가 넓은(*) 같은 라우터들은 마지막에 넣어주는게좋다.
// 이유는 자바스크립트 실행순서를 이해하면 된다.

// 404 처리 미들웨어
// 에러보다는 위, 라우터보다는 아래에 넣어줘야한다. 요청을 못찾기 때뭉네
app.use((req, res, next) => {
  res.status(404).send("404지롱");
});

// 에러 미들웨어, 반드시 4개의 매개변수를 넣어줘야한다.
// 매개변수 갯수가 다르면 완전 다른 함수가 된다.
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.send("비상사태,에러 발생");
// });

app.listen(app.get("port"), () => {
  console.log("Express Server is running!!!");
});
