const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');

const Admins = require('../../models/Admins.js');
const Filials = require('../../models/Filials.js');

router.get('/operators',  async (req, res) => {
  let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
  if (!token && token.role !== "user") return res.send({success: false, message: 'Incorrect token'});
  if(!req.query.filialId) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены'});
  let arrOperators = [];
  let filial = await Filials.findOne({idFilial: req.query.filialId});
  let operators = await Admins.find({idAdmin: {$in: filial.operators}});
  for (operator of operators) {
    arrOperators.push({fio: operator.fio, id: operator.idAdmin})
  }
  return res.send({success: true, operators: arrOperators});
});

module.exports = router;