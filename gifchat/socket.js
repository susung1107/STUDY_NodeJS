const SocketIO = require("socket.io");

// app.js에서 서버를 생성해서 전달해준다.
module.exports = (server, app) => {
  // 실제로 웹소켓 서버와 express 서버를 연결해준다.
  const io = SocketIO(server);
  app.set("io", io); // 서버에 접속한 클라이언트를 저장해두는 공간

  // 네임스페이스 생성
  const room = io.of("/room");
  const chat = io.of("/chat");

  // 네임스페이스 접속 시 실행되는 이벤트
  room.on("connection", (socket) => {
    console.log("room 네임스페이스 접속");
    socket.on("disconnect", () => {
      console.log("room 네임스페이스 접속 해제");
    });
  });

  chat.on("connection", (socket) => {
    console.log("chat 네임스페이스 접속");
    socket.on("disconnect", () => {
      console.log("chat 네임스페이스 접속 해제");
    });
  });
};
