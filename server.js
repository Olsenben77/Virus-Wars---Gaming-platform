"use strict";

const express = require("express");

// sequelize code:

// const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();
// sequelize code:
// db.sequelize.sync().then(function() {
//   app.listen(PORT, function() {
//     console.log("Listening on port %s", PORT);
//   });
// });

app.use(express.static(`public`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const expressHandlebars = require(`express-handlebars`);

app.engine(`handlebars`, expressHandlebars({ defaultLayout: "main" }));
app.set(`view engine`, `handlebars`);

require(`./routes/html-routes`)(app);

// const routes = require('./controller/game_controller.js);
// app.use(routes);

app.listen(PORT, () =>
  console.log(`Server listening on: http://localhost:${PORT}`)
);
