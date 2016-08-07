// Require modules
var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("./../db/db");
var crypto = require("crypto");
var jwt = require('jsonwebtoken');
var config = require("./../../config");
var Promise = require("bluebird");

// When POST req Received
router.post("/",function (req, res){
	console.log("\nReceived POST request on " + req.originalUrl);

	// new promise to start promise chain
  new Promise(function (resolve, reject) {
  	resolve(req.body);
  })
	.then(function (form) {
		// sets stayLoggedIn to boolean
    form.stayLoggedIn = form.stayLoggedIn ? true : false;
		// checks if username has invalid chars
		if(form.username.search(/[^A-Za-z0-9._]/g) >= 0){
    	res.redirect("/login?error=invU&prevUsername=" + form.username.replace(/[^A-Za-z0-9._]/g,'') + "&stayLoggedIn=" + form.stayLoggedIn);
  	}
		else{
			return form;
		}
  })
	.then(function (form) {
		// queries db to see if user exists
		return db.query(db.models.user, {name: form.username}).then(function (queryResults) {
			if(!queryResults.length){
				res.redirect("/login?error=noUFound&prevUsername=" + form.username + "&stayLoggedIn=" + form.stayLoggedIn);
			}
			else{
				// gives form var extra field containing user id
        form.userId = queryResults[0]._id;
        return form;
			}
		});
	})
  .then(function (form) {
		// queries db for password models with that user id
		return db.query(db.models.password, {userId: form.userId}).then(function (queryResults) {
			// encrypts password typed by user
      var encryptedPassword = crypto.pbkdf2Sync(form.password, queryResults[0].salt, 2500, 256, 'sha256').toString("base64");
			// compares stored password vs other
			if(encryptedPassword == queryResults[0].password) {
				// gives form var extra field containing the encrypted Password
        form.encryptedPassword = encryptedPassword;
			  return form;
			}
      else{
        res.redirect("/login?error=invCombo&prevUsername=" + form.username + "&stayLoggedIn=" + form.stayLoggedIn);
      }
		});
	})
	.then(function (form) {
		// creates a jwt token
		var token = jwt.sign({
			userId: form.userId,
			password: form.encryptedPassword
		}, config.secret, {
      expiresIn: 2592000
    });
		// checks user wants to stay logged in
    if(form.stayLoggedIn){
			// creates cookie - expires after 30 days
      res.cookie("access-token", token, {maxAge: "2592000000", httpOnly: true});
    }
    else {
			// creates cookie - expires after session
      res.cookie("access-token", token, {httpOnly: true});
    }
		// sends user to /overview
		console.log(form.redirectTo);
		res.redirect(form.redirectTo ? form.redirectTo : "/overview");
	});
});

module.exports = router;
