var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("./../db/db");
var jwt = require('jsonwebtoken');
var config = require("./../../config");

router.post("/", function (req, res) {
  console.log("\nReceived POST request on " + req.originalUrl);
  var recipeIds = req.body.recipeIds;
  var recipes = [];
  recipeIDs.forEach(function (recipeID) {
    db.query(db.models.recipes, {_id: recipeId}).then(function (queryResults) {
      recipes.push(queryResults[0]);
    });
  });
  res.json({
    recipes: recipes
  });
});

module.exports = router;
