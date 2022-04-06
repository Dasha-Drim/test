const axios = require('axios');
const qs = require('qs');



let merchantID, merchantKey, APIID, APIKey;
if (!process.env.DEV) {
	merchantKey = "g2Nm6X2PLnjbnAbpar4vX8TvY7fbA6TM";
	merchantID = 13781;
	APIID = 14301;
	APIKey = "E6QehgI00SA1wWLhMlUQfwwCCVwkSfS3";
} else {
	merchantKey = "EMNmbDZFxShu6i2ODnXeEi1Jai60m79q";
 	merchantID = 14958;
 	APIID = 16193;
	APIKey = "kcM9XGsCOTHGp8PXXWClQtR2YQ1HKv0Z";
}


let config = {
	name: "paykassapro",
}

/*let arrSystems = [
{ value: 2, currency: "USD" },
{ value: 7, currency: "RUB" },
{ value: 11, currency: "BTC" },
{ value: 12, currency: "ETH" },
{ value: 14, currency: "LTC" },
{ value: 15, currency: "DOGE" },
{ value: 16, currency: "DASH" },
{ value: 18, currency: "BCH" },
{ value: 19, currency: "ZEC" },
{ value: 22, currency: "XRP" },
{ value: 27, currency: "TRX" },
{ value: 28, currency: "XLM" },
{ value: 29, currency: "BNB" },
{ value: 30, currency: "USDT" },
{ value: 31, currency: "ADA" },
{ value: 31, currency: "EOS" },
]


let arrSystemsWithdraw = [
{ value: 11, currency: "BTC", name: "bitcoin" },
{ value: 12, currency: "ETH", name: "ethereum" },
{ value: 14, currency: "LTC", name: "litecoin" },
{ value: 15, currency: "DOGE", name: "dogecoin" },
{ value: 16, currency: "DASH", name: "dash" },
{ value: 18, currency: "BCH", name: "bitcoincash" },
{ value: 19, currency: "ZEC", name: "zcash" },
]*/

let arrSystems = [
{ value: 2, currency: "USD" },
{ value: 11, currency: "BTC" },
{ value: 12, currency: "ETH" },
{ value: 14, currency: "LTC" },
{ value: 15, currency: "DOGE" },
{ value: 18, currency: "BCH" }
]


let arrSystemsWithdraw = [
{ value: 11, currency: "BTC", name: "bitcoin" },
{ value: 12, currency: "ETH", name: "ethereum" },
{ value: 14, currency: "LTC", name: "litecoin" },
{ value: 15, currency: "DOGE", name: "dogecoin" },
{ value: 18, currency: "BCH", name: "bitcoincash" },
]



let request = async (url, data) => {
	let response = await axios({
		method: "post",
		url: url,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: qs.stringify(data)
	})
	return response.data;
}

let getBalance = async () => {
	let url = "https://paykassa.app/api/0.5/index.php";
	let data = {
		func: "api_get_shop_balance",
		api_id: APIID,
		api_key: APIKey,
		shop: merchantID
	}
	let a = await request(url, data);
	return a;
}

let getCurrencyRateForPair = async (currencyIn, currencyOut) => {
	let url = "https://currency.paykassa.pro/index.php";
	let data = {
		currency_in: currencyIn,
		currency_out: currencyOut,
	}
	let a = await request(url, data);
	console.log("aaaaaaaaaaaaaaaaa", a)
	return a;
}


let sci_create_order = async (amount, currency, orderId="", comment="", system=0, phone=false, paidCommission="", static='no') => {
	let url = "https://paykassa.app/sci/0.4/index.php";
	let createOrderData = {
		func: "sci_create_order",
		sci_id: merchantID,
		sci_key: merchantKey,
		domain: "https://dev.unicreate.ru",
		order_id: orderId,
		amount: +amount,
		currency: currency,
		system: system,
		paid_commission: "",
		test: false, // !!!
		comment: comment,
		phone: false
	}
	let a = await request(url, createOrderData);
	return a;
}


// createNewPaymentInterface
let getWayToPay = async (payment) => {
	console.log("payment", payment)
	let arrResult = [];
	for (system of arrSystems) {
		let coeff = await getCurrencyRateForPair(payment.amount.currency, system.currency);
		let amount = payment.amount.value*coeff.data.value;
		let result = await sci_create_order(amount, system.currency, payment.id, payment.description, system.value, false, "shop");
		if (!result.error) {
			let infoPayment = {
				name: "PayKassa.pro (" + (Math.floor(amount * 100000) / 100000) + " " + system.currency + ")",
				type: "paykassapro",
				logotype: "https://dev.unicreate.ru:3003/images/paykassa.svg",
				way: {
					"request_type": "GET",
					url: result.data.url,
				}
			};
			arrResult.push(infoPayment);
		}
	}
	return arrResult;
}


let getInfoAboutMethod = async () => {
	let balances = await getBalance();
	console.log("balances", balances)
	let balance = [];
	for (item of Object.keys(balances.data)) {
		let currencyArr = item.split('_');
		let currency = currencyArr[currencyArr.length - 1].toUpperCase();
		let info = {
			"name": "Paykassa Pro",
			"type": "paykassapro",
			"url": "https://paykassa.pro",
	        deposit_available: true, // ???
	        withdrawal_available: true, // ???
	        balance: balances.data[item],
	        currency: currency,
	    }
	    balance.push(info)
	}
	return balance;
}

let withdrawApplicationMethod = async (amount) => {
	// проверка баланса
	let balances = await getBalance();
	console.log("balances", balances)
	let arrResult = [];
	for (system of arrSystemsWithdraw) {

    	let systemBalance = system.name + "_" + system.currency.toLowerCase();
    	console.log(systemBalance, balances.data[systemBalance]);
    	let coeff = await getCurrencyRateForPair(system.currency);
    	console.log("coeffcoeffcoeff", coeff)
    	let amountCurrency = amount*coeff.data.value;
    	console.log("amountCurrency", amountCurrency);
    	let remain = balances.data[systemBalance] - amountCurrency;
    	console.log("remainremain", remain);
    	if (remain > 0) {
    		let infoPayment = {
    			name: "paykassaPro(" + system.currency + ")",
    			type: "paykassapro",
    			logotype: "https://dev.unicreate.ru:3003/images/paykassa.svg",
    			data: {
    				system: system.value,
    				currency: system.currency,
    			}
    		};
    		arrResult.push(infoPayment);
    	}
    }
    console.log("paykassaWithdraw", arrResult);
    return arrResult;
}


let createWithdrawApplication = async (id, data) => {
	// что-то делаем
	/*$amount = 0.25;
    $system = "bitcoin"; // !!!!
    $currency = 'BTC';
    $wallet = '3D2oetdNuZUqQHPJmcMDDHYoqkyNVsFk9r';
    $comment = 'comment';
    $paid_commission = '';
    $tag = '';
    $real_fee = true; // поддерживаются - BTC, LTC, DOGE, DASH, BSV, BCH, ZEC, ETH
    $priority = "medium"; // low - медленно, medium - средне, high - быстро*/


    let system;
    for (oneSystem of arrSystemsWithdraw) {
    	if (oneSystem.currency === data.currency) {
    		system = oneSystem.value;
    	}
    }
    console.log("data---paykassa", data)
    let coeff = await getCurrencyRateForPair(data.currency);
    let amount = data.amount*coeff.data.value;

    let newData = {
    	"type": "paykassapro",
    	"id": id,
    	"data": {
    		"amount": amount,
    		"currency": data.currency,
    		"system": system,
	          	//"expiry_month": 7,
	          	"wallet": data.wallet,
	          	"comment": "",
	          	"real_fee": true,
	          	"priority": "medium"
	          },
	      }
	      return newData;
	  }


	  let instantPayment = async (data) => {
	  	let url = "https://paykassa.app/api/0.5/index.php";
	  	let newData = {
	  		func: "api_payment",
	  		api_id: APIID,
	  		api_key: APIKey,
	  		shop: merchantID,
	  		amount: data.data.amount,
	  		currency: data.data.currency,
	  		system: data.data.system,
	  		number: data.data.wallet,
	  		tag: "",
	  		priority: data.data.priority,
	  		test: false,
	  	}
	  	let a = await request(url, newData);
	  	return a;
	  }


	  let withdraw = async (data) => {
	  	let result = await instantPayment(data);
	  	console.log("result withdraw paykassa", result)
	  	if (result.error) console.log("result data", result.data);
	  	else return {success: true}
	  		return {success: false}
	  }

	  module.exports.config = config;
	  module.exports.getWayToPay = getWayToPay;
	  module.exports.getInfoAboutMethod = getInfoAboutMethod;
	  module.exports.withdrawApplicationMethod = withdrawApplicationMethod;
	  module.exports.createWithdrawApplication = createWithdrawApplication;
	  module.exports.withdraw = withdraw;