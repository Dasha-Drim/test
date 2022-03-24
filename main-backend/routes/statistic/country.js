const express = require('express');
const router = express.Router();

const {DateTime} = require('luxon');

const jwt = require('../../modules/jwt.js');

const Visitors = require('../../models/Visitors.js');

router.get('/statistic/country', async (req, res) => {
	console.log("statistic-country", req.query);
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token) || (token.role !== "admin")) return res.send({success: false, message: 'Incorrect token'});

	let date = null;

	if (req.query.period === "week") date = DateTime.now().minus({weeks: 1}).toISO();
	if (req.query.period === "month") date = DateTime.now().minus({months: 1}).toISO();
	if (req.query.period === "season") date = DateTime.now().minus({months: 3}).toISO();

	let visitors = !date ? await Visitors.find({country: {$exists: true}}) : await Visitors.find({country: {$exists: true}, date: {$gt : date}});

	let country = visitors.reduce((acc, el) => {
		acc[el.country] = (acc[el.country] || 0) + 1;
		return acc;
	}, {});

	let countryArr = [];
	for (key in country) countryArr.push({country: key, value: country[key]});

	return res.send({success: true, country: countryArr})
});

module.exports = router;
