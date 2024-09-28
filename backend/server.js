const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

const port = 5001;
const dotenv = require("dotenv").config();

connectDB();
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/investments", require("./routes/investment.routes"));
app.use("/transactions", require("./routes/transaction.routes"));
app.use("/user", require("./routes/user.routes"));

app.listen(port, () => console.log("Le serveur a démarré au port " + port));
