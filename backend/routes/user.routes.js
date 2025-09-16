const express = require("express");
const {
  loginUser,
  signUpUser,
  editUser,
  deleteAccount,
  getCurrentUser,
  logoutUser,
  updateImg,
} = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post(
  "/add",
  upload.fields([{ name: "imgProfile", maxCount: 1 }]),
  signUpUser
);

router.put(
  "/edit/:id",
  auth,
  upload.fields([{ name: "imgProfile", maxCount: 1 }]),
  editUser
);
router.delete("/delete", auth, deleteAccount);
router.get("/current", auth, getCurrentUser);
router.patch(
  "/edit/:id",
  auth,
  upload.fields([{ name: "imgProfile", maxCount: 1 }]),
  updateImg
);

module.exports = router;
