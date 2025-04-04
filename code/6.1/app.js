const express = require("express"); // http를 사용하고 있는거와 동일하다
const path = require("path");

const app = express();

// 서버에 속성을 지정함: port 번호를 지정함.
app.set("port", process.env.PORT || 3000);

// 모든 요청에 실행되는 미들웨어
app.use((req, res, next) => {
  console.log("모든 요청에 실행됩니다.");
  next();
});

// html 서빙이라고 표현함
app.get("/", (req, res) => {
  // 한 라우터에서 send 두번은 하면 안됨
  res.sendFile(path.join(__dirname, "index.html"));
  res.setHeader("Content-Type: text/html");
  res.status(200).send("안녕하세요");
});

app.get("/", (req, res) => {
  //res.send("Hello Express");
  // json 형식으로 보내기

  // 원래방식
  // res.writeHead(200, { "Content-Type": "application/json" });
  // res.end(
  //   JSON.stringify({
  //     name: "홍길동",
  //     age: 20,
  //   })
  // );

  // express 방식
  res.json({
    name: "홍길동",
    age: 20,
  });
});

app.post("/", (req, res) => {
  res.send("Hello Express");
});

app.get("/category/javascript", (req, res) => {
  //
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
app.use((err, req, res, next) => {
  console.error(err);
  res.send("비상사태,에러 발생");
});

app.listen(app.get("port"), () => {
  console.log("Express Server is running!!!");
});
