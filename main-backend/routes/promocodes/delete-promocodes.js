const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt.js');
const Promocodes = require('../../models/Promocodes.js');

router.delete('/promocodes', async (req, res) => {
	console.log("delete-promocodes");
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if (!token && token.role !== "admin") return res.send({success: false, message: 'Incorrect token'});

	await Promocodes.deleteOne({promocode: req.body.promocode});
  	return res.send({ success: true });
});

module.exports = router;