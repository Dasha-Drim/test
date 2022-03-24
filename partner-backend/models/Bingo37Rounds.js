const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let newSchema = new Schema({ 
  bets: Array,
  num: Number,
});

module.exports = mongoose.model("bingo37_rounds", newSchema);