const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PaymentSchema = new Schema({
  id: String,
  status: String,
  paid: Boolean,
  amount: Object,
  confirmation: Object,
  created_at: {type: Date, default: Date.now},
  description: String,
  payment_method: String,
  test: Boolean,
  type: String, // deposit or withdraw
  payment_method: Object,
  user: String,
});

exports.model = mongoose.model("Payment", PaymentSchema);