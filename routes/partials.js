var express = require("express");
var router = express.Router();

router.all("/:file",function (req, res){
	console.log("\nReceived GET request on " + req.originalUrl);

	res.render("partials/" + req.params.file, {});
});

module.exports = router;
