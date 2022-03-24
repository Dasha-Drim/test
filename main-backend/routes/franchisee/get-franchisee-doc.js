const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');
const { DateTime } = require("luxon");

const Admins = require('../../models/Admins.js');
const OperatorsLog = require('../../models/OperatorsLog.js');

/*
  "dateFrom": "2022-03-09",
  "dateTo": "2022-03-19"
  */

  router.post('/franchisee/doc', async (req, res, next) => {
    let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
    if ((!token || (token.role !== "admin")) && (!token || (token.role !== "franchisee"))) return res.send({success: false, message: 'Incorrect token'});
    /**/
  // поступления receipt
  // снятия withdrawal
  // процент percent
  let withdrawal = 0;
  let receipt = 0;

  let arrDateFrom = req.body.dateFrom.split("-");
  let arrDateTo = req.body.dateTo.split("-");

  let dateStart = DateTime.fromObject({ year: arrDateFrom[0], month: arrDateFrom[1], day: arrDateFrom[2]});
  let dateEnd = DateTime.fromObject({ year: arrDateTo[0], month: arrDateTo[1], day: arrDateTo[2]});

  console.log("req.body", req.body)

  let operators = await Admins.find({level: 2, franchisee: req.body.franchiseeId});
  console.log("operators", operators);
  for (operator of operators) {
    let operations = await OperatorsLog.find({operatorId: operator.idAdmin});
    console.log("operations", operations);
    console.log("operator.idAdmin", operator.idAdmin);
    for (operation of operations) {
      if ((DateTime.fromISO(operation.dateTime).setZone("Europe/Moscow") > dateStart) && (DateTime.fromISO(operation.dateTime).setZone("Europe/Moscow") < dateEnd)) {
        if (operation.type == "down") withdrawal = withdrawal + operation.amount;
        if (operation.type == "up") receipt = receipt + operation.amount;
      }
    }
  }
  console.log("withdrawal", withdrawal);
  console.log("receipt", receipt);
  let franchisee = await Admins.findOne({idAdmin: req.body.franchiseeId});
  console.log("franchisee", franchisee);
  let percent = franchisee.percent/100;
  let comission = receipt*percent;
  return res.send({success: true, receipt: receipt, withdrawal: withdrawal, comission: comission});
  
});
  module.exports = router;