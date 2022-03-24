const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt.js');

const Admins = require('../../models/Admins.js');
const Filials = require('../../models/Filials.js');

router.delete('/franchisee', async (req, res) => {
	console.log("delete-franchisee");
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if (!token && token.role !== "admin") return res.send({success: false, message: 'Incorrect token'});

	let filials = await Filials.find({franchisee: +req.body.id});
	for (filial of filials) {
		for (manager of filial.managers) {
			console.log("manager", manager);
			await Admins.deleteOne({idAdmin: manager});
			console.log("manager delete!");
		}
		for (operator of filial.managers) {
			console.log("operator", operator);
			await Admins.deleteOne({idAdmin: operator});
			console.log("operator delete!");
		}
		await Filials.deleteOne({_id: filial._id});
	}

	await Admins.deleteOne({idAdmin: +req.body.id, level: 3});
  	return res.send({success: true});
});

module.exports = router;