const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt.js');
const verify = require('../../modules/verify.js');
const { DateTime } = require("luxon");

const Promocodes = require('../../models/Promocodes.js');

router.post('/promocodes', async (req, res) => {
	console.log("post-promocodes");
	
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if (!token && token.role !== "admin") return res.send({success: false, message: 'Incorrect token'});
	
	if ((!req.body.promocode) || (!req.body.price)) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены'});
	let verifyPromocodeData = verify.verifyPromocode({promocode: req.body.promocode, price: req.body.price});
	if (verifyPromocodeData) return res.send({success: false, message: verifyPromocodeData});

	let newPromocodeObj = {promocode: req.body.promocode, price: req.body.price}

	if (req.body.dateEnd) {
		let arrDate = req.body.dateEnd.split("-");
		console.log("arrDate", arrDate)
		if ((DateTime.fromObject({ year: arrDate[0], month: arrDate[1], day: arrDate[2]}).isValid) && (DateTime.fromObject({ year: arrDate[0], month: arrDate[1], day: arrDate[2]})<DateTime.local())) return res.send({success: false, message: "Некорректная дата"});
		newPromocodeObj.dateEnd = DateTime.fromObject({ year: arrDate[0], month: arrDate[1], day: arrDate[2]}).toISO();
	}

	let promocode = await Promocodes.findOne({promocode: req.body.promocode});
	if (promocode) return res.send({success: false, message: "У вас уже есть промокод с таким названием"});
	let newPromocode = await new Promocodes(newPromocodeObj).save();
	return res.send({success: true})

});

module.exports = router;