const EpargnModel = require("../models/epargn.model");

// Création d'un livret
module.exports.addAccount = async (req, res) => {
  try {
    const { user, name, balance, interestRate } = req.body;

    if (!name || balance === undefined || interestRate === undefined) {
      return res.status(400).json({
        message: "Veuillez fournir toutes les informations nécessaires",
      });
    }

    const account = await EpargnModel.create({
      user,
      name,
      balance: parseFloat(balance).toFixed(2),
      interestRate,
      transactions: [],
      lastInterestCalculation: new Date(),
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

// Récupération des livrets
module.exports.getAccounts = async (req, res) => {
  try {
    const accounts = await EpargnModel.find();
    return res.status(200).json(accounts);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération", error });
  }
};

// Virement entre livrets
module.exports.addTransfert = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    if (!fromAccountId || !toAccountId || amount === undefined) {
      return res.status(400).json({ message: "Informations incomplètes" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Le montant doit être positif" });
    }

    const fromAccount = await EpargnModel.findById(fromAccountId);
    const toAccount = await EpargnModel.findById(toAccountId);

    if (!fromAccount || !toAccount) {
      return res
        .status(404)
        .json({ message: "L'un des livrets n'a pas été trouvé" });
    }

    if (fromAccount.balance < amount) {
      return res.status(400).json({ message: "Solde insuffisant" });
    }

    // Mettre à jour les soldes
    fromAccount.balance = (fromAccount.balance - amount).toFixed(2);
    toAccount.balance = (toAccount.balance + amount).toFixed(2);

    // Ajouter les transactions
    fromAccount.transactions.push({
      type: "transfer",
      amount: parseFloat(amount).toFixed(2),
      toAccount: toAccountId,
    });
    toAccount.transactions.push({
      type: "transfer",
      amount: parseFloat(amount).toFixed(2),
    });

    await fromAccount.save();
    await toAccount.save();

    return res.status(200).json({ message: "Virement effectué avec succès" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors du virement", error });
  }
};

// Calcul des intérêts
module.exports.calculateInterest = async (req, res) => {
  try {
    const accounts = await EpargnModel.find();
    const today = new Date();

    for (const account of accounts) {
      const lastCalc = new Date(account.lastInterestCalculation);
      const diffDays = (today - lastCalc) / (1000 * 60 * 60 * 24); // Différence en jours

      if (diffDays > 0) {
        // Calcul des intérêts
        let interest = 0;

        // Si plus d'un an, on calcule l'année entière
        if (diffDays >= 365) {
          const dailyRate = account.interestRate / 100 / 365; // Taux journalier

          // Période 1 : Janvier à Mai (151 jours)
          interest += account.balance * dailyRate * 151;

          // Période 2 : Juin à Décembre (214 jours)
          interest += account.balance * dailyRate * 214;
        } else {
          // Si moins d'un an, calculez selon les jours exacts restants
          const dailyRate = account.interestRate / 100 / 365; // Taux journalier
          interest = account.balance * dailyRate * diffDays;
        }

        // Enregistrer les intérêts
        const calculatedInterest = parseFloat(interest).toFixed(2);

        // Mettre à jour le montant total des intérêts
        account.amountInterest = (
          parseFloat(account.amountInterest) + parseFloat(calculatedInterest)
        ).toFixed(2);

        // Ajouter une transaction pour les intérêts
        account.transactions.push({
          type: "interest",
          amount: parseFloat(calculatedInterest),
          date: today,
        });

        // Mettre à jour le solde et la date de calcul des intérêts
        account.balance = (
          parseFloat(account.balance) + parseFloat(calculatedInterest)
        ).toFixed(2);
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
