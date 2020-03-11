"use strict";

const mysql = require("mysql");

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Summer2019!",
    database: "highscore_db"
  });
}
connection.connect();
module.exports = connection;
