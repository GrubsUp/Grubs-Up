console.log("\nRunning app.js");

console.log("\nRequiring modules");
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

console.log("Requiring routes");
var routes = require('./routes');

console.log("\nInitialising app");
var app = express();

console.log("Configuring app");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

console.log("\nDeclaring module middleware");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));

console.log("Declaring route middleware");
app.get('*', routes);

console.log("\nDefining error handlers");
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        status: err.status
    });
}

console.log("\nListening on port 3000");
app.listen(3000);

module.exports = app
