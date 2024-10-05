const bcrypt = require("bcrypt");
const path = require("path");
const UserModel = require("../models/user.model");
const fs = require("fs");

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
      return res.status(200).json(user);
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
