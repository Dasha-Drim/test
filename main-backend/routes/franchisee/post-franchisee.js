const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const jwt = require('../../modules/jwt.js');

const Admins = require('../../models/Admins.js');

randomString = (i) => {
	let rnd = '';
	while (rnd.length < i) rnd += Math.random().toString(9).substring(2);
	return rnd.substring(0, i);
};

router.post('/franchisee', async (req, res) => {
	console.log("post-franchisee");

	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token) || (token.role !== "admin")) return res.send({success: false, message: 'Incorrect token'});

	if ((!req.body.fio) || (!req.body.percent)) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены'});
	if (!req.body.currency) return res.send({success: false, message: "вы не укаали валюту"});

	console.log('add-franchisee', req.body.fio);
	let login = "login_f_" + randomString(5).replace( /'/g, "" );
	let password = randomString(10);
	let salt = crypto.randomBytes(32).toString('hex');
	let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
	let franchisee = await Admins.find();
	let idFranchisee = franchisee[franchisee.length-1].idAdmin ? franchisee[franchisee.length-1].idAdmin + 1 : 1;

	let newFranchisee = await new Admins({idAdmin: idFranchisee, fio: req.body.fio, login: login, password: hash, salt: salt, level: 3, percent: req.body.percent, currency: req.body.currency}).save();

	return res.send({ success: true, login: login, password: password });
});

module.exports = router;