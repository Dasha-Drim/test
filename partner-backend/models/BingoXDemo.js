const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let newSchema = new Schema({ 
  userKey: String,
  socketID: String
});

module.exports = mongoose.model("bingoX_demo", newSchema);