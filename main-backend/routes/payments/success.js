const express = require('express');
const router = express.Router();

const PaymentsLog = require('../../models/PaymentsLog.js');
const Players = require('../../models/Players.js');

router.post('/payment/success', async (req, res) => { 
  	console.log("Оплата прошла успешно");
  	console.log("req.body", req.body);
  	let operation = await PaymentsLog.findOne({operationId : req.body.payment_id});
	let user = await Players.findOne({'idUser': operation.userId});
	return res.send({success: true, redirect: user[0].domainName+"/success"})
});

module.exports = router;
