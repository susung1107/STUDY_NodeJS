const fs = require("fs");

let data = fs.readFileSync("./readMe.txt");
console.log("1번", data.toString());

data = fs.readFileSync("./readMe.txt");
console.log("2번", data.toString());

data = fs.readFileSync("./readMe.txt");
console.log("3번", data.toString());

data = fs.readFileSync("./readMe.txt");
console.log("4번", data.toString());
