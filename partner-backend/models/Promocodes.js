const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PromocodeSchema = new Schema({
  promocode: { type: String },
  count: { type: Number, default: 0 },
  price: { type: Number },
  date: { type: Date, default: Date.now },
  dateEnd: { type: String },
});

module.exports = mongoose.model("Promocode", PromocodeSchema);
//exports.model = mongoose.model("Promocode", PromocodeSchema);