const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

const Admins = require('../../models/Admins.js');
const Filials = require('../../models/Filials.js');

router.delete('/operators', async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token || (token.role !== 'admin')) && (!token || (token.role !== 'franchisee')) && (!token || (token.role !== 'manager'))) return res.send({success: false, message: 'Incorrect token'});

	if(!req.body.id) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены'});

	console.log("req.body.id", req.body.id)
	let filial = await Filials.findOne({operators: req.body.id});

	console.log("filial", filial)

	let arrOperators = [];
	for (operator of filial.operators) {
		if (operator !== req.body.id) arrOperators.push(operator);
	}
	await Filials.updateOne({idFilial: filial.idFilial}, {$set: {operators: arrOperators}}, {upsert: false});

	await Admins.deleteOne({idAdmin: req.body.id});
	return res.send({success: true});
});

module.exports = router;