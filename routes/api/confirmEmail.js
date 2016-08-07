var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("./../db/db");
var jwt = require('jsonwebtoken');
var config = require("./../../config");

router.post("/", function (req, res) {
  console.log("\nReceived POST request on " + req.originalUrl);
  var token = req.body.token;
  var userId = req.body.userId;
  jwt.verify(token, config.secret, function (err, decodedToken) {
    if(err){
      if(err.name == "TokenExpiredError"){
        res.json({
          err: true,
          name: err.name,
          message: "Confirmation code is expired"
        });
      }
    }
    else if(decodedToken.userId == userId){
      db.query(db.models.user, {_id: userId}).then(function (queryResults) {
        if(queryResults[0].confirmedEmail){
          res.json({
            err: true,
            name: "EmailAlreadyConfirmed",
            message: "Your email account has already been confirmed"
          });
        }
        else if(queryResults[0].email == decodedToken.email){
          db.update(db.models.user, {_id: userId}, {confirmedEmail:true}).then(function (updateResults){
            res.json({
              confirmed: true
            });
          });
        }
        else{
          res.json({
            err: true,
            name: "EmailsDontMatch",
            message: "The email this confirmation code was sent to does not match yours."
          });
        }
      });
    }
    else{
      res.json({
        err: true,
        name: "TokensDontMatch",
        message: "Please sign in with the correct account"
      });
    }
  });

});

module.exports = router;
