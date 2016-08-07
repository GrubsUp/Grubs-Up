var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("./../db/db");
var jwt = require('jsonwebtoken');
var config = require("./../../config");
var token = require("./../auth/checkToken");

router.get("/", function (req, res) {
  console.log("\nReceived GET request on " + req.originalUrl);
  if(!req.cookies["access-token"]){
    res.json({
      notLoggedIn: true
    });
  }
  token.check(req.cookies["access-token"]).then(function (decodedToken) {
    if(decodedToken.valid){
      db.query(db.models.user, {_id: decodedToken.userId}).then(function (queryResults) {
        res.json(queryResults[0]);
      });
    }
    else{
      res.json(decodedToken);
    }
  });
});

module.exports = router;
