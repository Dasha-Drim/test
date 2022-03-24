const express = require('express');
const router = express.Router();

const {DateTime} = require('luxon');

const jwt = require('../../modules/jwt.js');

const SMSLogs = require('../../models/SMSLogs.js');
const LottoLog = require('../../models/LottoLog.js');

router.get('/monitoring', async (req, res) => {
	console.log("monitoring");
	let arrSystem = [SMSLogs, LottoLog];
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token) || (token.role !== "admin")) return res.send({success: false, message: 'Incorrect token'});

	let resObject = {};
	resObject.status = "ok";
	resObject.details = [];

	for (system of arrSystem) {
		let info = {};
		let data = await system.find().sort({_id:-1}).limit(5);
		if (arrSystem[0] == system) info.name = "СМС-сервис";
		if (arrSystem[1] == system) info.name = "Лоттомашина";
		info.info = data;
		info.status = (data.length && data[0].type == "success") ? "ok" : "fail";
		resObject.details.push(info);
		if (!data.length || data[0].type == "error") resObject.status = "fail";
	}

	return res.send({success: true, info: resObject});

});

module.exports = router;