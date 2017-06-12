var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("./../db/db");
var jwt = require('jsonwebtoken');
var config = require("./../../config");
var Promise = require("bluebird");

router.post("/", function (req, res) {
  console.log("\nReceived POST request on " + req.originalUrl);
  var userIds = req.body;

  Promise.map(userIds, function (userId) {
    return db.query(db.models.user, {_id: userId}).then(function (queryResults) {
      return {
        name: queryResults[0].name,
        recipes: queryResults[0].recipes,
        verified: queryResults[0].verified,
        pfp: queryResults[0].pfp
      };
    });
  }).then(function (users) {
    res.json(users);
  });

});

module.exports = router;
