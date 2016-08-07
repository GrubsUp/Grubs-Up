// Require modules
var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("./../db/db");
var jwt = require('jsonwebtoken');
var config = require("./../../config");

module.exports = {
  check: function (token) {
    return new Promise(function (resolve, reject) {
      // decoded token
      jwt.verify(token, config.secret, function (err, decodedToken) {
        if(err){
          resolve({
            valid: false
          });
        }
        else{
          // query db for matching userId+password
          db.query(db.models.password, {userId: decodedToken.userId, password: decodedToken.password}).then(function (queryResults) {
            // returns json object
            // valid option determines whether the token is valid
            if(queryResults.length){
              resolve({
                valid: true,
                userId: decodedToken.userId
              });
            }
            else{
              resolve({
                valid: false
              });
            }
          });
        }
      });
    })
  }
};
