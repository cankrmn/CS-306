const express = require("express");
const volleyball = require("volleyball");
const path = require("path");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var flash = require("connect-flash");
var cors = require('cors')

const auth = require("./user/index");
const event = require("./event/events");

const app = express();

app.use(flash());
app.use(cors())

//HTTP request logger middleware for nodejs //debugger gibi
app.use(volleyball);
app.use(express.urlencoded());

//app.use( '/' , express.static(path.join(__dirname ,'..' ,'public')));

app.use(express.static("public"));

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname + "/../index.html"));
	//__dirname : It will resolve to your project folder.
});

app.use("/user", auth);
app.use("/event", event);

function errorHandler(err, req, res, next) {
	res.status(res.statusCode || 500);
	res.json({
		message: err.message,
		stack: err.stack,
	});
}

//app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log("Listening on port", port);
});
