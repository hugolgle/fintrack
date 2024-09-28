const express = require("express");
const {
  getInvestments,
  getInvestment,
  setInvestments,
  editInvestment,
  deleteInvestment,
  soldInvestment,
} = require("../controllers/investment.controller");
const router = express.Router();

router.get("/user/:idUser", getInvestments);

router.get("/:id", getInvestment);

router.post("/", setInvestments);

router.put("/:id", editInvestment);

router.put("/:id/sold", soldInvestment);

router.delete("/:id", deleteInvestment);

module.exports = router;
