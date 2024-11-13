const express = require("express");
const {
  getInvestments,
  getInvestment,
  addInvestment,
  editInvestment,
  editTransaction, // Nouvelle route pour éditer une transaction
  deleteTransaction,
  addTransaction,
  deleteInvestement, // Nouvelle route pour supprimer une transaction
} = require("../controllers/investment.controller");
const auth = require("../middleware/auth");
const router = express.Router();

// Récupérer les investissements d'un utilisateur
router.get("/user/:idUser", auth, getInvestments);

// Récupérer un investissement par son ID
router.get("/:id", auth, getInvestment);

// Ajouter un nouvel investissement
router.post("/", auth, addInvestment);

// Ajouter une transaction à un investissement existant
router.post("/:id/transaction", auth, addTransaction);

// Modifier un investissement
router.put("/:id", auth, editInvestment);

// Modifier une transaction d'un investissement
router.put("/:id/transaction/:transactionId", auth, editTransaction); // Nouvelle route pour modifier une transaction

router.delete("/:id", auth, deleteInvestement); // Nouvelle route pour supprimer une transaction

// Supprimer une transaction d'un investissement
router.delete("/:id/transaction/:transactionId", auth, deleteTransaction); // Nouvelle route pour supprimer une transaction

module.exports = router;
