const express = require("express");
const auth = require("../middleware/auth");
const {
  addAccount,
  addTransfert,
  calculateInterest,
  getAccounts,
} = require("../controllers/epargn.controller");
const router = express.Router();

router.get("/accounts", auth, getAccounts);
router.post("/accounts", auth, addAccount);
router.post("/accounts/transfer", auth, addTransfert);
router.post("/accounts/calculate-interest", auth, calculateInterest);

module.exports = router;
