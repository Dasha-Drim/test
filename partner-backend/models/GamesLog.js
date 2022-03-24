const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let newSchema = new Schema({ 
	gameName: String,
	player: Number,
	type: String,
  	amount: Number,
  	currentRoundID: String,
});

module.exports = mongoose.model("games_log", newSchema);