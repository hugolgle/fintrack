const InvestmentModel = require("../models/investment.model");

module.exports.addInvestment = async (req, res) => {
  try {
    const { name, type, symbol, transaction, isin } = req.body;

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

    const investment = new InvestmentModel({
      user: req.userId,
      name,
      type,
      symbol: symbol.toUpperCase(),
      isin: isin ?? undefined,
      cycles: [
        {
          transactions: [
            {
              amount: transaction.amount,
              date: transaction.date,
              type: transaction.type,
            },
          ],
          amountBuy: transaction.type === "buy" ? transaction.amount : 0,
          amountSale: transaction.type === "sell" ? transaction.amount : 0,
          closed: false,
          result: 0,
        },
      ],
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
    const { amount, date, type, closed } = req.body;

    const investment = await InvestmentModel.findOne({
      _id: id,
      user: req.userId,
    });
    const cycle = investment.cycles.find((c) => !c.closed);

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }
    const newTransaction = { amount, date, type };

    if (!cycle) {
      investment.cycles.push({
        transactions: newTransaction,
        amountBuy: type === "buy" ? amount : 0,
        amountSale: type === "sell" ? amount : 0,
        closed: false,
        result: 0,
      });
    } else if (cycle) {
      cycle.transactions.push(newTransaction);

      cycle.amountBuy =
        type === "buy" ? amount + cycle.amountBuy : cycle.amountBuy;
      cycle.amountSale =
        type === "sell" ? amount + cycle.amountSale : cycle.amountSale;

      if (cycle.amountSale > cycle.amountBuy || closed) {
        cycle.closed = true;
        cycle.result = cycle.amountSale - cycle.amountBuy;
      }
    }

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

module.exports.addTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, date, type, closed } = req.body;

    const investment = await InvestmentModel.findOne({
      _id: id,
      user: req.userId,
    });
    const cycle = investment.cycles.find((c) => !c.closed);

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }
    const newTransaction = { amount, date, type };

    if (!cycle) {
      investment.cycles.push({
        transactions: newTransaction,
        amountBuy: type === "buy" ? amount : 0,
        amountSale: type === "sell" ? amount : 0,
        closed: false,
        result: 0,
      });
    } else if (cycle) {
      cycle.transactions.push(newTransaction);

      cycle.amountBuy =
        type === "buy" ? amount + cycle.amountBuy : cycle.amountBuy;
      cycle.amountSale =
        type === "sell" ? amount + cycle.amountSale : cycle.amountSale;

      if (cycle.amountSale > cycle.amountBuy || closed) {
        cycle.closed = true;
        cycle.result = cycle.amountSale - cycle.amountBuy;
      }
    }

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

module.exports.addDividend = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, date } = req.body;

    if (!amount || !date) {
      return res.status(400).json({
        message: "Veuillez fournir toutes les informations nécessaires",
      });
    }

    const investment = await InvestmentModel.findOne({
      _id: id,
      user: req.userId,
    });

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    investment.dividend.push({ amount, date });

    const updatedInvestment = await investment.save();

    return res.status(201).json({
      message: "Dividende ajouté avec succès",
      updatedInvestment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de l'ajout du dividende",
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
    if (updates.isin) investment.isin = updates.isin;
    if (updates.type) investment.type = updates.type;

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
    const { id, transactionId } = req.params;
    const { amount, date, type, closed } = req.body;

    const investment = await InvestmentModel.findOne({
      _id: id,
      user: req.userId,
    });

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    let transactionFound = null;
    let cycleIndex = -1;
    let transactionIndex = -1;

    investment.cycles.forEach((cycle, cIdx) => {
      const tIdx = cycle.transactions.findIndex(
        (t) => t._id.toString() === transactionId
      );
      if (tIdx !== -1) {
        transactionFound = cycle.transactions[tIdx];
        cycleIndex = cIdx;
        transactionIndex = tIdx;
      }
    });

    if (!transactionFound) {
      return res.status(400).json({ message: "Transaction non trouvée" });
    }

    const isSame =
      (amount === undefined || amount == transactionFound.amount) &&
      (date === undefined || date == transactionFound.date) &&
      (type === undefined || type == transactionFound.type);

    if (isSame) {
      return res.status(400).json({ message: "Aucune modification détectée" });
    }

    transactionFound.amount =
      type === "buy" ? Math.abs(amount) : amount ?? transactionFound.amount;
    transactionFound.date = date ?? transactionFound.date;
    transactionFound.type = type ?? transactionFound.type;

    const cycle = investment.cycles[cycleIndex];
    cycle.amountBuy = 0;
    cycle.amountSale = 0;
    cycle.transactions.forEach((t) => {
      if (t.type === "sell") cycle.amountSale += t.amount;
      else if (t.type === "buy") cycle.amountBuy += t.amount;
    });

    if (cycle.amountSale > cycle.amountBuy || closed) {
      cycle.closed = true;
      cycle.result = cycle.amountSale - cycle.amountBuy;
    }

    const updatedInvestment = await investment.save();

    return res.status(200).json({
      message: "Transaction modifiée avec succès",
      updatedInvestment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la modification de la transaction",
      error: error.message,
    });
  }
};

module.exports.editDividend = async (req, res) => {
  try {
    const { id, dividendId } = req.params;
    const { amount, date } = req.body;

    const investment = await InvestmentModel.findOne({
      _id: id,
      user: req.userId,
    });

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    const dividend = investment.dividend.id(dividendId);

    if (!dividend) {
      return res.status(400).json({ message: "Dividende non trouvé" });
    }

    const isSame =
      (amount === undefined || amount == dividend.amount) &&
      (date === undefined || date == dividend.date);

    if (isSame) {
      return res.status(400).json({ message: "Aucune modification détectée" });
    }

    if (amount !== undefined) dividend.amount = amount;
    if (date !== undefined) dividend.date = date;

    const updatedInvestment = await investment.save();

    return res.status(200).json({
      message: "Dividende modifié avec succès",
      updatedInvestment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la modification du dividende",
      error: error.message,
    });
  }
};

module.exports.deleteTransaction = async (req, res) => {
  try {
    const { id, transactionId } = req.params;

    const investment = await InvestmentModel.findOne({
      _id: id,
      user: req.userId,
    });

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    let cycleIndex = -1;
    let transactionIndex = -1;

    investment.cycles.forEach((cycle, cIdx) => {
      const tIdx = cycle.transactions.findIndex(
        (t) => t._id.toString() === transactionId
      );
      if (tIdx !== -1) {
        cycleIndex = cIdx;
        transactionIndex = tIdx;
      }
    });

    if (cycleIndex === -1 || transactionIndex === -1) {
      return res.status(400).json({ message: "Transaction non trouvée" });
    }

    const cycle = investment.cycles[cycleIndex];
    cycle.transactions.splice(transactionIndex, 1);

    cycle.amountBuy = 0;
    cycle.amountSale = 0;
    cycle.transactions.forEach((t) => {
      if (t.type === "sell") cycle.amountSale += t.amount;
      else if (t.type === "buy") cycle.amountBuy += t.amount;
    });

    if (cycle.transactions.length === 0) {
      investment.cycles.splice(cycleIndex, 1);
    }

    if (investment.cycles.length === 0) {
      await investment.deleteOne();
      return res.status(200).json({
        message: "Investissement supprimé car il n'y a plus de transactions",
        redirect: true,
      });
    }

    const updatedInvestment = await investment.save();
    return res.status(200).json({
      message: "Transaction supprimée avec succès",
      updatedInvestment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression de la transaction",
      error: error.message,
    });
  }
};

module.exports.deleteDividend = async (req, res) => {
  try {
    const investment = await InvestmentModel.findById(req.params.id);

    if (!investment) {
      return res
        .status(400)
        .json({ message: "Cet investissement n'existe pas" });
    }

    const dividendIndex = investment.dividend.findIndex(
      (d) => d._id.toString() === req.params.dividendId
    );

    if (dividendIndex === -1) {
      return res.status(400).json({ message: "Dividende non trouvé" });
    }

    investment.dividend.splice(dividendIndex, 1);
    await investment.save();

    return res.status(200).json({
      message: "Dividende supprimé avec succès",
      updatedInvestment: investment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression du dividende",
      error,
    });
  }
};
