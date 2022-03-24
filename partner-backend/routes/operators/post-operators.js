const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');
const { translit } = require('gost-transliteration');
const crypto = require('crypto');

const Admins = require('../../models/Admins.js');
const Filials = require('../../models/Filials.js');

function randomString(i) {
	let rnd = '';
	while (rnd.length < i) rnd += Math.random().toString(9).substring(2);
	return rnd.substring(0, i);
};

router.post('/operators', async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token || (token.role !== 'admin' && token.role !== 'manager' && token.role !== 'franchisee')) && (!token || (token.role !== 'franchisee'))) return res.send({success: false, message: 'Incorrect token'});

	if(!req.body.fio || !req.body.filialId) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены'});

	let array = req.body.fio.split(' ');
	let login = translit(array[0]) + '_' + randomString(7).replace( /'/g, "" );
	let password = randomString(10);
	let salt = crypto.randomBytes(32).toString('hex');
	let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

	let admins = await Admins.find();
	let idAdmin = admins[admins.length-1].idAdmin ? admins[admins.length-1].idAdmin + 1 : 1;

	let filial = await Filials.findOne({idFilial: req.body.filialId});
	await new Admins({idAdmin: idAdmin, filials: [filial.idFilial], fio: req.body.fio, login: login, password: hash, salt: salt, currency: filial.currency, level: 2, franchisee: filial.franchisee ? filial.franchisee : null}).save();

	await Filials.updateOne({idFilial: req.body.filialId}, {$addToSet: {operators: idAdmin}}, {upsert: false});
	res.send({success: true, login: login, password: password});
});

module.exports = router;