const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');
const {DateTime} = require('luxon');
const axios = require('axios');

router.get('/statistic', async (req, res, next) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if (!token || (token.role !== 'admin')) return res.send({success: false, message: 'Incorrect token'});
	let response = await axios({
        method: "get",
        url: 'https://dev.unicreate.ru:3003/v1/payments/',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        params: { findInfo: {"created_at": {$gte: req.query.dateStart, $lt: req.query.dateEnd}, status: "succeeded"}}
    });

    let dates = [];
    let amountArrayDeposite = [];
    let countArrayDeposite = [];
    let amountArrayWithdraw = [];
    let countArrayWithdraw = [];

    if (req.query.range === "week") {
        for (let i = 0; i < 8; i++) {
            amountArrayDeposite[i] = 0;
            countArrayDeposite[i] = 0;
            amountArrayWithdraw[i] = 0;
            countArrayWithdraw[i] = 0;
            let date = DateTime.fromISO(req.query.dateStart).plus({days: i}).setLocale('ru').toFormat('dd.LL');
            dates.push(date);

            for (payment of response.data.items) {
                let datePayment = DateTime.fromISO(payment.created_at).setLocale('ru').toFormat('dd.LL');
                if (datePayment === DateTime.fromISO(req.query.dateStart).plus({days: i}).setLocale('ru').toFormat('dd.LL')) {
                    amountArrayDeposite[i] = (payment.type === "deposit" && payment.amount.value) ? amountArrayDeposite[i] + +payment.amount.value : amountArrayDeposite[i] + 0;
                    countArrayDeposite[i] = (payment.type === "deposit") ? countArrayDeposite[i] + 1 : countArrayDeposite[i] + 0;

                    amountArrayWithdraw[i] = (payment.type === "withdraw" && payment.amount.value) ? amountArrayWithdraw[i] + +payment.amount.value : amountArrayWithdraw[i] + 0;
                    countArrayWithdraw[i] = (payment.type === "withdraw") ? countArrayWithdraw[i] + 1 : countArrayWithdraw[i] + 0;
                }
            }
        }
        return res.send({success: true, dates: dates, payments: {amountArray: amountArrayDeposite, countArray: countArrayDeposite}, withdraws: {amountArray: amountArrayWithdraw, countArray: countArrayWithdraw}})
    }

    if (req.query.range === "month") {
        for (let i = 0; i < 32; i++) {
            amountArrayDeposite[i] = 0;
            countArrayDeposite[i] = 0;
            amountArrayWithdraw[i] = 0;
            countArrayWithdraw[i] = 0;
            let date = DateTime.fromISO(req.query.dateStart).plus({days: i}).setLocale('ru').toFormat('dd.LL');
            dates.push(date);
            for (payment of response.data.items) {
                let datePayment = DateTime.fromISO(payment.created_at).setLocale('ru').toFormat('dd.LL');
                if (datePayment === DateTime.fromISO(req.query.dateStart).plus({days: i}).setLocale('ru').toFormat('dd.LL')) {
                    amountArrayDeposite[i] = (payment.type === "deposit" && payment.amount.value) ? amountArrayDeposite[i] + +payment.amount.value : amountArrayDeposite[i] + 0;
                    countArrayDeposite[i] = (payment.type === "deposit") ? countArrayDeposite[i] + 1 : countArrayDeposite[i] + 0;

                    amountArrayWithdraw[i] = (payment.type === "withdraw" && payment.amount.value) ? amountArrayWithdraw[i] + +payment.amount.value : amountArrayWithdraw[i] + 0;
                    countArrayWithdraw[i] = (payment.type === "withdraw") ? countArrayWithdraw[i] + 1 : countArrayWithdraw[i] + 0;
                }
            }
        }
        
        

        return res.send({success: true, dates: dates, payments: {amountArray: amountArrayDeposite, countArray: countArrayDeposite}, withdraws: {amountArray: amountArrayWithdraw, countArray: countArrayWithdraw}})
    }

    if (req.query.range === "year") {
         for (let i = 0; i < 13; i++) {
            amountArrayDeposite[i] = 0;
            countArrayDeposite[i] = 0;
            amountArrayWithdraw[i] = 0;
            countArrayWithdraw[i] = 0;
            let date = DateTime.fromISO(req.query.dateStart).plus({month: i}).setLocale('ru').toFormat('LLLL yyyy');
            dates.push(date);

            for (payment of response.data.items) {
                let datePayment = DateTime.fromISO(payment.created_at).setLocale('ru').toFormat('LLLL yyyy');
                if (datePayment === DateTime.fromISO(req.query.dateStart).plus({month: i}).setLocale('ru').toFormat('LLLL yyyy')) {
                    amountArrayDeposite[i] = (payment.type === "deposit" && payment.amount.value) ? amountArrayDeposite[i] + +payment.amount.value : amountArrayDeposite[i] + 0;
                    countArrayDeposite[i] = (payment.type === "deposit") ? countArrayDeposite[i] + 1 : countArrayDeposite[i] + 0;

                    amountArrayWithdraw[i] = (payment.type === "withdraw" && payment.amount.value) ? amountArrayWithdraw[i] + +payment.amount.value : amountArrayWithdraw[i] + 0;
                    countArrayWithdraw[i] = (payment.type === "withdraw") ? countArrayWithdraw[i] + 1 : countArrayWithdraw[i] + 0;
                }
            }
        }
        return res.send({success: true, dates: dates, payments: {amountArray: amountArrayDeposite, countArray: countArrayDeposite}, withdraws: {amountArray: amountArrayWithdraw, countArray: countArrayWithdraw}})
    }
});

module.exports = router;