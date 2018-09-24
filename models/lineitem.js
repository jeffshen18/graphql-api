const mongoose = require("mongoose");
const { Schema } = mongoose;

const lineItemSchema = new Schema({
  orderId: String,
  productId: String,
  quantity: Number,
  subtotal: Number
});

module.exports = mongoose.model("LineItem", lineItemSchema);
