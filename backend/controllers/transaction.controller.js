const OperationModel = require("../models/transaction.model");

module.exports.addTransaction = async (req, res) => {
  try {
    if (
      !req.body.date ||
      !req.body.amount ||
      !req.body.title ||
      !req.body.date
    ) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir les informations nécessaires" });
    }
    let amount = req.body.amount;
    if (req.body.type === "Expense") {
      amount = -Math.abs(amount);
    }

    const tags = req.body.tag || [];
    if (tags.length > 3) {
      return res
        .status(400)
        .json({ message: "Vous ne pouvez pas avoir plus de 3 tags" });
    }

    const transaction = await OperationModel.create({
      user: req.body.user,
      type: req.body.type,
      category: req.body.category,
      title: req.body.title,
      date: req.body.date,
      detail: req.body.detail || "",
      amount,
      tag: tags,
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

    const updatedTags = req.body.tag || transaction.tag;

    const updatedOperation = await OperationModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, amount, tag: updatedTags },
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

module.exports.addRefund = async (req, res) => {
  try {
    const transaction = await OperationModel.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction non trouvée" });
    }

    if (transaction.type !== "Expense") {
      return res.status(400).json({
        message:
          "Un remboursement ne peut être ajouté qu'à une transaction de type 'Expense'",
      });
    }

    const { title, amount, date } = req.body;

    if (!title || !amount || !date) {
      return res.status(400).json({
        message:
          "Veuillez fournir le titre, le montant et la date du remboursement",
      });
    }

    const refund = {
      title,
      amount: Math.abs(amount),
      date,
    };

    if (!transaction.initialAmount) {
      transaction.initialAmount = transaction.amount;
    }

    const amountTransac = Math.abs(transaction.amount) - refund.amount;
    transaction.amount = -amountTransac;

    transaction.refunds = transaction.refunds || [];
    transaction.refunds.push(refund);

    const updatedTransaction = await transaction.save();

    return res.status(201).json({
      message: "Remboursement ajouté avec succès",
      transaction: updatedTransaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de l'ajout du remboursement",
      error,
    });
  }
};
