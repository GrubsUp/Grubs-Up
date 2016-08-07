// require modules
var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("./../db/db");
var crypto = require("crypto");
var jwt = require('jsonwebtoken');
var config = require("./../../config");
var Promise = require("bluebird");
var mailer = require("nodemailer");

// when post req Received
router.post("/",function (req, res){
	console.log("\nReceived POST request on " + req.originalUrl);

	// new promise to start chain
  new Promise(function (resolve, reject) {
  	resolve(req.body);
  })
	.then(function (form) {
		// checks username for invalid chars
		if(form.username.search(/[^A-Za-z0-9._]/g) >= 0){
    	res.redirect("/signup?error=invU&prevUsername=" + form.username.replace(/[^A-Za-z0-9._]/g,'') + "&prevEmail=" + form.email);
  	}
		else{
			return form;
		}
  })
	.then(function (form) {
		// checks email format is valid
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
		// checks both password fields match
		if(form.password != form.confirm){
		 	res.redirect("/signup?error=invP&prevUsername=" + form.username + "&prevEmail=" + form.email);
		}
		else{
			return form;
		}
	})
	.then(function (form) {
		// queries db to see if username taken
		return db.query(db.models.user, {email: form.username}).then(function (queryResults) {
			if(queryResults.length > 0){
				res.redirect("/signup?error=takenU&prevUsername=" + form.username + "&prevEmail=" + form.email);
			}
			else{
				return form;
			}
		});
	})
	.then(function (form) {
		// queries db to see if email taken
		return db.query(db.models.user, {name: form.email}).then(function (queryResults) {
			if(queryResults.length > 0){
				res.redirect("/signup?error=takenE&prevUsername=" + form.username + "&prevEmail=" + form.email);
			}
			else{
				return form;
			}
		});
	})
	.then(function (form) {
		// saves user to db
		db.save(db.models.user, {
			name: form.username,
			email: form.email,
			confirmedEmail: false,
			recipes: [],
			shoppingList: [],
			pfp: "images/default-profile-picture.png"
		}).then(function (saveResults){
			// creates salt
			var salt = crypto.randomBytes(64).toString("base64");
			// encrypts password
			var encryptedPassword = crypto.pbkdf2Sync(form.password, salt, 2500, 256, 'sha256').toString("base64");
			// saves salt and password to db with user id
			return db.save(db.models.password, {
				userId: saveResults._id,
				salt: salt,
				password: encryptedPassword
			}).then(function (saveResults) {
				return saveResults;
			});
		}).then(function (saveResults) {
			// creates jwt token
			var token = jwt.sign({
				userId: saveResults.userId,
				password: saveResults.password
			}, config.secret, {
        expiresIn: 86400
      });
			// stores token as cookie
			res.cookie("access-token", token, {httpOnly: true});
			var confirmToken = jwt.sign({
				userId: saveResults.userId,
				email: saveResults.email
			}, config.secret, {
        expiresIn: 86400
      });
			// Use Smtp Protocol to send Email
			var smtpTransport = mailer.createTransport("SMTP",{
			    service: "Gmail",
			    auth: {
			        user: config.email,
			        pass: config.emailPassword
			    }
			});
			var mail = {
			    from: "Grub's Up <from@gmail.com>",
			    to: form.email,
			    subject: "Confirm Your Email - Grub's Up",
			    generateTextFromHTML: true,
			    html: "Click this link to confirm your email."
						+ " This link will expire 30 days after it has been sent."
						+ "<br><a href='http://192.168.1.21:3000/confirmemail/"
					  + confirmToken + "'>Click here to confirm email</a>"
			}

			smtpTransport.sendMail(mail, function(error, response){
			    if(error){
			        console.log(error);
			    }else{
			        console.log("Message sent: " + response.message);
			    }

			    smtpTransport.close();
			});
			// redirects to /accountsetup
			res.redirect("/overview");
		});
	});
});

module.exports = router;
