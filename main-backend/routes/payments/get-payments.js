const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

const axios = require('axios');

router.get('/payments', async (req, res, next) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
    let params = req.query;
    params.limit = 20;
	if (!token || (token.role !== 'admin')) return res.send({success: false, message: 'Incorrect token'});
    try {
        let response = await axios({
            method: "get",
            url: 'https://dev.unicreate.ru:3003/v1/payments/',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            params: params,
        })
        return res.send(response.data);
    } catch (e) {
        return res.send({success: false});
    }
});

module.exports = router;