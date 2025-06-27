const express = require("express");
const {
  getInvestments,
  getInvestment,
  addInvestment,
  editInvestment,
  editTransaction,
  deleteTransaction,
  addTransaction,
} = require("../controllers/investment.controller");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/user", auth, getInvestments);

router.get("/:id", auth, getInvestment);

router.post("/", auth, addInvestment);

router.post("/:id/transaction", auth, addTransaction);

router.put("/:id", auth, editInvestment);

router.put("/:id/transaction/:transactionId", auth, editTransaction);

router.delete("/:id/transaction/:transactionId", auth, deleteTransaction);

module.exports = router;
