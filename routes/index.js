var express = require("express");
var router = express.Router();

router.all("/",function (req, res){
	console.log("\nReceived GET request on " + req.originalUrl);

	res.render("layout", {});
});

module.exports = router;
