const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

const Admins = require('../../models/Admins.js');
const Players = require('../../models/Players.js');
const PaymentsLog = require('../../models/PaymentsLog.js');


router.get('/players-offline/:id([0-9]+)', async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token || (token.role !== 'operator'))) return res.send({success: false, message: 'Incorrect token'});

	let player = await Players.findOne({idUser: req.params.id});
	if (!player) return res.send({success: false, message: "Такого пользователя нет"});

	//return res.send({success: true, passport: player.passport, status: player.status, phone: player.phone});

	let user = {};
	user.accountInfo = {};
	if (player.phone) {
		user.accountInfo.type = "Телефон";
		user.accountInfo.value = player.phone;
	}
	if (player.mail) {
		user.accountInfo.type = "Mail";
		user.accountInfo.value = player.mail;
	}
	user.balance = player.balance + +(player.bonus ? +player.bonus : 0);
	user.accountStatus = player.status;
	user.accountCurrency = player.currency;
	user.passportStatus = player.passportStatus;
	user.idUser = player.idUser;

	user.active = (!player.active) ? 'deactivate' : 'activate';

	user.passport = {};
	user.passport.surname = player.passport.surname || "";
	user.passport.name = player.passport.name || "";
	user.passport.middleName = player.passport.patronymic || "";
	user.passport.dateBirth = player.passport.dateBirth || "";
	user.passport.number = player.passport.number || "";
	user.passport.passportPhoto = player.passport.photo ? "http://localhost:3002" + player.passport.photo : "";

	let operations = await PaymentsLog.find({userId: player.idUser});
	console.log('operations', operations);
	user.totalDeposits = 0;
	user.totalWithdraws = 0;
	user.totalBonuses = 0;
	for (operation of operations) {
		if(operation.type === "up" && operation.method !== "correction" && operation.method !== "bonus") user.totalDeposits += operation.amount;
		if(operation.type === "down" && operation.method !== "correction") user.totalWithdraws += operation.amount;
		if(operation.type === "up" && operation.method === "bonus") user.totalBonuses += +operation.amount;
		//operation.dateTime = DateTime.fromISO(operation.dateTime, { zone: req.query.timeZone }).toFormat('dd.LL.yy HH:mm');
	}
	user.profit = user.totalDeposits-user.totalWithdraws-user.balance;
	user.history = (operations.length !== 0) ? operations : [];
	return res.send({success: true, user: user})

});

module.exports = router;