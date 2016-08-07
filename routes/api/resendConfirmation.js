var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("./../db/db");
var jwt = require('jsonwebtoken');
var config = require("./../../config");
var mailer = require("nodemailer");

router.post("/", function (req, res) {
  console.log("\nReceived POST request on " + req.originalUrl);
  var email = req.body.email;
  var userId = req.body.userId;

  db.query(db.models.user, {_id: userId}).then(function (queryResults) {
    if(queryResults[0].email == email){
      var confirmToken = jwt.sign({
				userId: userId,
				email: email
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
			    to: email,
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
              res.json({sent: false});
			    }else{
			        console.log("Message sent: " + response.message);
              res.json({sent: true});
			    }

			    smtpTransport.close();
			});
    }
  });
});

module.exports = router;
