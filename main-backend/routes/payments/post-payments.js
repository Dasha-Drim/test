const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

const axios = require('axios');
const { DateTime } = require("luxon");

const PaymentsLog = require('../../models/PaymentsLog.js');
const Players = require('../../models/Players.js');

router.post('/payments', async (req, res, next) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if (!token || (token.role !== 'user')) return res.send({success: false, message: 'Incorrect token'});
    let user = await Players.findOne({'idUser': token.id});
    if (user.status == 'blocked')  return res.send({success: false, message: 'User blocked'});
    let currency = user.currency;
    let amount = +req.body.amount;
    if (currency === "KZT") {
        currency = "RUB";
        let result = await axios({
            method: "get",
            url: 'https://www.cbr-xml-daily.ru/latest.js',
        });
        amount = Math.ceil(req.body.amount / +result.data.rates.KZT);
    }
	let response = await axios({
        method: "post",
        url: 'https://dev.unicreate.ru:3003/v1/payments/',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: {amount: amount, currency: currency, user: user.login},
    })
    await Players.updateOne({'idUser': token.id}, {$set: {domainName: req.headers.origin}}, {upsert: false});
    if (response.data.result.success) {
        console.log("response.data.result.payment", response.data.result.payment);
        let currentTime = DateTime.local().setZone("Europe/Moscow").toISO();
        await new PaymentsLog({method: "non-cash", operationId: response.data.result.payment.id, currency: user.currency, amount: +req.body.amount, type: response.data.result.payment.type ? "up" : "down", userId: user.idUser, status: response.data.result.payment.status, dateTime: currentTime}).save();
        let timerId = setTimeout(async () => {
            let currentPayment = await PaymentsLog.findOne({operationId: response.data.result.payment.id});
            if ((currentPayment.type === "up") && (currentPayment.status === "pending")) {
                await PaymentsLog.deleteOne({operationId: response.data.result.payment.id});
                return;
            }
        }, 1800000); // 30 минут
        return res.send(response.data.result)
    } else return res.send({success: false, message: 'Error'})
});

module.exports = router;