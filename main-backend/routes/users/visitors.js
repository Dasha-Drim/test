const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt.js');

const Visitors = require('../../models/Visitors.js');

router.post('/visitors', async (req, res) => {
	console.log("visitor!", req.body.new);
	if (req.body.new) await Visitors({city: req.body.city, country: req.body.country, new: true}).save();
	else await Visitors({new: false}).save();
  	return res.send(true);
});

module.exports = router;