const express = require("express");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const path = require("path");
const db = require("../db/connection.js");

//const { reactive } = require('@vue/reactivity');

const router = express.Router(); //like a mini express app

router.post("/login", async function (req, res, next) {
	try {
		let returnVal = { type: "empty" };
		let sql1 = `SELECT password, type, location FROM user_userdata WHERE email = '${req.body.email}'`;
		db.all(sql1, (err1, res1) => {
			if(err1 != null) {
				console.log({err1})
			}
			try {
				if (req.body.password == res1[0].password) {
					returnVal = { type: res1[0].type, location: res1[0].location};
					res.status(302);
					res.json(returnVal);
					res.send();
				} else {
					res.status(401).send();
				}
			} catch (e) {
				console.log({e});
				res.status(404).send();
			}
		});
		return 0;
	} catch (e) {
		console.log({e});
		return 0;
	}
});

router.post("/register", async function (req, res, next) {
	try {
		let sql1 = `INSERT INTO user_userdata (email, password, type, location) VALUES ('${req.body.email}', '${req.body.password}', '${req.body.type}', '${req.body.location}')`;
		db.all(sql1, (err1, res1) => {
			res.send(res1);
		});
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
});

router.post("/list", async function (req, res, next) {
	try {
		let sql1 = `SELECT * FROM user_userdata`;
		db.all(sql1, (err1, res1) => {
			res.send(res1);
		});
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
});

module.exports = router;
