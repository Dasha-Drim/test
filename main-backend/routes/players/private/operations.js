const express = require('express');
const router = express.Router();
const { DateTime } = require("luxon");
const jwt = require('../../../modules/jwt.js');

const Players = require('../../../models/Players.js');
const PaymentsLog = require('../../../models/PaymentsLog.js');

router.get('/players/operations', async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if (((!token)  || (token.role !== "user")) && ((!token)  || (token.role !== 'user-offline'))) return res.send({success: false, message: 'Incorrect token'});
	let player = await Players.findOne({idUser : token.id});
	if (!player) return res.send({success: false, message: "такого пользователя не существует"});
	let operations = await PaymentsLog.find({userId: player.idUser}).limit(+req.query.limit).sort({_id: -1});
	for (operation of operations) {
		operation.dateTime = DateTime.fromISO(operation.dateTime, { zone: req.query.timeZone }).toFormat('dd.LL.yy HH:mm');
	}
	let count = await PaymentsLog.count({userId: player.idUser});
	return res.send({success: true, operations: operations, allResults: count})	
});

module.exports = router;