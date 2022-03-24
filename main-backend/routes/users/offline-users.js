const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt.js');

const Players = require('../../models/Players.js');

router.post('/users/offline', async (req, res) => {
	console.log("user offline!");
	if (!req.cookies.token) return res.send(true);
  	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
  	if (!token) return res.send(true);
  	if (token.role == 'user') {
  		await Players.updateOne({idUser: token.id}, {$set: {online: false}}, {upsert: false});
  		return res.send(true);
  	}
  	return res.send(true);
});

module.exports = router;