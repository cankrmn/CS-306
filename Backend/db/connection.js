var mysql = require("mysql");

// var db = mysql.createConnection({
// 	host: "remotemysql.com",
// 	port: 3306,
// 	user: "cghi3Rzb2m",
// 	password: "D95r3c7wp4",
// 	database: "cghi3Rzb2m",
// });

// db.connect(function (err) {
// 	if (err) {
// 		console.log("error connecting: " + err.stack);
// 		return;
// 	}

// 	console.log("connected as id " + db.threadId);
// });

const sqlite3 = require('sqlite3').verbose();

// let database = require("./mydatabase.sqlite")

let db = new sqlite3.Database("mydatabase.sqlite", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

// Export
module.exports = db;
