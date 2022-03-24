const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let newSchema = new Schema({ 
	type: String, // success / error
  	text: String,
  	date: {type: Date, default: Date.now},
});

module.exports = mongoose.model("lotto_log", newSchema);