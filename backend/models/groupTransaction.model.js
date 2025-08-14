const mongoose = require("mongoose");

const groupTransactionSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: false,
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupTransaction", groupTransactionSchema);
