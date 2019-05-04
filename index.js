const express = require("express");
const crypto = require("crypto");
const app = express();
app.get("*", (req, res) => {
  //doWork(5000);
  const start = Date.now();
  crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    const msg = "1:" + (Date.now() - start);
    console.log("Send " , msg);
    res.status(200).send(msg);
  });
});

function doWork(duration) {
  const start = Date.now();
  while (Date.now() - start < duration) {}
}

app.listen(8000, () => console.log("connected"));