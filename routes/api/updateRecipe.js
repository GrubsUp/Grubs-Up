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
        resolve(req.body.recipe);
      }).then(function (newRecipe) {
        db.update(db.models.recipe, {_id: newRecipe["_id"]}, {
          title: newRecipe.title,
          description: newRecipe.description,
          ingredients: newRecipe.ingredients,
          instructions: newRecipe.instructions
        }).then(function (updateResults){
          res.json({
            editted: true
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
