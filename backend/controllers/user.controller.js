const bcrypt = require("bcrypt");
const path = require("path");
const UserModel = require("../models/user.model");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports.loginUser = async (req, res) => {
  try {
    const { username, password, googleId } = req.body;

    let user;

    if (googleId) {
      // Vérification de l'utilisateur par Google ID
      user = await UserModel.findOne({ googleId });
    } else {
      // Vérification de l'utilisateur avec le mot de passe
      user = await UserModel.findOne({ username });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch && password === user.password) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      } else if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
      }
    }
    console.log("le user:", user);
    // Génération du token d'authentification
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Vous êtes connecté !",
      user,
      token,
    });
  } catch (error) {
    console.log("erreur cdans le catch:", error);
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
    const {
      username,
      password,
      nom,
      prenom,
      googleId,
      img,
      phone,
      zipcode,
      address,
      city,
    } = req.body;

    const API_URL = process.env.VITE_API_URL;

    const imgPath = req.file ? `${API_URL}/uploads/${req.file.filename}` : null;

    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà !" });
    }

    // Si l'utilisateur vient de Google, on ne hash pas de mot de passe
    const newUser = await UserModel.create({
      username,
      password: googleId ? null : await bcrypt.hash(password, 10), // Pas de mot de passe si connexion Google
      nom,
      prenom,
      phone,
      address,
      zipcode,
      city,
      img: imgPath ?? img,
      googleId: googleId || null, // Enregistre l'ID Google
    });

    return res.status(201).json({
      newUser,
      message: "Inscription réussie ! Vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);

    return res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de l'utilisateur", error });
  }
};

module.exports.editUser = async (req, res) => {
  const API_URL = process.env.VITE_API_URL;
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "Cet utilisateur n'existe pas" });
    }

    if (req.body.googleId) {
      return res
        .status(400)
        .json({ message: "Vous ne pouvez pas modifier l'ID Google" });
    }

    if (req.body.username && !emailRegex.test(req.body.username)) {
      return res.status(400).json({ message: "L'e-mail n'est pas valide" });
    }

    if (req.body.username) {
      const existingUser = await UserModel.findOne({
        username: req.body.username,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Cet e-mail est déjà utilisé par un autre utilisateur",
        });
      }
    }

    let imgPath;
    if (req.body.img === "null") {
      const oldImgPath = path.join(__dirname, "..", user.img);
      if (fs.existsSync(oldImgPath)) {
        fs.unlinkSync(oldImgPath);
      }
      imgPath = null;
    } else {
      imgPath = req.file ? `${API_URL}/uploads/${req.file.filename}` : user.img;
      if (req.file && user.img) {
        const oldImgPath = path.join(__dirname, "..", user.img);
        if (fs.existsSync(oldImgPath)) {
          fs.unlinkSync(oldImgPath);
        }
      }
    }

    user.username = req.body.username || user.username;
    user.nom = req.body.nom || user.nom;
    user.prenom = req.body.prenom || user.prenom;
    user.img = imgPath || user.img;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.zipcode = req.body.zipcode || user.zipcode;
    user.city = req.body.city || user.city;
    await user.save();

    return res.status(200).json({ message: "Profil mis à jour avec succès" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la mise à jour du profil",
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(400).json({ message: "Cet utilisateur n'existe pas" });
    }

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
    const userId = req.params.id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const { password, ...userData } = user.toObject();
    return res.status(200).json(userData);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
      error,
    });
  }
};
