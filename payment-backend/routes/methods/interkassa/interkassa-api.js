let express = require('express');
let router = express.Router();

const axios = require('axios');
let Payment = require("../../../models/Payments");

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

router.get("/interkassa/success", async (req, res) => {
	console.log("req.body", req.query);
	let response = await dataFromInterkassa({payment_id: req.query.ik_pm_no}, 'https://lotolive.org:3067/payment/success');
	console.log("response", response)
	if (response.data.success) return res.redirect(response.data.redirect)
	else return res.sendStatus(500);
});

router.get("/interkassa/error", async (req, res) => {
	console.log("req.body", req.query)
	let response = await dataFromInterkassa({payment_id: req.query.ik_pm_no}, 'https://lotolive.org:3067/payment/error');
	console.log("response", response)
	if (response.data.success) return res.redirect(response.data.redirect)
	else return res.sendStatus(500);
});

router.post("/interkassa/result", async (req, res) => {
	console.log("req.body", req.body);
	let data;
	if (req.body.ik_inv_st == "success") data = {success: true, payment_id: req.body.ik_pm_no};
	else data = {success: false};
	console.log("datadatadata", data)
	let response = await dataFromInterkassa(data, 'https://lotolive.org:3067/payment/result');
	await Payment.model.updateOne({id: req.body.ik_pm_no}, {$set: {status: "succeeded", paid: true}}, {upsert: false})
	await Payment.model.updateOne({id: req.body.ik_pm_no}, {$set: {payment_method: {type: "interkassa", id: req.body.ik_pm_no}}}, {upsert: false})
	return res.sendStatus(200);
});


module.exports = router;