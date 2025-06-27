const HeritageModel = require("../models/heritage.model");

module.exports.addAsset = async (req, res) => {
  try {
    if (
      !req.body.category ||
      !req.body.name ||
      !req.body.acquisitionDate ||
      !req.body.acquisitionPrice ||
      !req.body.estimatePrice
    ) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir les informations nécessaires" });
    }

    const asset = await HeritageModel.create({
      user: req.userId,
      category: req.body.category,
      name: req.body.name,
      acquisitionDate: req.body.acquisitionDate,
      detail: req.body.detail || "",
      acquisitionPrice: req.body.acquisitionPrice,
      estimatePrice: req.body.estimatePrice,
    });

    return res.status(201).json({ message: "Bien ajouté avec succès", asset });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la création de l'opération", error });
  }
};

module.exports.getAssets = async (req, res) => {
  try {
    const assets = await HeritageModel.find({ user: req.userId });
    return res.status(200).json(assets);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des opérations",
      error,
    });
  }
};

module.exports.getAsset = async (req, res) => {
  try {
    const asset = await HeritageModel.findById(req.params.id);
    return res.status(200).json(asset);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération de l'opération",
      error,
    });
  }
};

module.exports.editAsset = async (req, res) => {
  try {
    const asset = await HeritageModel.findById(req.params.id);

    if (!asset) {
      return res.status(400).json({ message: "Ce bien n'existe pas" });
    }

    const updates = req.body;

    const isSame = Object.keys(updates).every(
      (key) => asset[key] == updates[key]
    );

    if (isSame) {
      return res.status(400).json({
        message: "Aucune modification détectée",
      });
    }

    Object.keys(updates).forEach((key) => {
      asset[key] = updates[key];
    });

    const updatedAsset = await asset.save();

    return res.status(200).json({
      message: "Bien mis à jour avec succès !",
      updatedAsset,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour du bien",
      error,
    });
  }
};

module.exports.deleteAsset = async (req, res) => {
  try {
    const asset = await HeritageModel.findById(req.params.id);

    if (!asset) {
      return res.status(400).json({ message: "Cette opération n'existe pas" });
    }

    await asset.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: "Bien supprimé avec succès !" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'opération", error });
  }
};
