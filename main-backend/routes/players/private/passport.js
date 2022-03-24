const express = require('express');
const router = express.Router();

const jwt = require('../../../modules/jwt.js');

const Players = require('../../../models/Players.js');

router.get('/players/passport', async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token)  || (token.role !== "user")) return res.send({success: false, message: 'Incorrect token'});
	let player = await Players.findOne({idUser : token.id});
	if (!player) return res.send({success: false, message: "такого пользователя не существует"});

	return res.send({
		success: true,
		passportStatus: player.passportStatus,
		name: (!player.passport.name) ? null : player.passport.name, 
		surname: (!player.passport.surname) ? null : player.passport.surname, 
		patronymic: (!player.passport.patronymic) ? null : player.passport.patronymic, 
		dateBirth: (!player.passport.dateBirth) ? null : player.passport.dateBirth, 
		number: (!player.passport.number) ? null : player.passport.number, 
	})	
});

module.exports = router;
