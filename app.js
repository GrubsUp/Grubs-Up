console.log("\nRunning app.js");

console.log("\nRequiring modules");
var express = require("express");
var http = require("http");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

console.log("Requiring routes");
var routes = require("./routes");
var partials = require("./routes/partials");
var includes = require("./routes/includes");

var auth = {
  authenticate: require("./routes/auth/authenticate"),
  signup: require("./routes/auth/signup")
};
var api = {
  user: require("./routes/api/user"),
  confirmEmail: require("./routes/api/confirmEmail"),
  resendConfirmation: require("./routes/api/resendConfirmation"),
  getRecipes: require("./routes/api/getRecipes")
};

console.log("\nInitialising app");
var app = express();

console.log("Configuring app");
app.set("views", path.join(__dirname, "views"));

console.log("\nDeclaring module middleware");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));

console.log("Declaring route middleware");
app.use("/partials", partials);
app.use("/includes", includes);

app.use("/auth/authenticate", auth.authenticate);
app.use("/auth/signup", auth.signup);

app.use("/api/user", api.user);
app.use("/api/confirmEmail", api.confirmEmail);
app.use("/api/resendConfirmation", api.resendConfirmation);
app.use("/api/getRecipes", api.getRecipes);

app.use("*", routes);

console.log("\nDefining error handlers");
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
    res.sendFile(path.join(__dirname + "/views/error.html"));
});

console.log("\nListening on port 3000");
app.listen(3000);

module.exports = app
