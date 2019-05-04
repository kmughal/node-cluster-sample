const express = require("express");

const app = express();

app.get("*", (req, res) => {
  doWork(5000)
	res.status(200).send("hello");
});

function doWork(duration) {
	const start = Date.now();
	while (Date.now() - start < duration) {}
}

app.listen(8000, () => console.log("connected"));
