const bcrypt = require("bcrypt");
const path = require("path");
const UserModel = require("../models/user.model");
const TransactionModel = require("../models/transaction.model");
const InvestissementModel = require("../models/investment.model");
const CreditModel = require("../models/credit.model");
const EpargneModel = require("../models/epargn.model");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports.loginUser = async (req, res) => {
  try {
    const { username, password, googleId } = req.body;

    let user;

    if (googleId) {
      user = await UserModel.findOne({ googleId });
    } else {
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Vous êtes connecté !",
      user,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la connexion", error });
  }
};

module.exports.signUpUser = async (req, res) => {
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

    if (req.files?.imgProfile) {
      req.body.img = `/uploads/${req.files.imgProfile[0].filename}`;
    }

    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà !" });
    }

    const newUser = await UserModel.create({
      username,
      password: googleId ? null : await bcrypt.hash(password, 10),
      nom,
      prenom,
      phone,
      address,
      zipcode,
      city,
      img:
        req.body.img && req.body.img.trim() !== "" ? req.body.img : undefined,
      ...(googleId ? { googleId } : {}),
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

    if (req.files?.imgProfile) {
      if (user.img) {
        const oldPath = path.join(__dirname, "..", user.img.replace(/^\//, ""));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      req.body.img = `/uploads/${req.files.imgProfile[0].filename}`;
    }

    if (req.body.img && req.body.img.trim() !== "") {
      user.img = req.body.img;
    }

    user.username = req.body.username || user.username;
    user.nom = req.body.nom || user.nom;
    user.prenom = req.body.prenom || user.prenom;
    if (req.body.img) user.img = req.body.img;
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

module.exports.deleteAccount = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "Cet utilisateur n'existe pas" });
    }

    if (user.img) {
      const imgPath = path.join(__dirname, "..", user.img);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await Promise.all([
      TransactionModel.deleteMany({ user: req.userId }),
      InvestissementModel.deleteMany({ user: req.userId }),
      CreditModel.deleteMany({ user: req.userId }),
      EpargneModel.deleteMany({ user: req.userId }),
    ]);

    await user.deleteOne({ _id: req.userId });

    return res.status(200).json({ message: "Compte supprimé avec succès !" });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
      error,
    });
  }
};

module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

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

module.exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    });
    return res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la déconnexion",
      error,
    });
  }
};

module.exports.updateImg = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "Cet utilisateur n'existe pas" });
    }

    if (req.body.img === "") {
      if (user.img) {
        const oldPath = path.join(__dirname, "..", user.img.replace(/^\//, ""));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.img = null;
      await user.save();
      return res.status(200).json({ message: "Image supprimée avec succès" });
    }

    if (req.files?.imgProfile) {
      if (user.img) {
        const oldPath = path.join(__dirname, "..", user.img.replace(/^\//, ""));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.img = `/uploads/${req.files.imgProfile[0].filename}`;
      await user.save();
      return res.status(200).json({ message: "Image mise à jour avec succès" });
    }

    return res.status(400).json({ message: "Aucune donnée fournie" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la mise à jour de l'image",
    });
  }
};
