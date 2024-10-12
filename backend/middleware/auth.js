// middleware/auth.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Aucun token fourni." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token invalide." });
    }
    req.userId = decoded.id; // Ajoutez l'ID de l'utilisateur à la requête
    next();
  });
};

module.exports = auth;
