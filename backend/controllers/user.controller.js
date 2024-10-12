const bcrypt = require("bcrypt");
const path = require("path");
const UserModel = require("../models/user.model");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Générer un token JWT avec une expiration d'une heure
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({ user, token }); // Retourner l'utilisateur et le token
    } else {
      return res
        .status(401)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la connexion", error });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs",
      error,
    });
  }
};

module.exports.addUser = async (req, res) => {
  try {
    const { username, password, pseudo, nom, prenom } = req.body;

    const imgPath = req.file ? path.join("uploads", req.file.filename) : null;

    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      pseudo,
      nom,
      prenom,
      img: imgPath,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de l'utilisateur", error });
  }
};

module.exports.editUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(400).json({ message: "Cet utilisateur n'existe pas" });
    }

    // Vérifiez que l'email est valide
    if (req.body.username && !emailRegex.test(req.body.username)) {
      return res.status(400).json({ message: "L'e-mail n'est pas valide" });
    }

    let imgPath;

    if (req.body.img === "null") {
      const oldImgPath = path.join(__dirname, "..", user.img);
      if (fs.existsSync(oldImgPath)) {
        fs.unlinkSync(oldImgPath); // Delete the old image
      }
      imgPath = null;
    } else {
      imgPath = req.file ? path.join("uploads", req.file.filename) : user.img;

      if (req.file && user.img) {
        const oldImgPath = path.join(__dirname, "..", user.img);
        if (fs.existsSync(oldImgPath)) {
          fs.unlinkSync(oldImgPath);
        }
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, img: imgPath },
      { new: true }
    );

    return res.status(200).json({
      message: "Utilisateur mis à jour avec succès", // <-- Ajoutez un message de succès ici
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error,
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(400).json({ message: "Cet utilisateur n'existe pas" });
    }

    // Supprimer l'image associée à l'utilisateur
    if (user.img) {
      const imgPath = path.join(__dirname, "..", user.img);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await user.deleteOne({ _id: req.params.id });

    return res
      .status(200)
      .json({ message: `Utilisateur supprimé avec succès: ${req.params.id}` });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
      error,
    });
  }
};

module.exports.getCurrentUser = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête ou un token
    const userId = req.params.id; // Si vous passez l'ID en paramètre

    // Rechercher l'utilisateur par ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Retourner les informations de l'utilisateur sans le mot de passe
    const { password, ...userData } = user.toObject(); // Exclure le mot de passe des données renvoyées
    return res.status(200).json(userData);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
      error,
    });
  }
};
