const express = require('express');
const router = express.Router();

const passport = require('../../modules/passport.js')
const jwt = require('../../modules/jwt.js')

router.post('/auth/players', async (req, res) => {
	console.log("/auth/players");
	if (req.body.login) {
		passport.authenticate('login', {session: false }, async (err, user, info) => {
		if (info.code == 55) {
			console.log('login user', user);
			jwt.issueJWT(user.idUser, res, req.headers["user-agent"], 'user');
			return res.send({success: true});
		} else {
			if (err) return res.send({success: false, message: err});
			if ((info.code == 0) || (info.code == 1)) return res.send({success: false, message: info.message });
			return res.send({success: false, message: 'error' })
		}
		})(req, res);
	}
	if (req.body.code) {
		passport.authenticate('login-code', {session: false }, async (err, user, info) => {
		if (info.code == 55) {
			console.log('login user', user);
			jwt.issueJWT(user.idUser, res, req.headers["user-agent"], 'user-offline');
			return res.send({success: true});
		} else {
			if (err) return res.send({success: false, message: err});
			if ((info.code === 0)) return res.send({success: false, message: info.message });
			return res.send({success: false, message: 'error' })
		}
		})(req, res);
	}
});

module.exports = router;