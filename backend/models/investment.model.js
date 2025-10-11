const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ["buy", "sell"], required: true },
  },
  { _id: true, timestamps: true }
);

const dividendSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: String, required: true },
  },
  { _id: true, timestamps: true }
);

const cycleSchema = new mongoose.Schema(
  {
    amountBuy: { type: Number, required: true },
    amountSale: { type: Number, required: true },
    closed: { type: Boolean, required: true, default: false },
    transactions: [transactionSchema],
    result: { type: Number, required: false },
  },
  { _id: true }
);

const investmentSchema = mongoose.Schema(
  {
    user: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: false },
    isin: { type: String, required: false },
    type: { type: String, required: true },
    dividend: [dividendSchema],
    cycles: [cycleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("investment", investmentSchema);
