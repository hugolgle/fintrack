const express = require("express");
const auth = require("../middleware/auth");
const {
  addAccount,
  addTransfert,
  calculateInterest,
  getAccounts,
  getAccount,
  depositAccount,
  withdrawAccount,
} = require("../controllers/epargn.controller");
const router = express.Router();

router.get("/accounts/user/:idUser", auth, getAccounts);
router.get("/accounts/:id", auth, getAccount);
router.post("/accounts", auth, addAccount);
router.post("/transfers", auth, addTransfert);
router.post("/deposit", auth, depositAccount);
router.post("/withdraw", auth, withdrawAccount);
router.post("/accounts/calculate-interest", auth, calculateInterest);

module.exports = router;
