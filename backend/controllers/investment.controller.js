const InvestmentModel = require("../models/investment.model");

module.exports.setInvestments = async (req, res) => {
  try {
    if (!req.body.date || !req.body.montant) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir les informations nécessaires" });
    }

    const investment = await InvestmentModel.create({
      user: req.body.user,
      type: req.body.type,
      titre: req.body.titre,
      detail: req.body.detail || "",
      date: req.body.date,
      montant: req.body.montant,
      isSold: false,
    });

    return res.status(201).json(investment);
  } catch (error) {
    console.error(error); // Ajoutez cette ligne pour afficher les erreurs dans la console
    return res.status(500).json({
      message: "Erreur lors de la création de l'investissement",
      error,
    });
  }
};

module.exports.getInvestments = async (req, res) => {
  try {
    const investments = await InvestmentModel.find({
      user: req.params.idUser,
    });
    return res.status(200).json(investments);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des investissements",
      error,
    });
  }
};

module.exports.getInvestment = async (req, res) => {
  try {
    const investments = await InvestmentModel.findById(req.params.id);
    return res.status(200).json(investments);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération de l'investissement",
      error,
    });
  }
};

module.exports.soldInvestment = async (req, res) => {
  try {
    const investment = await InvestmentModel.findById(req.params.id);

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    // Assurez-vous que `montantVendu` est fourni dans la requête
    const montantVendu = parseFloat(req.body.montantVendu);
    if (isNaN(montantVendu)) {
      return res.status(400).json({ message: "Le montant vendu est invalide" });
    }

    // Calcul du bénéfice
    const montantInitial = parseFloat(investment.montant);
    const benefice = montantVendu - montantInitial;

    const updatedOperation = await InvestmentModel.findByIdAndUpdate(
      req.params.id,
      {
        montantVendu: montantVendu.toFixed(2),
        benefice: benefice.toFixed(2), // Stockage du bénéfice calculé
        isSold: true,
      },
      { new: true },
    );

    return res.status(200).json(updatedOperation);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour de l'investissement",
      error,
    });
  }
};

module.exports.editInvestment = async (req, res) => {
  try {
    const investment = await InvestmentModel.findById(req.params.id);

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    const updatedInvestment = await InvestmentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    return res.status(200).json(updatedInvestment);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour de l'investissement",
      error,
    });
  }
};

module.exports.deleteInvestment = async (req, res) => {
  try {
    const investment = await InvestmentModel.findById(req.params.id);

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    await investment.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      message: `Investissement supprimé avec succès: ${req.params.id}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression de l'investissement",
      error,
    });
  }
};
