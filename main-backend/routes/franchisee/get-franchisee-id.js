const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt.js');

const Admins = require('../../models/Admins.js');
const Filials = require('../../models/Filials.js');
const OperatorsLog = require('../../models/OperatorsLog.js');

router.get('/franchisee/:id([0-9]+)', async (req, res) => {
	console.log("get-franchisee-id");
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	let managersArr = [];
	let operatorsArr = [];
	let arrFilials = [];
	if ((!token || (token.role !== "admin")) && (!token || (token.role !== "franchisee")) && (!token || (token.role !== "manager"))) return res.send({success: false, message: 'Incorrect token'});
	
	
	if (token.role === "manager") {
		let filials = await Filials.find({managers: token.id});
		let manager = await Admins.findOne({idAdmin: token.id});
		let franchisee  = await Admins.findOne({idAdmin: manager.franchisee});
		if (filials.length) {
			for (filial of filials) {
				for (operator of filial.operators) {
					let infoOperator = await Admins.findOne({idAdmin: operator});
					let item = {
						fio: infoOperator.fio, 
						filial: filial.name,
						id: infoOperator.idAdmin,
					}
					operatorsArr.push(item);
				}
			}
		}
		return res.send({success: true, id: franchisee.idAdmin, fio: franchisee.fio, filials: filials, operators: operatorsArr});

	} else {
		console.log("token", token)
		let franchisee = (token.role === "franchisee") ? await Admins.findOne({idAdmin: +token.id, level: 3}) : await Admins.findOne({idAdmin: +req.params.id, level: 3});
		let filials = await Filials.find({franchisee: franchisee.idAdmin});
		if (filials.length) {
			for (filial of filials) {
				for (operator of filial.operators) {
					let infoOperator = await Admins.findOne({idAdmin: operator});
					let item = {
						fio: infoOperator.fio, 
						filial: filial.name,
						id: infoOperator.idAdmin,
					}
					operatorsArr.push(item);
				}
			}

			for (filial of filials) {
				let deposit = 0;
				let withdraw = 0;
				let profit = 0;
				for (operator of filial.operators) {
					let operations = await OperatorsLog.find({operatorId: operator});
					for (operation of operations) {
						if(operation.type === "up" && operation.method !== "correction" && operation.method !== "bonus") deposit += operation.amount;
						if(operation.type === "down" && operation.method !== "correction") withdraw += operation.amount;
					}
					profit = deposit - withdraw;
				}
				arrFilials.push({name: filial.name, idFilial: filial.idFilial, deposits: deposit, withdraws: withdraw, profit: profit});
			}
		}

		let managers = await Admins.find({franchisee: franchisee.idAdmin, level: 1});
		if (managers.length) {
			for (manager of managers) {
				let filialsArr = [];
				if (manager.filials.length) {
					for (filial of manager.filials) {
						let filialInfo = await Filials.findOne({idFilial: filial});
						filialsArr.push(filialInfo.name);
					}
				}
				managersArr.push({fio: manager.fio, idAdmin: manager.idAdmin, filials: filialsArr});
			}
		}
		return res.send({success: true, id: franchisee.idAdmin, fio: franchisee.fio, currency: franchisee.currency, percent: franchisee.percent, filials: arrFilials, operators: operatorsArr, managers: managersArr});
	}
});

module.exports = router;