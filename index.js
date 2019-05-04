// Every child in the cluster will have 1 thread.
process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require("cluster");
const os = require("os");
const works = [];
if (cluster.isMaster) {
	os.cpus().forEach((value, index) => {
		console.log("Forking:", index);
		const worker = cluster.fork();
		works.push(worker);
	});
} else {
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
}
