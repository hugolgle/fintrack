const OperationModel = require("../models/transaction.model");

module.exports.addTransaction = async (req, res) => {
  try {
    if (!req.body.date || !req.body.amount) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir les informations nécessaires" });
    }
    let amount = req.body.amount;
    if (req.body.type === "Expense") {
      amount = -Math.abs(amount);
    }

    const transaction = await OperationModel.create({
      user: req.body.user,
      type: req.body.type,
      category: req.body.category,
      title: req.body.title,
      date: req.body.date,
      detail: req.body.detail || "",
      amount,
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
    const transactions = await OperationModel.find({ user: req.params.idUser });
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

    let amount = req.body.amount;
    if (req.body.type === "Expense") {
      amount = -Math.abs(amount);
    }

    const updatedOperation = await OperationModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, amount },
      { new: true }
    );

    return res.status(200).json({
      message: "Transaction mise à jour avec succès !",
      updatedOperation,
    });
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
      .json({ message: "Transaction supprimée avec succès !" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'opération", error });
  }
};
