const buffer = Buffer.from("버퍼 데이터");
console.log(buffer);
console.log(buffer.length);
console.log(buffer.toString());

const array = [
  Buffer.from("띄엄 "),
  Buffer.from("띄엄 "),
  Buffer.from("띄엄 "),
];
console.log(Buffer.concat(array).toString());

console.log(Buffer.alloc(5)); // 빈 버퍼 생성(5바이트)
