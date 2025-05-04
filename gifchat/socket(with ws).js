const WebSocket = require("ws");

// app.js에서 서버를 생성해서 전달해준다.
module.exports = (server) => {
  // 실제로 웹소켓 서버와 express 서버를 연결해준다.
  const wss = new WebSocket.Server({ server });

  // 첫 웹소켓 연결 시 시작되는 부분
  wss.on("connection", (ws, req) => {
    // 클라이언트의 ip 주소를 알아내는 방법
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("새로운 클라이언트 접속 : ", ip);

    // 클라이언트 측에서 메시지를 보내면 이 이벤트가 발생한다.
    ws.on("message", (message) => {
      // message는 buffer 형식으로 들어오기 때문에 문자열로 변환해야 우리가 읽을 수 있다.
      console.log(message.toString());
    });

    // 웹소켓 오류 발생 시 이 이벤트가 발생한다.
    ws.on("error", console.error);

    // 클라이언트 접속 해제 시 이 이벤트가 발생한다.
    ws.on("close", () => {
      console.log("클라이언트 접속 해제 :", ip);
      clearInterval(ws.interval);
    });

    // 3초마다 클라이언트에게 메시지를 보내기
    ws.interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send("서버에서 클라이언트로 메시지를 전송함");
      }
    }, 3000);
  });
};
