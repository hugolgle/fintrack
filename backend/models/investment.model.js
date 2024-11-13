const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    amount: { type: String, required: true },
    date: { type: String, required: true },
    isSale: { type: Boolean, required: true },
  },
  { _id: true }
);

const investmentSchema = mongoose.Schema(
  {
    user: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: false },
    type: { type: String, required: true },
    transaction: [transactionSchema],
    amountBuy: { type: String, required: true },
    amountSale: { type: String, required: true },
    amountResult: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("investment", investmentSchema);
