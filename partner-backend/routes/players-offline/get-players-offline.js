const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

const Players = require('../../models/Players.js');

router.get('/players-offline', async (req, res) => {
	
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if (!token || (token.role !== "operator")) return res.send({success: false, message: 'Incorrect token'});

	let strSearch = req.query.search ? req.query.search : null;
	let regSearch = strSearch ? new RegExp(strSearch) : null;

	let allUsers = [];

	let players = (regSearch) ? await Players.find({phone : regSearch, inFilial: true}) : await Players.find({inFilial: true});
	for (player of players) {
		let user = {
			code: player.password,
			id: player.idUser,
			phone: player.phone,
			active: player.active
		};
		allUsers.push(user);
	}
	return res.send({success: true, users: allUsers})
});

module.exports = router;