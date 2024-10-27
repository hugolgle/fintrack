const express = require("express");
const {
  getTransactions,
  getTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
} = require("../controllers/transaction.controller");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/user/:idUser", auth, getTransactions);

router.get("/:id", auth, getTransaction);

router.post("/", auth, addTransaction);

router.put("/:id", auth, editTransaction);

router.delete("/:id", auth, deleteTransaction);

module.exports = router;
