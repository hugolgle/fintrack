const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    initialAmount: {
      type: Number,
      required: false,
    },
    refunds: [
      {
        title: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
      },
    ],
    tag: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", transactionSchema);
