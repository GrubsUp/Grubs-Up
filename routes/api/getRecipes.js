var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("./../db/db");
var jwt = require('jsonwebtoken');
var config = require("./../../config");
var Promise = require("bluebird");

router.post("/", function (req, res) {
  console.log("\nReceived POST request on " + req.originalUrl);
  var recipeIds = req.body;

  Promise.map(recipeIds, function (recipeId) {
    return db.query(db.models.recipe, {_id: recipeId}).then(function (queryResults) {
      return queryResults[0];
    });
  }).then(function (recipes) {
    res.json(recipes);
  });

});

module.exports = router;
