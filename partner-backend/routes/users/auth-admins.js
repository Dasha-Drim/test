const express = require('express');
const router = express.Router();

const passport = require('../../modules/passport.js')
const jwt = require('../../modules/jwt.js')

const Admins = require('../../models/Admins.js')

router.post('/auth/admins', async (req, res, next) => {
	passport.authenticate('login-admin', {session: false }, function(err, user, info) {
		if (!user) return res.send({success: false, message: 'Incorrect data'});
		if (user.level == 1) {
			jwt.issueJWT(user.idAdmin, res, req.headers["user-agent"], 'manager');
			return res.send({success: true, role: "manager"});
		}
		if (user.level == 2) {
			jwt.issueJWT(user.idAdmin, res, req.headers["user-agent"], 'operator');
			return res.send({success: true, role: "operator"});
		}
		if (user.level == 3) {
			jwt.issueJWT(user.idAdmin, res, req.headers["user-agent"], 'franchisee');
			return res.send({success: true, role: "franchisee"});
		}
		if (user.level == 0) {
			return res.send({success: false, role: "admin"});
		}
	})(req, res, next);
});

module.exports = router;