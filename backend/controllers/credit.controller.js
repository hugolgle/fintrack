const CreditModel = require("../models/credit.model");

// Créer un crédit
exports.createCredit = async (req, res) => {
  try {
    const data = {
      ...req.body,
      balance: req.body.amount, // balance = montant total au départ
    };
    const credit = new CreditModel(data);
    await credit.save();
    res.status(201).json({ message: "Crédit crée avec succès !", credit });
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

// Récupérer tous les crédits d’un utilisateur
exports.getCredits = async (req, res) => {
  try {
    const credits = await CreditModel.find({ user: req.params.idUser });
    res.json(credits);
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

// Récupérer un crédit
exports.getCredit = async (req, res) => {
  try {
    const credit = await CreditModel.findById(req.params.id);
    if (!credit) return res.status(404).json({ message: "Not found" });
    res.json(credit);
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

// Mettre à jour un crédit
exports.updateCredit = async (req, res) => {
  try {
    const credit = await CreditModel.findById(req.params.id);
    if (!credit) return res.status(404).json({ message: "Crédit non trouvé" });

    const newBalance =
      req.body.amount -
      credit.transactions.reduce(
        (acc, transaction) => acc + transaction.depreciation,
        0
      );

    const updatedCredit = await CreditModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        balance: newBalance,
      },
      { new: true }
    );

    res.json({
      message: "Crédit mis à jour avec succès !",
      credit: updatedCredit,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

// Supprimer un crédit
exports.deleteCredit = async (req, res) => {
  try {
    const credit = await CreditModel.findByIdAndDelete(req.params.id);
    if (!credit) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Crédit supprimé avec succès !", credit });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

// Ajouter un paiement sur un crédit
exports.addPayment = async (req, res) => {
  try {
    const { amount, date, depreciation } = req.body;
    const credit = await CreditModel.findById(req.params.id);
    if (!credit) return res.status(404).json({ message: "Not found" });

    credit.balance -= depreciation;
    remainingAmount = credit.balance;
    credit.transactions.push({ amount, date, depreciation, remainingAmount });
    await credit.save();

    res.json({ message: "Paiement ajouté !", credit });
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

// Activer / désactiver un crédit
exports.toggleCreditStatus = async (req, res) => {
  try {
    const credit = await CreditModel.findById(req.params.id);
    if (!credit) return res.status(404).json({ message: "Not found" });

    credit.isActive = !credit.isActive;
    await credit.save();

    res.json({ message: "Statut mis à jour", isActive: credit.isActive });
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};

// Supprimer une payment d'un crédit
exports.deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params; // ID de la payment à supprimer
    const credit = await CreditModel.findById(req.params.id);

    if (!credit) return res.status(404).json({ message: "Crédit non trouvé" });

    // Trouver l'index de la payment dans le tableau
    const paymentIndex = credit.transactions.findIndex(
      (payment) => payment._id.toString() === paymentId
    );

    if (paymentIndex === -1) {
      return res.status(404).json({ message: "Paiement non trouvée" });
    }

    // Supprimer la payment
    const removedPayment = credit.transactions.splice(paymentIndex, 1);

    // Recalculer le solde du crédit
    credit.balance += removedPayment[0].depreciation;

    await credit.save();

    res.json({
      message: "Paiement supprimée avec succès",
      credit,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, error });
  }
};
