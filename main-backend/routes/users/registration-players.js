const express = require('express');
const router = express.Router();

const Players = require('../../models/Players.js');
const passport = require('../../modules/passport.js')
const jwt = require('../../modules/jwt.js')

router.post('/registration/players', async (req, res) => {
	console.log("/registration/players");
	console.log("req.body", req.body)
	if (req.body.phone && req.body.password) {
		if (!req.body.phone.match(/^(\+)(\d{11})$/)) return res.send({success: false, message: 'Incorrect phone'});
		if (!req.body.currency) return res.send({success: false, message: "вы не укаали валюту"});
		passport.authenticate('registration-phone', {session: false}, async (err, user, info) => {
			if (!user) return res.send({success: false, message: info.message});
			res.cookie('login', 'phone');
			res.cookie('phone', req.body.phone);
			jwt.issueJWT(user.idUser, res, req.headers["user-agent"], 'vizitor');
			await Players.updateOne({idUser : user.idUser}, {$set: {currency: req.body.currency}}, {upsert: false});
			return res.send({success: true});
		})(req, res);
	} else if (req.body.mail && req.body.password) {
		if (!req.body.currency) return res.send({success: false, message: "вы не укаали валюту"});
		passport.authenticate('registration-mail', {session: false}, async (err, user, info) => {
			if (!user) return res.send({success: false, message: info.message});
			res.cookie('login', 'mail');
			res.cookie('mail', req.body.mail);
			jwt.issueJWT(user.idUser, res, req.headers["user-agent"], 'vizitor');
			await Players.updateOne({idUser : user.idUser}, {$set: {currency: req.body.currency}}, {upsert: false});
			return res.send({success: true});
		})(req, res);
	} else if (req.body.code) {
		let user = req.cookies.login === 'phone' ? await Players.findOne({phone: req.cookies.phone}) : req.cookies.login === 'mail' ? await Players.findOne({mail: req.cookies.mail}) : null;
		console.log("user", user)
		if (!user) return res.send("error");
		if (user.code !== req.body.code) return res.send({success: false, message: 'Incorrect code'});
		else {
			jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"], 'user');
			await Players.updateOne({idUser : user.idUser}, {$set: {phoneConfirm: true}}, {upsert: false});
			return res.send({success: true})
		}
	} else {
		return res.send('недостаточно данных')
	}
});

module.exports = router;