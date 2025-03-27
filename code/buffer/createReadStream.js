const { error } = require("console");
const fs = require("fs");

// highWaterMark: 버퍼의 크기를 설정
const readStream = fs.createReadStream("./readMe.txt", { highWaterMark: 16 });

const data = [];
readStream.on("data", (chunk) => {
  data.push(chunk);
  console.log("data: ", chunk, chunk.length);
});

readStream.on("end", () => {
  console.log("end: ", Buffer.concat(data).toString());
});

readStream.on("error", (error) => {
  console.log("error: ", error);
});
