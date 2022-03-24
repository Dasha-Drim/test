const https = require('https');
const axios = require('axios');
const { base64encode, base64decode } = require('nodejs-base64');
let FormData = require('form-data');

kassaID = "61eed69388c01754cc6ee813"; // !!!! 61eed69388c01754cc6ee813
accountID = "61eed2371b21db1f627a4292"; //61eed2371b21db1f627a4292
accountKey = "NnfwP7RSirxgw2G3Dt4QYES94FEZrqYu"; //NnfwP7RSirxgw2G3Dt4QYES94FEZrqYu
kassaName = "lotolive.org RUB" //lotolive.org RUB

let config = {
    name: "interkassa",
}

// Firstly, get business cabinet id
let getBusinessCabinetId = async () => {
    let response = await axios({
        method: "get",
        url: 'https://api.interkassa.com/v1/account',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Basic "+base64encode(accountID+":"+accountKey),
        }
    })
    console.log("response", response.data.data)
    let accounts = response.data.data;
    for (var key in accounts) {
      if(accounts[key].nm === 'Бизнес-кабинет') return accounts[key]["_id"];
  }
}

/*
URL: https://api.interkassa.com/v1/purse
Запрос: GET
Headers: Authorization, Ik-Api-Account-Id
*/
// get info about purse

let getPurseInfo = async (businessCabinetId) => {
    let response = await axios({
        method: "get",
        url: 'https://api.interkassa.com/v1/purse',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Basic "+base64encode(accountID+":"+accountKey),
            'Ik-Api-Account-Id': businessCabinetId
        }
    })
    return response.data.data;
}


let getInfoAboutMethod = async () => {
    let businessCabinetId = await getBusinessCabinetId();
    console.log("businessCabinetId", businessCabinetId)
    let dataFromKassa = await getPurseInfo(businessCabinetId);
    let balance = 0;
    for(let key in dataFromKassa) {
        balance = dataFromKassa[key].balance
    }
    let info = {
        "name": "Интеркасса",
        "type": "interkassa",
        "logotype": "https://lotolive.org:2877/public/images/interkassa.png",
        "url": "https://interkassa.com",
        balance: balance,
        currency: "RUB",
        deposit_available: true, // ???
        withdrawal_available: true // ???
    }
    return info;
}



let getWayToPay = async (payment) => {
    /*let infoPayment = {
        name: "Интеркасса",
        type: "interkassa",
        logotype: "https://lotolive.org:2877/images/interkassa.png",
        way: {
            "request_type": "POST",
            url: "https://sci.interkassa.com",
            data: {
                "ik_co_id": kassaID,
                "ik_pm_no": payment.id,
                "ik_am": payment.amount.value,
                "ik_cur": payment.amount.currency,
                "ik_desc": payment.description, 
            }
        }
    };
    return infoPayment;*/
    return false;
}


let withdrawApplicationMethod = async () => {
    // проверка баланса
    /*let infoPayment = {
        name: "Интеркасса",
        type: "interkassa",
        logotype: "https://jenis.games:2877/images/interkassa.png",
    };
    console.log("interkassaWithdraw");
    return infoPayment;*/
    return false;
}

let createWithdrawApplication = async (id, data) => {
    let newData = {
            "type": "interkassa",
            "id": id,
            "data": {
                "amount": data.amount,
                "currency": "usd",
                'method': 'card',
                'card': data.card,
                'phone': data.phone,
                'useShortAlias': true,
                'action': 'process',
            },
    }
    console.log("createWithdrawApplication", newData)
    return newData;
}

let withdraw = async (data) => {
    (async()=>{
        let postWithdraw = async (id, purseId) => {// где-то тут ошибка
            let form = new FormData();
            console.log("purseId", purseId)
            form.append('amount', data.data.amount);
            form.append('currency', data.data.currency);
            form.append('purseId', purseId);
            form.append('action', data.data.action);
            form.append('method', data.data.method);
            form.append('details[card]', data.data.card);
            form.append('details[phone]', data.data.phone);
            form.append('paymentNo', data.id);
            form.append('useShortAlias', data.data.useShortAlias);

            let response = await axios({
              method: "post",
              url: 'https://api.interkassa.com/v1/withdraw',
              headers: {
                'Accept': 'application/json',
                ...form.getHeaders(),
                'Authorization': "Basic "+base64encode(accountID+":"+accountKey),
                'Ik-Api-Account-Id': id
              },
              data: form
            })

            return response.data;
        }
        let getPurseId = async (businessCabinetId) => {
            let response = await axios({
              method: "get",
              url: 'https://api.interkassa.com/v1/purse?checkoutId='+kassaID,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Basic "+base64encode(accountID+":"+accountKey),
                'Ik-Api-Account-Id': businessCabinetId
              },
            })
            console.log("response.dataresponse.dataresponse.data", response.data)
            let purses = response.data.data;
            for (var key in purses) {
              if(purses[key].name === kassaName) return purses[key]["id"];
            }
        }

        try {
            // try to withdraw
            let businessCabinetId = await getBusinessCabinetId();
            console.log("businessCabinetId", businessCabinetId)
            let purseId = await getPurseId(businessCabinetId);
            console.log("purseIdpurseIdpurseId", purseId)
            let withdrawResult = await postWithdraw(businessCabinetId, purseId);
            console.log("postWithdraw", withdrawResult);
            return {success: true, withdrawResult: withdrawResult};
        } catch (e) {
          console.log("catched e", e);
          return {success: false, message: "Платёжный сервис недоступен. Мы передали информацию администратору. Попробуйте позже"};
        }
    })();
}


module.exports.config = config;
module.exports.getInfoAboutMethod = getInfoAboutMethod;
module.exports.getWayToPay = getWayToPay;
module.exports.withdrawApplicationMethod = withdrawApplicationMethod;
module.exports.createWithdrawApplication = createWithdrawApplication;
module.exports.withdraw = withdraw;


/*

const express = require('express');
const router = express.Router();
const jwt = require('../modules/jwt.js');
const db = require('../modules/db.js');
const passport = require('../modules/passport-jwt.js');
const verify = require('../modules/verify.js');
ObjectId = require('mongodb').ObjectID;
const { DateTime } = require("luxon");

let FormData = require('form-data');
let config = require('../config/config.js');



router.post('/', passport.authenticate('jwt', {session: false}), async function(req, res, next) {
  let id = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
  if (!id) {
    return res.send({success: false, message: 'Incorrect token'});
  }

  // Thidly, do withdraw
  let postWithdraw = async (id, purseId) => {
    let form = new FormData();

    form.append('amount', req.body.amount);
    form.append('currency', "xts");
    form.append('purseId', purseId);
    form.append('action', "process");
    form.append('method', "card");
    form.append('details[card]', "4276123412341234");
    form.append('details[phone]', "9175654200");
    form.append('paymentNo', "1234");
    form.append('useShortAlias', "true");

    let response = await axios({
      method: "post",
      url: 'https://api.interkassa.com/v1/withdraw',
      headers: {
        'Accept': 'application/json',
        ...form.getHeaders(),
        'Authorization': "Basic "+base64encode(config.config.interkassa.accountID+":"+config.config.interkassa.accountKey),
        'Ik-Api-Account-Id': id
      },
      data: form
    })

    return response.data;
  }

  // Secondly, get purse id
  let getPurseId = async (businessCabinetId) => {
    let response = await axios({
      method: "get",
      url: 'https://api.interkassa.com/v1/purse?checkoutId='+config.config.interkassa.kassaID,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Basic "+base64encode(config.config.interkassa.accountID+":"+config.config.interkassa.accountKey),
        'Ik-Api-Account-Id': businessCabinetId
      },
    })

    let purses = response.data.data;
    for (var key in purses) {
      if(purses[key].name === config.config.interkassa.kassaName) return purses[key]["id"];
    }
  }



  db.DBread('users', { '_id' :  ObjectId ( id.id )}).catch(console.dir).then(
    function(user) {
      let messageVerify = verify.verifyAmount(req.body.amount);
      if (!messageVerify) {
        let balance = user[0].balance - req.body.amount;
        if (balance < 0) {
          return res.send({success: false, message: 'Недостаточно средств для вывода'});
        } else {
          (async()=>{
            try {
              // try to withdraw
              let businessCabinetId = await getBusinessCabinetId();
              let purseId = await getPurseId(businessCabinetId);
              let withdrawResult = await postWithdraw(businessCabinetId, purseId);
              console.log("postWithdraw", withdrawResult);

              let currentTime = DateTime.local().setZone("Europe/Moscow").toISO();
              db.DBcount('balance_sheet_operations').catch(console.dir).then(
                (result) => {
                  db.DBwrite('balance_sheet_operations', { method: "non-cash", operationId: +result+1, amount: +req.body.amount, type: "down", dateTime: currentTime, userId: user[0]._id.toString() });
                }
              )

              db.DBupdate('users', { phone : user[0].phone }, { balance: balance });
              return res.send({success: true, balance: balance});

            } catch (e) {
              console.log("catched e", e);
              return res.send({success: false, message: "Платёжный сервис недоступен. Мы передали информацию администратору. Попробуйте позже"});
            }
          })();
        }
      } else {
        return res.send({success: false, message: messageVerify});
      }
    }
  );
});



*/