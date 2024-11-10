const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    amount: { type: String, required: true },
    date: { type: String, required: true },
    isSale: { type: Boolean, required: true },
  },
  { _id: true } // Pas de _id pour chaque transaction
);

const investmentSchema = mongoose.Schema(
  {
    user: { type: String, required: true },
    name: { type: String, required: true }, // Correspond au "title" dans l'ancien schéma
    symbol: { type: String, required: false },
    type: { type: String, required: true },
    transaction: [transactionSchema], // Tableau de transactions
    amountBuy: { type: String, required: true }, // Montant total des achats
    amountSale: { type: String, required: true }, // Montant total des ventes
    amountResult: { type: String, required: true }, // Différence entre les ventes et les achats
  },
  { timestamps: true }
);

module.exports = mongoose.model("investment", investmentSchema);
