let express = require('express');
let router = express.Router();

const qs = require('qs');

const axios = require('axios');
let Payment = require("../../../models/Payments");

let merchantID, merchantKey;
if (!process.env.DEV) {
	merchantKey = "g2Nm6X2PLnjbnAbpar4vX8TvY7fbA6TM";
 	merchantID = 13781;
} else {
	merchantKey = "EMNmbDZFxShu6i2ODnXeEi1Jai60m79q";
 	merchantID = 14958;
}



let dataFromInterkassa = async (data, way) => {
	let response = await axios({
        method: "post",
        url: way,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data,
    })
    return response;
}

let request = async (url, data) => {
	let response = await axios({
		method: "post",
		url: url,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: qs.stringify(data)
	})
	return response.data;
}

let sci_confirm_transaction_notification = async (private_hash) => {
	console.log("private_hashprivate_hash", private_hash)
	let url = "https://paykassa.app/sci/0.4/index.php";
	let createOrderData = {
		func: "sci_confirm_transaction_notification",
		sci_id: merchantID,
		sci_key: merchantKey,
		private_hash: private_hash,
		test: false,
	}
	let a = await request(url, createOrderData);
	return a;
}

router.get("/paykassa/success", async (req, res) => {
	console.log("req.body", req.query);
	let response = await dataFromInterkassa({payment_id: req.query.order_id}, 'https://dev.unicreate.ru:3001/payment/success');
	//console.log("response", response)
	if (response.data.success) return res.redirect(response.data.redirect)
	else return res.sendStatus(500);
});

router.get("/paykassa/error", async (req, res) => {
	console.log("req.body", req.query)
	let response = await dataFromInterkassa({payment_id: req.query.order_id}, 'https://dev.unicreate.ru:3001/payment/error');
	console.log("response", response.data)
	if (response.data.success) return res.redirect(response.data.redirect)
	else return res.sendStatus(500);
});

router.post("/paykassa/result", async (req, res) => {
	return res.send(req.body.order_id+'|success');
});

router.post("/paykassa/notify", async (req, res) => {
	console.log("req.body", req.body);
	let data;
	let infoPayment = await sci_confirm_transaction_notification(req.body.private_hash);
	console.log("infoPayment", infoPayment);
	if (!infoPayment.error) {
		if (infoPayment.data.status === "yes") {
			data = {success: true, payment_id: infoPayment.data.order_id};
			// setInterval
			let timerId = setInterval(async () => {
				console.log("interval");
				let response = await dataFromInterkassa(data, 'https://dev.unicreate.ru:3001/payment/result');
				//console.log("response", response);
				if (response.status == 200) {
					let update = await Payment.model.updateOne({id: infoPayment.data.order_id}, {$set: {status: "succeeded", paid: true, payment_method: {type: "paykassaPro", id: req.body.order_id, system: infoPayment.data.system, amount: infoPayment.data.amount, currency: infoPayment.data.currency, transaction: infoPayment.data.transaction}}}, {upsert: false})
					console.log("updateupdateupdate", update);
					//await Payment.model.updateOne({id: req.body.order_id}, {$set: {}, {upsert: false})
					clearInterval(timerId);
				}
			}, 30000);

			//console.log("resulttttttt", result);
			
			return res.send(req.body.order_id+'|success');
		}
	}
	return res.send(req.body.order_id+'|success');
});

module.exports = router;

