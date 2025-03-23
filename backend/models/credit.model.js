const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema({
  user: { type: String, required: true },
  name: { type: String, required: true }, // Nom du credit
  type: { type: String, required: true }, // Type de credit
  amount: { type: Number, required: true, default: 0.0 }, // Montant emprunté
  monthlyPayment: { type: Number, required: false, default: 0.0 }, // Mensualité
  balance: { type: Number, required: true, default: 0.0 }, // Montant restant a remboursé
  interestRate: { type: Number, required: true, default: 0.0 }, // Interet
  startDate: { type: Date, required: true, default: new Date() },
  duration: { type: Number, required: false, default: 0 }, // Durée de remboursement en mois
  isActive: { type: Boolean, required: true, default: true }, // Statut du credit (actif, remboursé, etc.)
  transactions: [
    // Historique des transactions
    new mongoose.Schema(
      {
        amount: { type: Number, required: true },
        date: { type: Date, required: true, default: new Date() },
        remainingAmount: { type: Number, required: true },
      },
      { timestamps: true }
    ),
  ],
});

module.exports = mongoose.model("credit", creditSchema);
