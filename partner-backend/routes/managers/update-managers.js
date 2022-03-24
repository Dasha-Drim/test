const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

let MoveFromFilial = require('./modules/move-from-filial')
let AddToFilial = require('./modules/add-to-filial')

router.put('/managers', async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token || (token.role !== 'admin')) && (!token || (token.role !== 'franchisee'))) return res.send({success: false, message: 'Incorrect token'});
	if(!req.body.managerId || !req.body.filialId) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены'});
	if (req.body.action == "add") {
		let result = await AddToFilial(req.body.filialId, req.body.managerId);
		return res.send(result);
	}
	if (req.body.action == "move") {
		let result = await MoveFromFilial(req.body.filialId, req.body.managerId);
		return res.send(result);
	}
	return res.send({success: false, message: "Отправьте корректое поле action (move or add)"});
});

module.exports = router;