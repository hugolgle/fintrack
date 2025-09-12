const InvestmentModel = require("../models/investment.model");

module.exports.addInvestment = async (req, res) => {
  try {
    const { name, type, symbol, transaction } = req.body;

    if (
      !name ||
      !type ||
      !transaction?.amount ||
      !transaction?.date ||
      !transaction?.type
    ) {
      return res.status(400).json({
        message: "Veuillez fournir toutes les informations nécessaires",
      });
    }

    const existingAsset = await InvestmentModel.findOne({
      name,
      user: req.userId,
    });

    if (existingAsset) {
      return res.status(400).json({ message: "Cet actif existe déjà !" });
    }

    let newAmount = transaction.amount;
    if (transaction.type === "buy") {
      newAmount = -Math.abs(transaction.amount);
    }

    const investment = new InvestmentModel({
      user: req.userId,
      name,
      type,
      symbol: symbol.toUpperCase(),
      transaction: [
        {
          amount: newAmount,
          date: transaction.date,
          type: transaction.type,
        },
      ],
      amountBuy: 0,
      amountSale: 0,
    });

    investment.transaction.forEach(({ amount, type }) => {
      if (type === "sell") investment.amountSale += amount;
      else if (type === "buy") investment.amountBuy += amount;
    });

    const updatedInvestment = await investment.save();

    return res.status(201).json({
      message: "Investissement ajouté avec succès !",
      updatedInvestment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la création de l'investissement",
      error: error.message,
    });
  }
};

module.exports.addTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, date, type } = req.body;

    const investment = await InvestmentModel.findOne({
      _id: id,
      user: req.userId,
    });

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }
    let newAmount = amount;
    if (type === "buy") {
      newAmount = -Math.abs(amount);
    }
    const newTransaction = { amount: newAmount, date, type };
    investment.transaction.push(newTransaction);

    investment.amountBuy = 0;
    investment.amountSale = 0;

    investment.transaction.forEach(({ amount, type }) => {
      if (type === "sell") investment.amountSale += amount;
      else if (type === "buy") investment.amountBuy += amount;
    });

    const updatedInvestment = await investment.save();

    return res.status(201).json({
      message: "Transaction ajoutée avec succès",
      updatedInvestment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de l'ajout de la transaction",
      error: error.message,
    });
  }
};

module.exports.getInvestments = async (req, res) => {
  try {
    const investments = await InvestmentModel.find({
      user: req.userId,
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

module.exports.editInvestment = async (req, res) => {
  try {
    const investment = await InvestmentModel.findById(req.params.id);

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    const updates = req.body;
    const isSame = Object.keys(updates).every(
      (key) => investment[key] == updates[key]
    );

    if (isSame) {
      return res.status(400).json({
        message: "Aucune modification détectée",
      });
    }

    if (updates.name) investment.name = updates.name;
    if (updates.symbol) investment.symbol = updates.symbol;
    if (updates.type) investment.type = updates.type;

    let amountBuy = 0;
    let amountSale = 0;
    investment.transaction.forEach((t) => {
      if (t.type === "sell") {
        amountSale += t.amount;
      } else if (t.type === "buy") {
        amountBuy += t.amount;
      }
    });

    const amountResult = amountSale - amountBuy;

    investment.amountBuy = amountBuy.toString();
    investment.amountSale = amountSale.toString();
    investment.amountResult = amountResult.toString();

    const updatedInvestment = await investment.save();

    return res.status(200).json({
      message: "Investissement mis à jour avec succès !",
      updatedInvestment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour de l'investissement",
      error,
    });
  }
};

module.exports.editTransaction = async (req, res) => {
  try {
    const investment = await InvestmentModel.findById(req.params.id);

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    const transactionIndex = investment.transaction.findIndex(
      (t) => t._id.toString() === req.params.transactionId
    );

    if (transactionIndex === -1) {
      return res.status(400).json({ message: "Transaction non trouvée" });
    }

    const transaction = investment.transaction[transactionIndex];

    const isSame =
      (req.body.amount === undefined ||
        req.body.amount == transaction.amount) &&
      (req.body.date === undefined || req.body.date == transaction.date) &&
      (req.body.type === undefined || req.body.type == transaction.type);

    if (isSame) {
      return res.status(400).json({ message: "Aucune modification détectée" });
    }

    transaction.amount =
      req.body.type === "buy"
        ? Math.abs(req.body.amount)
        : req.body.amount ?? transaction.amount;
    transaction.date = req.body.date ?? transaction.date;
    transaction.type = req.body.type ?? transaction.type;

    investment.amountBuy = 0;
    investment.amountSale = 0;

    investment.transaction.forEach(({ amount, type }) => {
      if (type === "sell") investment.amountSale += amount;
      else if (type === "buy") investment.amountBuy += amount;
    });

    const updatedInvestment = await investment.save();

    return res.status(200).json({
      message: "Transaction modifiée avec succès",
      updatedInvestment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la modification de la transaction",
      error,
    });
  }
};

module.exports.deleteTransaction = async (req, res) => {
  try {
    const investment = await InvestmentModel.findById(req.params.id);

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    const transactionIndex = investment.transaction.findIndex(
      (t) => t._id.toString() === req.params.transactionId
    );

    if (transactionIndex === -1) {
      return res.status(400).json({ message: "Transaction non trouvée" });
    }

    investment.transaction.splice(transactionIndex, 1);

    if (investment.transaction.length > 0) {
      investment.amountBuy = 0;
      investment.amountSale = 0;

      investment.transaction.forEach(({ amount, type }) => {
        if (type === "sell") investment.amountSale += amount;
        else if (type === "buy") investment.amountBuy += amount;
      });

      await investment.save();

      return res.status(200).json({
        message: "Transaction supprimée avec succès",
        updatedInvestment: investment,
      });
    }

    // Ici : plus de transactions → on supprime l'investissement
    await investment.deleteOne();
    return res.status(200).json({
      message: "Investissement supprimé car il n'y a plus de transactions",
      redirect: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression de la transaction",
      error,
    });
  }
};
