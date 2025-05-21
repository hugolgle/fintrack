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
      required: false,
    },
    nom: {
      type: String,
      required: false,
    },
    prenom: {
      type: String,
      required: true,
    },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    zipcode: { type: String, required: false },
    city: {
      type: String,
      required: false,
    },
    img: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
