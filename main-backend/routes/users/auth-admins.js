const express = require('express');
const router = express.Router();

const passport = require('../../modules/passport.js')
const jwt = require('../../modules/jwt.js')

router.post('/auth/admins', async (req, res) => {
	passport.authenticate('login-admin', {session: false }, function(err, user, info) {
		console.log("user", user)
		if (!user) return res.send({success: false, message: 'Incorrect data'});
		jwt.issueJWT(user.idAdmin, res, req.headers["user-agent"], 'admin');
		return res.send({success: true});
	})(req, res);
});

module.exports = router;