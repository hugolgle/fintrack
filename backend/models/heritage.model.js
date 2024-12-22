const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const heritageSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    acquisitionDate: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: false,
    },
    acquisitionPrice: {
      type: Number,
      required: true,
    },
    estimatePrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("heritage", heritageSchema);
