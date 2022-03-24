const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

const Admins = require('../../models/Admins.js');
const Filials = require('../../models/Filials.js');

router.get('/managers',  async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token || (token.role !== 'admin')) && (!token || (token.role !== 'franchisee'))) return res.send({success: false, message: 'Incorrect token'});

	let arrManagers = [];

	if (req.query.idFranchisee) {
		//let filial = await Filials.findOne({idFilial: req.query.filialId});
		let managers = await Admins.find({franchisee: req.query.idFranchisee, level: 1});
		for (manager of managers) {
			arrManagers.push({label: manager.fio, value: manager.idAdmin});
		}
		return res.send({success: true, managers: arrManagers});
	} else return res.send({success: false, message: "не все двнные"});
});

module.exports = router;