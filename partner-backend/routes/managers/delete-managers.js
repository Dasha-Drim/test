const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

const Admins = require('../../models/Admins.js');
const Filials = require('../../models/Filials.js');

router.delete('/managers', async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token || (token.role !== 'admin')) && (!token || (token.role !== 'franchisee'))) return res.send({success: false, message: 'Incorrect token'});

	if(!req.body.id) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены'});

	let filials = Filials.find({managers: req.body.id});

	if (filials.length) {
		for (filial of filials) {
			let arrManagers = [];
			for (manager of filial.managers) {
				if (manager !== req.body.id) arrManagers.push(manager);
			}
			await Filials.updateOne({idFilial: filial.idFilial}, {$set: {managers: arrManagers}}, {upsert: false});
		}
	}
	
	await Admins.deleteOne({idAdmin: req.body.id});
	return res.send({success: true});
});

module.exports = router;