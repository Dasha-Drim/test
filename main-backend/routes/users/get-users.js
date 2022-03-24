// get user role
const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

const Players = require('../../models/Players.js');

router.get('/users', async (req, res) => {
	console.log("get-users");
	if (!req.cookies.token) return res.send({success: true, role: 'vizitor'});
  	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
  	if (!token) return res.send({success: true, role: 'vizitor'});
  	if (token.role == 'user') {
  		await Players.updateOne({idUser: token.id}, {$set: {online: true}}, {upsert: false});
  		return res.send({success: true, role: 'user'});
  	}
  	if (token.role == 'user-offline') {
  		await Players.updateOne({idUser: token.id}, {$set: {online: true}}, {upsert: false});
  		return res.send({success: true, role: 'user', offline: true});
  	}
  	else if (token.role == 'admin') return res.send({success: true, role: 'admin'});
  	else return res.send({success: true, role: 'vizitor'});
});

module.exports = router;