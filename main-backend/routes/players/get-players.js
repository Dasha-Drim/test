const express = require('express');
const router = express.Router();

const { DateTime } = require("luxon");
const jwt = require('../../modules/jwt.js');

const Players = require('../../models/Players.js');
const PaymentsLog = require('../../models/PaymentsLog.js');

router.get('/players', async (req, res) => {
	console.log("get-players", req.cookies);
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token) || (token.role !== "admin")) return res.send({success: false, message: 'Incorrect token'});

	let strSearch = req.query.search ? req.query.search : null;
	let regSearch = strSearch ? new RegExp(strSearch) : null;

	let sort = (req.query.sort == "byDate") ? {dateRegistration: -1} : (req.query.sort == "byBonus") ? {bonus: -1} : {};

	let allUsers = [];

	let players = (!req.query.search) ? await Players.find({inFilial: false}).sort(sort) :  await Players.find({inFilial: false, login : regSearch}).sort(sort);
	for (player of players) {
		let user = {};
		user.account = player.phone || player.mail;
		user.registerDate =player.dateRegistration;
		user.balance = player.balance + +(player.bonus ? +player.bonus : 0);
		user.status = player.status;
		user.currency = player.currency;
		user.idUser = player.idUser || null;
		let operations = await PaymentsLog.find({userId: player.idUser});
		user.totalDeposits = 0;
		user.totalWithdraws = 0;
		user.totalBonuses = 0;
		for (operation of operations) {
			if(operation.type === "up" && operation.method !== "correction" && operation.method !== "bonus" && operation.status === "success") user.totalDeposits += operation.amount;
			if(operation.type === "down" && operation.method !== "correction" && operation.status === "success") user.totalWithdraws += operation.amount;
			if(operation.type === "up" && operation.method === "bonus") user.totalBonuses += +operation.amount;
		}
		user.profit = +user.totalDeposits - +user.totalWithdraws - +user.balance;
		allUsers.push(user);

		if (req.query.sort == "byProfit") allUsers.sort((prev, next) => prev.profit - next.profit);
		if (req.query.sort == "byBalance") allUsers.sort((prev, next) => next.balance - prev.balance);
		if (req.query.sort == "byBonus") allUsers.sort((prev, next) => next.totalBonuses - prev.totalBonuses);
	}
	return res.send({success: true, users: allUsers})
});

module.exports = router;