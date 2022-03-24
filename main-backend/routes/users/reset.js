const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const passport = require('../../modules/passport.js')
const jwt = require('../../modules/jwt.js')
const Players = require('../../models/Players.js')


router.post('/reset', async (req, res) => {
	console.log("/reset");
	if (req.body.login) {
		passport.authenticate('reset', {session: false }, async (err, user, info) => {
			if (user) {
				jwt.issueJWT(user.idUser, res, req.headers["user-agent"], 'user');
				return res.send({success: true});
			} else return res.send({success: false, message: info.message})
		})(req, res);
	}
	if (req.body.code) {
		let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"], 'user');
		if (!token && token !== "user") return res.send({success: false, message: "Incorrect token."});
		let user = await Players.findOne({idUser: token.id});
		if (user.code !== req.body.code) return res.send({success: false, message: "Incorrect code."});
		else return res.send({success: true})
	}
	if (req.body.password) {
		let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"], 'user');
		if (!token && token !== "user") return res.send({success: false, message: "Incorrect token."});
		let salt = crypto.randomBytes(32).toString('hex');
  		let hash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 64, 'sha512').toString('hex');
		await Players.updateOne({idUser: token.id}, {$set: {password: hash, salt: salt}}, {upsert: false});
		return res.send({success: true})
	}
});

module.exports = router;