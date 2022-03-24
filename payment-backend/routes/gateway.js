let Payment = require("../models/Payments");
let interkassa = require("./methods/interkassa");
let paykassaPro = require("./methods/paykassaPro");
const { v4: uuidv4 } = require('uuid');
const {DateTime} = require('luxon');

let methods = [paykassaPro];

let createNewPayment = async (data) => {
	let newPayment = new Payment.model(data);
	try {
		let savePayment = await newPayment.save();
		return savePayment;
	} catch (err) {
		console.log("err", err);
		return {success: false, message: 'Не удалось создать платёж'};
	}
}
let updatePayment = async (id, data) => {
	try {
		await Payment.model.updateOne({id: id}, {$set: data}, {upsert: false})
	} catch (err) {
		console.log("err", err);
		return {success: false, message: 'Не удалось обновить информацию о платёже'};
	}
}
let getPayment = async (id) => {
	let payment = await Payment.model.findOne({id: id});
	return payment;
}
let getPayments = async (limit, findInfo, date) => {
	let paymentsArr = [];

	if (date.dateFrom || date.dateTo) findInfo["created_at"] = {};
	if (date.dateFrom) findInfo["created_at"].$gt = date.dateFrom;
	if (date.dateTo) findInfo["created_at"].$lt = date.dateTo;

	let payments = (date.dateFrom || date.dateTo) 
	? await Payment.model.find(findInfo).sort({ $natural: -1 }) 
	: await Payment.model.find(findInfo).sort({ $natural: -1 }).limit(limit);

	paymentsArr = payments;
	return paymentsArr;
}


let postWithdraw = async (req, res) => {
	console.log("req.body", req.body)
	if (!req.body.method)  {
		// fill methods
		let arrMethods = [];
		for (const method of methods) {
			let info = await method.withdrawApplicationMethod(req.body.amount);
			if (info) {
				let isArray = Array.isArray(info);
				console.log("isArray", isArray)
				if (isArray) {
					console.log("Array");
					arrMethods = arrMethods.concat(info);
				} else arrMethods.push(info);
			}
		}

		return {success: true, payment: {amount: {value: req.body.amount}}, methods: arrMethods};
	} else {
		let id = uuidv4();
		let paymentData = {
			id: id,
			status: "pending",
			paid: false,
			"amount": {
	          "value": req.body.method.data.amount,
	          "currency": req.body.currency
	        },
	        "confirmation": {
	          "type": "redirect",
	          "return_url": "https://dev.unicreate.ru:7975"
	        },
	        "description": "Заказ №1",
			"type": "withdraw" // deposit or withdraw
		}

		// add payment to db
		let payment = await createNewPayment(paymentData);
		console.log("withdrawApplication222")
		for (const method of methods) {
			if (req.body.method.name === method.config.name) {
				let data = req.body.method.data ? req.body.method.data : null;
				console.log("datadatadatadatadata", data)
				let withdrawApplication = await method.createWithdrawApplication(id, data);
				updatePayment(id, {payment_method: withdrawApplication})
				withdrawApplication.amount = req.body.method.data.amount;
				console.log("withdrawApplication", withdrawApplication)
				return {success: true, data: withdrawApplication};
			}
		}
	}
}

let withdrawСonfirmation = async (req, res) => {
	let payment = await getPayment(req.body.payment_id);
	console.log("paymentpaymentpayment222", payment)
	for (const method of methods) {
		if (payment.payment_method.type === method.config.name) {
			let data = payment.payment_method;
			let withdraw = await method.withdraw(data);
			if (withdraw.success) {
				console.log("data", data);
				await updatePayment(data.id, {status: "succeeded"});
				return {success: true};
			} else {
				return {success: false};
			}
			// сделать обновление статуса платежа
			//updatePayment(data.payment_id, {payment_method: withdrawApplication})
			
		}
	}
}

let withdrawUnconfirmation = async (req, res) => {
	await updatePayment(req.body.payment_id, {status: "canceled"});
	return {success: true};
}

// req.body.method.data.amount
// req.body.method.data.payment_id
// req.body.method.data.currency
// req.body.method.data.wallet
// req.body.method.data.card
// req.body.method.data.phone



let postCreateNewPayment = async (req, res) => {
	let id = uuidv4();
	let paymentData = {
		id: id,
		status: "pending",
		paid: false,
		"amount": {
          "value": req.body.amount,
          "currency": req.body.currency
        },
        "confirmation": {
          "type": "redirect",
          "return_url": "https://lotolive.org"
        },
        "description": "Заказ №1",
		"type": "deposit", // deposit or withdraw
		"user": req.body.user,
	}

	// add payment to db
	let payment = await createNewPayment(paymentData);

	// fill methods
	let arrMethods = [];
	for (const method of methods) {
		let info = await method.getWayToPay(payment);
		if (info) {
			let isArray = Array.isArray(info);
			console.log("isArray", isArray)
			if (isArray) {
				console.log("Array");
				arrMethods = arrMethods.concat(info);
			} else arrMethods.push(info);
		}
	}

	let timerId = setTimeout(async () => {
		let currentPayment = await Payment.model.findOne({id: id});
		if ((currentPayment.type === "deposit") && (currentPayment.status === "pending")) {
			await Payment.model.deleteOne({id: id});
			return;
		}
	}, 1800000); // 30 минут

	return {success: true, payment: payment, methods: arrMethods};
}


let getListPayments = async (req, res) => {
	let limit = "";
	let findInfo = {};
	let date = {};
	console.log("req.body", req.body)
	console.log("req.query", req.query)
	console.log("req.params", req.params)

	/*
	"id": "fzdvdd",
  "paymentType": "",
  "paymentStatus": "",
  "paymentMethod": "",
  "dateFrom": "",
  "dateTo": ""
	*/

	/*
	
{ "_id" : ObjectId("61c9cc06edc22035d4e4abc0"), 
"id" : "7c9584ad-cdc2-45a1-a3ce-a8bb3a7e69a4", 
"status" : "pending", 
"paid" : false,
 "amount" : { "value" : "100.00", "currency" : "RUB" }, 
 "confirmation" : { "type" : "redirect", "return_url" : "https://www.merchant-website.com/return_url" }, 
 "description" : "Заказ №1", 
 "type" : "deposit", 
 "created_at" : ISODate("2021-12-27T14:21:58.512Z"), "__v" : 0 }

	*/

	if (req.query.limit) limit = req.query.limit;
	if (req.query.id && req.query.id !== "") {
		let regSearch = new RegExp(req.query.id);
		findInfo.id = regSearch;
	}
	if (req.query.paymentType && req.query.paymentType !== "") findInfo.type = req.query.paymentType;
	if (req.query.paymentStatus && req.query.paymentStatus !== "") findInfo.status = req.query.paymentStatus;
	if (req.query.paymentMethod && req.query.paymentMethod !== "") {
		findInfo["payment_method"] = {};
		findInfo["payment_method"].type = req.query.paymentMethod;
	}

	if (req.query.dateFrom && req.query.dateFrom !== "") date.dateFrom = req.query.dateFrom;
	if (req.query.dateTo && req.query.dateTo !== "") date.dateTo = req.query.dateTo;

	//if (req.query.findInfo) findInfo = JSON.parse(req.query.findInfo);

	let payments = await getPayments(+limit, findInfo, date);
	return {type: "list", items: payments};
}

let getInfoPayment = async (req, res) => {
	let payment = await getPayment(req.params.payment_id);
	console.log("payment", payment)
	return {payment: payment};
}

let getMetods = async (req, res) => {
	let methodsArr = [];
	for (const method of methods) {
		let info = await method.getInfoAboutMethod();
		let isArray = Array.isArray(info);
		if (isArray) {
			console.log("Array");
			methodsArr = methodsArr.concat(info);
		} else methodsArr.push(info);
	}
	// добавть сюда информацию для графика
	return {methods: methodsArr};
}


module.exports.postCreateNewPayment = postCreateNewPayment;
module.exports.getListPayments = getListPayments;
module.exports.getInfoPayment = getInfoPayment;
module.exports.getMetods = getMetods;
module.exports.postWithdraw = postWithdraw;
module.exports.withdrawСonfirmation = withdrawСonfirmation;
module.exports.withdrawUnconfirmation = withdrawUnconfirmation;




/*
let paymentData = {
		id: id,
		status: "pending",
		paid: false,
		"amount": {
          "value": "100.00",
          "currency": "RUB"
        },
        "confirmation": {
          "type": "redirect",
          "return_url": "https://www.merchant-website.com/return_url"
        },
        "description": "Заказ №1",
		"type": "deposit" // deposit or withdraw
	}
	*/