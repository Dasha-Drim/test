const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  date: {type: Date, default: Date.now},
  country: String,
  city: String,
  new: {type: Boolean, default: true},
});

module.exports = mongoose.model("Visitors", UserSchema);