const { DateTime } = require("luxon");

const Players = require('../../../models/Players.js');
const PaymentsLog = require('../../../models/PaymentsLog.js');
const OperatorsLog = require('../../../models/OperatorsLog.js');

module.exports = async (idUser, amount, operator) => {
  let player = await Players.findOne({idUser: idUser});
  if (!amount.match(/^[0-9]+$/)) return {success: false, message: 'В сумме пополнения или снятия могут быть только цифры'};
  let balance = player.balance + +amount;
  await Players.updateOne({idUser: idUser}, {$set: {balance: balance}}, {upsert: false});
  let countOperation = await PaymentsLog.count();
  await new PaymentsLog({method: "cash", operationId: +countOperation+1, amount: +amount, currency: player.currency, type: "up", dateTime: DateTime.local().setZone("Europe/Moscow").toISO(), userId: player.idUser}).save();
  await new OperatorsLog({operatorId: operator, userId: idUser, amount: +amount, type: "up", dateTime: DateTime.local().setZone("Europe/Moscow").toISO()}).save();
  return {success: true, balance: balance};
}