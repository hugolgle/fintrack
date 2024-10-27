const express = require("express");
const {
  getInvestments,
  getInvestment,
  setInvestments,
  editInvestment,
  deleteInvestment,
  soldInvestment,
} = require("../controllers/investment.controller");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/user/:idUser", auth, getInvestments);

router.get("/:id", auth, getInvestment);

router.post("/", auth, setInvestments);

router.put("/:id", auth, editInvestment);

router.put("/:id/sold", auth, soldInvestment);

router.delete("/:id", auth, deleteInvestment);

module.exports = router;
