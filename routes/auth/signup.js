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
		if(form.username.search(/[^A-Za-z0-9._]/g) >= 0){
    	res.redirect("/signup?error=invU&prevUsername=" + form.username.replace(/[^A-Za-z0-9._]/g,'') + "&prevEmail=" + form.email);
  	}
		else{
			return form;
		}
  })
	.then(function (form) {
		if(
			form.email.indexOf("@") < 1 ||
			form.email.lastIndexOf(".") < form.email.indexOf("@") + 2 ||
			form.email.lastIndexOf(".") + 2 >= form.email.length
		){
		 	res.redirect("/signup?error=invE&prevUsername=" + form.username + "&prevEmail=" + form.email);
		}
		else{
			return form;
		}
	})
	.then(function (form) {
		if(form.password != form.confirm){
		 	res.redirect("/signup?error=invP&prevUsername=" + form.username + "&prevEmail=" + form.email);
		}
		else{
			return form;
		}
	})
	.then(function (form) {
		return db.query(db.models.user, {name: form.username}).then(function (queryResults) {
			if(queryResults.length > 0){
				res.redirect("/signup?error=takenU&prevUsername=" + form.username + "&prevEmail=" + form.email);
			}
			else{
				return form;
			}
		});
	})
	.then(function (form) {
		return db.query(db.models.user, {email: form.email}).then(function (queryResults) {
			if(queryResults.length > 0){
				res.redirect("/signup?error=takenE&prevUsername=" + form.username + "&prevEmail=" + form.email);
			}
			else{
				return form;
			}
		});
	})
	.then(function (form) {
		db.save(db.models.user, {
			name: form.username,
			email: form.email,
			recipes: [],
			shoppingList: []
		}).then(function (saveResults){
			var salt = crypto.randomBytes(64).toString("base64");
			return db.save(db.models.password, {
				userId: saveResults._id,
				salt: salt
			}).then(function (saveResults) {
				return saveResults;
			});
		}).then(function (saveResults){
			var encryptedPassword = crypto.pbkdf2Sync(form.password, saveResults.salt, 2500, 256, 'sha256').toString("base64");
			return db.update(db.models.password, {userId: saveResults.userId}, {$set: {password: encryptedPassword}}).then(function (updateResults) {
				return {
					encryptedPassword: encryptedPassword,
					userId: saveResults.userId
				};
			});
		}).then(function (updateResults) {
			var token = jwt.sign({
				userId: updateResults.userId
				password: updateResults.encryptedPassword
			}, require("./../../config").secret, {
        expiresIn: 86400
      });

			res.cookie("access-token", token, {httpOnly: true});
			res.redirect("/accountsetup");
		});
	});
});

module.exports = router;
