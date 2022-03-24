const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AdminSchema = new Schema({
  login: String,
  password: String,
  name: String,
  salt: String,
  level: Number,
  fio: String,
  filials: { type: Array, required: false },
  income: { type: Number, required: false },
  consumption: { type: Number, required: false },
  franchisee: { type: String, required: false },
  percent: { type: Number, required: false },
  idAdmin: Number,
  currency: String,
});

module.exports = mongoose.model("Admin", AdminSchema);