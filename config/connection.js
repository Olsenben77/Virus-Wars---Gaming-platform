"use strict";

// Set up MySQL connection.
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Summer2019!",
  database: "highscore_db"
});

connection.connect(err => {
  if (err) {
    console.error("error connecting", err.stack);
    return;
  }
  console.log(`connected with id ${connection.threadId}`);
});

module.exports = connection;
