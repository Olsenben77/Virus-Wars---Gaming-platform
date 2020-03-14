"use strict";

const mysql = require("mysql");
let connection;
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: "ou6zjjcqbi307lip.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    port: 3306,
    user: "chadcd62cdk8d4kp",
    password: "cbpj2rosq3m4ozsk",
    database: "x8i76z9ke00xwl4s"
  });
}
connection.connect();
module.exports = connection;
