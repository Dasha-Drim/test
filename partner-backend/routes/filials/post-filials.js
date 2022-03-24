const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt.js');

const Filials = require('../../models/Filials.js');
const Admins = require('../../models/Admins.js');

router.post('/filials', async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token || (token.role !== 'admin')) && (!token || (token.role !== 'franchisee'))) return res.send({success: false, message: 'Incorrect token'});
	if(!req.body.name) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены'});
	
	let franchisee = (token.role === 'admin') ? await Admins.findOne({idAdmin: req.body.id}) : await Admins.findOne({idAdmin: token.id});

	let allFilials = await Filials.find();
	let id = allFilials.length ? allFilials[allFilials.length - 1].idFilial + 1 : 1;
	let filial = {idFilial: id, name: req.body.name, managers: [], operators: [], history: [], franchisee: franchisee.idAdmin, currency: franchisee.currency || null};
	await new Filials(filial).save();

	return res.send({success: true});
});

module.exports = router;