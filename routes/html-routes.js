"use strict";

module.exports = app => {
  app.get(`/`, (req, res) => {
    res.render(`index`, { style: `game_style.css` });
  });
  app.get(`/highscore`, (req, res) => {
    res.render(`highscore`, { style: `game_style.css` });
  });
  app.get(`/controller`, (req, res) => {
    res.render(`controller`, { style: `game_style.css` });
  });
};
