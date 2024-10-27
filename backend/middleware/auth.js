// middleware/auth.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Aucun token fourni." });
  }

  const bearerToken = token.split(" ")[1];

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token invalide ou expiré." });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = auth;
