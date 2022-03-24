const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt.js');

const Filials = require('../../models/Filials.js');
const Admins = require('../../models/Admins.js');

router.delete('/filials', async (req, res) => {
	let id = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!id || (id.role !== 'admin')) && (!id || (id.role !== 'franchisee'))) return res.send({success: false, message: 'Incorrect token'});
	if(!req.body.id) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены'});

	let filial = await Filials.findOne({idFilial: req.body.id});

  	for (operator of filial.operators) {
  		await Admins.deleteOne({idAdmin: operator});
  	}
  	for (manager of filial.managers) {
  		let filials = [];
  		let managerInfo = await Admins.findOne({idAdmin: manager});
  		for (filial of managerInfo.filials) {
  			if (req.body.id !== filial) filials.push(filial);
  		}
  		await Admins.updateOne({idAdmin: manager}, {$set: {filials: filials}}, {upsert: false})
  	}

  	await Filials.deleteOne({idFilial: req.body.id});
  	return res.send({success: true});
});

module.exports = router;