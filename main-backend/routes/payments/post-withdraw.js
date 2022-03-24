const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');
const { DateTime } = require("luxon");
const axios = require('axios');

const PaymentsLog = require('../../models/PaymentsLog.js');
const Players = require('../../models/Players.js');

router.post('/withdraw', async (req, res, next) => {
    let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
    if (!token || (token.role !== 'user')) return res.send({success: false, message: 'Incorrect token'});

    await Players.updateOne({'idUser': token.id}, {$set: {domainName: req.headers.origin}}, {upsert: false});
    let user = await Players.findOne({'idUser': token.id});
    if (user.status == 'blocked') return res.send({success: false, message: 'User blocked'});
    let balance = user.balance - req.body.amount;
    if (balance < 0) return res.send({success: false, message: 'Недостаточно средств для вывода'});

    let currency = user.currency;
    let amount = +req.body.amount;
    if (currency === "KZT") {
        currency = "RUB";
        let result = await axios({
            method: "get",
            url: 'https://www.cbr-xml-daily.ru/latest.js',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        amount = Math.ceil(req.body.amount / +result.data.rates.KZT);
    }

    let response = await axios({
        method: "post",
        url: 'https://dev.unicreate.ru:3003/v1/withdraw/',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: {amount: amount, currency: currency},
    })
    if (response.data.result.success) {
        if (response.data.result.data) {
            let currentTime = DateTime.local().setZone("Europe/Moscow").toISO();
            await new PaymentsLog({method: "non-cash", operationId: response.data.result.data.id, currency: user.currency, amount: +req.body.amount, type: "down", userId: user.idUser,  status: "pending", dateTime: currentTime}).save();
            return res.send(response.data.result)
        } else return res.send(response.data.result)
    } else return res.send({success: false, message: 'Error'})

});

module.exports = router;