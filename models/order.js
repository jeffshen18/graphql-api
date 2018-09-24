const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  total: Number,
  shopId: String

});

module.exports = mongoose.model("Order", orderSchema);
