const express = require("express");
const multer = require("multer");
const path = require("path"); // Ajoute path ici pour multer
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
    const uploadPath = path.join(__dirname, "..", "uploads"); // Corrige le chemin vers "uploads"
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Nom unique de l'image
  },
});

const upload = multer({ storage });
const router = express.Router();

router.get("/", getUsers);
router.post("/login", loginUser);
router.post("/add", upload.single("img"), addUser); // Protéger cette route
router.put("/edit/:id", upload.single("img"), editUser); // Protéger cette route
router.delete("/delete/:id", deleteUser); // Protéger cette route
router.get("/current/:id", getCurrentUser); // Protéger cette route

module.exports = router;
