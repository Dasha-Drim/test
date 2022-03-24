const express = require('express');
const router = express.Router();

const {DateTime} = require('luxon');
var moment = require('moment');

const jwt = require('../../modules/jwt.js');

const Visitors = require('../../models/Visitors.js');

router.get('/statistic/visitors/new', async (req, res) => {
	console.log("statistic-visitors", req.query);
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token) || (token.role !== "admin")) return res.send({success: false, message: 'Incorrect token'});

	let date = null;

	if (req.query.period === "week") date = DateTime.now().minus({weeks: 1}).toISO();
	if (req.query.period === "month") date = DateTime.now().minus({months: 1}).toISO();
	if (req.query.period === "season") date = DateTime.now().minus({months: 3}).toISO();

	let visitors = !date ? await Visitors.find({new: true}) : await Visitors.find({new: true, date: {$gt : date}});

	let arrDate = {};
	let dateArr = [];
	let visitorsArr = [];
	let isDate = false;
	let dateObj = {};	

	if (req.query.period === "week") {
		dateObj = visitors.reduce((acc, el) => {
			acc[moment(el.date).locale('ru').format('DD.MM.YYYY')] = (acc[moment(el.date).locale('ru').format('DD.MM.YYYY')] || 0) + 1;
			return acc;
		}, {});
		for (let i = 0; i < 8; i++) dateArr.push(moment(DateTime.now().minus({days: i}).toISO()).locale('ru').format('DD.MM.YYYY'));
	}

	if (req.query.period === "month") {

		dateObj = visitors.reduce((acc, el) => {
			acc[moment(el.date).locale('ru').format('DD.MM.YYYY')] = (acc[moment(el.date).locale('ru').format('DD.MM.YYYY')] || 0) + 1;
			return acc;
		}, {});

		for (let i = 0; i < 31; i++) dateArr.push(moment(DateTime.now().minus({days: i}).toISO()).locale('ru').format('DD.MM.YYYY'))
	}

	if (req.query.period === "season") {
		dateObj = visitors.reduce((acc, el) => {
			acc[moment(el.date).locale('ru').format('MM.YYYY')] = (acc[moment(el.date).locale('ru').format('MM.YYYY')] || 0) + 1;
			return acc;
		}, {});
		for (let i = 0; i < 3; i++) dateArr.push(moment(DateTime.now().minus({months: i}).toISO()).locale('ru').format('MM.YYYY'))
	}

	if (req.query.period === "all") {
		dateObj = visitors.reduce((acc, el) => {
			acc[moment(el.date).locale('ru').format('YYYY')] = (acc[moment(el.date).locale('ru').format('YYYY')] || 0) + 1;
			return acc;
		}, {});
		for (let i = 0; i < 5; i++) dateArr.push(moment(DateTime.now().minus({years: i}).toISO()).locale('ru').format('YYYY'))
	}

	dateArr.reverse();

	console.log("dateArr", dateArr)
	console.log("dateObj", dateObj)

	let max = 0;

	for (item of dateArr) {
		for (key in dateObj) {
			if (item === key) {
				if (dateObj[key] > max) max = dateObj[key];
				visitorsArr.push({date: item, value: dateObj[key]});
				isDate = true
			}
		}
		if (!isDate) visitorsArr.push({date: item, value: 0});
		isDate = false;
	}

	console.log("visitorsArr", visitorsArr)
	console.log("dateArr", dateArr)

	return res.send({success: true, visitors: visitorsArr, max: max})
});

module.exports = router;