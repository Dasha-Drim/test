const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt.js');

const Admins = require('../../models/Admins.js');

router.get('/franchisee', async (req, res) => {
	console.log("get-franchisee");
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token) || (token.role !== "admin")) return res.send({success: false, message: 'Incorrect token'});

	let arrFranchisee = [];
	let franchisee = await Admins.find({level: 3});
	for (item of franchisee) {
		arrFranchisee.push({fio: item.fio, id: item.idAdmin, percent: item.percent, currency: item.currency})
	}
	return res.send({success: true, franchisee: arrFranchisee});
	
});

module.exports = router;