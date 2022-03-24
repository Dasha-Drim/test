const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let newSchema = new Schema({ 
	roundId: String,
  	bets: Array,
  	num: Number,
  	win: Number,
  	price: Number,
});

module.exports = mongoose.model("game_log_bot", newSchema);