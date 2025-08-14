const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = 8000;
connectDB();
const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/investments", auth, require("./routes/investment.routes"));
app.use("/transactions", auth, require("./routes/transaction.routes"));
app.use("/epargns", auth, require("./routes/epargn.routes"));
app.use("/credits", auth, require("./routes/credit.routes"));
app.use(
  "/group-transactions",
  auth,
  require("./routes/groupTransaction.routes")
);
app.use("/user", require("./routes/user.routes"));

app.listen(port, () => console.log("Le serveur a démarré au port " + port));
