const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    isSale: { type: Boolean, required: true },
  },
  { _id: true, timestamps: true }
);

const investmentSchema = mongoose.Schema(
  {
    user: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: false },
    type: { type: String, required: true },
    transaction: [transactionSchema],
    amountBuy: { type: Number, required: true },
    amountSale: { type: Number, required: true },
    amountResult: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("investment", investmentSchema);
