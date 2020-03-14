//sequelize code:

var express = require("express");
var db = require("./models");

var PORT = process.env.PORT || 3000;
var app = express();

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("Listening on port %s", PORT);
  });
});
