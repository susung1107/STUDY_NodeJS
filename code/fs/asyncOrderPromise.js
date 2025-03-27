// 이거 오류납니데이

const fs = require("fs");

async function main() {
  let data = await fs.readFile("./readMe.txt");
  console.log("1번", data.toString());

  data = await fs.readFile("./readMe.txt");
  console.log("2번", data.toString());

  data = await fs.readFile("./readMe.txt");
  console.log("3번", data.toString());

  data = await fs.readFile("./readMe.txt");
  console.log("4번", data.toString());
}

main();
