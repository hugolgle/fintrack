const mongoose = require("mongoose");

const investmentSchema = mongoose.Schema(
  {
    user: { type: String, required: true },
    type: { type: String, required: true },
    titre: { type: String, required: true },
    detail: { type: String, required: false },
    date: { type: String, required: true },
    montant: { type: String, required: true },
    montantVendu: { type: String, required: false },
    benefice: { type: String, required: false },
    isSold: { type: Boolean, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("investment", investmentSchema);
