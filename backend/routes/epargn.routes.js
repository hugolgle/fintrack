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
  editAccount,
} = require("../controllers/epargn.controller");
const router = express.Router();

router.get("/accounts/user", auth, getAccounts);
router.get("/accounts/:id", auth, getAccount);
router.put("/accounts/:id", auth, editAccount);
router.post("/accounts", auth, addAccount);
router.post("/transfers", auth, addTransfert);
router.post("/deposit", auth, depositAccount);
router.post("/withdraw", auth, withdrawAccount);
router.post("/accounts/calculate-interest", auth, calculateInterest);

module.exports = router;
