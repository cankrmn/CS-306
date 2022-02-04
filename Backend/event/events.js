const express = require("express");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const path = require("path");
const db = require("../db/connection.js");

//const { reactive } = require('@vue/reactivity');

const router = express.Router(); //like a mini express app

router.get("/", async function (req, res, next) {
	try {
		db.all(`SELECT * FROM event_events`, (err1, res1) => {
			db.all(`SELECT eventID FROM event_saves WHERE email = '${req.query.email}'`, (err2, res2) => {
				db.all(`SELECT * FROM event_buys WHERE email = '${req.query.email}'`, (err3, res3) => {
					var newList = [];
					for (let i = 0; i < res1.length; i++) {
						var temp = {};
						res1[i]["isSaved"] = false;
						res1[i]["isBought"] = false;
						temp = res1[i];

						for (j of res2) {
							if (temp.eventID == j.eventID) {
								temp.isSaved = true;
							}
						}
						for (k of res3) {
							if (temp.eventID == k.eventID) {
								temp.isBought = true;
							}
						}
						newList.push(temp);
					}
					res.send(newList);
				});
			});
		});
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
});

router.get("/list", async function (req, res, next) {
	try {
		db.all(`SELECT * FROM event_events`, (err1, res1) => {
			res.send(res1);
		});
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
});

router.post("/search", async function (req, res, next) {
	// email as query
	try {
		db.all(`SELECT * FROM event_events WHERE name LIKE '%${req.body.name}%'`, (err1, res1) => {
			db.all(`SELECT eventID FROM event_saves WHERE email = '${req.query.email}'`, (err2, res2) => {
				db.all(`SELECT * FROM event_buys WHERE email = '${req.query.email}'`, (err3, res3) => {
					var newList = [];
					for (let i = 0; i < res1.length; i++) {
						console.log(res1[i]);
						var temp = {};
						res1[i]["isSaved"] = false;
						res1[i]["isBought"] = false;
						temp = res1[i];

						for (j of res2) {
							if (temp.eventID == j.eventID) {
								temp.isSaved = true;
							}
						}
						for (k of res3) {
							if (temp.eventID == k.eventID) {
								temp.isBought = true;
							}
						}
						newList.push(temp);
					}
					res.status(302).send(newList);
				});
			});
		});
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
});

router.get("/delete", async function (req, res, next) {
	// id as query
	try {
		db.all(`DELETE FROM event_events WHERE eventID = '${req.query.id}'`, (err1, res1) => {});
		db.all(`DELETE FROM event_manages WHERE eventID = '${req.query.id}'`, (err2, res2) => {});
		res.send();
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
});

db.all(`UPDATE event_manages SET email = 'org@org.com' WHERE email = 'undefined'`);

router.post("/edit", async function (req, res, next) {
	//id as query
	console.log("body: ", req.body);
	try {
		db.all(
			`UPDATE event_events SET 
			date= '${req.body.date}',
			name= '${req.body.name}',
			duration= ${req.body.duration},
			description= '${req.body.description}',
			region= '${req.body.region}',
			city= '${req.body.city}',
			type= '${req.body.type}',
			minPrice= ${req.body.minPrice},
			maxPrice = ${req.body.maxPrice}
			WHERE eventID = ${req.query.id}`,
			(err1, res1) => {}
		);
		db.all(
			`UPDATE event_manages SET email = "${req.body.email}" WHERE eventID = "${req.query.id}"`,
			(err2, res2) => {}
		);
		res.status(200).send();
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
});

router.post("/create", async function (req, res, next) {
	console.log({ req });
	try {
		let id = Math.floor(Math.random() * 10000);
		db.all(
			`INSERT INTO event_events (eventID, date, name, duration, description, region, city, type, minPrice, maxPrice)
			VALUES
			(${id},
			'${req.body.date}',
			'${req.body.name}',
			${req.body.duration},
			'${req.body.description}',
			'${req.body.region}',
			'${req.body.city}',
			'${req.body.type}',
			${req.body.minPrice},
			${req.body.maxPrice})`,
			(err1, res1) => {
				if (err1 != null) {
					console.log(err1);
				}
			}
		);
		db.all(
			`INSERT INTO event_manages (email, eventID) VALUES ('${req.body.email}', ${id})`,
			(err2, res2) => {
				if (err2 != null) {
					console.log(err2);
				}
			}
		);
		res.status(201).send({ eventID: id });
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
});

router.get("/showSaved", async function (req, res, next) {
	// email as query
	try {
		let sql = `SELECT eventID FROM event_saves WHERE email = '${req.query.email}'`;
		db.all(`SELECT * FROM event_events WHERE eventID IN (${sql})`, (err1, res1) => {
			if (err1 != null) {
				return err1;
			}
			res.send(res1);
		});
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
});

router.get("/showTicket", async function (req, res, next) {
	// email as query
	try {
		let sql = `SELECT eventID FROM event_buys WHERE email = '${req.query.email}'`;
		db.all(`SELECT * FROM event_events WHERE eventID IN (${sql})`, (err1, res1) => {
			if (err1 != null) {
				return err1;
			}
			res.send(res1);
		});
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
});

router.get("/save/", async function (req, res, next) {
	//eid, email as query
	try {
		db.all(
			`INSERT INTO event_saves (email, eventID) VALUES ('${req.query.email}', ${req.query.eid})`,
			(err1, res1) => {
				if (err1 != null) {
					console.log({ err1 });
				}
				res.send(res1);
			}
		);
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
});

router.get("/removeSaved", async function (req, res, next) {
	//eid, email as query
	try {
		db.all(
			`DELETE FROM event_saves WHERE (email, eventID) = ('${req.query.email}', '${req.query.eid}')`,
			(err1, res1) => {
				if (err1 != null) {
					console.log({ err1 });
				}
				res.send(res1);
			}
		);
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
});

router.post("/buyTicket", async function (req, res, next) {
	try {
		console.log(req.body);
		db.all(
			`INSERT INTO event_buys (email, eventID) VALUES ('${req.body.email}', ${req.body.eventID})`,
			(err1, res1) => {
				if (err1 != null) {
					console.log({ err1 });
				}
				res.send(res1);
			}
		);
		return 0;
	} catch (e) {
		console.log(e);
		res.status(404);
		return 0;
	}
});

router.get("/organiserEvents", async function (req, res, next) {
	//email as query
	try {
		let sql = `SELECT eventID FROM event_manages WHERE email = '${req.query.email}'`;
		db.all(`SELECT * FROM event_events WHERE eventID IN (${sql})`, (err1, res1) => {
			if (err1 != null) {
				console.log({ err1 });
			}
			res.send(res1);
		});
	} catch (e) {
		console.log(e);
		return 0;
	}
});

module.exports = router;
