const mongoose = require("mongoose");

const epargnSchema = new mongoose.Schema({
  user: { type: String, required: true },
  name: { type: String, required: true }, // Nom du livret (ex: Livret A, LDD, etc.)
  balance: { type: Number, required: true, default: 0.0 }, // Solde actuel
  interestRate: { type: Number, required: true, default: 0.0 }, // Taux d'intérêt annuel (en pourcentage)
  lastInterestCalculation: { type: Date, required: true, default: new Date() }, // Date du dernier calcul des intérêts
  transactions: [
    {
      type: {
        type: String,
        enum: ["deposit", "withdraw", "transfer"],
        required: true,
      },
      amount: { type: Number, required: true },
      date: { type: Date, required: true, default: new Date() },
      toAccount: { type: mongoose.Schema.Types.ObjectId, ref: "epargn" }, // Pour les transferts
    },
  ],
});

module.exports = mongoose.model("epargn", epargnSchema);
