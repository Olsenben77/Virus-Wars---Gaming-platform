"use strict";
// var express = require(`express`);
// const path = require(`path`);

module.exports = app => {
  app.get(`/`, function(req, res) {
    res.render(`index`, { style: `game_style.css` });
  });
  app.get(`/`, function(req, res) {
    res.render(`highscore`, { style: `game_style.css` });
  });
};

//   app.get(`/,` (req, res) => {
//       res.sendFile(path.join(__dirname, ``  };
