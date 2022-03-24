const express = require('express');
const router = express.Router();

const PaymentsLog = require('../../models/PaymentsLog.js');
const Players = require('../../models/Players.js');

router.post('/payment/result', async (req, res) => {
	console.log("Результат платежа!!!!!!");
	console.log("req!!!!!", req.body);

	if (req.body.success) {
		let operation = await PaymentsLog.findOne({operationId :  req.body.payment_id});
		console.log("operation", operation)
		let user = await Players.findOne({'idUser': operation.userId});
		console.log("user", user)
		let balance = user.balance + +operation.amount;
		await PaymentsLog.updateOne({operationId: req.body.payment_id}, {$set: {status: "success"}}, {upsert: false});
		await Players.updateOne({'idUser': user.idUser}, {$set: {balance: balance}}, {upsert: false});
		return res.sendStatus(200).send({success: true});
	} else {
		return res.send({success: false});
	}
});

module.exports = router;