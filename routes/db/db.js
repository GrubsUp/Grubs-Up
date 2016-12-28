var mongoose = require('mongoose');
console.log("Connecting to MongoDB");
mongoose.connect(require("./../../config").databaseUrl);

var schemas = require("./mongooseSchemas");
var Promise = require("bluebird");

console.log("Defining mongoose models");
var userModel = mongoose.model("User", schemas.user);
var passwordModel = mongoose.model("Password", schemas.password);
var recipeModel = mongoose.model("Recipe", schemas.recipe);

module.exports = {
  query: function (model, query) {
    return new Promise(function (resolve, reject) {
      console.log("\nQuerying the db");
      var dbQuery = model.find(query, function (err, results) {
        if(err) console.log("Error:\n" + err);
        resolve(dbQuery);
      });
    });
  },
  save: function (model, data) {
    return new Promise(function (resolve, reject) {
      console.log("\nSaving to the db");
      var newDoc = new model(data).save(function (err, results) {
        if(err) console.log("Error:\n" + err);
        resolve(newDoc);
      });
    });
  },
  update: function (model, query, data) {
    return new Promise(function (resolve, reject) {
      console.log("\nUpdating the db");
      var updatedDoc = model.update(query, data, function (err, results) {
        if(err) console.log("Error:\n" + err);
        resolve(updatedDoc);
      });

    });
  },
  delete: function (model, query) {
    return new Promise(function (resolve, reject) {
      console.log("\nUpdating the db");
      var updatedDoc = model.remove(query, function (err) {
        if(err){
          console.log("Error:\n" + err);
          resolve("Error");
        }
        else {
          resolve("Success");
        }
      });

    });
  },
  models: {
    user: userModel,
    password: passwordModel,
    recipe: recipeModel
  }
}
