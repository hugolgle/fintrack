const InvestmentModel = require("../models/investment.model");

module.exports.addInvestment = async (req, res) => {
  try {
    if (!req.body.name || !req.body.type) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir les informations nécessaires" });
    }

    // Ajout de la transaction dans l'investissement
    const investment = await InvestmentModel.create({
      user: req.body.user,
      name: req.body.name,
      type: req.body.type,
      symbol: req.body.symbol,
      transaction: [],
      amountBuy: "0.00",
      amountSale: "0.00",
      amountResult: "0.00",
    });

    return res.status(201).json(investment);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la création de l'investissement",
      error,
    });
  }
};

module.exports.addTransaction = async (req, res) => {
  try {
    // Trouver l'investissement par son ID
    const investment = await InvestmentModel.findById(req.params.id);

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    // Créer une nouvelle transaction
    const newTransaction = {
      amount: req.body.amount,
      date: req.body.date,
      isSale: req.body.isSale,
    };

    // Ajouter la transaction au tableau des transactions de l'investissement
    investment.transaction.push(newTransaction);

    // Recalculer les montants d'achat et de vente
    let amountBuy = 0;
    let amountSale = 0;
    investment.transaction.forEach((t) => {
      if (t.isSale) {
        amountSale += parseFloat(t.amount);
      } else {
        amountBuy += parseFloat(t.amount);
      }
    });

    // Calculer le résultat avec deux décimales
    const amountResult = amountSale - amountBuy;

    // Formater les montants avec deux décimales
    investment.amountBuy = amountBuy.toFixed(2); // "10.00"
    investment.amountSale = amountSale.toFixed(2); // "10.00"
    investment.amountResult = amountResult.toFixed(2); // "0.00"

    // Sauvegarder l'investissement avec la nouvelle transaction
    const updatedInvestment = await investment.save();

    return res.status(201).json({
      message: "Transaction ajoutée avec succès",
      updatedInvestment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de l'ajout de la transaction",
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

module.exports.editInvestment = async (req, res) => {
  try {
    const investment = await InvestmentModel.findById(req.params.id);

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    if (req.body.name) investment.name = req.body.name;
    if (req.body.symbol) investment.symbol = req.body.symbol;
    if (req.body.type) investment.type = req.body.type;

    let amountBuy = 0;
    let amountSale = 0;
    investment.transaction.forEach((t) => {
      if (t.isSale) {
        amountSale += parseFloat(t.amount);
      } else {
        amountBuy += parseFloat(t.amount);
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

    // Trouver l'index de la transaction à modifier
    const transactionIndex = investment.transaction.findIndex(
      (t) => t._id.toString() === req.params.transactionId
    );

    if (transactionIndex === -1) {
      return res.status(400).json({ message: "Transaction non trouvée" });
    }

    // Mise à jour des informations de la transaction
    const transaction = investment.transaction[transactionIndex];
    transaction.amount = req.body.amount || transaction.amount;
    transaction.date = req.body.date || transaction.date;
    transaction.isSale =
      req.body.isSale !== undefined ? req.body.isSale : transaction.isSale;

    // Recalcul des montants après modification
    let amountBuy = 0;
    let amountSale = 0;
    investment.transaction.forEach((t) => {
      if (t.isSale) {
        amountSale += parseFloat(t.amount);
      } else {
        amountBuy += parseFloat(t.amount);
      }
    });

    const amountResult = amountSale - amountBuy;

    // Mise à jour des montants dans l'investissement
    investment.amountBuy = amountBuy.toString();
    investment.amountSale = amountSale.toString();
    investment.amountResult = amountResult.toString();

    // Sauvegarde de l'investissement mis à jour
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

    // Trouver l'index de la transaction à supprimer par son _id
    const transactionIndex = investment.transaction.findIndex(
      (t) => t._id.toString() === req.params.transactionId
    );

    if (transactionIndex === -1) {
      return res.status(400).json({ message: "Transaction non trouvée" });
    }

    // Supprimer la transaction
    investment.transaction.splice(transactionIndex, 1);

    // Recalculer les montants d'achat, de vente et de résultat
    let amountBuy = 0;
    let amountSale = 0;
    investment.transaction.forEach((t) => {
      if (t.isSale) {
        amountSale += parseFloat(t.amount);
      } else {
        amountBuy += parseFloat(t.amount);
      }
    });

    const amountResult = amountSale - amountBuy;

    // Mettre à jour les montants dans l'investissement
    investment.amountBuy = amountBuy.toString();
    investment.amountSale = amountSale.toString();
    investment.amountResult = amountResult.toString();

    // Sauvegarder l'investissement après suppression
    const updatedInvestment = await investment.save();

    return res.status(200).json({
      message: "Transaction supprimée avec succès",
      updatedInvestment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression de la transaction",
      error,
    });
  }
};

module.exports.deleteInvestement = async (req, res) => {
  try {
    const investement = await InvestmentModel.findById(req.params.id);

    if (!investement) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    if (investement.transaction.length > 0) {
      return res.status(400).json({
        message:
          "Impossible de supprimer l'investissement : il contient des transactions",
      });
    }

    await investement.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: "Ordre supprimé avec succès !" });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression de l'investissement",
      error,
    });
  }
};
