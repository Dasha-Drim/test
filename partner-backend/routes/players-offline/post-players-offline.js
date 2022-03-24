const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

const Admins = require('../../models/Admins.js');
const Players = require('../../models/Players.js');

router.post('/players-offline', async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token || (token.role !== 'operator'))) return res.send({success: false, message: 'Incorrect token'});

	if(!req.body.phone) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены'});
	if(!req.body.filialId) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены'});

	let player = await Players.findOne({phone: req.body.phone, inFilial: true});
	if (player) return res.send({success: false, message: "Такой пользователь уже есть, воспользуйтесь поиском"});

	let playersOffline = await Players.find();
	let idUser = playersOffline[playersOffline.length-1].idUser ? playersOffline[playersOffline.length-1].idUser + 1 : 1;

	let admin = await Admins.findOne({idAdmin: token.id});
	await new Players({idUser: idUser, idFilial: req.body.filialId, phone: req.body.phone, currency: admin.currency, balance: 0, status: true, passportStatus: false, inFilial: true}).save();

	res.send({success: true, id: idUser});
});

module.exports = router;