// 코드가 변경되었을때는 무조건 서버 재시작!!

const http = require("http");

const server = http
  .createServer((req, res) => {
    // 어떤 브라우저에서는(사파리인 경우에는) html인지 string인지 모르는 경우가 있다.
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write("<h1>Hello Node!</h1>");
    res.write("<p>hello server</p>");
    res.end("<p>hello kang</p>");
  })
  .listen(8080); // 포트번호를 설정

server.on("listening", () => {
  console.log("8080번 포트에서 서버 대기중입니다.");
});

// 에러처리는 필수!!!
server.on("error", (error) => {
  console.error(error);
});

// 서버 여러개 만들기
// const server1 = http
//   .createServer((req, res) => {
//     // 어떤 브라우저에서는(사파리인 경우에는) html인지 string인지 모르는 경우가 있다.
//     res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
//     res.write("<h1>Hello Node!</h1>");
//     res.write("<p>hello server</p>");
//     res.end("<p>hello kang</p>");
//   })
//   .listen(8081); // 포트번호를 설정
