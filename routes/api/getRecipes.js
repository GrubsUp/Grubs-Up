var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("./../db/db");
var jwt = require('jsonwebtoken');
var config = require("./../../config");
var Promise = require("bluebird");
var token = require("./../auth/checkToken");

router.post("/", function (req, res) {
  console.log("\nReceived POST request on " + req.originalUrl);
  var recipeIds = req.body;
  token.check(req.cookies["access-token"]).then(function (decodedToken) {
    if(decodedToken.valid){
      Promise.map(recipeIds, function (recipeId) {
        return db.query(db.models.recipe, {_id: recipeId}).then(function (queryResults) {
          return queryResults[0];
        });
      }).then(function (recipes) {
        Promise.map(recipes, function (recipe) {
          if (recipe != undefined) {
            if (!recipe.public && recipe.author == decodedToken.userId || recipe.public) {
              return recipe;
            }
            else {
              return "private";
            }
          }
          else {
            return "notFound";
          }
        }).then(function (recipesToSend) {
          res.json(recipesToSend);
        });
      });

    }
  });


});

module.exports = router;
