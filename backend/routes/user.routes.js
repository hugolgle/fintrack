const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getUsers,
  loginUser,
  addUser,
  editUser,
  deleteUser,
  getCurrentUser,
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

router.get("/", auth, getUsers);
router.post("/login", loginUser);
router.post("/add", upload.single("img"), addUser);

router.put("/edit/:id", auth, upload.single("img"), editUser);
router.delete("/delete/:id", auth, deleteUser);
router.get("/current", auth, getCurrentUser);

module.exports = router;
