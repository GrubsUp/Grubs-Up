var express = require("express");
var router = express.Router();
var path = require("path");

router.all("/:file",function (req, res){
	console.log("\nReceived GET request on " + req.originalUrl);

	res.sendFile(path.join(__dirname + "/../views/includes/" + req.params.file + ".html"));
});

module.exports = router;
