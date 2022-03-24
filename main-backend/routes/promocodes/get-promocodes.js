const express = require('express');
const router = express.Router();

const { DateTime } = require("luxon");

const Promocodes = require('../../models/Promocodes.js');

router.get('/promocodes', async (req, res) => {
	console.log("get-promocodes");

	/*let id = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if (!id) return res.send({success: false, message: 'Incorrect token'});*/

	let arrPromocodes = [];
	let promocodes = await Promocodes.find();
	console.log("promocodes", promocodes);
	for (promocode of promocodes) {
		arrPromocodes.push({
          	promocode: promocode.promocode,
          	price: promocode.price ? promocode.price : null,
          	dateEnd: promocode.dateEnd ? DateTime.fromISO(promocode.dateEnd).toFormat('dd.LL.yyyy') : null,
          	count: promocode.count,
          	id: promocode._id,
        })
	}
	return res.send({success: true, promocodes: arrPromocodes});
	
});

module.exports = router;