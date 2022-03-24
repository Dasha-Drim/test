const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt.js');
const axios = require('axios');

const Players = require('../../models/Players.js');
const PaymentsLog = require('../../models/PaymentsLog.js');

router.get('/statistic/players', async (req, res) => {
	console.log("statistic-players");
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token) || (token.role !== "admin")) return res.send({success: false, message: 'Incorrect token'});

	let response = await axios({
        method: "get",
        url: 'https://www.cbr-xml-daily.ru/latest.js',
    });

	let players = await Players.find({inFilial: false});
	let playersOnline = await Players.count({online: true});
	let balance = 0;
	let deposit = 0;
	let withdraw = 0;
	for (player of players) {
		if (player.currency === "RUB") balance += Math.round(player.balance * response.data.rates.USD);
		else balance += Math.round(player.balance / response.data.rates[player.currency] * response.data.rates.USD);
		let operations = await PaymentsLog.find({userId: player.idUser, status: "success"});
		for (operation of operations) {
			if(operation.type === "up" && operation.method !== "correction" && operation.method !== "bonus") {
				if (player.currency === "RUB") deposit += Math.round(operation.amount * response.data.rates.USD);
				else deposit += Math.round(operation.amount / response.data.rates[player.currency] * response.data.rates.USD);
			}
			if(operation.type === "down" && operation.method !== "correction") {
				if (player.currency === "RUB") withdraw += Math.round(operation.amount * response.data.rates.USD);
				else withdraw += Math.round(operation.amount / response.data.rates[player.currency] * response.data.rates.USD);
			}
		}
	}
	return res.send({
		success: true,
		stats: [
			{name: "Всего аккаунтов", value: players.length},
			{name: "Игроков онлайн", value: playersOnline},
			{name: "На балансах", value: balance + " $"},
			{name: "Всего пополнений", value: deposit + " $"},
			{name: "Всего выводов", value: withdraw + " $"},
		]
	})
});

module.exports = router;


