const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let OperatorsLogsSchema = new Schema({
 	operatorId: String,
 	userId: String,
 	amount: Number,
 	type: String,
 	dateTime: String,
});

module.exports = mongoose.model("OperatorsLogs", OperatorsLogsSchema);