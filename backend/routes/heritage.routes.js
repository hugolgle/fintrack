const express = require("express");
const {
  getAssets,
  getAsset,
  addAsset,
  editAsset,
  deleteAsset,
} = require("../controllers/heritage.controller");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/user/:idUser", auth, getAssets);

router.get("/:id", auth, getAsset);

router.post("/", auth, addAsset);

router.put("/:id", auth, editAsset);

router.delete("/:id", auth, deleteAsset);

module.exports = router;
