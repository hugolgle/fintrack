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
    categorie: {
      type: String,
      required: true,
    },
    titre: {
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
    montant: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", transactionSchema);
