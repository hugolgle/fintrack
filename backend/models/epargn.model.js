const mongoose = require("mongoose");

const epargnSchema = new mongoose.Schema({
  user: { type: String, required: true },
  name: { type: String, required: true },
  balance: { type: Number, required: true, default: 0.0 },
  interestRate: { type: Number, required: true, default: 0.0 },
  lastInterestCalculation: { type: Date, required: true, default: new Date() },
  amountInterest: { type: Number, default: 0.0 },
  maxBalance: { type: Number, required: true, default: 100000.0 },
  transactions: [
    new mongoose.Schema(
      {
        type: {
          type: String,
          enum: ["deposit", "withdraw", "transfer", "interest"],
          required: true,
        },
        amount: { type: Number, required: true },
        date: { type: Date, required: true, default: new Date() },
        toAccount: { type: mongoose.Schema.Types.ObjectId, ref: "epargn" },
        fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: "epargn" },
      },
      { timestamps: true }
    ),
  ],
  monthlyStatements: [
    {
      date: { type: Date, required: true },
      balance: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("epargn", epargnSchema);
