const SocketIO = require("socket.io");

// app.js에서 서버를 생성해서 전달해준다.
module.exports = (server) => {
  // 실제로 웹소켓 서버와 express 서버를 연결해준다.
  const io = SocketIO(server, { path: "/socket.io" });

  // 첫 웹소켓 연결 시 시작되는 부분
  io.on("connection", (socket) => {
    const req = socket.request;

    // 클라이언트의 ip 주소를 알아내는 방법
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("새로운 클라이언트 접속 : ", ip, socket.id);

    // ws close와 대응됨
    socket.on("disconnect", () => {
      console.log("클라이언트 접속 해제 :", ip, socket.id);
      clearInterval(socket.interval);
    });

    socket.on("reply", (data) => {
      console.log(data);
    });

    // error
    socket.on("error", console.error);

    // 3초 마다 클라이언트에게 메시지 보내기
    socket.interval = setInterval(() => {
      // emit('키', '데이터')
      socket.emit("news", "Hello Socket.IO");
    }, 3000);
  });
};
