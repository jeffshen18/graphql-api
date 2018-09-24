const mongoose = require("mongoose");
const { Schema } = mongoose;

const shopSchema = new Schema({
  name: String
});

module.exports = mongoose.model("Shop", shopSchema);
