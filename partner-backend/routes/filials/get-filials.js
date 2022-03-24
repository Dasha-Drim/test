const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt.js');

const Filials = require('../../models/Filials.js');
const OperatorsLog = require('../../models/OperatorsLog.js');

router.get('/filials', async (req, res) => {
  let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
  if ((!token || (token.role !== 'admin')) && (!token || (token.role !== 'franchisee'))) return res.send({success: false, message: 'Incorrect token'});
  let arrFilials = [];
  let filials = await Filials.find({franchisee: req.query.franchisee});
  for (filial of filials) {
  	for (operator of filial.operators) {
  		let operations = await OperatorsLog.find({operatorId: operator});
  		console.log("operations", operations);
  		let deposit = 0;
		let withdraw = 0;
		if(operation.type === "up" && operation.method !== "correction" && operation.method !== "bonus") deposit += operation.amount;
		if(operation.type === "down" && operation.method !== "correction") withdraw += operation.amount;
		let profit = deposit - withdraw;
  	}
    arrFilials.push({name: filial.name, id: filial.idFilial, deposits: deposit, withdraws: withdraw, profit: profit});
  }
  return res.send({success: true, filials: arrFilials});
})
module.exports = router;
