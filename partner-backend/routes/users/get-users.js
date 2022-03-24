// get user role
const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

router.get('/users', async (req, res) => {
	console.log("get-users");
	if (!req.cookies.token) return res.send({success: true, role: 'vizitor'});
  	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
  	if (!token) return res.send({success: true, role: 'vizitor'});
  	if (token.role == 'user') return res.send({success: true, role: 'user'});
  	else if (token.role == 'admin') return res.send({success: true, role: 'admin'});
  	else if (token.role == 'franchisee') return res.send({success: true, role: 'franchisee'});
  	else if (token.role == 'managers') return res.send({success: true, role: 'managers'});
  	else if (token.role == 'operators') return res.send({success: true, role: 'operators'});
  	else return res.send({success: true, role: 'vizitor'});
});

module.exports = router;