const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Maintenant optionnel pour les utilisateurs Google
    },
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false, // Stocke l'ID unique de Google si l'utilisateur se connecte avec Google
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
