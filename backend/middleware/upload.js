const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    let prefix = "file";

    switch (file.fieldname) {
      case "imgProfile":
        prefix = "imgProfile";
        break;
    }

    cb(null, `${prefix}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
