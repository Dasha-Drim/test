const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt.js');

const Filials = require('../../models/Filials.js');
const Admins = require('../../models/Admins.js');
const Players = require('../../models/Players.js');

router.get('/filials/:id([0-9]+)', async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token || (token.role !== 'admin')) && (!token || (token.role !== 'franchisee')) && (!token || (token.role !== 'manager')) && (!token || (token.role !== 'operator'))) return res.send({success: false, message: 'Incorrect token'});
	
	if (token.role !== "operator") {
		let filial = await Filials.findOne({idFilial: req.params.id});
		let players = await Players.find({idFilial: req.params.id});
		let managers = await Admins.find({idAdmin: {$in: filial.managers}});
		let operators = await Admins.find({idAdmin: {$in: filial.operators}});

		let playersArr = [];
		let managersArr = [];
		let operatorsArr = [];

		let activePlayers = 0;
		if (players.length) {
			for (player of players) {
				let item = {
					code: player.password,
					id: player.idUser,
					phone: player.phone,
					active: player.active,
				};
				if (player.active) activePlayers++;
				playersArr.push(item);
			}
		}
		if (managers.length) {
			for (manager of managers) {
				let item = {
					fio: manager.fio,
					id: manager.idAdmin,
				};
				managersArr.push(item);
			}
		}
		if (operators.length) {
			for (operator of operators) {
				let item = {
					fio: operator.fio,
					id: operator.idAdmin,
				};
				operatorsArr.push(item);
			}
		}
		let object = {};
		object.statistics = [];
		object.name = filial.name;
		object.idFranchisee = filial.franchisee;
		object.idFilial = filial.idFilial;
		if (token.role !== 'manager') object.managers = managersArr;
		object.operators = operatorsArr;
		object.players = playersArr;
		object.statistics.push({name: "Игроков", value: playersArr.length});
		object.statistics.push({name: "Сейчас играют", value: activePlayers});
		object.statistics.push({name: "Управляющих", value: filial.managers.length});
		object.statistics.push({name: "Операторов", value: filial.operators.length});

		return res.send({success: true, filial: object});
	} else {
		let playersArr = [];
		let operator = await Admins.findOne({idAdmin: token.id});
		let filial = await Filials.findOne({idFilial: operator.filials[0]});
		let players = await Players.find({idFilial: operator.filials[0]});
		let object = {};

		if (players.length) {
			for (player of players) {
				let item = {
					code: player.password,
					id: player.idUser,
					phone: player.phone,
					active: player.active,
				};
				playersArr.push(item);
			}
		}

		object.idFilial = filial.idFilial;
		object.name = filial.name;
		object.players = playersArr;
		return res.send({success: true, filial: object});
	}
	
})
module.exports = router;