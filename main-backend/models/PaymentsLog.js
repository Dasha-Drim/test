const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PaymentsLogsSchema = new Schema({
 	operationId: String,
 	status: String,
 	method: String,
 	amount: Number,
 	currency: String,
 	type: String,
 	userId: String,
 	dateTime: String,
});

module.exports = mongoose.model("PaymentsLogs", PaymentsLogsSchema);