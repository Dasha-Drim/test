const express = require('express');
const router = express.Router();

const jwt = require('../../../modules/jwt.js');

const Players = require('../../../models/Players.js');

router.get('/players/balance', async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if (((!token)  || (token.role !== "user")) && ((!token)  || (token.role !== 'user-offline'))) return res.send({success: false, message: 'Incorrect token'});
	let player = await Players.findOne({idUser : token.id});
	if (!player) return res.send({success: false, message: "такого пользователя не существует"});
	return res.send({success: true, balance: player.balance + +(player.bonus ? +player.bonus : 0), currency: player.currency})	
});

module.exports = router;