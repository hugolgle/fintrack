const EpargnModel = require("../models/epargn.model");
const cron = require("node-cron");
const mongoose = require("mongoose");

module.exports.addAccount = async (req, res) => {
  try {
    const { name, balance, interestRate, maxBalance } = req.body;

    if (!name || balance === undefined || interestRate === undefined) {
      return res.status(400).json({
        message: "Veuillez fournir toutes les informations nécessaires",
      });
    }

    const account = await EpargnModel.create({
      user: req.userId,
      name,
      balance,
      interestRate,
      transactions: [],
      lastInterestCalculation: new Date(),
      maxBalance,
    });

    return res
      .status(201)
      .json({ message: "Livret créé avec succès", account });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la création", error });
  }
};

module.exports.editAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const updates = req.body;

    const account = await EpargnModel.findById(accountId);

    if (!account) {
      return res.status(404).json({
        message: "Compte introuvable",
      });
    }

    const isSame = Object.keys(updates).every(
      (key) => account[key] == updates[key]
    );

    if (isSame) {
      return res.status(400).json({
        message: "Aucune modification détectée",
      });
    }

    Object.keys(updates).forEach((key) => {
      account[key] = updates[key];
    });

    await account.save();

    return res.status(200).json({
      message: "Compte mis à jour avec succès",
      account,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du compte :", error);
    return res.status(500).json({
      message: "Erreur lors de la mise à jour du compte",
      error: error.message, // renvoie uniquement le message d'erreur
    });
  }
};

module.exports.getAccounts = async (req, res) => {
  try {
    const accounts = await EpargnModel.find({
      user: req.userId,
    });
    return res.status(200).json(accounts);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération", error });
  }
};

module.exports.getAccount = async (req, res) => {
  try {
    const account = await EpargnModel.findById(req.params.id);
    return res.status(200).json(account);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération", error });
  }
};

module.exports.addTransfert = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    if (!fromAccountId || !toAccountId || amount <= 0) {
      return res.status(400).json({ message: "Informations incomplètes" });
    }

    const fromAccount = await EpargnModel.findById(fromAccountId);
    const toAccount = await EpargnModel.findById(toAccountId);

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ message: "Compte non trouvé" });
    }

    if (fromAccount.balance < amount) {
      return res.status(400).json({ message: "Solde insuffisant" });
    }

    const newBalance = toAccount.balance + amount;
    if (toAccount.maxBalance && newBalance > toAccount.maxBalance) {
      return res
        .status(400)
        .json({ message: "Le montant dépasse le plafond autorisé" });
    }

    const today = new Date();
    let debitDate, creditDate;

    if (today.getDate() <= 15) {
      debitDate = new Date(today.getFullYear(), today.getMonth(), 1);
      creditDate = new Date(today.getFullYear(), today.getMonth(), 16);
    } else {
      debitDate = new Date(today.getFullYear(), today.getMonth(), 16);
      creditDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    }

    const transferId = new mongoose.Types.ObjectId();

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    fromAccount.transactions.push({
      _id: transferId,
      type: "transfer",
      amount: -amount,
      date: debitDate,
      toAccount: toAccountId,
    });

    toAccount.transactions.push({
      _id: transferId,
      type: "transfer",
      amount: amount,
      date: creditDate,
      fromAccount: fromAccountId,
    });

    await fromAccount.save();
    await toAccount.save();

    return res.status(200).json({ message: "Transfert effectué avec succès" });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors du transfert de fonds",
      error,
    });
  }
};

module.exports.depositAccount = async (req, res) => {
  try {
    const { accountId, amount } = req.body;

    if (!accountId || amount === undefined) {
      return res.status(400).json({ message: "Informations incomplètes" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Le montant doit être positif" });
    }

    const account = await EpargnModel.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "Compte non trouvé" });
    }

    const newBalance = account.balance + amount;
    if (account.maxBalance && newBalance > account.maxBalance) {
      return res
        .status(400)
        .json({ message: "Le montant dépasse le plafond autorisé" });
    }

    const today = new Date();
    let depositDate;
    if (today.getDate() <= 15) {
      depositDate = new Date(today.getFullYear(), today.getMonth(), 16);
    } else {
      depositDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    }

    account.balance = newBalance;

    account.transactions.push({
      type: "deposit",
      amount,
      date: depositDate,
    });

    await account.save();

    return res
      .status(200)
      .json({ message: "Compte crédité avec succès", account });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors du dépôt du compte",
      error,
    });
  }
};

module.exports.withdrawAccount = async (req, res) => {
  try {
    const { accountId, amount } = req.body;

    if (!accountId || amount === undefined) {
      return res.status(400).json({ message: "Informations incomplètes" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Le montant doit être positif" });
    }

    const account = await EpargnModel.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "Compte non trouvé" });
    }

    const newBalance = account.balance - amount;

    if (newBalance < 0) {
      return res
        .status(400)
        .json({ message: "Solde insuffisant pour effectuer ce retrait" });
    }

    const today = new Date();
    let withdrawalDate;
    if (today.getDate() <= 15) {
      withdrawalDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else {
      withdrawalDate = new Date(today.getFullYear(), today.getMonth(), 16);
    }

    account.balance = newBalance;

    account.transactions.push({
      type: "withdraw",
      amount: -amount,
      date: withdrawalDate,
    });

    await account.save();

    return res
      .status(200)
      .json({ message: "Retrait effectué avec succès", account });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors du retrait du compte",
      error,
    });
  }
};

module.exports.calculateInterest = async (req, res) => {
  try {
    const accounts = await EpargnModel.find();
    const today = new Date();

    for (const account of accounts) {
      const lastCalc = new Date(account.lastInterestCalculation);
      const diffDays = (today - lastCalc) / (1000 * 60 * 60 * 24);

      if (diffDays > 0) {
        let interest = 0;

        if (diffDays >= 365) {
          const dailyRate = account.interestRate / 100 / 365;

          interest += account.balance * dailyRate * 151;

          interest += account.balance * dailyRate * 214;
        } else {
          const dailyRate = account.interestRate / 100 / 365;
          interest = account.balance * dailyRate * diffDays;
        }

        const calculatedInterest = interest;

        account.amountInterest = account.amountInterest + calculatedInterest;

        account.transactions.push({
          type: "interest",
          amount: calculatedInterest,
          date: today,
        });

        account.balance = account.balance + calculatedInterest;
        account.lastInterestCalculation = today;

        await account.save();
      }
    }

    return res.status(200).json({
      message: "Intérêts calculés et mis à jour avec succès",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors du calcul des intérêts",
      error,
    });
  }
};

const calculateYearlyInterest = async () => {
  const accounts = await EpargnModel.find();

  for (const account of accounts) {
    const totalInterest = account.amountInterest || 0;

    if (totalInterest > 0) {
      account.transactions.push({
        type: "interest",
        amount: totalInterest,
        date: new Date(),
      });

      account.amountInterest = "0.00";

      await account.save();
    }
  }
};

cron.schedule("0 0 1 1 *", async () => {
  await calculateYearlyInterest();
});

cron.schedule("0 0 1,16 * *", () => {
  calculateInterest();
});

cron.schedule("0 0 1 * *", async () => {
  const accounts = await EpargnModel.find();

  for (const account of accounts) {
    account.monthlyStatements.push({
      date: new Date(),
      balance: account.balance,
    });

    await account.save();
  }
});
