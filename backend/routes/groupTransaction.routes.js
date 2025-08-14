const express = require("express");

const auth = require("../middleware/auth");
const {
  createGroup,
  getGroupById,
  getGroups,
  updateGroup,
  deleteGroup,
  addTransactionToGroup,
  removeTransactionFromGroup,
} = require("../controllers/groupTransaction.controller");
const router = express.Router();

router.get("/user", auth, getGroups);

router.post("/", auth, createGroup);

router.get("/:id", auth, getGroupById);

router.delete("/:id", auth, deleteGroup);
router.post("/:id/transactions", auth, addTransactionToGroup);

router.delete("/:id/transactions", auth, removeTransactionFromGroup);
router.put("/:id", auth, updateGroup);
module.exports = router;
