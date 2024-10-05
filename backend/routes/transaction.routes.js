const express = require("express");
const {
  getTransactions,
  getTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
} = require("../controllers/transaction.controller");
const router = express.Router();

router.get("/user/:idUser", getTransactions);

router.get("/:id", getTransaction);

router.post("/", addTransaction);

router.put("/:id", editTransaction);

router.delete("/:id", deleteTransaction);

module.exports = router;
