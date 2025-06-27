const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  loginUser,
  addUser,
  editUser,
  deleteUser,
  getCurrentUser,
  logoutUser,
} = require("../controllers/user.controller");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/add", upload.single("img"), addUser);

router.put("/edit/:id", auth, upload.single("img"), editUser);
router.delete("/delete/:id", auth, deleteUser);
router.get("/current", auth, getCurrentUser);

module.exports = router;
