const express = require("express");
const {
  getTransactions,
  getTransaction,
  setTransactions,
  editTransaction,
  deleteTransaction,
  addRefund,
  deleteRefund,
  editRefund,
} = require("../controllers/transaction.controller");
const router = express.Router();

router.get("/user/:idUser", getTransactions);

router.get("/:id", getTransaction);

router.post("/", setTransactions);

router.post("/:id/refund", addRefund);

router.put("/:id", editTransaction);

router.put("/:id/refund/:refundId", editRefund);

router.delete("/:id", deleteTransaction);

router.delete("/:id/refund/:refundId", deleteRefund);

module.exports = router;
