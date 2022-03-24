const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');
const axios = require('axios');

const PaymentsLog = require('../../models/PaymentsLog.js');
const Players = require('../../models/Players.js');

router.post('/withdraw/confirmation', async (req, res, next) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if (!token || (token.role !== 'admin')) return res.send({success: false, message: 'Incorrect token'});
	console.log("req.bodyreq.body", req.body);
	let payment = await PaymentsLog.findOne({operationId : req.body.payment_id});
	let user = await Players.findOne({'idUser': operation.userId});
	let balance = user.balance - payment.amount;
	if (balance < 0) return res.send({success: false, message: 'Недостаточно средств для вывода'});
	else {
		let response = await axios({
			method: "post",
			url: 'https://dev.unicreate.ru:3003/v1/withdraw/confirmation',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			data: req.body,
		})
		if (response.data.result.success) {
			await PaymentsLog.updateOne({operationId: req.body.payment_id}, {$set: {status: "success"}}, {upsert: false});
			await Players.updateOne({'idUser': user.idUser}, {$set: {balance: balance}}, {upsert: false});
			return res.send({success: true})
		} else return res.send({success: false, message: 'Error'})
	}
});

module.exports = router;