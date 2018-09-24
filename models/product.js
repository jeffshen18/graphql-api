const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: String,
  price: Number,
  shopId: String
});

module.exports = mongoose.model("Product", productSchema);
