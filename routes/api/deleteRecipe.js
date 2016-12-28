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
  token.check(req.cookies["access-token"]).then(function (decodedToken) {
    if(decodedToken.valid){
      new Promise(function (resolve, reject) {
        resolve(decodedToken.userId);
      }).then(function (userId) {
        return db.query(db.models.user, {_id: userId}).then(function (queryResults) {
          return queryResults[0];
    		});
      }).then(function (user) {
        var newRecipes=[];
        var newPublicRecipes=[];
        Promise.each(user.recipes, function (recipeId) {
          if(recipeId != req.body.recipeId){
            newRecipes.push(recipeId);
          }
        }).then(function () {
          Promise.each(user.recipesPublic, function (recipeId) {
            if(recipeId != req.body.recipeId){
              newPublicRecipes.push(recipeId);
            }
          }).then(function () {
            db.update(db.models.user, {_id: user._id}, {
              recipes: newRecipes,
              recipesPublic: newPublicRecipes,
            }).then(function (updateResults) {
              return db.delete(db.models.recipe, {_id: req.body.recipeId}).then(function (deleteResult) {
                return deleteResult;
              });
            }).then(function (deleteResult) {
              res.json({
                deleteResult: deleteResult
              });
            });
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
