var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("./../db/db");
var crypto = require("crypto");
var jwt = require('jsonwebtoken');

router.post("/",function (req, res){
	console.log("\nReceived POST request on " + req.originalUrl);

  new Promise(function (resolve, reject) {
  	resolve(req.body);
  })
	.then(function (form) {
    form.stayLoggedIn = form.stayLoggedIn ? true : false;
		if(form.username.search(/[^A-Za-z0-9._]/g) >= 0){
    	res.redirect("/login?error=invU&prevUsername=" + form.username.replace(/[^A-Za-z0-9._]/g,'') + "&stayLoggedIn=" + form.stayLoggedIn);
  	}
		else{
			return form;
		}
  })
	.then(function (form) {
		return db.query(db.models.user, {name: form.username}).then(function (queryResults) {
			if(!queryResults.length){
				res.redirect("/login?error=noUFound&prevUsername=" + form.username + "&stayLoggedIn=" + form.stayLoggedIn);
			}
			else{
        form.userId = queryResults[0].id;
        return form;
			}
		});
	})
  .then(function (form) {
		return db.query(db.models.password, {userId: form.userId}).then(function (queryResults) {
      var encryptedPassword = crypto.pbkdf2Sync(form.password, queryResults[0].salt, 2500, 256, 'sha256').toString("base64");
			if(encryptedPassword == queryResults[0].password) {
        form.password = encryptedPassword;
			  return form;
			}
      else{
        res.redirect("/login?error=invCombo&prevUsername=" + form.username + "&stayLoggedIn=" + form.stayLoggedIn);
      }
		});
	})
	.then(function (form) {
		var token = jwt.sign({
			userId: form.userId,
			password: form.password
		}, require("./../../config").secret, {
      expiresIn: 2592000
    });

    if(form.stayLoggedIn){
      res.cookie("access-token", token, {maxAge: "2592000000", httpOnly: true});
    }
    else {
      res.cookie("access-token", token, {httpOnly: true});
    }

		res.redirect("/dashboard");
	});
});

module.exports = router;
