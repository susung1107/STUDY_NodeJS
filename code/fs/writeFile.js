const fs = require("fs").promises;

fs.writeFile("./writeMe.txt", "글자를 써보자")
  .then(() => {
    return fs.readFile("./writeMe.txt");
  })
  .then((data) => {
    console.log(data.toString());
  })
  .catch((err) => {
    throw err;
  });
