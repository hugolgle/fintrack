const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {
  createCredit,
  getCredits,
  getCredit,
  updateCredit,
  deleteCredit,
  addPayment,
  toggleCreditStatus,
} = require("../controllers/credit.controller");

router.post("/", auth, createCredit);
router.get("/user/:idUser", auth, getCredits);
router.get("/:id", auth, getCredit);
router.put("/:id", auth, updateCredit);
router.patch("/:id", auth, toggleCreditStatus);
router.delete("/:id", auth, deleteCredit);
router.post("/:id/payment", auth, addPayment);

module.exports = router;
