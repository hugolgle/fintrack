const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema({
  user: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true, default: 0.0 },
  monthlyPayment: { type: Number, required: false, default: 0.0 },
  balance: { type: Number, required: true, default: 0.0 },
  interestRate: { type: Number, required: true, default: 0.0 },
  startDate: { type: Date, required: true, default: new Date() },
  duration: { type: Number, required: false, default: 0 },
  isActive: { type: Boolean, required: true, default: true },
  insurance: { type: Number, required: false, default: 0.0 },
  transactions: [
    new mongoose.Schema(
      {
        amount: { type: Number, required: true },
        depreciation: { type: Number, required: true },
        date: { type: Date, required: true, default: new Date() },
        remainingAmount: { type: Number, required: true },
      },
      { timestamps: true }
    ),
  ],
});

module.exports = mongoose.model("credit", creditSchema);
