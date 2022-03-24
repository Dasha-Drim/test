const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let FilialSchema = new Schema({ 
  name: String,
  idFilial: Number,
  managers: {type: Array, default: []},
  operators: {type: Array, default: []},
  history: {type: Array, default: []},
  franchisee: Number,
  currency: String,
});

module.exports = mongoose.model("Filial", FilialSchema);