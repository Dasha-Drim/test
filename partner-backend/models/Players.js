const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  phone: String,
  mail: String,
  login: String,
  password: String,
  salt: String,
  code: String,
  phoneConfirm: Boolean, 
  status: String,
  balance: Number,
  bonus: { type: Number, default: 0 },
  passport: {
    name: String, 
    surname: String,
    patronymic: String,
    dateBirth: String,
    number: String,
    photo: String,
  },
  passportStatus: String,
  promocodes: { type: Array, default: []},
  domainName: String,
  dateRegistration: {type: Date, default: Date.now},
  idUser: Number,
  county: String,
  currency: String,
  userKey: String,
  socketID: String,
  online: Boolean,

  inFilial: { type: Boolean, default: false },
  idFilial: Number,
  active: { type: Boolean, default: false },
  franchisee: {type: Array}, // [{franchisee: xxx, balance: 0}]
});

module.exports = mongoose.model("User", UserSchema);