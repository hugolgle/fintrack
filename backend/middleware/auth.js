const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Aucun token fourni." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token invalide ou expiré." });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = auth;
