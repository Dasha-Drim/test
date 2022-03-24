const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

const axios = require('axios');

router.get('/payments/:payment_id', async (req, res, next) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if (!token || (token.role !== 'admin')) return res.send({success: false, message: 'Incorrect token'});
	console.log("req.query", req.query);
	let response = await axios({
        method: "get",
        url: 'https://dev.unicreate.ru:3003/v1/payments/' + req.query.payment_id,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    return res.send(response)
});

module.exports = router;