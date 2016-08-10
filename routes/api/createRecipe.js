var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("./../db/db");
var jwt = require('jsonwebtoken');
var config = require("./../../config");
var token = require("./../auth/checkToken");

router.post("/", function (req, res) {
  console.log("\nReceived POST request on " + req.originalUrl);

  token.check(req.cookies["access-token"]).then(function (decodedToken) {
    if(decodedToken.valid){
      new Promise(function (resolve, reject) {
      	resolve(req.body);
      })
      .then(function (recipe) {
        return db.save(db.models.recipe, {
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions
        }).then(function (saveResults) {
          return saveResults;
        });
      })
      .then(function (saveResults) {
        var recipeId = saveResults.id;

        db.query(db.models.user, {_id: decodedToken.userId}).then(function (queryResults) {

          var newRecipes = queryResults[0].recipes || [];
          newRecipes.push(recipeId);

          db.update(db.models.user, {_id: decodedToken.userId}, {
            recipes: newRecipes
          }).then(function (updateResults) {
            res.redirect("/recipes");
          });

        });

      });

    }
    else{
      res.json(decodedToken);
    }
  });

});

module.exports = router;
