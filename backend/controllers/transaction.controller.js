const OperationModel = require("../models/transaction.model");

module.exports.setTransactions = async (req, res) => {
  try {
    if (!req.body.date || !req.body.montant) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir les informations nécessaires" });
    }

    const transaction = await OperationModel.create({
      user: req.body.user,
      type: req.body.type,
      categorie: req.body.categorie,
      titre: req.body.titre,
      date: req.body.date,
      detail: req.body.detail || "",
      montant: req.body.montant,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la création de l'opération", error });
  }
};

module.exports.getTransactions = async (req, res) => {
  try {
    const transactions = await OperationModel.find({ user: req.params.idUser }); // Change this line to filter by user ID
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des opérations",
      error,
    });
  }
};

module.exports.getTransaction = async (req, res) => {
  try {
    const transactions = await OperationModel.findById(req.params.id);
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération de l'transaction",
      error,
    });
  }
};

module.exports.editTransaction = async (req, res) => {
  try {
    const transaction = await OperationModel.findById(req.params.id);

    if (!transaction) {
      return res.status(400).json({ message: "Cette opération n'existe pas" });
    }

    const updatedOperation = await OperationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json(updatedOperation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'opération", error });
  }
};

module.exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await OperationModel.findById(req.params.id);

    if (!transaction) {
      return res.status(400).json({ message: "Cette opération n'existe pas" });
    }

    await transaction.deleteOne({ _id: req.params.id });

    return res
      .status(200)
      .json({ message: `Opération supprimée avec succès: ${req.params.id}` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'opération", error });
  }
};

module.exports.addRefund = async (req, res) => {
  try {
    const transaction = await OperationModel.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.remboursements.push(req.body);
    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error in addRefund:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteRefund = async (req, res) => {
  try {
    const transaction = await OperationModel.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const refundIndex = transaction.remboursements.findIndex(
      (refund) => refund._id.toString() === req.params.refundId
    );
    if (refundIndex === -1) {
      return res.status(404).json({ message: "Refund not found" });
    }

    transaction.remboursements.splice(refundIndex, 1);
    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.editRefund = async (req, res) => {
  try {
    const transaction = await OperationModel.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const refundIndex = transaction.remboursements.findIndex(
      (refund) => refund._id.toString() === req.params.refundId
    );
    if (refundIndex === -1) {
      return res.status(404).json({ message: "Refund not found" });
    }

    transaction.remboursements[refundIndex] = {
      ...transaction.remboursements[refundIndex],
      ...req.body,
    };
    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error in editRefund:", error);
    res.status(500).json({ message: error.message });
  }
};
