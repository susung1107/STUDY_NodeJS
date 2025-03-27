// const fs = require("fs");
const fs = require("fs").promises; // 프로미스 적용하고 싶으면 이렇게 하면 됌

// fs.readFile("./readMe.txt", (err, data) => {
//   if (err) {
//     throw err;
//   }
//   console.log(data); // 이진법을 16진법으로 보여줌
//   console.log(data.toString()); // 문자열로 변환
// });

fs.readFile("./readMe.txt")
  .then((data) => {
    console.log(data);
    console.log(data.toString());
  })
  .catch((err) => {
    throw err;
  });
