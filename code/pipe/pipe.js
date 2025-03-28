const fs = require("fs");
const zlib = require("zlib");

const readStream = fs.createReadStream("./readMe.txt", { highWaterMark: 16 });
const zlibStream = zlib.createGzip();
const writeStream = fs.createWriteStream("./writeMeGzip.txt.gz");
// readStream.pipe(writeStream); // 16바이트씩 읽은걸 writeMe.txt에 16바이트씩 쓴다.
readStream.pipe(zlibStream).pipe(writeStream);
