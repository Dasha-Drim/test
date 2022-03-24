let express = require('express');
let router = express.Router();
let gateway = require("./gateway")
//let config = require("../config/config")

/* POST create new payment */
router.post("/payments", async (req, res) => {
	//console.log("req", req);
	let result = await gateway.postCreateNewPayment(req, res);
	//console.log("resultresult", result)
  	return res.send({result: result});
});

/* POST create new payment withdraw */
router.post("/withdraw", async (req, res) => {
	let result = await gateway.postWithdraw(req, res);
  	return res.send({result: result});
});

/* POST create new payment withdraw */
router.post("/withdraw/confirmation", async (req, res) => {
	let result = await gateway.withdrawСonfirmation(req, res);
  	return res.send({result: result});
});

/* POST create new payment withdraw */
router.post("/withdraw/unconfirmation", async (req, res) => {
	let result = await gateway.withdrawUnconfirmation(req, res);
  	return res.send({result: result});
});

/* GET get list of payments */
router.get("/payments", async (req, res) => {
	let result = await gateway.getListPayments(req, res);
  	return res.send(result);
});

/* GET get info about payment */
router.get("/payments/:payment_id", async (req, res) => {
	let result = await gateway.getInfoPayment(req, res);
  	return res.send(result);
});

/* GET all connected payment methods */
router.get("/methods", async (req, res) => {
	let result = await gateway.getMetods(req, res);
  	return res.send(result);
});

module.exports = router;